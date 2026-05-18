"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  UtensilsCrossed,
  LineChart,
  BookOpen,
  LogOut,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";
import { createClient } from "../../utils/supabase/client";
import NotificationBell from "./NotificationBell";

/* ════════════════════════════════════════════════════════════════
   CONSTANTES
   ════════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { name: "Reservas", href: "/dashboard/reservas", icon: CalendarDays },
  { name: "Menú", href: "/dashboard/menu", icon: UtensilsCrossed },
  { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { name: "Contenido", href: "/dashboard/contenido", icon: BookOpen },
] as const;

const RESTAURANTS = [
  { key: "lc", name: "La Carreta", color: "var(--lc)", bg: "var(--lc-bg)", count: 12 },
  { key: "mt", name: "Mar y Tierra", color: "var(--mt)", bg: "var(--mt-bg)", count: 8 },
  { key: "dl", name: "Delica", color: "var(--dl)", bg: "var(--dl-bg)", count: 5 },
] as const;

/* ════════════════════════════════════════════════════════════════
   BACKGROUND EFFECTS
   ════════════════════════════════════════════════════════════════ */
function BackgroundEffects() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="motion-safe:animate-pulse absolute -top-1/4 -left-[10%] w-1/2 h-1/2 rounded-full blur-[120px] opacity-[0.06]"
        style={{ background: "var(--accent)", animationDuration: "8s" }}
      />
      <div
        className="motion-safe:animate-pulse absolute -bottom-1/4 -right-[10%] w-2/5 h-2/5 rounded-full blur-[100px] opacity-[0.04]"
        style={{ background: "var(--dl)", animationDuration: "12s", animationDelay: "3s" }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SIDEBAR — DESKTOP
   Siempre visible, ancho fijo, sin hover-expand.
   El ítem activo se marca con acento lateral (border-left),
   no con un fondo que llena todo el botón.
   ════════════════════════════════════════════════════════════════ */
function DesktopSidebar({
  pathname,
  onLogout,
}: {
  pathname: string;
  onLogout: () => void;
}) {
  return (
    <aside
      className="hidden md:flex flex-col h-full z-40 shrink-0"
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-2)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* ── Wordmark ─────────────────────────────────────── */}
      <div
        style={{
          padding: "22px 20px 18px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="shrink-0 flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-md)",
              background: "var(--accent)",
              boxShadow: "0 0 18px var(--accent-glow)",
            }}
          >
            <LayoutDashboard size={15} color="#fff" />
          </div>
          <div>
            <p
              style={{
                fontSize: "var(--text-md)",
                fontWeight: "var(--font-weight-bold)",
                color: "var(--text)",
                letterSpacing: "var(--tracking-tight)",
                lineHeight: 1,
              }}
            >
              Sistema Ops
            </p>
            <p
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-bold)",
                color: "var(--text-4)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-wider)",
                marginTop: 3,
              }}
            >
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* ── Nav principal ────────────────────────────────── */}
      <nav style={{ padding: "14px 12px 8px" }}>
        <p
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--text-4)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wider)",
            padding: "0 8px",
            marginBottom: 8,
          }}
        >
          Navegación
        </p>

        <div className="flex flex-col" style={{ gap: 1 }}>
          {NAV_LINKS.map(({ href, name, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  height: 36,
                  padding: "0 10px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-sm)",
                  fontWeight: isActive
                    ? "var(--font-weight-semibold)"
                    : "var(--font-weight-medium)",
                  textDecoration: "none",
                  position: "relative",
                  transition:
                    "background var(--dur-fast) var(--ease-smooth), color var(--dur-fast)",
                  color: isActive ? "var(--dl)" : "var(--text-3)",
                  background: isActive ? "var(--dl-bg)" : "transparent",
                }}
                className={!isActive ? "hover:!text-[var(--text-2)] hover:!bg-white/[0.04]" : ""}
              >
                {/* Acento lateral izquierdo */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 8,
                      bottom: 8,
                      width: 2,
                      borderRadius: "0 2px 2px 0",
                      background: "var(--dl)",
                    }}
                  />
                )}
                <Icon
                  size={15}
                  style={{ flexShrink: 0, opacity: isActive ? 1 : 0.45 }}
                />
                {name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Separador ────────────────────────────────────── */}
      <div style={{ height: 1, background: "var(--border)", margin: "4px 12px" }} />

      {/* ── Contexto operativo: restaurantes ─────────────── */}
      <div style={{ padding: "12px 12px 8px" }}>
        <p
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--text-4)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wider)",
            padding: "0 8px",
            marginBottom: 8,
          }}
        >
          Restaurantes
        </p>

        <div className="flex flex-col" style={{ gap: 2 }}>
          {RESTAURANTS.map(({ key, name, color, bg, count }) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 28,
                padding: "0 10px",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 0 2.5px ${bg}`,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--text-3)",
                  flex: 1,
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: "var(--font-weight-bold)",
                  padding: "1px 5px",
                  borderRadius: "var(--radius-xs)",
                  background: bg,
                  color: color,
                  lineHeight: 1.6,
                }}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Spacer ────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Logout ───────────────────────────────────────── */}
      <div style={{ padding: "12px", borderTop: "1px solid var(--border)" }}>
        <button
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            height: 34,
            padding: "0 10px",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--text-3)",
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "background var(--dur-fast), color var(--dur-fast)",
            textAlign: "left",
          }}
          className="hover:!bg-[var(--danger-bg)] hover:!text-[var(--danger)]"
        >
          <LogOut size={14} style={{ flexShrink: 0 }} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

/* ════════════════════════════════════════════════════════════════
   TOPBAR
   Título en Cormorant Garamond italic para jerarquía visual real.
   Breadcrumb sutil. Notificaciones + avatar pill a la derecha.
   ════════════════════════════════════════════════════════════════ */
function Topbar({ pathname }: { pathname: string }) {
  const pageName = NAV_LINKS.find((n) => n.href === pathname)?.name ?? "Dashboard";

  return (
    <header
      style={{
        height: "var(--topbar-height)",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        gap: 16,
        borderBottom: "1px solid var(--border)",
        background: "rgba(8,9,10,0.55)",
        backdropFilter: "blur(var(--glass-blur))",
        position: "relative",
        zIndex: 50,
      }}
    >
      {/* ── Izquierda ── */}
      <div>
        {/* Breadcrumb — solo desktop */}
        <div
          className="hidden md:flex items-center"
          style={{ gap: 5, marginBottom: 2 }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--text-4)",
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-wider)",
            }}
          >
            Dashboard
          </span>
          <ChevronRight size={10} color="var(--text-4)" />
          <span
            style={{
              fontSize: 10,
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--text-3)",
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-wider)",
            }}
          >
            {pageName}
          </span>
        </div>

        {/* Título display */}
        <h1
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(17px, 2.2vw, 21px)",
            color: "var(--text)",
            lineHeight: 1,
            letterSpacing: "-0.015em",
          }}
        >
          {pageName}
        </h1>
      </div>

      {/* ── Derecha ── */}
      <div className="flex items-center" style={{ gap: 10 }}>

        {/* Online status — solo desktop */}
        <div
          className="hidden sm:flex items-center"
          style={{ gap: 6, marginRight: 2 }}
        >
          <span
            className="motion-safe:animate-pulse"
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "var(--success)",
              animationDuration: "2.5s",
            }}
            aria-hidden="true"
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: "var(--font-weight-bold)",
              color: "var(--text-3)",
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-wider)",
            }}
          >
            En línea
          </span>
        </div>

        {/* Divisor */}
        <div
          className="hidden sm:block"
          style={{
            width: 1,
            height: 18,
            background: "var(--border-soft)",
          }}
          aria-hidden="true"
        />

        {/* Notificaciones — Realtime */}
        <NotificationBell />

        {/* Avatar pill */}
        <div
          role="button"
          tabIndex={0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "3px 10px 3px 3px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-strong)",
            background: "rgba(255,255,255,0.02)",
            cursor: "pointer",
            transition: "border-color var(--dur-fast)",
          }}
          className="hover:!border-[var(--border-focus)]"
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--dl), var(--accent))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: "var(--font-weight-bold)",
              color: "#fff",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            NS
          </div>
          <span
            className="hidden sm:block"
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--text-2)",
              whiteSpace: "nowrap",
            }}
          >
            Nicolás S.
          </span>
        </div>
      </div>
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════
   MOBILE BOTTOM NAV
   Píldora flotante contenida — no barra pegada al borde.
   El ítem activo usa fondo capsular (dl-bg) con color (dl).
   ════════════════════════════════════════════════════════════════ */
function MobileBottomNav({
  pathname,
  onLogout,
}: {
  pathname: string;
  onLogout: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside tap
  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [showMenu]);

  return (
    <nav
      className="md:hidden"
      aria-label="Navegación principal"
      style={{
        padding: `8px 16px max(12px, env(safe-area-inset-bottom, 12px))`,
        zIndex: 50,
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          background: "rgba(12,14,18,0.92)",
          backdropFilter: "blur(20px) saturate(1.6)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-2xl)",
          padding: "4px 6px",
          boxShadow: "var(--shadow-4)",
        }}
      >
        {/* Profile / Logout button */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            aria-label="Perfil y opciones"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "7px 16px",
              borderRadius: "var(--radius-xl)",
              background: showMenu ? "var(--dl-bg)" : "transparent",
              border: "none",
              cursor: "pointer",
              color: showMenu ? "var(--dl)" : "var(--text-3)",
              minWidth: 58,
              transition:
                "background var(--dur-fast), color var(--dur-fast)",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: showMenu
                  ? "var(--dl)"
                  : "linear-gradient(135deg, var(--dl), var(--accent))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 7,
                fontWeight: 800,
                color: showMenu ? "#0c0e12" : "#fff",
                lineHeight: 1,
              }}
            >
              NS
            </div>
            <span
              style={{
                fontSize: 9,
                fontWeight: "var(--font-weight-bold)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-wider)",
                opacity: showMenu ? 1 : 0.45,
                lineHeight: 1,
              }}
            >
              Perfil
            </span>
          </button>

          {/* Popup menu */}
          {showMenu && (
            <div
              style={{
                position: "absolute",
                bottom: "calc(100% + 12px)",
                left: "50%",
                transform: "translateX(-50%)",
                minWidth: 180,
                background: "rgba(16,18,22,0.96)",
                backdropFilter: "blur(20px) saturate(1.6)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "0 -8px 32px rgba(0,0,0,0.5)",
                overflow: "hidden",
                animation: "slideUp 200ms ease-out",
              }}
            >
              {/* User info */}
              <div
                style={{
                  padding: "14px 16px 12px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--dl), var(--accent))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 800,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    NS
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semibold)",
                        color: "var(--text)",
                        lineHeight: 1.2,
                      }}
                    >
                      Nicolás S.
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: "var(--text-4)",
                        letterSpacing: "0.03em",
                        marginTop: 2,
                      }}
                    >
                      Chef Ejecutivo
                    </p>
                  </div>
                </div>
              </div>

              {/* Logout action */}
              <button
                onClick={() => {
                  setShowMenu(false);
                  onLogout();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "12px 16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--danger)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  textAlign: "left",
                  transition: "background var(--dur-fast)",
                }}
                className="hover:!bg-[var(--danger-bg)]"
              >
                <LogOut size={14} style={{ flexShrink: 0 }} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

        {NAV_LINKS.map(({ href, name, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "7px 16px",
                borderRadius: "var(--radius-xl)",
                textDecoration: "none",
                transition:
                  "background var(--dur-fast), color var(--dur-fast)",
                background: isActive ? "var(--dl-bg)" : "transparent",
                color: isActive ? "var(--dl)" : "var(--text-3)",
                minWidth: 58,
              }}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: "var(--font-weight-bold)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-wider)",
                  opacity: isActive ? 1 : 0.45,
                  lineHeight: 1,
                }}
              >
                {name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ════════════════════════════════════════════════════════════════
   LAYOUT PRINCIPAL
   ════════════════════════════════════════════════════════════════ */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div
      className="min-h-dvh flex flex-col overflow-hidden"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <div className="flex flex-1 overflow-hidden relative">
        <BackgroundEffects />

        <DesktopSidebar pathname={pathname} onLogout={logout} />

        <main className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
          <Topbar pathname={pathname} />

          <div className="flex-1 overflow-y-auto">
            <div
              className="mx-auto animate-in fade-in slide-in-from-bottom-2"
              style={{
                padding: "clamp(16px, 3vw, 32px)",
                maxWidth: 1200,
                paddingBottom: "max(96px, 32px)",
                animationDuration: "var(--dur-enter)",
              }}
            >
              {children}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav pathname={pathname} onLogout={logout} />
    </div>
  );
}