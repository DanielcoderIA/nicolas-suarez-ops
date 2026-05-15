/**
 * @repo/ui — LoyaltyTracker Component
 * Invisible component that mounts in every public app layout.
 *
 * Responsibilities:
 * 1. Tracks page views on every route change
 * 2. Runs passive loyalty detection (cookie → SHA-256 → RPC)
 *
 * executive_summary.md: Fidelización pasiva + GA4 eventos custom
 * context_prd.md: CU-003 — reconocido por cookie en 2da visita sin dar datos
 *
 * ⚠️ NEVER stores personal data.
 * ⚠️ NEVER uses localStorage or sessionStorage.
 */

"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAnalytics } from "../hooks/useAnalytics";
import { useLoyalty } from "../hooks/useLoyalty";

interface LoyaltyTrackerProps {
  restaurantId: string;
  analyticsToken: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

/**
 * Invisible tracking component. Renders nothing.
 * Mount once in the root layout of each public app.
 *
 * @example
 * ```tsx
 * // In apps/la-carreta/src/app/layout.tsx
 * <LoyaltyTracker
 *   restaurantId="11111111-1111-1111-1111-111111111111"
 *   analyticsToken={process.env.NEXT_PUBLIC_ANALYTICS_TOKEN!}
 *   supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
 *   supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
 * />
 * ```
 */
export function LoyaltyTracker({
  restaurantId,
  analyticsToken,
  supabaseUrl,
  supabaseAnonKey,
}: LoyaltyTrackerProps) {
  const { trackPageView, trackEvent } = useAnalytics({
    restaurantId,
    token: analyticsToken,
  });

  const { isReturning } = useLoyalty({
    restaurantId,
    supabaseUrl,
    supabaseAnonKey,
  });

  // Track initial page view on mount
  const hasTrackedInitial = useRef(false);

  useEffect(() => {
    if (hasTrackedInitial.current) return;
    hasTrackedInitial.current = true;

    trackPageView();
  }, [trackPageView]);

  // Track loyal_visitor_detected event if returning visitor
  const hasTrackedLoyalty = useRef(false);

  useEffect(() => {
    if (!isReturning || hasTrackedLoyalty.current) return;
    hasTrackedLoyalty.current = true;

    trackEvent("loyal_visitor_detected");
  }, [isReturning, trackEvent]);

  // Listen for route changes (Next.js App Router uses popstate + pushState)
  useEffect(() => {
    let lastPath = window.location.pathname;

    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      if (currentPath !== lastPath) {
        lastPath = currentPath;
        trackPageView(currentPath);
      }
    };

    // Listen for browser back/forward
    window.addEventListener("popstate", handleRouteChange);

    // Intercept pushState/replaceState for client-side navigation
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    history.pushState = (...args: Parameters<typeof history.pushState>) => {
      originalPushState(...args);
      handleRouteChange();
    };

    history.replaceState = (...args: Parameters<typeof history.replaceState>) => {
      originalReplaceState(...args);
      handleRouteChange();
    };

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [trackPageView]);

  // This component renders nothing — it's purely behavioral
  return null;
}
