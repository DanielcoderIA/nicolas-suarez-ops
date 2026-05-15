/**
 * @repo/ui — Card Component
 * Multi-brand card with hover lift animation per context_ui.md.
 *
 * Each brand has its own shadow palette:
 * - La Carreta: warm terracotta-tinted shadows
 * - Mar y Tierra: ocean-blue tinted shadows
 * - Delica: near-black shadows, max 2-4px border-radius
 * - Admin: neutral dark elevation system
 */

import type { HTMLAttributes, ReactNode } from "react";
import type { BrandTheme } from "./button";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  theme?: BrandTheme;
  /** Removes hover animation */
  flat?: boolean;
  /** Adds inner padding */
  padded?: boolean;
}

function getCardClasses(theme: BrandTheme, flat: boolean): string {
  const base = "overflow-hidden transition-all duration-200";
  const hover = flat
    ? ""
    : "hover:-translate-y-0.5 cursor-pointer";

  switch (theme) {
    case "la-carreta":
      return `${base} rounded-[10px] border border-[#ede8df] bg-white shadow-[0_2px_8px_rgba(107,23,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] ${hover} hover:shadow-[0_4px_16px_rgba(107,23,0,0.12),0_2px_4px_rgba(0,0,0,0.06)]`;

    case "mar-y-tierra":
      return `${base} rounded-[10px] border border-[rgba(10,61,98,0.08)] bg-white shadow-[0_2px_8px_rgba(10,61,98,0.08),0_1px_2px_rgba(0,0,0,0.04)] ${hover} hover:shadow-[0_4px_16px_rgba(10,61,98,0.12),0_2px_4px_rgba(0,0,0,0.06)]`;

    case "delica":
      return `${base} rounded-[2px] border border-[rgba(141,106,50,0.1)] bg-[#1e100a] shadow-[0_2px_12px_rgba(0,0,0,0.18),0_1px_3px_rgba(0,0,0,0.12)] ${hover} hover:shadow-[0_4px_20px_rgba(0,0,0,0.28),0_2px_6px_rgba(0,0,0,0.14)]`;

    case "admin":
    default:
      return `${base} rounded-lg border border-white/[0.07] bg-[#1e232c] shadow-[0_1px_2px_rgba(0,0,0,0.4)] ${hover} hover:shadow-[0_2px_8px_rgba(0,0,0,0.5),0_1px_2px_rgba(0,0,0,0.3)] hover:border-white/[0.13]`;
  }
}

/** Multi-brand Card with hover lift animation. */
export function Card({
  children,
  theme = "admin",
  flat = false,
  padded = true,
  className = "",
  ...props
}: CardProps) {
  const classes = [
    getCardClasses(theme, flat),
    padded ? "p-3" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
