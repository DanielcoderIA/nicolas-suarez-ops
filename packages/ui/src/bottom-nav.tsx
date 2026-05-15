"use client";

import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, CalendarPlus } from "lucide-react";
import type { ReactNode } from "react";
import { type BrandTheme } from "./button";

/**
 * @repo/ui — BottomNav Component
 * Shared mobile bottom navigation bar that adapts to brand identity.
 */

interface NavTab {
  label: string;
  href: string;
  icon: ReactNode;
}

const TABS: NavTab[] = [
  { label: "Inicio", href: "/", icon: <Home size={22} strokeWidth={1.8} /> },
  { label: "Menú", href: "/menu", icon: <UtensilsCrossed size={22} strokeWidth={1.8} /> },
  { label: "Reservar", href: "/reservas", icon: <CalendarPlus size={22} strokeWidth={1.8} /> },
];

export interface BottomNavProps {
  restaurant: BrandTheme | "chef";
}

export function BottomNav({ restaurant }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={`theme-${restaurant} fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--color-primary)] border-t border-white/5`}
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        boxShadow: "0 -4px 24px rgba(0, 0, 0, 0.15)",
      }}
      role="navigation"
      aria-label="Navegación principal móvil"
    >
      <div className="flex items-stretch justify-around h-16">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          return (
            <a
              key={tab.href}
              href={tab.href}
              className={`
                flex flex-col items-center justify-center gap-1
                min-w-[64px] min-h-[44px] px-3
                no-underline transition-all duration-300
                ${isActive
                  ? "text-[var(--color-accent)] scale-110"
                  : "text-white/40 hover:text-white/70"
                }
              `}
              aria-current={isActive ? "page" : undefined}
              aria-label={tab.label}
            >
              <span className="flex items-center justify-center w-6 h-6">
                {tab.icon}
              </span>
              <span
                className="font-['DM_Sans',sans-serif] text-[10px] font-bold leading-none tracking-wider uppercase"
              >
                {tab.label}
              </span>
              
              {/* Active Indicator Dot */}
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]" />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
