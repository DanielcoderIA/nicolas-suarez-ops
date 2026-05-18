"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, X, Users, Clock } from "lucide-react";
import { createClient } from "../../utils/supabase/client";

/* ════════════════════════════════════════════════════════════════
   TYPES
   ════════════════════════════════════════════════════════════════ */

interface ReservationPayload {
  id: string;
  restaurant_id: string;
  client_name: string;
  guests: number;
  date: string;
  time: string;
  status: string;
  created_at: string;
}

interface Notification {
  id: string;
  type: "new_reservation";
  title: string;
  body: string;
  restaurant: string;
  restaurantKey: "lc" | "mt" | "dl";
  meta: {
    guests: number;
    date: string;
    time: string;
    clientName: string;
  };
  receivedAt: Date;
  read: boolean;
}

/* ════════════════════════════════════════════════════════════════
   CONSTANTS
   ════════════════════════════════════════════════════════════════ */

const RESTAURANT_MAP: Record<
  string,
  { name: string; key: "lc" | "mt" | "dl" }
> = {
  "11111111-1111-1111-1111-111111111111": {
    name: "La Carreta",
    key: "lc",
  },
  "22222222-2222-2222-2222-222222222222": {
    name: "Mar y Tierra",
    key: "mt",
  },
  "33333333-3333-3333-3333-333333333333": {
    name: "Delica",
    key: "dl",
  },
};

/* ════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════ */

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Ahora";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${Math.floor(hours / 24)}d`;
}

function formatTime(time: string): string {
  const parts = time.split(":");
  const h = parts[0] ?? "0";
  const m = parts[1] ?? "00";
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

function formatDate(dateStr: string): string {
  const today = new Date().toISOString().split("T")[0];
  if (dateStr === today) return "Hoy";

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (dateStr === tomorrow.toISOString().split("T")[0]) return "Mañana";

  const parts = dateStr.split("-");
  const month = parts[1] ?? "01";
  const day = parts[2] ?? "01";
  const months = [
    "", "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];
  return `${parseInt(day, 10)} ${months[parseInt(month, 10)] ?? ""}`;
}

/* ════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════ */

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ── Supabase Realtime subscription ────────────────────────── */
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("admin-new-reservations")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reservations",
        },
        (payload) => {
          const row = payload.new as ReservationPayload;
          const restaurant = RESTAURANT_MAP[row.restaurant_id] ?? {
            name: "Restaurante",
            key: "lc" as const,
          };

          const notification: Notification = {
            id: row.id,
            type: "new_reservation",
            title: "Nueva reserva",
            body: `${row.client_name} — ${row.guests} persona${row.guests > 1 ? "s" : ""}`,
            restaurant: restaurant.name,
            restaurantKey: restaurant.key,
            meta: {
              guests: row.guests,
              date: row.date,
              time: row.time,
              clientName: row.client_name,
            },
            receivedAt: new Date(),
            read: false,
          };

          setNotifications((prev) => [notification, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ── Close on outside click ────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [isOpen]);

  /* ── Update time-ago labels every 30s ──────────────────────── */
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  /* ── Actions ───────────────────────────────────────────────── */
  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <div style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notificaciones"
        style={{
          position: "relative",
          width: 32,
          height: 32,
          borderRadius: "var(--radius-md)",
          border: `1px solid ${isOpen ? "var(--border-focus)" : "var(--border-strong)"}`,
          background: isOpen ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: isOpen ? "var(--text-2)" : "var(--text-3)",
          transition:
            "border-color var(--dur-fast), background var(--dur-fast), color var(--dur-fast)",
        }}
        className="hover:!border-[var(--border-focus)] hover:!text-[var(--text-2)] hover:!bg-white/[0.04]"
      >
        <Bell size={13} />

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            className="notif-badge-pulse"
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 16,
              height: 16,
              borderRadius: "var(--radius-full)",
              background: "var(--danger)",
              border: "2px solid var(--bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 800,
              color: "#fff",
              padding: "0 3px",
              lineHeight: 1,
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="notif-panel-enter"
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: "min(320px, calc(100vw - 48px))",
            maxHeight: 300,
            background: "rgba(14,16,19,0.97)",
            backdropFilter: "blur(24px) saturate(1.6)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-5)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            zIndex: 100,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px 12px",
              borderBottom: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            <div className="flex items-center gap-2">
              <Bell size={13} color="var(--text-2)" />
              <span
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-bold)",
                  color: "var(--text)",
                  letterSpacing: "var(--tracking-tight)",
                }}
              >
                Notificaciones
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--danger-bg)",
                    color: "var(--danger)",
                    border: "1px solid var(--danger-border)",
                    lineHeight: 1.5,
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--text-3)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "var(--radius-sm)",
                  transition: "color var(--dur-fast), background var(--dur-fast)",
                  letterSpacing: "0.02em",
                }}
                className="hover:!text-[var(--text-2)] hover:!bg-white/[0.04]"
              >
                Marcar todo leído
              </button>
            )}
          </div>

          {/* List */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {notifications.length === 0 ? (
              /* Empty state */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px 20px",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-full)",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bell size={16} color="var(--text-4)" />
                </div>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--text-3)",
                    fontWeight: "var(--font-weight-medium)",
                    textAlign: "center",
                  }}
                >
                  Sin notificaciones
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--text-4)",
                    textAlign: "center",
                    maxWidth: 240,
                    lineHeight: 1.5,
                  }}
                >
                  Las nuevas reservas aparecerán aquí en tiempo real
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--border)",
                    background: notif.read
                      ? "transparent"
                      : "rgba(255,255,255,0.015)",
                    transition: "background var(--dur-fast)",
                    position: "relative",
                  }}
                >
                  {/* Unread dot */}
                  {!notif.read && (
                    <span
                      style={{
                        position: "absolute",
                        left: 6,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: `var(--${notif.restaurantKey})`,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "var(--radius-md)",
                      background: `var(--${notif.restaurantKey}-bg)`,
                      border: `1px solid var(--${notif.restaurantKey}-border)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <Users
                      size={13}
                      color={`var(--${notif.restaurantKey})`}
                    />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Restaurant tag + time */}
                    <div
                      className="flex items-center justify-between"
                      style={{ marginBottom: 3 }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: `var(--${notif.restaurantKey})`,
                        }}
                      >
                        {notif.restaurant}
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          color: "var(--text-4)",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          marginLeft: 8,
                        }}
                      >
                        {timeAgo(notif.receivedAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semibold)",
                        color: "var(--text)",
                        lineHeight: 1.3,
                        marginBottom: 4,
                      }}
                    >
                      {notif.meta.clientName}
                    </p>

                    {/* Details row */}
                    <div
                      className="flex items-center"
                      style={{ gap: 10 }}
                    >
                      <span
                        className="flex items-center"
                        style={{
                          gap: 3,
                          fontSize: 10,
                          color: "var(--text-3)",
                          fontWeight: 500,
                        }}
                      >
                        <Users size={10} />
                        {notif.meta.guests}{" "}
                        {notif.meta.guests > 1 ? "personas" : "persona"}
                      </span>
                      <span
                        style={{
                          width: 3,
                          height: 3,
                          borderRadius: "50%",
                          background: "var(--text-4)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className="flex items-center"
                        style={{
                          gap: 3,
                          fontSize: 10,
                          color: "var(--text-3)",
                          fontWeight: 500,
                        }}
                      >
                        <Clock size={10} />
                        {formatDate(notif.meta.date)},{" "}
                        {formatTime(notif.meta.time)}
                      </span>
                    </div>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={() => dismissNotification(notif.id)}
                    aria-label="Descartar"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "var(--radius-sm)",
                      background: "none",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "var(--text-4)",
                      flexShrink: 0,
                      marginTop: 2,
                      transition: "color var(--dur-fast)",
                    }}
                    className="hover:!text-[var(--text-2)]"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
