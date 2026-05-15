/**
 * @repo/ui — Package Entry Point
 * Re-exports all components and shared types.
 *
 * Import pattern in apps:
 *   import { NavBar, HeroSection, MenuCard } from "@repo/ui";
 *   import { Button, type BrandTheme } from "@repo/ui";
 */

// ── Atomic components ─────────────────────────────────────────
export { Button } from "./button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./button";

export { CustomImage, validateImageFile } from "./custom-image";
export type { CustomImageProps } from "./custom-image";

// ── Shared type ───────────────────────────────────────────────
export type { BrandTheme } from "./button";

// ── Composite components ──────────────────────────────────────
export { NavBar } from "./navbar";
export type { NavBarProps, NavLink } from "./navbar";

export { HeroSection } from "./hero-section";
export type { HeroSectionProps, HeroRestaurant } from "./hero-section";

export { MenuCard } from "./menu-card";
export type { MenuCardProps, MenuCardRestaurant } from "./menu-card";

export { ReservationForm } from "./reservation-form";
export type {
  ReservationFormProps,
  ReservationData,
} from "./reservation-form";

export { Footer } from "./footer";
export type {
  FooterProps,
  FooterRestaurant,
  FooterLink,
  FooterHours,
} from "./footer";

// ── Admin / specialized components ───────────────────────────
export { ImageUploader } from "./image-uploader";
export type { ImageUploaderProps, UploaderRestaurant } from "./image-uploader";

export { CataCard } from "./cata-card";
export type { CataCardProps } from "./cata-card";
export type { Experience } from "./cata-card-types";

export { AnalyticsWidget } from "./analytics-widget";
export type {
  AnalyticsWidgetProps,
  AnalyticsStat,
  AnalyticsBar,
} from "./analytics-widget";

// ── Hooks ────────────────────────────────────────────────────
export { useAnalytics } from "./hooks/useAnalytics";
export { useLoyalty } from "./hooks/useLoyalty";

// ── Behavioral components ────────────────────────────────────
export { LoyaltyTracker } from "./components/LoyaltyTracker";
export { ScrollReveal } from "./scroll-reveal";
export { SectionHeader } from "./components/section-header";
export { BottomNav } from "./bottom-nav";
export type { BottomNavProps } from "./bottom-nav";

