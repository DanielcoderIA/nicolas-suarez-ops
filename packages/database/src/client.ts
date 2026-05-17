import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Returns a public Supabase client for browser-side anonymous reads.
 */
export function getPublicSupabase(): SupabaseClient<Database, 'public', any> {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Returns a service-role Supabase client for server-side admin tasks.
 * Bypasses RLS.
 */
export function getServiceSupabase(): SupabaseClient<Database, 'public', any> {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
