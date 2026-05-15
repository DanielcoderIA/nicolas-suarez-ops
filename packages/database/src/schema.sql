-- ============================================================
-- Schema SQL — Sistema de Operación Digital · Nicolás Suárez
-- PostgreSQL 15+ via Supabase
-- Multi-tenant: every table scoped by restaurant_id
-- RLS: enabled on ALL tables, ZERO exceptions
-- ============================================================

-- ─── Helper Function ────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── 1. restaurants ─────────────────────────────────────────

CREATE TABLE restaurants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  domain       TEXT UNIQUE NOT NULL,
  theme_config JSONB,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE UNIQUE INDEX idx_restaurants_slug   ON restaurants (slug);
CREATE UNIQUE INDEX idx_restaurants_domain ON restaurants (domain);

-- ─── 2. admin_users ─────────────────────────────────────────

CREATE TABLE admin_users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'admin'
              CHECK (role IN ('admin', 'superadmin', 'viewer')),
  restaurants UUID[],
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 3. menu_items ──────────────────────────────────────────

CREATE TABLE menu_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL CHECK (price > 0),
  photo_url     TEXT,
  category      TEXT NOT NULL CHECK (category IN
                  ('entradas','principales','postres','bebidas','catas')),
  is_available  BOOLEAN NOT NULL DEFAULT true,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_menu_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_menu_restaurant_avail ON menu_items (restaurant_id, is_available);
CREATE INDEX idx_menu_category         ON menu_items (restaurant_id, category);
CREATE INDEX idx_menu_sort             ON menu_items (restaurant_id, sort_order ASC);

-- ─── 4. reservations ────────────────────────────────────────

CREATE TABLE reservations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE RESTRICT,
  client_name   TEXT NOT NULL,
  whatsapp      TEXT NOT NULL,
  date          DATE NOT NULL,
  time          TIME NOT NULL,
  guests        SMALLINT NOT NULL CHECK (guests BETWEEN 1 AND 20),
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','confirmed','cancelled','notified')),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_res_restaurant_date ON reservations (restaurant_id, date);
CREATE INDEX idx_res_status          ON reservations (status, restaurant_id);
CREATE INDEX idx_res_created         ON reservations (created_at DESC);

-- ─── 5. experiences (Delica only) ───────────────────────────

CREATE TABLE experiences (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  date          TIMESTAMPTZ NOT NULL,
  capacity      SMALLINT NOT NULL CHECK (capacity > 0),
  booked        SMALLINT NOT NULL DEFAULT 0 CHECK (booked >= 0),
  price         NUMERIC(10,2) NOT NULL CHECK (price > 0),
  photos        TEXT[] NOT NULL DEFAULT '{}',
  is_published  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT booked_lte_capacity CHECK (booked <= capacity)
);

CREATE INDEX idx_exp_published_date ON experiences (restaurant_id, is_published, date);
CREATE INDEX idx_exp_avail          ON experiences (restaurant_id, booked, capacity);

-- ─── 6. loyal_visits ────────────────────────────────────────

CREATE TABLE loyal_visits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cookie_hash   TEXT NOT NULL,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  visit_count   INTEGER NOT NULL DEFAULT 1 CHECK (visit_count > 0),
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  last_visit    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(cookie_hash, restaurant_id)
);

CREATE INDEX idx_loyal_hash  ON loyal_visits (cookie_hash, restaurant_id);
CREATE INDEX idx_loyal_count ON loyal_visits (restaurant_id, visit_count DESC);
CREATE INDEX idx_loyal_last  ON loyal_visits (restaurant_id, last_visit DESC);

-- ─── 7. analytics_events ────────────────────────────────────

CREATE TYPE event_type_enum AS ENUM (
  'page_view', 'menu_view', 'menu_item_view',
  'reservation_start', 'reservation_complete',
  'cata_view', 'cata_book_intent', 'loyal_visitor_detected'
);

CREATE TABLE analytics_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  event_type    event_type_enum NOT NULL,
  page          TEXT,
  referrer      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_type_time ON analytics_events (restaurant_id, event_type, created_at);
CREATE INDEX idx_analytics_brin      ON analytics_events USING BRIN (created_at);

-- ─── RPC Functions ──────────────────────────────────────────

CREATE OR REPLACE FUNCTION upsert_loyal_visit(
  p_hash TEXT, p_rid UUID,
  p_src  TEXT DEFAULT NULL,
  p_med  TEXT DEFAULT NULL,
  p_camp TEXT DEFAULT NULL
) RETURNS loyal_visits AS $$
DECLARE r loyal_visits;
BEGIN
  INSERT INTO loyal_visits (cookie_hash, restaurant_id, visit_count, utm_source, utm_medium, utm_campaign, last_visit)
  VALUES (p_hash, p_rid, 1, p_src, p_med, p_camp, now())
  ON CONFLICT (cookie_hash, restaurant_id)
  DO UPDATE SET
    visit_count = loyal_visits.visit_count + 1,
    last_visit  = now()
  RETURNING * INTO r;
  RETURN r;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_experience_availability(p_experience_id UUID)
RETURNS BOOLEAN AS $$
DECLARE v_cap SMALLINT; v_booked SMALLINT;
BEGIN
  SELECT capacity, booked INTO v_cap, v_booked
  FROM experiences WHERE id = p_experience_id AND is_published = true;
  RETURN FOUND AND (v_booked < v_cap);
END;
$$ LANGUAGE plpgsql STABLE;

-- ─── RLS Helpers ────────────────────────────────────────────

/**
 * Checks if the current authenticated user is a superadmin.
 * Uses SECURITY DEFINER to bypass RLS on admin_users table and avoid recursion.
 */
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND role = 'superadmin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

/**
 * Returns the list of restaurant IDs assigned to the current user.
 * Uses SECURITY DEFINER to bypass RLS on admin_users table and avoid recursion.
 */
CREATE OR REPLACE FUNCTION get_my_restaurants()
RETURNS UUID[] AS $$
  SELECT restaurants FROM admin_users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- ROW-LEVEL SECURITY — Zero-Trust Multi-Tenancy
-- ============================================================

ALTER TABLE restaurants      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences      ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyal_visits     ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ─── Role: anon (public sites, no authentication) ───────────

-- Restaurants: read only active ones
CREATE POLICY restaurants_anon_read ON restaurants
  FOR SELECT TO anon
  USING (is_active = true);

-- Menu: read only available items
CREATE POLICY menu_anon_read ON menu_items
  FOR SELECT TO anon
  USING (is_available = true);

-- Reservations: anyone can insert (rate limited at API layer)
CREATE POLICY reservations_anon_insert ON reservations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Experiences: read only published
CREATE POLICY experiences_anon_read ON experiences
  FOR SELECT TO anon
  USING (is_published = true);

-- ─── Role: authenticated (admin panel — JWT via httpOnly cookie) ─

-- Restaurants: admins read all active, superadmins can write
CREATE POLICY restaurants_auth_read ON restaurants
  FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY restaurants_superadmin_write ON restaurants
  FOR ALL TO authenticated
  USING (is_superadmin());

-- Admin users: self-read + superadmin full access
CREATE POLICY admin_self_read ON admin_users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY admin_superadmin_all ON admin_users
  FOR ALL TO authenticated
  USING (is_superadmin());

-- Menu items: admin write scoped to assigned restaurants
CREATE POLICY menu_auth_read ON menu_items
  FOR SELECT TO authenticated
  USING (true);  -- Admins can see all items (including unavailable)

CREATE POLICY menu_admin_write ON menu_items
  FOR ALL TO authenticated
  USING (
    restaurant_id = ANY(get_my_restaurants())
    OR is_superadmin()
  );

-- Reservations: admin read/update scoped to assigned restaurants
CREATE POLICY reservations_auth_read ON reservations
  FOR SELECT TO authenticated
  USING (
    restaurant_id = ANY(get_my_restaurants())
    OR is_superadmin()
  );

CREATE POLICY reservations_auth_update ON reservations
  FOR UPDATE TO authenticated
  USING (
    restaurant_id = ANY(get_my_restaurants())
    OR is_superadmin()
  );

-- Experiences: admin write scoped to assigned restaurants
CREATE POLICY experiences_auth_read ON experiences
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY experiences_admin_write ON experiences
  FOR ALL TO authenticated
  USING (
    restaurant_id = ANY(get_my_restaurants())
    OR is_superadmin()
  );

-- ─── Role: service_role (server-only — bypasses RLS automatically) ──
-- loyal_visits and analytics_events are ONLY accessible via service_role key.
-- No explicit policies needed as service_role bypasses RLS.
-- This is enforced at the application layer via getAdminSupabase().

-- ============================================================
-- Seed Data — Fixed UUIDs for dev/staging/prod consistency
-- ============================================================

INSERT INTO restaurants (id, name, slug, domain, theme_config, is_active) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'La Carreta', 'la-carreta', 'lacarreta.co',
  '{"primary":"#8B2500","accent":"#C4972A","surface":"#FDF6EC","fontDisplay":"Fraunces","priceRange":"$$"}',
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Mar y Tierra Zipa', 'mar-y-tierra', 'marytierrazipa.co',
  '{"primary":"#0A3D62","accent":"#1ABC9C","surface":"#F0F8FF","fontDisplay":"Libre Baskerville","priceRange":"$$"}',
  true
),
(
  '33333333-3333-3333-3333-333333333333',
  'Delica', 'delica', 'delicazipa.co',
  '{"primary":"#2C1810","accent":"#8D6A32","surface":"#FAFAF8","fontDisplay":"Cormorant Garamond","priceRange":"$$$"}',
  true
);
