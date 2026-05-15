/**
 * @repo/ui — AnalyticsWidget Component
 * Minimalist data visualization widget for the Admin panel.
 * Uses --text-mono scale for all numeric values (DM Mono).
 *
 * context_ui.md: §AnalyticsWidget · §Chart bars · §Stat cards
 * Admin SLA: visible metrics, DM Mono for all IDs and data values.
 */

import type { ReactNode } from "react";

export interface AnalyticsStat {
  label: string;
  value: string | number;
  /** Optional change indicator. Positive = green, negative = red. */
  change?: number;
  /** Optional change label (e.g. "vs. semana anterior") */
  changeLabel?: string;
}

export interface AnalyticsBar {
  label: string;
  value: number;
  /** Max value for bar scaling. If omitted, uses max of all values. */
  max?: number;
  /** Mark as highlighted (current day / peak) */
  highlight?: boolean;
}

export interface AnalyticsWidgetProps {
  /** Widget title */
  title: string;
  /** Optional subtitle or period label */
  period?: string;
  /** Stat cards row */
  stats?: AnalyticsStat[];
  /** Bar chart data */
  bars?: AnalyticsBar[];
  /** Optional badge (e.g. restaurant name) */
  badge?: ReactNode;
  /** Optional footer content */
  footer?: ReactNode;
  className?: string;
}

/** Formats a number for display — compact if large */
function fmt(value: string | number): string {
  if (typeof value === "string") return value;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

/** Minimalist admin analytics widget. No client state needed — fully SSR-safe. */
export function AnalyticsWidget({
  title,
  period,
  stats = [],
  bars = [],
  badge,
  footer,
  className = "",
}: AnalyticsWidgetProps) {
  const maxBarValue =
    bars.length > 0
      ? Math.max(...bars.map((b) => b.max ?? b.value), 1)
      : 1;

  return (
    <section
      className={`theme-admin bg-[#1e232c] border border-white/[0.07] rounded-[8px] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.4)] ${className}`}
      aria-label={title}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-['DM_Sans',sans-serif] text-[13px] font-semibold text-[#e8eaed] leading-none">
            {title}
          </h2>
          {period && (
            <p className="font-['DM_Mono',monospace] text-[11px] text-[#5f6672] mt-1 leading-none">
              {period}
            </p>
          )}
        </div>
        {badge && <div className="flex-shrink-0">{badge}</div>}
      </div>

      {/* Stat cards row */}
      {stats.length > 0 && (
        <div
          className="grid gap-3 mb-4"
          style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)` }}
          role="list"
          aria-label="Métricas"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#252b36] border border-white/[0.06] rounded-[6px] p-3"
              role="listitem"
            >
              <p
                className="font-['DM_Mono',monospace] text-[20px] font-normal text-[#e8eaed] leading-none tabular-nums"
                aria-label={`${stat.label}: ${fmt(stat.value)}`}
              >
                {fmt(stat.value)}
              </p>
              <p className="font-['DM_Sans',sans-serif] text-[10px] text-[#5f6672] uppercase tracking-[0.08em] mt-1.5 leading-none">
                {stat.label}
              </p>
              {stat.change !== undefined && (
                <p
                  className={`font-['DM_Mono',monospace] text-[11px] mt-1.5 leading-none ${
                    stat.change >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"
                  }`}
                  aria-label={`Cambio: ${stat.change >= 0 ? "+" : ""}${stat.change}%${stat.changeLabel ? ` ${stat.changeLabel}` : ""}`}
                >
                  {stat.change >= 0 ? "↑" : "↓"} {Math.abs(stat.change)}%
                  {stat.changeLabel && (
                    <span className="font-['DM_Sans',sans-serif] text-[#5f6672] ml-1 text-[10px]">
                      {stat.changeLabel}
                    </span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bar chart */}
      {bars.length > 0 && (
        <div
          className="flex items-end gap-1 h-16"
          role="img"
          aria-label={`Gráfica de barras: ${title}`}
        >
          {bars.map((bar) => {
            const effectiveMax = bar.max ?? maxBarValue;
            const heightPct = effectiveMax > 0
              ? Math.max(Math.round((bar.value / effectiveMax) * 100), 4)
              : 4;

            return (
              <div
                key={bar.label}
                className="flex flex-col items-center gap-1 flex-1 h-full justify-end"
                title={`${bar.label}: ${fmt(bar.value)}`}
              >
                <div
                  className={`w-full rounded-t-[3px] min-h-[4px] transition-all duration-500 ${
                    bar.highlight
                      ? "bg-[#8D6A32]"
                      : "bg-[rgba(141,106,50,0.5)]"
                  }`}
                  style={{ height: `${heightPct}%` }}
                  role="presentation"
                />
                <span className="font-['DM_Sans',sans-serif] text-[8px] text-[#5f6672] leading-none truncate w-full text-center">
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-3 border-t border-white/[0.05] font-['DM_Sans',sans-serif] text-[11px] text-[#5f6672]">
          {footer}
        </div>
      )}
    </section>
  );
}
