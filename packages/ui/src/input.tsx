/**
 * @repo/ui — Input Component
 * Multi-brand form input following context_ui.md reservation form specs.
 *
 * Focus ring uses brand primary color with opacity glow.
 * DM Sans 13px for input text, 10px uppercase for labels.
 */

import type { InputHTMLAttributes } from "react";
import type { BrandTheme } from "./button";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label text */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Brand theme for focus ring coloring */
  theme?: BrandTheme;
}

function getFocusRing(theme: BrandTheme): string {
  switch (theme) {
    case "la-carreta":
      return "focus:border-[#6B1700] focus:shadow-[0_0_0_3px_rgba(107,23,0,0.08)]";
    case "mar-y-tierra":
      return "focus:border-[#0A3D62] focus:shadow-[0_0_0_3px_rgba(10,61,98,0.08)]";
    case "delica":
      return "focus:border-[#8D6A32] focus:shadow-[0_0_0_3px_rgba(141,106,50,0.08)]";
    case "admin":
    default:
      return "focus:border-[#4f8ef7] focus:shadow-[0_0_0_3px_rgba(79,142,247,0.15)]";
  }
}

function getInputClasses(theme: BrandTheme, hasError: boolean): string {
  const base =
    "w-full px-3 py-2.5 rounded border text-[13px] font-normal transition-all duration-150 outline-none font-[family-name:var(--font-body)]";

  const borderColor = hasError
    ? "border-red-500"
    : theme === "admin"
      ? "border-white/10 bg-[#1e232c] text-[#e8eaed] placeholder:text-[#5f6672]"
      : "border-[#e0d8cf] bg-white text-[#333] placeholder:text-[#aaa]";

  return `${base} ${borderColor} ${getFocusRing(theme)}`;
}

/** Multi-brand Input with label and error states. */
export function Input({
  label,
  error,
  theme = "admin",
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#888]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={getInputClasses(theme, Boolean(error))}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-[11px] text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
