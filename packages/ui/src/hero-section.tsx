/**
 * @repo/ui — HeroSection Component
 * Full-width hero with display title, subtitle, and primary CTA.
 * Applies brand identity via context_ui.md hero specs per restaurant.
 *
 * Rendering: SSG (used in static pages — no client state needed).
 *
 * Layout fix v3:
 *  - Outer section uses layout-container (max-w-6xl) for correct desktop alignment
 *  - Inner <div class="max-w-xl"> anchors text content to the left
 *  - Removed px-6 from heroContainerStyles (was causing double padding on desktop)
 *  - lg:-ml-8 on text column nudges content closer to the left edge on desktop
 */

import Image from "next/image";
import type { ReactNode } from "react";
import type { BrandTheme } from "./button";

export type HeroRestaurant = BrandTheme | "chef";

export interface HeroSectionProps {
  restaurant: HeroRestaurant;
  /** Main headline — use <em> for accent-colored italic spans */
  title: ReactNode;
  /** Subtitle / description */
  subtitle?: string;
  /** Primary CTA label */
  ctaLabel?: string;
  /** Primary CTA href */
  ctaHref?: string;
  /** Optional eyebrow text (shown above title with brand line) */
  eyebrow?: string;
  /** Optional background image URL */
  backgroundImage?: string;
  /** Optional decorative element (e.g. wave, circles) */
  children?: ReactNode;
  className?: string;
}

/* ── Brand hero containers ──────────────────────────────────
   IMPORTANT: no px-* here — padding is handled by layout-container
   inside the component. Adding px here causes double padding on desktop.
   ─────────────────────────────────────────────────────────── */
const heroContainerStyles: Record<HeroRestaurant, string> = {
  "la-carreta":
    "relative min-h-[100vh] flex items-center overflow-hidden",
  "mar-y-tierra":
    "bg-[var(--color-primary)] pt-20 pb-20 relative overflow-hidden",
  delica:
    "bg-[#1e100a] pt-14 pb-16 relative overflow-hidden",
  chef:
    "bg-[#1e100a] pt-14 pb-16 relative overflow-hidden",
  admin:
    "bg-[#0b0d0f] pt-10 pb-12 relative overflow-hidden",
};

/* ── Display title typography ───────────────────────────────── */
const titleStyles: Record<HeroRestaurant, string> = {
  "la-carreta":
    "font-['Cormorant_Garamond',serif] text-[clamp(56px,8vw,92px)] font-light text-[#FDFAF5] leading-[1.1] tracking-[-0.015em] [&_em]:text-[#C9973A] [&_em]:italic [text-shadow:0_2px_10px_rgba(28,20,16,0.3)]",
  "mar-y-tierra":
    "font-['Libre_Baskerville',serif] text-[32px] md:text-[48px] font-bold text-[#e8f4fd] leading-[1.15] tracking-display [&_em]:text-[var(--color-accent)] [&_em]:not-italic",
  delica:
    "font-['Cormorant_Garamond',serif] text-[38px] font-light italic text-[#f0e8d8] leading-[1.05] tracking-[-0.01em] [&_em]:text-[#8D6A32] [&_em]:not-italic",
  chef:
    "font-['Cormorant_Garamond',serif] text-[32px] font-light italic text-[#f0e8d8] leading-[1.1] tracking-[-0.01em]",
  admin:
    "font-['DM_Sans',sans-serif] text-[22px] font-semibold text-[#e8eaed] leading-[1.3] tracking-[-0.01em]",
};

/* ── Subtitle typography ────────────────────────────────────── */
const subtitleStyles: Record<HeroRestaurant, string> = {
  "la-carreta":
    "font-['Jost',sans-serif] text-[15px] font-light text-[rgba(245,239,227,0.7)] mt-7 leading-[1.8] max-w-[440px] [text-shadow:0_1px_4px_rgba(28,20,16,0.2)]",
  "mar-y-tierra":
    "font-['DM_Sans',sans-serif] text-[15px] md:text-[17px] text-[rgba(232,244,253,0.75)] mt-6 leading-relaxed",
  delica:
    "font-['Cormorant_Garamond',serif] text-[16px] font-light text-[rgba(240,232,216,0.55)] mt-4 leading-relaxed italic",
  chef:
    "font-['DM_Sans',sans-serif] text-[14px] text-[rgba(240,232,216,0.6)] mt-3 leading-relaxed",
  admin:
    "font-['DM_Sans',sans-serif] text-[14px] text-[#9aa0ac] mt-2 leading-relaxed",
};

/* ── Eyebrow typography ─────────────────────────────────────── */
const eyebrowStyles: Record<HeroRestaurant, string> = {
  "la-carreta":
    "flex items-center gap-[14px] mb-[1.8rem] font-['Jost',sans-serif] text-[11px] font-medium tracking-[0.22em] uppercase text-[#C9973A] [&>span:first-child]:block [&>span:first-child]:w-8 [&>span:first-child]:h-px [&>span:first-child]:bg-[#C9973A]",
  "mar-y-tierra":
    "inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full bg-[rgba(26,188,156,0.12)] border border-[rgba(26,188,156,0.2)] font-['DM_Sans',sans-serif] text-[9px] font-semibold tracking-eyebrow uppercase text-[var(--color-accent)]",
  delica:
    "flex items-center gap-[10px] mb-6 font-['DM_Sans',sans-serif] text-[9px] font-medium tracking-[0.18em] uppercase text-[rgba(141,106,50,0.6)] [&>span.line]:block [&>span.line]:w-7 [&>span.line]:h-px [&>span.line]:bg-[rgba(141,106,50,0.5)]",
  chef:
    "flex items-center gap-[10px] mb-6 font-['DM_Sans',sans-serif] text-[9px] font-medium tracking-[0.16em] uppercase text-[rgba(141,106,50,0.6)]",
  admin:
    "font-['DM_Sans',sans-serif] text-[10px] font-semibold tracking-[0.08em] uppercase text-[#5f6672] mb-2",
};

/* ── CTA button styles ──────────────────────────────────────── */
const ctaStyles: Record<HeroRestaurant, string> = {
  "la-carreta":
    "bg-[#7A2E1E] text-white border-0 border-none outline-none outline-0 px-6 py-3 text-xs tracking-widest cursor-pointer hover:bg-[#6a2418] transition-colors duration-200 inline-flex items-center justify-center rounded-[2px] font-['Jost',sans-serif] font-medium uppercase no-underline focus-visible:outline-none shadow-xl",
  "mar-y-tierra":
    "mt-6 inline-flex bg-[var(--color-accent)] text-white px-7 py-3.5 rounded-full font-['DM_Sans',sans-serif] text-[13px] font-bold tracking-cta shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-px transition-all duration-200 no-underline focus-visible:outline-none",
  delica:
    "mt-8 inline-flex border border-[rgba(141,106,50,0.5)] text-[#8D6A32] px-6 py-[11px] rounded-[1px] font-['DM_Sans',sans-serif] text-[10px] font-semibold tracking-[0.12em] uppercase bg-transparent hover:bg-[rgba(141,106,50,0.06)] hover:border-[#8D6A32] transition-all duration-300 no-underline focus-visible:outline-none",
  chef:
    "mt-8 inline-flex border border-[rgba(141,106,50,0.5)] text-[#8D6A32] px-6 py-[11px] rounded-[1px] font-['DM_Sans',sans-serif] text-[10px] font-semibold tracking-[0.12em] uppercase bg-transparent hover:bg-[rgba(141,106,50,0.06)] transition-all duration-300 no-underline focus-visible:outline-none",
  admin:
    "mt-5 inline-flex bg-[#4f8ef7] text-white px-5 py-2.5 rounded-[5px] font-['DM_Sans',sans-serif] text-[13px] font-semibold hover:bg-[#6ba0f8] transition-colors duration-100 no-underline focus-visible:outline-none",
};

/* ── Max width of the text column per brand ─────────────────
   Controls how wide the headline and subtitle get before wrapping.
   Delica is narrower on purpose — luxury editorial breathing room.
   ─────────────────────────────────────────────────────────── */
const contentMaxWidth: Record<HeroRestaurant, string> = {
  "la-carreta": "max-w-[620px]",
  "mar-y-tierra": "max-w-lg",  /* ~512px */
  delica: "max-w-md",   /* ~448px — editorial narrowness */
  chef: "max-w-md",
  admin: "max-w-lg",
};

/** Renders the eyebrow label according to per-brand rules */
function Eyebrow({
  restaurant,
  text,
}: {
  restaurant: HeroRestaurant;
  text: string;
}) {
  if (restaurant === "la-carreta") {
    return (
      <p className={eyebrowStyles[restaurant]}>
        <span aria-hidden="true" />
        {text}
      </p>
    );
  }

  if (restaurant === "delica" || restaurant === "chef") {
    return (
      <p className={eyebrowStyles[restaurant]}>
        <span className="line" aria-hidden="true" />
        {text}
        <span className="line" aria-hidden="true" />
      </p>
    );
  }

  return <p className={eyebrowStyles[restaurant]}>{text}</p>;
}

/** Full-width hero section with brand-specific display typography */
export function HeroSection({
  restaurant,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  eyebrow,
  backgroundImage,
  children,
  className = "",
}: HeroSectionProps) {
  return (
    <section
      className={`theme-${restaurant} ${heroContainerStyles[restaurant]} ${className}`}
      aria-label="Sección hero"
    >
      {/* ── Background image + overlay ── */}
      {backgroundImage && (
        <div
          className="absolute inset-0 z-0 select-none pointer-events-none"
          aria-hidden="true"
        >
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            quality={75}
            priority={true}
            className="object-cover"
          />
          {/* Dark Overlay for Accessibility Contrast (WCAG AA) */}
          <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(0, 0, 0, 0.28)' }} />
          {/* Diagonal Editorial Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(28,20,16,0.85)] via-[rgba(28,20,16,0.6)] to-transparent z-[2]" />
          {restaurant === "la-carreta" && (
            <div className="absolute bottom-0 left-[38%] w-[1px] h-[60%] bg-gradient-to-t from-[rgba(201,151,58,0.4)] to-transparent -rotate-12 translate-x-[-50%] pointer-events-none z-[2]" />
          )}
        </div>
      )}

      {/*
        ── Content container ──────────────────────────────────────
        layout-container  →  max-w-6xl, responsive px, centered.
                              Fixes the desktop right-drift bug caused
                              by the old layout-container-sm (max-w-2xl).
        pt-20 md:pt-32    →  pushes content below the fixed NavBar.
        ─────────────────────────────────────────────────────────── */}
      <div className={`layout-container relative z-10 ${restaurant === 'la-carreta' ? 'pt-24' : 'pt-20 md:pt-32'}`}>

        {/*
          ── Text column ─────────────────────────────────────────
          max-w-* per brand keeps headlines from stretching too wide
          while staying anchored to the left edge of layout-container.
          ─────────────────────────────────────────────────────── */}
        <div className={`${contentMaxWidth[restaurant]} lg:-ml-8`}>
          {eyebrow && <Eyebrow restaurant={restaurant} text={eyebrow} />}

          <h1 className={titleStyles[restaurant]}>{title}</h1>

          {subtitle && (
            <p className={subtitleStyles[restaurant]}>{subtitle}</p>
          )}

          {ctaLabel && ctaHref && (
            <div className="flex items-center gap-8 mt-12">
              <a href={ctaHref} className={ctaStyles[restaurant]}>
                {ctaLabel}
              </a>
              {restaurant === "la-carreta" && (
                <a href="/menu" className="font-['Jost',sans-serif] text-[12px] font-medium tracking-[0.15em] uppercase text-[#C9973A] hover:text-[#FDFAF5] no-underline transition-all duration-300 flex items-center gap-3 group/link">
                  Ver Menú
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover/link:translate-x-2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Scroll Indicator for La Carreta ── */}
      {restaurant === "la-carreta" && (
        <div className="absolute bottom-12 right-[6vw] flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000">
          <div className="w-[1px] h-[60px] bg-gradient-to-b from-[#C9973A] via-[rgba(201,151,58,0.3)] to-transparent" />
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-[rgba(245,239,227,0.35)] [writing-mode:vertical-rl] opacity-80">
            Explorar
          </span>
        </div>
      )}

      {/* ── Decorative slot (wave, circles, arcs, etc.) ── */}
      {children && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {children}
        </div>
      )}
    </section>
  );
}