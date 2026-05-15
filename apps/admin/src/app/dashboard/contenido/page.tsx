import { cookies } from "next/headers";
import { getServerSupabase, getAdminProfile } from "@repo/database/server";
import { redirect } from "next/navigation";
import { getAdminExperiences } from "@repo/database/queries/admin";
import ContenidoClient from "./client";
import { BookOpen, Eye, FileEdit, Layers } from "lucide-react";

const DELICA_ID = "33333333-3333-3333-3333-333333333333";

export default async function ContenidoPage() {
  const cookieStore = await cookies();
  const supabase = getServerSupabase(cookieStore);
  const adminProfile = await getAdminProfile(cookieStore);

  if (!adminProfile) redirect("/unauthorized");

  /* ── Acceso restringido ── */
  if (!adminProfile.restaurants?.includes(DELICA_ID)) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: 32,
          gap: 20,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "var(--radius-lg)",
            background: "var(--surface)",
            border: "1px solid var(--border-strong)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BookOpen size={24} style={{ color: "var(--text-3)" }} />
        </div>
        <div>
          <p style={{ fontSize: "var(--text-md)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-2)", marginBottom: 6 }}>
            Acceso restringido
          </p>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-3)", maxWidth: 280, lineHeight: "var(--leading-normal)" }}>
            No tienes acceso al CMS de <strong style={{ color: "var(--dl)", fontWeight: "var(--font-weight-semibold)" }}>Delica</strong>. Contacta al administrador del sistema.
          </p>
        </div>
      </div>
    );
  }

  const experiences = await getAdminExperiences(supabase, DELICA_ID);

  const published = experiences.filter((e) => e.is_published).length;
  const drafts = experiences.filter((e) => !e.is_published).length;

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
          <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-4)" }}>
            Delica
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
            Catas &amp; Experiencias
          </span>
        </div>

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
              Contenido
            </h1>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-3)", marginTop: 10, maxWidth: 460, lineHeight: "var(--leading-loose)" }}>
              Publica catas y eventos exclusivos. Los cambios se reflejan en delicazipa.co de forma inmediata.
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
        <ContenidoStatCard
          label="Total catas"
          value={experiences.length}
          sub="en sistema"
          icon={<Layers size={14} />}
          valueColor="var(--text)"
        />
        <ContenidoStatCard
          label="Publicadas"
          value={published}
          sub="visibles en web"
          icon={<Eye size={14} />}
          valueColor="var(--success)"
          accent="var(--success-bg)"
          accentBorder="var(--success-border)"
        />
        <ContenidoStatCard
          label="Borradores"
          value={drafts}
          sub="sin publicar"
          icon={<FileEdit size={14} />}
          valueColor="var(--warning)"
          accent="var(--warning-bg)"
          accentBorder="var(--warning-border)"
        />
      </div>

      {/* Divider */}
      <div
        aria-hidden="true"
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, var(--border-soft) 20%, var(--border-soft) 80%, transparent)",
          marginBottom: "clamp(20px, 3vw, 28px)",
        }}
      />

      <ContenidoClient initialExperiences={experiences} restaurantId={DELICA_ID} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STAT CARD — server component local
   ───────────────────────────────────────────────────────────── */
function ContenidoStatCard({
  label, value, sub, icon, valueColor, accent, accentBorder,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  valueColor: string;
  accent?: string;
  accentBorder?: string;
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
        transition: "transform var(--dur-fast), box-shadow var(--dur-fast)",
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
      </div>
    </div>
  );
}