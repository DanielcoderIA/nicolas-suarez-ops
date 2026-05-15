/**
 * @repo/database — Experience Queries (Delica only)
 * All queries enforce restaurant_id scoping.
 */

import { getPublicSupabase } from "../client";
import { assertRestaurantId } from "../helpers/rls";
import type { Experience } from "../types";

/**
 * Fetches published experiences for a specific restaurant.
 * Public: only returns is_published = true, ordered by date ascending.
 *
 * @param restaurantId - UUID of the restaurant (REQUIRED — multi-tenant isolation)
 * @returns Array of published experiences, sorted by soonest date first
 */
export async function getPublishedExperiences(
  restaurantId: string
): Promise<Experience[]> {
  assertRestaurantId(restaurantId);

  const supabase = getPublicSupabase();

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("is_published", true)
    .order("date", { ascending: true });

  if (error) {
    throw new Error(`[experiences] Failed to fetch: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Fetches a single experience by ID.
 * Validates restaurant_id ownership before returning.
 *
 * @param experienceId - UUID of the experience
 * @param restaurantId - UUID of the restaurant (ownership check)
 */
export async function getExperience(
  experienceId: string,
  restaurantId: string
): Promise<Experience | null> {
  assertRestaurantId(experienceId);
  assertRestaurantId(restaurantId);

  const supabase = getPublicSupabase();

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", experienceId)
    .eq("restaurant_id", restaurantId)
    .single();

  if (error) return null;
  return data;
}
