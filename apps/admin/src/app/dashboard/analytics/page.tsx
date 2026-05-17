import { cookies } from "next/headers";
import { getServerSupabase, getAdminProfile, getAdminSupabase } from "@repo/database/server";
import { redirect } from "next/navigation";
import { getAdminAnalyticsEvents, getAdminLoyaltyStats, getAdminMenu } from "@repo/database/queries/admin";
import {
  Activity, TrendingUp, Users, Eye,
  UtensilsCrossed, Clock, Heart,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════ */

const RESTAURANT_NAMES: Record<string, string> = {
  "11111111-1111-1111-1111-111111111111": "La Carreta",
  "22222222-2222-2222-2222-222222222222": "Mar y Tierra",
  "33333333-3333-3333-3333-333333333333": "Delica",
};

const RESTAURANT_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  "11111111-1111-1111-1111-111111111111": { color: "var(--lc)", bg: "var(--lc-bg)", border: "var(--lc-border)" },
  "22222222-2222-2222-2222-222222222222": { color: "var(--mt)", bg: "var(--mt-bg)", border: "var(--mt-border)" },
  "33333333-3333-3333-3333-333333333333": { color: "var(--dl)", bg: "var(--dl-bg)", border: "var(--dl-border)" },
};

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { restaurant?: string };
}) {
  const cookieStore = await cookies();
  const supabase = getServerSupabase(cookieStore);
  const adminProfile = await getAdminProfile(cookieStore);

  if (!adminProfile) redirect("/unauthorized");

  const selectedRestaurant =
    (await searchParams).restaurant ?? (adminProfile.restaurants ?? [])[0] ?? "";

  if (!selectedRestaurant || !(adminProfile.restaurants ?? []).includes(selectedRestaurant)) {
    return (
      <div style={{ padding: 32, fontSize: "var(--text-sm)", color: "var(--text-3)" }}>
        No tienes acceso a este restaurante.
      </div>
    );
  }

  const adminSupabase = getAdminSupabase();
  const [events, loyaltyStats, menuItems] = await Promise.all([
    getAdminAnalyticsEvents(adminSupabase, selectedRestaurant, 30),
    getAdminLoyaltyStats(adminSupabase, selectedRestaurant),
    getAdminMenu(supabase, selectedRestaurant),
  ]);

  /* ── Aggregations ── */
  const trafficCount = events.filter(
    (e) => e.event_type === "page_view" || e.event_type === "menu_view"
  ).length;

  const menuViews = events.filter((e) => e.event_type === "menu_item_view" && e.page);
  const dishCounts: Record<string, number> = {};
  menuViews.forEach((e) => {
    const id = e.page as string;
    dishCounts[id] = (dishCounts[id] ?? 0) + 1;
  });

  const topDishes = Object.entries(dishCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({
      name: menuItems.find((m) => m.id === id)?.name ?? "Desconocido",
      count,
    }));

  const maxDishCount = topDishes[0]?.count ?? 1;

  const hourCounts: Record<number, number> = {};
  events.forEach((e) => {
    const h = new Date(e.created_at).getHours();
    hourCounts[h] = (hourCounts[h] ?? 0) + 1;
  });
  const maxHourCount = Math.max(...Object.values(hourCounts), 1);
  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "--";

  const totalVisitors = loyaltyStats.length;
  const returningVisitors = loyaltyStats.filter((v) => v.visit_count > 1).length;
  const returnRate = totalVisitors > 0 ? Math.round((returningVisitors / totalVisitors) * 100) : 0;
  const avgVisits =
    totalVisitors > 0
      ? (loyaltyStats.reduce((s, v) => s + v.visit_count, 0) / totalVisitors).toFixed(1)
      : "0";

  const rst = RESTAURANT_STYLE[selectedRestaurant] ?? { color: "var(--dl)", bg: "var(--dl-bg)", border: "var(--dl-border)" };

  return (
    <div
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "clamp(16px, 3vw, 36px)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(20px, 3vw, 32px)",
      }}
    >

      {/* ══════════════════════════════════════════════════
          PAGE HEADER
          ══════════════════════════════════════════════════ */}
      <div>
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-4)" }}>
            Datos
          </span>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--border-strong)" }}>/</span>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-4)" }}>
            Últimos 30 días
          </span>
        </div>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(32px, 5vw, 46px)",
                color: "var(--text)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              Analytics
            </h1>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-3)", marginTop: 10, maxWidth: 440, lineHeight: "var(--leading-loose)" }}>
              Métricas de tráfico, fidelización y platos del restaurante seleccionado.
            </p>
          </div>

          {/* Restaurant tab switcher */}
          <div
            style={{
              display: "flex",
              gap: 4,
              padding: 5,
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              flexShrink: 0,
            }}
          >
            {(adminProfile.restaurants ?? []).map((id) => {
              const isActive = selectedRestaurant === id;
              const s = RESTAURANT_STYLE[id];
              return (
                <a
                  key={id}
                  href={`/dashboard/analytics?restaurant=${id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    height: 30,
                    padding: "0 12px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-xs)",
                    fontWeight: isActive ? "var(--font-weight-semibold)" : "var(--font-weight-medium)",
                    color: isActive ? "var(--text)" : "var(--text-3)",
                    background: isActive ? "var(--surface-2)" : "transparent",
                    border: isActive ? "1px solid var(--border-strong)" : "1px solid transparent",
                    textDecoration: "none",
                    transition: "all var(--dur-fast)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: isActive ? (s?.color ?? "var(--text-3)") : "rgba(255,255,255,0.15)",
                      flexShrink: 0,
                      transition: "background var(--dur-fast)",
                    }}
                  />
                  {RESTAURANT_NAMES[id] ?? id}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          TOP STAT CARDS
          ══════════════════════════════════════════════════ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "clamp(10px, 1.5vw, 14px)",
        }}
      >
        {[
          { label: "Visitas totales", value: trafficCount, icon: Activity, color: "var(--accent)", bg: "var(--accent-dim)", border: "rgba(79,142,247,0.18)" },
          { label: "Clientes que vuelven", value: `${returnRate}%`, icon: TrendingUp, color: "var(--success)", bg: "var(--success-bg)", border: "var(--success-border)" },
          { label: "Visitas por persona", value: avgVisits, icon: Users, color: "var(--warning)", bg: "var(--warning-bg)", border: "var(--warning-border)" },
          { label: "Interés en platos", value: menuViews.length, icon: Eye, color: "var(--dl)", bg: "var(--dl-bg)", border: "var(--dl-border)" },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <AnalyticsStatCard key={label} label={label} value={value} icon={<Icon size={14} />} valueColor={color} accent={bg} accentBorder={border} />
        ))}
      </div>

      {/* Divider */}
      <Divider />

      {/* ══════════════════════════════════════════════════
          CHARTS GRID
          ══════════════════════════════════════════════════ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "clamp(12px, 2vw, 20px)",
        }}
      >

        {/* ── Top dishes ── */}
        <PanelCard>
          <PanelHeader
            icon={<UtensilsCrossed size={15} />}
            iconColor="var(--accent)"
            iconBg="var(--accent-dim)"
            iconBorder="rgba(79,142,247,0.18)"
            title="Lo que más miran"
            sub="Los 5 platos más populares"
          />
          {topDishes.length === 0 ? (
            <EmptyChart icon={<Eye size={20} />} label="Sin datos suficientes" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {topDishes.map((dish, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "75%" }}>
                      {dish.name}
                    </span>
                    <span style={{ fontSize: "var(--text-xs)", fontFamily: '"DM Mono", monospace', color: "var(--text-3)", flexShrink: 0 }}>
                      {dish.count}
                    </span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${(dish.count / maxDishCount) * 100}%`,
                        background: rst.color,
                        borderRadius: "var(--radius-full)",
                        opacity: 1 - i * 0.12,
                        transition: "width var(--dur-slow) var(--ease-smooth)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </PanelCard>

        {/* ── Activity by hour ── */}
        <PanelCard>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <PanelHeader
              icon={<Clock size={15} />}
              iconColor="var(--warning)"
              iconBg="var(--warning-bg)"
              iconBorder="var(--warning-border)"
              title="¿A qué hora entran?"
              sub="Movimiento durante el día"
            />
            {peakHour !== "--" && (
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: 10, fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-4)", marginBottom: 4 }}>
                  Hora pico (Más visitas)
                </p>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontFamily: '"DM Mono", monospace',
                    fontWeight: "var(--font-weight-bold)",
                    color: "var(--warning)",
                    background: "var(--warning-bg)",
                    border: "1px solid var(--warning-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "3px 8px",
                  }}
                >
                  {peakHour}:00
                </span>
              </div>
            )}
          </div>

          {/* Bar chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 100, marginBottom: 10 }}>
            {Array.from({ length: 24 }).map((_, hour) => {
              const count = hourCounts[hour] ?? 0;
              const height = maxHourCount > 0 ? (count / maxHourCount) * 100 : 0;
              const isPeak = count > 0 && count === maxHourCount;
              return (
                <div
                  key={hour}
                  title={`${hour}:00 — ${count} visitas`}
                  style={{
                    flex: 1,
                    height: `${Math.max(height, 4)}%`,
                    borderRadius: "2px 2px 0 0",
                    background: isPeak ? rst.color : "rgba(255,255,255,0.07)",
                    border: isPeak ? `1px solid ${rst.border}` : "none",
                    transition: "background var(--dur-fast), height var(--dur-slow) var(--ease-smooth)",
                    cursor: "default",
                    alignSelf: "flex-end",
                  }}
                />
              );
            })}
          </div>

          {/* X axis labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 8,
              borderTop: "1px solid var(--border)",
            }}
          >
            {["00h", "06h", "12h", "18h", "23h"].map((h) => (
              <span key={h} style={{ fontSize: 9, fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-4)" }}>
                {h}
              </span>
            ))}
          </div>
        </PanelCard>
      </div>

      {/* Divider */}
      <Divider />

      {/* ══════════════════════════════════════════════════
          LOYALTY SECTION
          ══════════════════════════════════════════════════ */}
      <PanelCard>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <PanelHeader
            icon={<Heart size={15} />}
            iconColor="var(--danger)"
            iconBg="var(--danger-bg)"
            iconBorder="var(--danger-border)"
            title="Fidelidad de clientes"
            sub="Clientes que regresan sin registrarse"
          />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--success)",
                boxShadow: "0 0 6px var(--success-glow)",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 10, fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-3)" }}>
              Real-time
            </span>
          </div>
        </div>

        {/* Loyalty stats mini-grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "clamp(8px, 1.5vw, 12px)",
            marginBottom: 28,
          }}
        >
          {[
            { label: "Clientes únicos", value: totalVisitors, color: "var(--accent)" },
            { label: "Clientes recurrentes", value: returningVisitors, color: "var(--success)" },
            { label: "% Clientes fieles", value: `${returnRate}%`, color: "var(--warning)" },
            { label: "Visitas promedio", value: avgVisits, color: "var(--info)" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                padding: "14px 16px",
                borderRadius: "var(--radius-md)",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border)",
              }}
            >
              <p style={{ fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: "var(--font-weight-bold)", color, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 6, fontVariantNumeric: "tabular-nums" }}>
                {value}
              </p>
              <p style={{ fontSize: 10, fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-4)", lineHeight: 1.3 }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Frequency ranking */}
        {loyaltyStats.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <TrendingUp size={13} style={{ color: "var(--success)" }} />
              <span style={{ fontSize: 10, fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-3)" }}>
                Clientes más fieles (Cuadro de honor)
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {loyaltyStats
                .sort((a, b) => b.visit_count - a.visit_count)
                .slice(0, 5)
                .map((v, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Rank */}
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "var(--radius-sm)",
                        background: i === 0 ? rst.bg : "rgba(255,255,255,0.03)",
                        border: `1px solid ${i === 0 ? rst.border : "var(--border)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: "var(--font-weight-bold)",
                        color: i === 0 ? rst.color : "var(--text-4)",
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>

                    {/* Bar + hash */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                        <span style={{ fontSize: "var(--text-xs)", fontFamily: '"DM Mono", monospace', color: "var(--text-3)" }}>
                          {v.cookie_hash.substring(0, 14)}…
                        </span>
                        <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-bold)", color: "var(--text-2)", flexShrink: 0 }}>
                          {v.visit_count} visitas registradas
                        </span>
                      </div>
                      <div style={{ height: 2, background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${(v.visit_count / (loyaltyStats[0]?.visit_count ?? 1)) * 100}%`,
                            background: rst.color,
                            borderRadius: "var(--radius-full)",
                            transition: "width var(--dur-slow) var(--ease-smooth)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </PanelCard>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOCAL SERVER COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function Divider() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 1,
        background: "linear-gradient(90deg, transparent, var(--border-soft) 20%, var(--border-soft) 80%, transparent)",
      }}
    />
  );
}

function PanelCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--radius-lg)",
        padding: "clamp(16px, 2.5vw, 24px)",
        boxShadow: "var(--shadow-1)",
        transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
      }}
    >
      {children}
    </div>
  );
}

function PanelHeader({
  icon, iconColor, iconBg, iconBorder, title, sub,
}: {
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  title: string;
  sub: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "var(--radius-md)",
          background: iconBg,
          border: `1px solid ${iconBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--text)", lineHeight: 1.2 }}>
          {title}
        </p>
        <p style={{ fontSize: 10, fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-4)", marginTop: 3 }}>
          {sub}
        </p>
      </div>
    </div>
  );
}

function EmptyChart({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 160,
        gap: 12,
        borderRadius: "var(--radius-md)",
        border: "1px dashed var(--border-soft)",
        background: "rgba(255,255,255,0.01)",
        color: "var(--text-4)",
      }}
    >
      {icon}
      <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--text-3)" }}>
        {label}
      </span>
    </div>
  );
}

function AnalyticsStatCard({
  label, value, icon, valueColor, accent, accentBorder,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  valueColor: string;
  accent: string;
  accentBorder: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: "var(--surface)",
        border: `1px solid ${accentBorder}`,
        borderRadius: "var(--radius-lg)",
        padding: "clamp(14px, 2vw, 20px)",
        boxShadow: "var(--shadow-1)",
        overflow: "hidden",
        transition: "transform var(--dur-fast), box-shadow var(--dur-fast)",
      }}
      className="hover:!translate-y-[-2px] hover:!shadow-[var(--shadow-3)]"
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: accent, opacity: 0.4, borderRadius: "inherit", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-3)" }}>
            {label}
          </p>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "var(--radius-sm)", background: accent, color: valueColor, border: `1px solid ${accentBorder}` }}>
            {icon}
          </span>
        </div>
        <p style={{ fontSize: "clamp(26px, 3.5vw, 34px)", fontWeight: "var(--font-weight-bold)", color: valueColor, lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
          {value}
        </p>
      </div>
    </div>
  );
}