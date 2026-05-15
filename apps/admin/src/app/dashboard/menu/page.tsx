import { cookies } from "next/headers";
import { getServerSupabase, getAdminProfile } from "@repo/database/server";
import { redirect } from "next/navigation";
import MenuClient from "./client";
import type { MenuItem } from "@repo/database/types";
import { UtensilsCrossed, CheckCircle2, XCircle } from "lucide-react";

export default async function MenuPage() {
  const cookieStore = await cookies();
  const supabase = getServerSupabase(cookieStore);
  const adminProfile = await getAdminProfile(cookieStore);

  if (!adminProfile) redirect("/unauthorized");

  const { data: menuItems, error } = await supabase
    .from("menu_items")
    .select("*")
    .in("restaurant_id", adminProfile.restaurants || [])
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) console.error("[MenuPage]", error);

  const items = (menuItems as MenuItem[]) ?? [];
  const available = items.filter((i) => i.is_available).length;
  const unavailable = items.length - available;
  const availRate = items.length > 0 ? Math.round((available / items.length) * 100) : 0;

  return (
    <div
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "clamp(16px, 3vw, 36px)",
      }}
    >
      {/* ══════════════════════════════════════════════════
          PAGE HEADER
          ══════════════════════════════════════════════════ */}
      <div style={{ marginBottom: "clamp(24px, 4vw, 40px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-bold)",
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-wider)",
              color: "var(--text-4)",
            }}
          >
            Gestión · Tiempo Real
          </span>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--border-strong)" }}>/</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-bold)",
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-wider)",
              color: "var(--dl)",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--dl)",
                display: "inline-block",
              }}
            />
            &lt; 5s propagación
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
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
              Menú Digital
            </h1>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-3)",
                marginTop: 10,
                maxWidth: 460,
                lineHeight: "var(--leading-loose)",
              }}
            >
              Actualiza disponibilidad al instante. Los cambios se reflejan en el sitio público en menos de 5 segundos.
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          STAT GRID
          ══════════════════════════════════════════════════ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "clamp(10px, 1.5vw, 14px)",
          marginBottom: "clamp(24px, 4vw, 36px)",
        }}
      >
        <MenuStatCard
          label="Total platos"
          value={items.length}
          sub="en carta"
          icon={<UtensilsCrossed size={14} />}
          valueColor="var(--text)"
        />
        <MenuStatCard
          label="Disponibles"
          value={available}
          sub="activos ahora"
          icon={<CheckCircle2 size={14} />}
          valueColor="var(--success)"
          accent="var(--success-bg)"
          accentBorder="var(--success-border)"
          glow="var(--success-glow)"
        />
        <MenuStatCard
          label="Agotados"
          value={unavailable}
          sub="sin stock"
          icon={<XCircle size={14} />}
          valueColor="var(--danger)"
          accent="var(--danger-bg)"
          accentBorder="var(--danger-border)"
          glow="var(--danger-glow)"
        />
        <MenuStatCard
          label="Disponibilidad"
          value={`${availRate}%`}
          sub="de la carta activa"
          icon={<CheckCircle2 size={14} />}
          valueColor="var(--dl)"
          accent="var(--dl-bg)"
          accentBorder="var(--dl-border)"
          progress={availRate}
        />
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, var(--border-soft) 20%, var(--border-soft) 80%, transparent)",
          marginBottom: "clamp(20px, 3vw, 28px)",
        }}
        aria-hidden="true"
      />

      <MenuClient
        initialItems={items}
        restaurantIds={adminProfile.restaurants ?? []}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STAT CARD — server component local
   ───────────────────────────────────────────────────────────── */
function MenuStatCard({
  label,
  value,
  sub,
  icon,
  valueColor,
  accent,
  accentBorder,
  glow,
  progress,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  valueColor: string;
  accent?: string;
  accentBorder?: string;
  glow?: string;
  progress?: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: "var(--surface)",
        border: `1px solid ${accentBorder ?? "var(--border-soft)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "clamp(14px, 2vw, 20px)",
        boxShadow: "var(--shadow-1)",
        overflow: "hidden",
        transition: "border-color var(--dur-fast), box-shadow var(--dur-fast), transform var(--dur-fast)",
      }}
      className="hover:!translate-y-[-2px] hover:!shadow-[var(--shadow-3)]"
    >
      {accent && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: accent,
            opacity: 0.45,
            borderRadius: "inherit",
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-3)" }}>
            {label}
          </p>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "var(--radius-sm)", background: accent ?? "rgba(255,255,255,0.04)", color: valueColor, border: `1px solid ${accentBorder ?? "var(--border)"}` }}>
            {icon}
          </span>
        </div>
        <p style={{ fontSize: "clamp(26px, 3.5vw, 34px)", fontWeight: "var(--font-weight-bold)", color: valueColor, lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", marginBottom: 6 }}>
          {value}
        </p>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-3)", lineHeight: 1.3 }}>
          {sub}
        </p>
        {progress !== undefined && (
          <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-full)", marginTop: 12, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: valueColor, borderRadius: "var(--radius-full)", transition: "width var(--dur-normal) var(--ease-smooth)" }} />
          </div>
        )}
      </div>
    </div>
  );
}