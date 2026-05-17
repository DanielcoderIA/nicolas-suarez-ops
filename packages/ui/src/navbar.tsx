/**
 * @repo/ui — NavBar Component
 * Mobile-first navigation with logo, links, and hamburger menu.
 * Applies brand tokens via .theme-${restaurant} on the root element.
 *
 * context_ui.md: topbar heights, nav item styles, CTA per brand.
 */

"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { BrandTheme } from "./button";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavBarProps {
  /** Active brand — sets .theme-${restaurant} and visual identity */
  restaurant: BrandTheme | "chef";
  /** Brand display name shown in the topbar */
  brandName: string;
  /** Optional brand mark element (logo SVG or icon) */
  brandMark?: ReactNode;
  /** Navigation links */
  links?: NavLink[];
  /** CTA button label (e.g. "Reservar") */
  ctaLabel?: string;
  /** CTA button href */
  ctaHref?: string;
  /** Extra classes on root element */
  className?: string;
  /** Whether the navbar should be transparent and float over the hero */
  transparent?: boolean;
}

/* ── Brand-specific topbar styles (context_ui.md) ──────────── */
const topbarStyles: Record<NavBarProps["restaurant"], string> = {
  "la-carreta":
    "relative z-50 bg-[#5C1F0E] border-b border-[rgba(201,151,58,0.18)] h-[72px]",
  "mar-y-tierra":
    "relative z-50 bg-[#0A3D62] border-b border-[rgba(26,188,156,0.08)] h-[72px]",
  delica:
    "relative z-50 bg-[#1e100a] h-[72px] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[rgba(141,106,50,0.3)] after:to-transparent",
  chef: "relative z-50 bg-[#1e100a] border-b border-[rgba(141,106,50,0.12)] h-[72px]",
  admin:
    "relative z-50 bg-[#161b25] border-b border-white/[0.06] h-[64px] backdrop-blur-[20px]",
};

const brandNameStyles: Record<NavBarProps["restaurant"], string> = {
  "la-carreta":
    "font-['Cormorant_Garamond',serif] text-[22px] font-normal text-[#F5EFE3] tracking-[0.04em]",
  "mar-y-tierra":
    "font-['Libre_Baskerville',serif] text-[17px] font-bold text-[#e8f4fd]",
  delica:
    "font-['Cormorant_Garamond',serif] text-[26px] font-light italic text-[#8D6A32] tracking-[0.06em]",
  chef: "font-['Cormorant_Garamond',serif] text-[22px] font-light italic text-[#8D6A32] tracking-[0.06em]",
  admin: "font-['DM_Sans',sans-serif] text-[13px] font-semibold text-[#e8eaed]",
};

const mobileNavItemStyles: Record<NavBarProps["restaurant"], string> = {
  "la-carreta":
    "font-['Cormorant_Garamond',serif] text-[28px] font-normal text-[#FDFAF5] hover:text-[#C9973A] transition-colors duration-200 text-center",
  "mar-y-tierra":
    "font-['Libre_Baskerville',serif] text-[24px] font-bold text-[#e8f4fd] hover:text-[#1ABC9C] transition-colors duration-200 text-center",
  delica:
    "font-['Cormorant_Garamond',serif] text-[28px] italic text-[#f0e8d8] hover:text-[#8D6A32] transition-colors duration-200 text-center",
  chef: "font-['Cormorant_Garamond',serif] text-[28px] italic text-[#f0e8d8] hover:text-[#8D6A32] transition-colors duration-200 text-center",
  admin:
    "font-['DM_Sans',sans-serif] text-[18px] font-medium text-[#e8eaed] transition-colors duration-100 text-center",
};

const navItemStyles: Record<NavBarProps["restaurant"], string> = {
  "la-carreta":
    "font-['Jost',sans-serif] text-[10px] font-medium text-[rgba(245,239,227,0.7)] tracking-[0.22em] uppercase hover:text-[#FDFAF5] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#C9973A] hover:after:w-full after:transition-all after:duration-300",
  "mar-y-tierra":
    "font-['DM_Sans',sans-serif] text-[12px] font-medium text-[rgba(232,244,253,0.75)] hover:text-[#e8f4fd] transition-colors duration-100",
  delica:
    "font-['DM_Sans',sans-serif] text-[10px] tracking-[0.08em] uppercase text-[rgba(245,240,232,0.3)] hover:text-[rgba(245,240,232,0.7)] transition-colors duration-200",
  chef: "font-['DM_Sans',sans-serif] text-[10px] tracking-[0.08em] uppercase text-[rgba(245,240,232,0.3)] hover:text-[rgba(245,240,232,0.7)] transition-colors duration-200",
  admin:
    "font-['DM_Sans',sans-serif] text-[11px] font-medium text-[#9aa0ac] hover:text-[#e8eaed] transition-colors duration-100",
};

const ctaStyles: Record<NavBarProps["restaurant"], string> = {
  "la-carreta":
    "bg-[#7A2E1E] text-[#FDFAF5] border-none outline-none px-8 py-2.5 rounded-[2px] font-['Jost',sans-serif] text-[10px] font-medium tracking-[0.2em] uppercase hover:bg-[#5C1F0E] transition-all duration-300 shadow-lg",
  "mar-y-tierra": "transition-all duration-200",
  delica:
    "border border-[rgba(141,106,50,0.4)] text-[#8D6A32] px-4 py-[6px] rounded-[1px] font-['DM_Sans',sans-serif] text-[9px] font-semibold tracking-[0.1em] uppercase bg-transparent hover:bg-[rgba(141,106,50,0.06)] hover:border-[rgba(141,106,50,0.7)] transition-all duration-200",
  chef: "border border-[rgba(141,106,50,0.4)] text-[#8D6A32] px-4 py-[6px] rounded-[1px] font-['DM_Sans',sans-serif] text-[9px] font-semibold tracking-[0.1em] uppercase bg-transparent hover:bg-[rgba(141,106,50,0.06)] transition-all duration-200",
  admin:
    "bg-[#4f8ef7] text-white px-3 py-1.5 rounded-[5px] font-['DM_Sans',sans-serif] text-[11px] font-semibold hover:bg-[#6ba0f8] transition-colors duration-100",
};

/* Inline styles for brands where Tailwind arbitrary values fail in monorepo builds */
const ctaInlineStyles: Partial<Record<NavBarProps["restaurant"], React.CSSProperties>> = {
  "mar-y-tierra": {
    backgroundColor: '#1ABC9C',
    color: '#ffffff',
    padding: '10px 24px',
    borderRadius: '9999px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    boxShadow: '0 2px 10px rgba(26,188,156,0.3)',
  },
};

const hamburgerColor: Record<NavBarProps["restaurant"], string> = {
  "la-carreta": "bg-[rgba(201,169,110,0.7)]",
  "mar-y-tierra": "bg-[rgba(232,244,253,0.75)]",
  delica: "bg-[rgba(141,106,50,0.6)]",
  chef: "bg-[rgba(141,106,50,0.6)]",
  admin: "bg-[#9aa0ac]",
};

const mobileMenuBg: Record<NavBarProps["restaurant"], string> = {
  "la-carreta": "bg-[#6b2c1a]",
  "mar-y-tierra": "bg-[#0A3D62]",
  delica: "bg-[#1e100a]",
  chef: "bg-[#1e100a]",
  admin: "bg-[#161b25]",
};

/** Mobile-first NavBar with brand identity tokens */
export function NavBar({
  restaurant,
  brandName,
  brandMark,
  links = [],
  ctaLabel,
  ctaHref,
  className = "",
  transparent = false,
}: NavBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={`theme-${restaurant} w-full ${className} ${
        transparent
          ? "absolute top-0 left-0 right-0 z-50 bg-transparent border-transparent"
          : topbarStyles[restaurant]
      }`}
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="layout-container h-full flex items-center justify-between w-full">
        <div className="flex items-center gap-12">
          {/* Brand Identity */}
          <a
            href="/"
            className="flex items-center gap-3 no-underline focus-visible:outline-none group"
            aria-label={`Ir al inicio de ${brandName}`}
          >
            {brandMark ? (
              <div className="relative h-[52px] md:h-[56px] flex items-center transition-transform duration-500 group-hover:scale-105">
                {brandMark}
                <span className="sr-only">{brandName}</span>
              </div>
            ) : (
              <span className={brandNameStyles[restaurant]}>{brandName}</span>
            )}
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0 translate-y-[1px]">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={`${navItemStyles[restaurant]} no-underline`}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {ctaLabel && ctaHref && (
            <a
              href={ctaHref}
              className={`${ctaStyles[restaurant]} no-underline inline-flex items-center gap-2`}
              style={ctaInlineStyles[restaurant]}
            >
              {ctaLabel}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 bg-transparent border-none cursor-pointer p-1 focus-visible:outline-none"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          <span
            className={`block h-px w-5 transition-all duration-200 ${hamburgerColor[restaurant]} ${open ? "rotate-45 translate-y-[6px]" : ""}`}
          />
          <span
            className={`block h-px w-5 transition-all duration-200 ${hamburgerColor[restaurant]} ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-px w-5 transition-all duration-200 ${hamburgerColor[restaurant]} ${open ? "-rotate-45 -translate-y-[6px]" : ""}`}
          />
        </button>
      </div>

      {/* Mobile drawer full screen */}
      <div 
        className={`md:hidden fixed inset-0 z-40 ${mobileMenuBg[restaurant]} transition-all duration-400 ease-in-out flex flex-col items-center justify-center ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col list-none m-0 p-0 gap-8 items-center w-full">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`${mobileNavItemStyles[restaurant]} no-underline block`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          {ctaLabel && ctaHref && (
            <li className="mt-4">
              <a 
                href={ctaHref} 
                className={`${ctaStyles[restaurant]} no-underline inline-flex items-center justify-center gap-2`}
                style={ctaInlineStyles[restaurant]}
                onClick={() => setOpen(false)}
              >
                {ctaLabel}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
