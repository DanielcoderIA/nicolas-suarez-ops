/**
 * @repo/database — Environment Validation
 * Validates all required Supabase env vars at startup.
 * Fails fast with clear error messages instead of runtime crashes.
 */

interface SupabaseEnv {
  url: string;
  anonKey: string;
}

interface SupabaseServerEnv extends SupabaseEnv {
  serviceRoleKey: string;
}

/**
 * Returns public Supabase credentials (safe for client-side).
 * @throws {Error} if NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing.
 */
export function getPublicEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      "[database] Missing NEXT_PUBLIC_SUPABASE_URL. Set it in .env.local"
    );
  }
  if (!anonKey) {
    throw new Error(
      "[database] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Set it in .env.local"
    );
  }

  return { url, anonKey };
}

/**
 * Returns server-only Supabase credentials including service role key.
 * ⚠️ NEVER expose this to the client.
 * @throws {Error} if any env var is missing.
 */
export function getServerEnv(): SupabaseServerEnv {
  const { url, anonKey } = getPublicEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "[database] Missing SUPABASE_SERVICE_ROLE_KEY. This is a server-only variable."
    );
  }

  return { url, anonKey, serviceRoleKey };
}
