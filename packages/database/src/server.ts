/**
 * @repo/database — Server-Side Supabase Clients
 * Uses httpOnly cookies exclusively for auth. NEVER localStorage.
 *
 * Two clients:
 * 1. getServerSupabase(cookieStore) — Auth-aware, respects RLS + JWT identity
 * 2. getAdminSupabase() — Service role, bypasses RLS. Server-only.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { getPublicEnv, getServerEnv } from "./env";

/**
 * Cookie adapter type for Next.js App Router.
 * Compatible with `cookies()` from `next/headers`.
 */
export interface CookieStore {
  getAll(): Array<{ name: string; value: string }>;
  set(options: {
    name: string;
    value: string;
    maxAge?: number;
    path?: string;
    domain?: string;
    sameSite?: "strict" | "lax" | "none";
    secure?: boolean;
    httpOnly?: boolean;
  }): void;
}

/**
 * Creates an authenticated Supabase client using httpOnly cookies.
 * This is the primary client for all admin panel operations.
 *
 * The JWT from the cookie is used to evaluate RLS policies.
 * auth.uid() in PostgreSQL will resolve to the authenticated user.
 *
 * @param cookieStore - Next.js cookie store from `await cookies()`
 * @returns Supabase client with user's JWT identity
 *
 * @example
 * ```ts
 * import { cookies } from "next/headers";
 * import { getServerSupabase } from "@repo/database/server";
 *
 * export async function GET() {
 *   const cookieStore = await cookies();
 *   const supabase = getServerSupabase(cookieStore);
 *   const { data } = await supabase.from("reservations").select("*");
 *   return Response.json({ data });
 * }
 * ```
 */
export function getServerSupabase(cookieStore: CookieStore): SupabaseClient<Database, "public", any> {
  const { url, anonKey } = getPublicEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set({
            name,
            value,
            ...options,
            // ⛔ SECURITY: Force httpOnly + Secure + SameSite=Strict
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
          });
        }
      },
    },
  });
}

/**
 * Returns a service-role Supabase client that bypasses ALL RLS.
 * ⚠️ NEVER expose to client code. Only use in:
 * - API Routes (server-side)
 * - Server Components (server-side)
 * - n8n webhooks
 *
 * Typical use: loyal_visits, analytics_events (service_role only tables).
 */
export function getAdminSupabase() {
  const { url, serviceRoleKey } = getServerEnv();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      // ⛔ SECURITY: No persistence, no browser features
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Validates the current user session from cookies.
 * Returns the user if authenticated, null otherwise.
 *
 * @param cookieStore - Next.js cookie store from `await cookies()`
 * @returns User object or null
 */
export async function validateSession(cookieStore: CookieStore) {
  const supabase = getServerSupabase(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

import type { AdminUser } from "./types";

/**
 * Gets the admin user profile with restaurant access list.
 * Used to enforce multi-tenant authorization.
 *
 * @param cookieStore - Next.js cookie store
 * @returns AdminUser row or null if not admin
 */
export async function getAdminProfile(cookieStore: CookieStore): Promise<AdminUser | null> {
  const user = await validateSession(cookieStore);
  if (!user) return null;

  // Use the admin client to bypass RLS, we already validated the user session above
  const adminSupabase = getAdminSupabase();
  const { data, error } = await adminSupabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("[getAdminProfile] Supabase error:", error.message);
  }

  if (error || !data) return null;
  return data;
}
