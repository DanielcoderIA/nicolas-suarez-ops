/**
 * @repo/ui — Badge Component
 * Status and category badges following context_ui.md.
 *
 * Variants:
 * - status: pending (amber), confirmed (green), cancelled (red), info (blue)
 * - rendering: SSG (green), ISR (amber), CSR (blue)
 * - restaurant: la-carreta, mar-y-tierra, delica
 */

import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "info"
  | "ssg"
  | "isr"
  | "csr"
  | "la-carreta"
  | "mar-y-tierra"
  | "delica"
  | "default";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  /** Show status dot before text */
  dot?: boolean;
}

function getBadgeClasses(variant: BadgeVariant): string {
  const base =
    "inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-semibold tracking-[0.06em] uppercase leading-none";

  switch (variant) {
    // Status badges
    case "pending":
      return `${base} rounded bg-amber-500/[0.12] text-amber-500 border border-amber-500/20`;
    case "confirmed":
      return `${base} rounded bg-green-500/[0.12] text-green-500 border border-green-500/20`;
    case "cancelled":
      return `${base} rounded bg-red-500/[0.12] text-red-500 border border-red-500/20`;
    case "info":
      return `${base} rounded bg-blue-400/[0.12] text-blue-400 border border-blue-400/20`;

    // Rendering strategy badges
    case "ssg":
      return `${base} rounded bg-green-500/[0.12] text-green-500 border border-green-500/20`;
    case "isr":
      return `${base} rounded bg-amber-500/[0.12] text-amber-500 border border-amber-500/20`;
    case "csr":
      return `${base} rounded bg-[rgba(79,142,247,0.12)] text-[#4f8ef7] border border-[rgba(79,142,247,0.2)]`;

    // Restaurant badges (admin panel)
    case "la-carreta":
      return `${base} rounded bg-[rgba(107,23,0,0.15)] text-[#c87048]`;
    case "mar-y-tierra":
      return `${base} rounded bg-[rgba(10,61,98,0.2)] text-[#4d90c0]`;
    case "delica":
      return `${base} rounded bg-[rgba(141,106,50,0.15)] text-[#8D6A32]`;

    default:
      return `${base} rounded bg-white/5 text-[#9aa0ac] border border-white/10`;
  }
}

function getDotColor(variant: BadgeVariant): string {
  switch (variant) {
    case "pending":
      return "bg-amber-500";
    case "confirmed":
      return "bg-green-500";
    case "cancelled":
      return "bg-red-500";
    case "info":
      return "bg-blue-400";
    default:
      return "bg-current";
  }
}

/** Status and category badge. */
export function Badge({
  children,
  variant = "default",
  dot = false,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span className={`${getBadgeClasses(variant)} ${className}`} {...props}>
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${getDotColor(variant)} flex-shrink-0`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
