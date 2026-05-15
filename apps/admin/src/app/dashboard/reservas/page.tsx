import { cookies } from "next/headers";
import { getServerSupabase, getAdminProfile } from "@repo/database/server";
import { redirect } from "next/navigation";
import ReservationsClient from "./client";
import type { Reservation } from "@repo/database/types";
import { CalendarDays, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

export default async function ReservasPage() {
  const cookieStore = await cookies();
  const supabase = getServerSupabase(cookieStore);
  const adminProfile = await getAdminProfile(cookieStore);

  if (!adminProfile) redirect("/unauthorized");

  const { data: reservations, error } = await supabase
    .from("reservations")
    .select("*")
    .in("restaurant_id", adminProfile.restaurants || [])
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) console.error("[ReservasPage]", error);

  const all = (reservations || []) as Reservation[];
  const total = all.length;
  const pending = all.filter((r) => r.status === "pending").length;
  const confirmed = all.filter((r) => r.status === "confirmed").length;
  const cancelled = all.filter((r) => r.status === "cancelled").length;

  /* Tasa de confirmación */
  const confirmRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;

  /* Reservas de hoy */
  const today = new Date().toISOString().split("T")[0];
  const todayCount = all.filter((r) => r.date === today).length;

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
          marginBottom: "clamp(24px, 4vw, 40px)",
        }}
      >
        {/* Eyebrow + title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-bold)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-wider)",
                color: "var(--text-4)",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--success)",
                  boxShadow: "0 0 6px var(--success-glow)",
                  display: "inline-block",
                  animation: "pulse 2.5s ease-in-out infinite",
                }}
              />
              Sistema unificado
            </span>
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--border-strong)",
              }}
            >
              /
            </span>
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-bold)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-wider)",
                color: "var(--text-4)",
              }}
            >
              {adminProfile.restaurants?.length ?? 0} Restaurantes
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
                Reservas
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
                Vista unificada de los 3 restaurantes. Confirma o cancela con un solo toque.
              </p>
            </div>

            {/* CTA */}
            <button
              className="btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 40,
                padding: "0 20px",
                borderRadius: "var(--radius-lg)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-semibold)",
                letterSpacing: "0.01em",
                flexShrink: 0,
              }}
            >
              <CalendarDays size={15} />
              Nueva reserva
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          STAT GRID — 5 columnas en desktop, 2+1 en mobile
          ══════════════════════════════════════════════════ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "clamp(10px, 1.5vw, 14px)",
          marginBottom: "clamp(24px, 4vw, 36px)",
        }}
      >
        {/* Total */}
        <StatCard
          label="Total"
          value={total}
          sub="reservas activas"
          icon={<CalendarDays size={14} />}
          valueColor="var(--text)"
        />

        {/* Pendientes */}
        <StatCard
          label="Pendientes"
          value={pending}
          sub="esperando acción"
          icon={<Clock size={14} />}
          valueColor="var(--warning)"
          accent="var(--warning-bg)"
          accentBorder="var(--warning-border)"
          glow="var(--warning-glow)"
        />

        {/* Confirmadas */}
        <StatCard
          label="Confirmadas"
          value={confirmed}
          sub="aprobadas"
          icon={<CheckCircle2 size={14} />}
          valueColor="var(--success)"
          accent="var(--success-bg)"
          accentBorder="var(--success-border)"
          glow="var(--success-glow)"
        />

        {/* Tasa de confirmación */}
        <StatCard
          label="Tasa de conf."
          value={`${confirmRate}%`}
          sub="sobre el total"
          icon={<TrendingUp size={14} />}
          valueColor="var(--accent)"
          accent="var(--accent-dim)"
          accentBorder="rgba(79,142,247,0.18)"
          glow="var(--accent-glow)"
          progress={confirmRate}
        />

        {/* Hoy */}
        <StatCard
          label="Hoy"
          value={todayCount}
          sub={new Date().toLocaleDateString("es-CO", { weekday: "long" })}
          icon={<CalendarDays size={14} />}
          valueColor="var(--dl)"
          accent="var(--dl-bg)"
          accentBorder="var(--dl-border)"
          glow="rgba(156,124,68,0.18)"
        />
      </div>

      {/* ══════════════════════════════════════════════════
          DIVIDER subtle
          ══════════════════════════════════════════════════ */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, var(--border-soft) 20%, var(--border-soft) 80%, transparent)",
          marginBottom: "clamp(20px, 3vw, 28px)",
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════
          CLIENT (filtros + tabla)
          ══════════════════════════════════════════════════ */}
      <ReservationsClient
        initialReservations={all}
        restaurantIds={adminProfile.restaurants || []}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STAT CARD — componente local (server component)
   ───────────────────────────────────────────────────────────── */
function StatCard({
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
        boxShadow: glow ? `0 0 0 1px ${accentBorder ?? "transparent"}, var(--shadow-1)` : "var(--shadow-1)",
        overflow: "hidden",
        transition: "border-color var(--dur-fast), box-shadow var(--dur-fast), transform var(--dur-fast)",
      }}
      className="group hover:!translate-y-[-2px] hover:!shadow-[var(--shadow-3)]"
    >
      {/* Glow fill sutil */}
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
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <p
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-bold)",
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-wider)",
              color: "var(--text-3)",
            }}
          >
            {label}
          </p>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              borderRadius: "var(--radius-sm)",
              background: accent ?? "rgba(255,255,255,0.04)",
              color: valueColor,
              border: `1px solid ${accentBorder ?? "var(--border)"}`,
            }}
          >
            {icon}
          </span>
        </div>

        {/* Value */}
        <p
          style={{
            fontSize: "clamp(26px, 3.5vw, 34px)",
            fontWeight: "var(--font-weight-bold)",
            color: valueColor,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            fontVariantNumeric: "tabular-nums",
            marginBottom: 6,
          }}
        >
          {value}
        </p>

        {/* Sub-label */}
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--text-3)",
            lineHeight: 1.3,
          }}
        >
          {sub}
        </p>

        {/* Progress bar optional */}
        {progress !== undefined && (
          <div
            style={{
              height: 2,
              background: "rgba(255,255,255,0.06)",
              borderRadius: "var(--radius-full)",
              marginTop: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: valueColor,
                borderRadius: "var(--radius-full)",
                transition: "width var(--dur-normal) var(--ease-smooth)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}