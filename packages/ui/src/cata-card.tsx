/**
 * @repo/ui — CataCard Component (Delica-only)
 * Card for tasting events (catas) with storytelling, availability badge,
 * and reservation action. Matches context_ui.md §CataCard exactly.
 *
 * context_ui.md:
 * - bg #1e100a, border-radius 2px, left accent bar
 * - Cormorant Garamond title 20px weight-600 color #f0e8d8
 * - Price Cormorant 22px weight-600 color #8D6A32
 * - Status: agotado = opacity 0.55 on full card
 */

import type { Experience } from "./cata-card-types";

export interface CataCardProps {
  /** Experience data from Supabase */
  experience: Experience;
  /** Called when user clicks Reservar */
  onBook?: (experience: Experience) => void;
  className?: string;
}

/** Formats date in Spanish locale */
function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

/** Formats price in COP */
function formatCOP(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Tasting event card for Delica. Always rendered in Delica context.
 * SSG-safe: no client state. onBook is optional for server-rendered lists.
 */
export function CataCard({ experience, onBook, className = "" }: CataCardProps) {
  const availableSpots = experience.capacity - experience.booked;
  const isSoldOut = availableSpots <= 0;
  const isLimited = availableSpots > 0 && availableSpots <= 3;

  return (
    <article
      className={`theme-delica bg-[#1e100a] rounded-[2px] border border-[rgba(141,106,50,0.1)] shadow-[0_2px_12px_rgba(0,0,0,0.18),0_1px_3px_rgba(0,0,0,0.12)] relative overflow-hidden transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.28),0_2px_6px_rgba(0,0,0,0.14)] ${isSoldOut ? "opacity-55" : ""} ${className}`}
      aria-label={experience.title}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{
          background: isSoldOut
            ? "rgba(141,106,50,0.2)"
            : "linear-gradient(180deg, #8D6A32, rgba(141,106,50,0.2))",
        }}
        aria-hidden="true"
      />

      <div className="pl-[22px] pr-5 pt-[18px] pb-4">
        {/* Date + dot */}
        <div className="flex items-center gap-0 mb-3">
          <time
            dateTime={experience.date}
            className="font-['DM_Sans',sans-serif] text-[9px] font-semibold tracking-[0.1em] uppercase text-[#8D6A32]"
          >
            {formatDate(experience.date)}
          </time>
          <span
            className="inline-block w-[3px] h-[3px] rounded-full bg-[rgba(141,106,50,0.3)] mx-1.5 align-middle"
            aria-hidden="true"
          />
          {isSoldOut ? (
            <span className="font-['DM_Sans',sans-serif] text-[9px] font-semibold tracking-[0.08em] uppercase text-red-500/70">
              Agotado
            </span>
          ) : (
            <span
              className={`font-['DM_Sans',sans-serif] text-[9px] font-semibold tracking-[0.08em] uppercase ${isLimited ? "text-[#a06800]" : "text-[rgba(141,106,50,0.5)]"}`}
            >
              {availableSpots} {availableSpots === 1 ? "cupo" : "cupos"}
              {isLimited && " · Últimos"}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-['Cormorant_Garamond',serif] text-[20px] font-semibold text-[#f0e8d8] leading-snug mb-2">
          {experience.title}
        </h3>

        {/* Description (storytelling) */}
        {experience.description && (
          <p className="font-['DM_Sans',sans-serif] text-[11px] text-[rgba(240,232,216,0.35)] leading-[1.55] mb-3 line-clamp-3">
            {experience.description}
          </p>
        )}

        {/* Origin tags */}
        {experience.photos.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4" aria-label="Características">
            {experience.photos.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-[7px] py-[2px] border border-[rgba(141,106,50,0.2)] rounded-[1px] font-['DM_Sans',sans-serif] text-[8px] font-medium tracking-[0.08em] uppercase text-[rgba(141,106,50,0.5)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider ornamental */}
        <div className="flex items-center gap-2.5 my-3" aria-hidden="true">
          <span className="flex-1 h-px bg-[rgba(141,106,50,0.08)]" />
          <span
            className="w-1.5 h-1.5 bg-[rgba(141,106,50,0.3)] rotate-45 rounded-[1px] flex-shrink-0"
          />
          <span className="flex-1 h-px bg-[rgba(141,106,50,0.08)]" />
        </div>

        {/* Footer: price + cupos + CTA */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-['Cormorant_Garamond',serif] text-[22px] font-semibold text-[#8D6A32]">
              {formatCOP(experience.price)}
            </span>
            <span className="font-['DM_Sans',sans-serif] text-[9px] text-[rgba(141,106,50,0.35)] uppercase tracking-[0.08em] ml-2">
              / persona
            </span>
          </div>

          {onBook && !isSoldOut && (
            <button
              onClick={() => onBook(experience)}
              className="border border-[rgba(141,106,50,0.4)] text-[#8D6A32] px-4 py-[7px] rounded-[1px] bg-transparent font-['DM_Sans',sans-serif] text-[9px] font-bold tracking-[0.1em] uppercase transition-all duration-200 hover:bg-[rgba(141,106,50,0.06)] hover:border-[rgba(141,106,50,0.7)] cursor-pointer focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_#1e100a,0_0_0_4px_#8D6A32]"
            >
              Reservar
            </button>
          )}
        </div>

        {/* Cupos dinámico badge */}
        {!isSoldOut && availableSpots <= experience.capacity && (
          <div className="mt-3">
            <div className="w-full h-[3px] bg-[rgba(141,106,50,0.08)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[rgba(141,106,50,0.4)] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round((experience.booked / experience.capacity) * 100)}%`,
                }}
                role="progressbar"
                aria-valuenow={experience.booked}
                aria-valuemin={0}
                aria-valuemax={experience.capacity}
                aria-label={`${experience.booked} de ${experience.capacity} cupos reservados`}
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
