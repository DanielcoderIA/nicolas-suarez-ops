/**
 * @repo/ui — useAnalytics Hook
 * Tracks analytics events for public restaurant sites.
 *
 * executive_summary.md: GA4 + eventos custom por restaurante
 * context_prd.md: CU-003 — Fidelización pasiva
 *
 * ⚠️ NEVER sends personal data (name, email, phone).
 * ⚠️ NEVER uses localStorage or sessionStorage.
 */

"use client";

import { useCallback, useRef } from "react";

/** Valid event types matching the AnalyticsEventType enum in @repo/database. */
type AnalyticsEventType =
  | "page_view"
  | "menu_view"
  | "menu_item_view"
  | "reservation_start"
  | "reservation_complete"
  | "cata_view"
  | "cata_book_intent"
  | "loyal_visitor_detected";

interface UseAnalyticsOptions {
  /** UUID of the restaurant */
  restaurantId: string;
  /** The ANALYTICS_INTERNAL_TOKEN for server auth */
  token: string;
  /** Base URL of the analytics endpoint (defaults to /api/analytics/events) */
  endpoint?: string;
}

interface UseAnalyticsReturn {
  /** Track a custom event */
  trackEvent: (eventType: AnalyticsEventType, page?: string) => void;
  /** Track a page view (call on navigation) */
  trackPageView: (page?: string) => void;
}

/**
 * Client-side analytics hook for public restaurant sites.
 * Sends events to POST /api/analytics/events.
 *
 * Uses `navigator.sendBeacon` when available for non-blocking tracking,
 * falling back to fetch. Deduplicates rapid-fire events.
 */
export function useAnalytics({
  restaurantId,
  token,
  endpoint = "/api/analytics/events",
}: UseAnalyticsOptions): UseAnalyticsReturn {
  // Dedupe: track last event to prevent double-fires on strict mode
  const lastEventRef = useRef<string>("");

  const trackEvent = useCallback(
    (eventType: AnalyticsEventType, page?: string) => {
      // Dedupe key: event_type + page within 1 second
      const dedupeKey = `${eventType}:${page ?? ""}`;
      if (lastEventRef.current === dedupeKey) return;
      lastEventRef.current = dedupeKey;

      // Reset dedupe after 1 second
      setTimeout(() => {
        if (lastEventRef.current === dedupeKey) {
          lastEventRef.current = "";
        }
      }, 1000);

      const payload = JSON.stringify({
        restaurant_id: restaurantId,
        event_type: eventType,
        page: page ?? (typeof window !== "undefined" ? window.location.pathname : null),
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
      });

      // Use fetch with keep-alive for reliable delivery + Authorization header
      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // Silently fail — analytics should never block the user
      });
    },
    [restaurantId, token, endpoint]
  );

  const trackPageView = useCallback(
    (page?: string) => {
      trackEvent("page_view", page);
    },
    [trackEvent]
  );

  return { trackEvent, trackPageView };
}
