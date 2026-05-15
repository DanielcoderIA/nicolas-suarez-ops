/**
 * @repo/ui — SectionHeader Component
 * Consistent typographic treatment for section titles across the platform.
 */

import React from "react";
import { type BrandTheme } from "./button";

interface SectionHeaderProps {
  restaurant: BrandTheme | "chef";
  eyebrow?: string;
  title: string | React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

const eyebrowStyles: Record<string, string> = {
  "la-carreta": "font-['DM_Sans',sans-serif] text-[10px] font-bold tracking-eyebrow uppercase text-[var(--color-accent)] mb-3",
  "mar-y-tierra": "font-['DM_Sans',sans-serif] text-[10px] font-semibold tracking-eyebrow uppercase text-[var(--color-accent)] mb-3",
  "delica": "font-['DM_Sans',sans-serif] text-[9px] font-medium tracking-wide uppercase text-[var(--color-accent)] mb-3",
};

const titleStyles: Record<string, string> = {
  "la-carreta": "font-['Fraunces',serif] text-[28px] md:text-[36px] text-[var(--color-text-dark)] leading-tight tracking-display",
  "mar-y-tierra": "font-['Libre_Baskerville',serif] text-[24px] md:text-[32px] text-[var(--color-text-dark)] leading-tight font-bold tracking-display",
  "delica": "font-['Cormorant_Garamond',serif] text-[30px] md:text-[38px] text-[var(--color-text-dark)] leading-tight italic tracking-tight",
};

const descStyles: Record<string, string> = {
  "la-carreta": "font-['DM_Sans',sans-serif] text-[14px] text-[rgba(44,32,24,0.6)] mt-4 max-w-xl",
  "mar-y-tierra": "font-['DM_Sans',sans-serif] text-[14px] text-[var(--color-text-muted)] mt-4 max-w-xl",
  "delica": "font-['DM_Sans',sans-serif] text-[14px] text-[rgba(44,24,16,0.5)] mt-4 max-w-xl",
};

export function SectionHeader({
  restaurant,
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div className={`mb-10 ${isCenter ? "text-center flex flex-col items-center" : ""} ${className}`}>
      {eyebrow && <p className={eyebrowStyles[restaurant] || eyebrowStyles["la-carreta"]}>{eyebrow}</p>}
      <h2 className={titleStyles[restaurant] || titleStyles["la-carreta"]}>{title}</h2>
      {description && <p className={descStyles[restaurant] || descStyles["la-carreta"]}>{description}</p>}
    </div>
  );
}
