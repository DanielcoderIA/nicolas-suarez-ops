"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import {
  Calendar, Users, Phone, Check, X, FileText,
  Clock, MapPin, ChevronDown, RotateCcw,
} from "lucide-react";
import type { Reservation, ReservationStatus } from "@repo/database/types";

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════ */

const RESTAURANT_NAMES: Record<string, string> = {
  "11111111-1111-1111-1111-111111111111": "La Carreta",
  "22222222-2222-2222-2222-222222222222": "Mar y Tierra",
  "33333333-3333-3333-3333-333333333333": "Delica",
};

const RESTAURANT_STYLE: Record<string, { color: string; bg: string; border: string; badge: string }> = {
  "11111111-1111-1111-1111-111111111111": { color: "var(--lc)", bg: "var(--lc-bg)", border: "var(--lc-border)", badge: "badge-lc" },
  "22222222-2222-2222-2222-222222222222": { color: "var(--mt)", bg: "var(--mt-bg)", border: "var(--mt-border)", badge: "badge-mt" },
  "33333333-3333-3333-3333-333333333333": { color: "var(--dl)", bg: "var(--dl-bg)", border: "var(--dl-border)", badge: "badge-dl" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending: { label: "Pendiente", color: "var(--warning)", bg: "var(--warning-bg)", border: "var(--warning-border)" },
  confirmed: { label: "Confirmada", color: "var(--success)", bg: "var(--success-bg)", border: "var(--success-border)" },
  cancelled: { label: "Cancelada", color: "var(--danger)", bg: "var(--danger-bg)", border: "var(--danger-border)" },
  notified: { label: "Notificada", color: "var(--info)", bg: "var(--info-bg)", border: "var(--info-border)" },
};

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "pm" : "am";
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:${m} ${ampm}`;
}

/* ═══════════════════════════════════════════════════════════
   SUBCOMPONENTS
   ═══════════════════════════════════════════════════════════ */

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px",
        borderRadius: "var(--radius-full)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--font-weight-bold)",
        letterSpacing: "var(--tracking-wider)",
        textTransform: "uppercase",
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        lineHeight: 1.5,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: cfg.color,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

function MetaChip({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: "var(--font-weight-bold)",
          textTransform: "uppercase",
          letterSpacing: "var(--tracking-wider)",
          color: "var(--text-4)",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "var(--text-3)", display: "flex", flexShrink: 0 }}>{icon}</span>
        <span
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--text)",
            fontFamily: mono ? '"DM Mono", monospace' : undefined,
            letterSpacing: mono ? "var(--tracking-wide)" : undefined,
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESERVATION CARD
   ═══════════════════════════════════════════════════════════ */

function ReservationCard({
  res,
  updating,
  onUpdate,
}: {
  res: Reservation;
  updating: string | null;
  onUpdate: (id: string, restaurantId: string, status: ReservationStatus) => void;
}) {
  const rest = RESTAURANT_STYLE[res.restaurant_id];
  const isLoading = updating === res.id;

  return (
    <div
      style={{
        position: "relative",
        background: "var(--surface)",
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        transition: "border-color var(--dur-fast), box-shadow var(--dur-fast), transform var(--dur-fast)",
        opacity: isLoading ? 0.6 : 1,
      }}
      className="hover:!border-[var(--border-strong)] hover:!shadow-[var(--shadow-3)] hover:!translate-y-[-1px]"
    >
      {/* Restaurant color bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: rest?.color ?? "var(--border)",
        }}
      />

      <div style={{ padding: "clamp(16px, 2.5vw, 24px)" }}>

        {/* ── Header row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          {/* Left: name + pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", minWidth: 0 }}>
            {/* Avatar iniciales */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-md)",
                background: rest?.bg ?? "var(--surface-2)",
                border: `1px solid ${rest?.border ?? "var(--border)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-bold)",
                color: rest?.color ?? "var(--text-3)",
                flexShrink: 0,
                letterSpacing: "0.04em",
              }}
            >
              {res.client_name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
            </div>

            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: "var(--text-md)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--text)",
                  lineHeight: 1.2,
                  letterSpacing: "var(--tracking-tight)",
                }}
              >
                {res.client_name}
              </p>
              {/* Restaurant name subtle */}
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  color: rest?.color ?? "var(--text-3)",
                  marginTop: 2,
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                {RESTAURANT_NAMES[res.restaurant_id] ?? ""}
              </p>
            </div>
          </div>

          {/* Right: status pill */}
          <StatusPill status={res.status} />
        </div>

        {/* ── Meta grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
            gap: "12px 24px",
            padding: "14px 16px",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            marginBottom: res.notes ? 12 : 16,
          }}
        >
          <MetaChip icon={<Calendar size={13} />} label="Fecha" value={formatDate(res.date)} />
          <MetaChip icon={<Clock size={13} />} label="Hora" value={formatTime(res.time)} />
          <MetaChip icon={<Users size={13} />} label="Personas" value={`${res.guests} pers.`} />
          <MetaChip icon={<Phone size={13} />} label="WhatsApp" value={res.whatsapp} mono />
        </div>

        {/* ── Notes ── */}
        {res.notes && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "10px 14px",
              background: "rgba(255,255,255,0.015)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              marginBottom: 16,
            }}
          >
            <FileText size={13} style={{ color: "var(--text-4)", flexShrink: 0, marginTop: 1 }} />
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-3)",
                lineHeight: "var(--leading-loose)",
                fontStyle: "italic",
              }}
            >
              {res.notes}
            </p>
          </div>
        )}

        {/* ── Actions ── */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {res.status !== "confirmed" && res.status !== "cancelled" && (
            <button
              onClick={() => onUpdate(res.id, res.restaurant_id, "confirmed")}
              disabled={isLoading}
              className="btn-action btn-confirm"
              style={{ flex: 1, justifyContent: "center", height: 36, minWidth: 100 }}
            >
              <Check size={14} strokeWidth={2.5} />
              Confirmar
            </button>
          )}

          {res.status === "confirmed" && (
            <button
              onClick={() => onUpdate(res.id, res.restaurant_id, "cancelled")}
              disabled={isLoading}
              className="btn-action btn-cancel-res"
              style={{ flex: 1, justifyContent: "center", height: 36, minWidth: 100 }}
            >
              <X size={14} strokeWidth={2.5} />
              Cancelar reserva
            </button>
          )}

          {res.status === "pending" && (
            <button
              onClick={() => onUpdate(res.id, res.restaurant_id, "cancelled")}
              disabled={isLoading}
              className="btn-action btn-cancel-res"
              style={{ flex: 1, justifyContent: "center", height: 36, minWidth: 100 }}
            >
              <X size={14} strokeWidth={2.5} />
              Rechazar
            </button>
          )}

          {res.status === "cancelled" && (
            <button
              onClick={() => onUpdate(res.id, res.restaurant_id, "pending")}
              disabled={isLoading}
              className="btn-action btn-ghost"
              style={{ flex: 1, justifyContent: "center", height: 36, minWidth: 100 }}
            >
              <RotateCcw size={13} />
              Restablecer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════════ */

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(40px, 8vw, 80px) 24px",
        gap: 20,
        borderRadius: "var(--radius-lg)",
        border: "1px dashed var(--border-soft)",
        background: "rgba(255,255,255,0.01)",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "var(--radius-lg)",
          background: "var(--surface)",
          border: "1px solid var(--border-strong)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Calendar size={22} style={{ color: "var(--text-3)" }} />
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "var(--text-md)", fontWeight: "var(--font-weight-semibold)", color: "var(--text)", marginBottom: 6 }}>
          {hasFilters ? "Sin resultados" : "No hay reservas"}
        </p>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--text-3)", maxWidth: 280, lineHeight: "var(--leading-normal)" }}>
          {hasFilters
            ? "Ninguna reserva coincide con los filtros activos."
            : "Aún no hay reservas registradas en el sistema."}
        </p>
      </div>

      {hasFilters ? (
        <button onClick={onClear} className="btn-action btn-ghost" style={{ height: 34 }}>
          <X size={13} />
          Limpiar filtros
        </button>
      ) : (
        <button className="btn-action btn-primary" style={{ height: 34 }}>
          <Check size={13} strokeWidth={2.5} />
          Nueva reserva
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN CLIENT
   ═══════════════════════════════════════════════════════════ */

export default function ReservationsClient({
  initialReservations,
  restaurantIds,
}: {
  initialReservations: Reservation[];
  restaurantIds: string[];
}) {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [filterRestaurant, setFilterRestaurant] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");
  const [updating, setUpdating] = useState<string | null>(null);
  const supabase = createClient();

  /* ── Real-time ── */
  useEffect(() => {
    const channel = supabase
      .channel("admin-reservations")
      .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const r = payload.new as Reservation;
          if (restaurantIds.includes(r.restaurant_id)) {
            setReservations((prev) =>
              [...prev, r].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
            );
          }
        } else if (payload.eventType === "UPDATE") {
          const r = payload.new as Reservation;
          setReservations((prev) => prev.map((x) => (x.id === r.id ? r : x)));
        } else if (payload.eventType === "DELETE") {
          setReservations((prev) => prev.filter((x) => x.id !== payload.old.id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, restaurantIds]);

  const handleUpdateStatus = async (id: string, restaurantId: string, status: ReservationStatus) => {
    const prev = [...reservations];
    setUpdating(id);
    setReservations((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, restaurantId }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setReservations(prev);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = reservations.filter((r) => {
    if (filterRestaurant !== "all" && r.restaurant_id !== filterRestaurant) return false;
    if (filterDate && r.date !== filterDate) return false;
    return true;
  });

  const hasFilters = filterRestaurant !== "all" || !!filterDate;
  const clearFilters = () => { setFilterRestaurant("all"); setFilterDate(""); };

  /* ── Agrupar por fecha ── */
  const grouped = filtered.reduce<Record<string, Reservation[]>>((acc, r) => {
    (acc[r.date] ??= []).push(r);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Filters bar ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          padding: "12px 14px",
          background: "var(--surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Restaurant select */}
        <div style={{ position: "relative", flex: "1 1 180px", minWidth: 0 }}>
          <MapPin
            size={13}
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-3)",
              pointerEvents: "none",
            }}
          />
          <select
            value={filterRestaurant}
            onChange={(e) => setFilterRestaurant(e.target.value)}
            className="admin-input"
            style={{ paddingLeft: 30, paddingRight: 28, height: 36, fontSize: "var(--text-sm)", appearance: "none", cursor: "pointer" }}
          >
            <option value="all">Todos los restaurantes</option>
            {restaurantIds.map((id) => (
              <option key={id} value={id}>{RESTAURANT_NAMES[id] ?? id}</option>
            ))}
          </select>
          <ChevronDown
            size={13}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-3)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Date picker */}
        <div style={{ position: "relative", flex: "0 0 auto" }}>
          <Calendar
            size={13}
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-3)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="admin-input"
            style={{
              paddingLeft: 30,
              height: 36,
              fontSize: "var(--text-sm)",
              width: 160,
              colorScheme: "dark",
            }}
          />
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="btn-action btn-ghost"
            style={{ height: 36, flexShrink: 0 }}
          >
            <X size={13} />
            Limpiar
          </button>
        )}

        {/* Count pill */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--text-3)",
              padding: "3px 10px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-strong)",
              whiteSpace: "nowrap",
            }}
          >
            {filtered.length} reserva{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {sortedDates.map((date) => (
            <section key={date}>
              {/* Date group header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-weight-bold)",
                    textTransform: "uppercase",
                    letterSpacing: "var(--tracking-wider)",
                    color: "var(--text-3)",
                  }}
                >
                  {formatDate(date)}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "var(--border)",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: "var(--font-weight-bold)",
                    color: "var(--text-4)",
                    padding: "2px 7px",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {grouped[date].length}
                </span>
              </div>

              {/* Cards for that date */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: 12,
                }}
              >
                {grouped[date].map((res) => (
                  <ReservationCard
                    key={res.id}
                    res={res}
                    updating={updating}
                    onUpdate={handleUpdateStatus}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}