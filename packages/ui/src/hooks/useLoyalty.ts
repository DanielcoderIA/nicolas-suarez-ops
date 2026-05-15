/**
 * @repo/ui — useLoyalty Hook
 * Passive loyalty tracking via 1st-party cookies.
 *
 * executive_summary.md: Fidelización usa SHA-256 del cookie. NUNCA nombre, email ni datos personales.
 * context_prd.md: CU-003 — 1ra visita → cookie ns_visitor (1 año) → SHA-256 hash guardado
 *
 * Flow:
 * 1. Read `ns_visitor` cookie
 * 2. If absent → generate UUID → set cookie (1 year, SameSite=Lax, 1st-party)
 * 3. Hash cookie value with SHA-256 (never store raw)
 * 4. Call upsert_loyal_visit() RPC → returns visit_count
 *
 * ⚠️ NEVER uses localStorage or sessionStorage.
 * ⚠️ NEVER stores name, email, or any personal data.
 */

"use client";

import { useEffect, useState, useRef } from "react";

interface UseLoyaltyOptions {
  restaurantId: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

interface UseLoyaltyReturn {
  isReturning: boolean;
  visitCount: number;
  isLoading: boolean;
}

/** Generate a crypto-safe UUID v4 */
function generateVisitorId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** SHA-256 hash of a string (Web Crypto API) */
async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Read a cookie by name */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1] ?? "") : null;
}

/** Set a 1st-party cookie with 1 year expiration */
function setCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  const maxAge = 365 * 24 * 60 * 60; // 1 year in seconds
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/** Parse UTM params from URL */
function getUTMParams(): {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
} {
  if (typeof window === "undefined") {
    return { utm_source: null, utm_medium: null, utm_campaign: null };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
  };
}

const COOKIE_NAME = "ns_visitor";

/**
 * Passive loyalty hook. Tracks returning visitors using a hashed cookie.
 * No personal data is ever stored — only a SHA-256 hash of a random UUID.
 */
export function useLoyalty({
  restaurantId,
  supabaseUrl,
  supabaseAnonKey,
}: UseLoyaltyOptions): UseLoyaltyReturn {
  const [isReturning, setIsReturning] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent double-run in React Strict Mode
    if (hasRun.current) return;
    hasRun.current = true;

    async function track() {
      try {
        // Step 1: Read or create visitor cookie
        let visitorId = getCookie(COOKIE_NAME);

        if (!visitorId) {
          visitorId = generateVisitorId();
          setCookie(COOKIE_NAME, visitorId);
        }

        // Step 2: SHA-256 hash (never store raw cookie)
        const cookieHash = await sha256(visitorId);

        // Step 3: Get UTM params
        const { utm_source, utm_medium, utm_campaign } = getUTMParams();

        // Step 4: Call upsert_loyal_visit() RPC via Supabase REST API
        const rpcUrl = `${supabaseUrl}/rest/v1/rpc/upsert_loyal_visit`;

        const response = await fetch(rpcUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            p_hash: cookieHash,
            p_rid: restaurantId,
            p_src: utm_source,
            p_med: utm_medium,
            p_camp: utm_campaign,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          // RPC returns the LoyalVisit row
          const count = typeof result === "object" && result !== null
            ? (result as { visit_count?: number }).visit_count ?? 1
            : 1;

          setVisitCount(count);
          setIsReturning(count > 1);
        }
      } catch {
        // Silently fail — loyalty should never block the user experience
      } finally {
        setIsLoading(false);
      }
    }

    track();
  }, [restaurantId, supabaseUrl, supabaseAnonKey]);

  return { isReturning, visitCount, isLoading };
}
