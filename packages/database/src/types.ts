/**
 * @repo/database — Strict TypeScript Types
 * Generated from context_ddd.md · 7 tables · Zero `any`
 *
 * All IDs are UUID v4 strings.
 * All timestamps are ISO 8601 UTC strings (TIMESTAMPTZ).
 * Prices are in COP (Colombian Pesos), always > 0.
 *
 * NOTE: All row/insert/update types are declared as `type` aliases (not
 * `interface`) so that TypeScript's conditional type system can structurally
 * expand them when evaluating `Database["public"] extends GenericSchema` inside
 * the Supabase client generics. Interfaces are nominally opaque in that context
 * and cause Schema to collapse to `never`.
 */

// ─── Enums & Literal Types ────────────────────────────────────

export type MenuCategory =
  | "entradas"
  | "principales"
  | "postres"
  | "bebidas"
  | "catas"
  // ── La Carreta categories ──
  | "especialidades"
  | "carnes-maduradas"
  | "cortes-especiales"
  | "platos-tipicos"
  | "cremas-sopas"
  | "pollo-cerdo"
  | "pescados-mariscos"
  | "ensaladas"
  | "vegetarianos"
  | "hamburguesas"
  | "arroces"
  | "guarniciones"
  | "bebidas-frescas"
  | "bebidas-calientes"
  | "cocteles"
  | "cervezas"
  | "licores"
  | "menu-infantil"
  // ── Mar y Tierra categories ──
  | "pescados-fritos"
  | "pescados-plancha"
  | "pescados-marinera"
  | "pescados-criolla"
  | "cazuelas-sancochos"
  | "carnes"
  | "adiciones"
  | "vinos";

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "notified";

export type AdminRole = "admin" | "superadmin" | "viewer";

export type AnalyticsEventType =
  | "page_view"
  | "menu_view"
  | "menu_item_view"
  | "reservation_start"
  | "reservation_complete"
  | "cata_view"
  | "cata_book_intent"
  | "loyal_visitor_detected";

export type RestaurantSlug = "la-carreta" | "mar-y-tierra" | "delica";

// ─── Theme Config ─────────────────────────────────────────────

export type ThemeConfig = {
  primary: string;
  accent: string;
  surface: string;
  fontDisplay: "Playfair Display" | "Fraunces" | "Lato" | "Libre Baskerville" | "Cormorant Garamond";
  priceRange: "$$" | "$$$";
};

// ─── Table: restaurants ───────────────────────────────────────

export type Restaurant = {
  id: string;
  name: string;
  slug: RestaurantSlug;
  domain: string;
  theme_config: ThemeConfig | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type RestaurantInsert = {
  name: string;
  slug: RestaurantSlug;
  domain: string;
  theme_config?: ThemeConfig | null;
  is_active?: boolean;
};

export type RestaurantUpdate = {
  name?: string;
  slug?: RestaurantSlug;
  domain?: string;
  theme_config?: ThemeConfig | null;
  is_active?: boolean;
};

// ─── Table: menu_items ────────────────────────────────────────

export type MenuItem = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  photo_url: string | null;
  category: MenuCategory;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type MenuItemInsert = {
  restaurant_id: string;
  name: string;
  description?: string | null;
  price: number;
  photo_url?: string | null;
  category: MenuCategory;
  is_available?: boolean;
  sort_order?: number;
};

export type MenuItemUpdate = {
  id?: string;
  restaurant_id?: string;
  name?: string;
  description?: string | null;
  price?: number;
  photo_url?: string | null;
  category?: MenuCategory;
  is_available?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
};

// ─── Table: reservations ──────────────────────────────────────

export type Reservation = {
  id: string;
  restaurant_id: string;
  client_name: string;
  whatsapp: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  notes: string | null;
  created_at: string;
};

export type ReservationInsert = {
  id?: string;
  restaurant_id: string;
  client_name: string;
  whatsapp: string;
  date: string;
  time: string;
  guests: number;
  notes?: string | null;
  status: ReservationStatus;
  created_at?: string;
};

export type ReservationUpdate = {
  id?: string;
  restaurant_id?: string;
  client_name?: string;
  whatsapp?: string;
  date?: string;
  time?: string;
  guests?: number;
  status?: "pending" | "confirmed" | "cancelled" | "notified";
  notes?: string | null;
  created_at?: string;
};

// ─── Table: experiences (Delica only) ─────────────────────────

export type Experience = {
  id: string;
  restaurant_id: string;
  title: string;
  description: string | null;
  date: string;
  capacity: number;
  booked: number;
  price: number;
  photos: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

/** Computed field for API responses */
export type ExperienceWithAvailability = Experience & {
  available_spots: number;
};

export type ExperienceInsert = {
  restaurant_id: string;
  title: string;
  description?: string | null;
  date: string;
  capacity: number;
  price: number;
  photos?: string[];
  is_published?: boolean;
};

export type ExperienceUpdate = {
  title?: string;
  description?: string | null;
  date?: string;
  capacity?: number;
  price?: number;
  photos?: string[];
  is_published?: boolean;
};

// ─── Table: loyal_visits ──────────────────────────────────────

export type LoyalVisit = {
  id: string;
  cookie_hash: string;
  restaurant_id: string;
  visit_count: number;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  last_visit: string;
};

export type LoyalVisitUpsert = {
  cookie_hash: string;
  restaurant_id: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
};

// ─── Table: analytics_events ──────────────────────────────────

export type AnalyticsEvent = {
  id: string;
  restaurant_id: string;
  event_type: AnalyticsEventType;
  page: string | null;
  referrer: string | null;
  created_at: string;
};

export type AnalyticsEventInsert = {
  restaurant_id: string;
  event_type: AnalyticsEventType;
  page?: string | null;
  referrer?: string | null;
};

// ─── Table: admin_users ───────────────────────────────────────

export type AdminUser = {
  id: string;
  email: string;
  role: AdminRole;
  restaurants: string[] | null;
  created_at: string;
};

// ─── Database Schema (Supabase Generated Type Shape) ──────────
//
// Declared as a `type` alias (not `interface`) so TypeScript can structurally
// expand it when evaluating `Database["public"] extends GenericSchema` inside
// Supabase's SupabaseClient generics. Same rule applies to all referenced types.

export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: Restaurant;
        Insert: RestaurantInsert;
        Update: RestaurantUpdate;
        Relationships: [];
      };
      menu_items: {
        Row: MenuItem;
        Insert: MenuItemInsert;
        Update: MenuItemUpdate;
        Relationships: [];
      };
      reservations: {
        Row: Reservation;
        Insert: ReservationInsert;
        Update: ReservationUpdate;
        Relationships: [];
      };
      experiences: {
        Row: Experience;
        Insert: ExperienceInsert;
        Update: ExperienceUpdate;
        Relationships: [];
      };
      loyal_visits: {
        Row: LoyalVisit;
        Insert: LoyalVisitUpsert;
        Update: Partial<LoyalVisit>;
        Relationships: [];
      };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: AnalyticsEventInsert;
        /** analytics_events is append-only — updates are not allowed */
        Update: Record<string, never>;
        Relationships: [];
      };
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, "created_at">;
        Update: Partial<Pick<AdminUser, "role" | "restaurants">>;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {
      upsert_loyal_visit: {
        Args: {
          p_hash: string;
          p_rid: string;
          p_src: string | null;
          p_med: string | null;
          p_camp: string | null;
        };
        Returns: LoyalVisit;
      };
      check_experience_availability: {
        Args: { p_experience_id: string };
        Returns: boolean;
      };
    };
  };
};

// ─── API Response Types ───────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
  message?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    status: number;
    details?: Array<{
      field: string;
      message: string;
      received?: string;
    }>;
    timestamp: string;
    request_id: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
