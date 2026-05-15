/**
 * @repo/ui — Button Component
 * Multi-brand atomic button following context_ui.md design tokens.
 *
 * Supports 3 brand themes + admin + semantic variants.
 * Performance: zero runtime CSS-in-JS, pure className composition.
 */

"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type BrandTheme = "la-carreta" | "mar-y-tierra" | "delica" | "admin";
export type ButtonVariant = "primary" | "secondary" | "ghost" | "confirm" | "cancel";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  theme?: BrandTheme;
  /** Full width button */
  fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[11px]",
  md: "px-4 py-2.5 text-[12px]",
  lg: "px-7 py-4 text-[14px]",
};

/**
 * Brand-aware CTA styles from context_ui.md:
 * - La Carreta: filled gold on terracotta, border-radius 3-4px
 * - Mar y Tierra: filled teal pill, border-radius 20px
 * - Delica: ghost/outline gold, border-radius 1px MAX
 * - Admin: subtle bordered, border-radius 5px
 */
function getVariantClasses(theme: BrandTheme, variant: ButtonVariant): string {
  const base =
    "inline-flex items-center justify-center font-semibold uppercase tracking-wide transition-all cursor-pointer focus-visible:outline-none";

  if (variant === "confirm") {
    return `${base} rounded-[5px] border border-green-500/30 text-green-500 bg-transparent hover:bg-green-500/10`;
  }
  if (variant === "cancel") {
    return `${base} rounded-[5px] border border-red-500/30 text-red-500 bg-transparent hover:bg-red-500/10`;
  }

  switch (theme) {
    case "la-carreta":
      return variant === "primary"
        ? `${base} rounded-[3px] bg-[var(--color-accent)] text-[var(--color-primary)] font-bold shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-px focus-visible:shadow-[0_0_0_2px_var(--color-primary),0_0_0_4px_var(--color-accent)]`
        : variant === "secondary"
          ? `${base} rounded-[3px] border border-[var(--color-accent)]/40 text-[var(--color-accent)] bg-transparent hover:bg-[var(--color-accent)]/10`
          : `${base} rounded-[3px] text-[var(--color-accent)] bg-transparent hover:bg-[var(--color-accent)]/10`;

    case "mar-y-tierra":
      return variant === "primary"
        ? `${base} rounded-full bg-[var(--color-accent)] text-white font-bold shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-px focus-visible:shadow-[0_0_0_2px_var(--color-primary),0_0_0_4px_var(--color-accent)]`
        : variant === "secondary"
          ? `${base} rounded-full border border-[var(--color-primary)]/20 text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)]/5`
          : `${base} rounded-full text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)]/5`;

    case "delica":
      return variant === "primary"
        ? `${base} rounded-[1px] border border-[var(--color-accent)]/50 text-[var(--color-accent)] bg-transparent hover:bg-[var(--color-accent)]/[0.06] hover:border-[var(--color-accent)] focus-visible:shadow-[0_0_0_2px_var(--color-primary),0_0_0_4px_var(--color-accent)]`
        : variant === "secondary"
          ? `${base} rounded-[1px] border border-[var(--color-accent)]/25 text-[var(--color-accent)]/70 bg-transparent hover:text-[var(--color-accent)]`
          : `${base} rounded-[1px] text-[var(--color-accent)]/60 bg-transparent hover:text-[var(--color-accent)]`;

    case "admin":
    default:
      return variant === "primary"
        ? `${base} rounded-[5px] bg-[#4f8ef7] text-white hover:bg-[#6ba0f8] focus-visible:shadow-[0_0_0_2px_#0b0d0f,0_0_0_4px_#4f8ef7]`
        : variant === "secondary"
          ? `${base} rounded-[5px] border border-white/12 text-[#9aa0ac] bg-white/[0.04] hover:bg-white/[0.08]`
          : `${base} rounded-[5px] text-[#9aa0ac] bg-transparent hover:bg-white/5`;
  }
}

/** Multi-brand Button component. Lightweight: zero runtime CSS-in-JS. */
export function Button({
  children,
  variant = "primary",
  size = "md",
  theme = "admin",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const classes = [
    getVariantClasses(theme, variant),
    sizeStyles[size],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
