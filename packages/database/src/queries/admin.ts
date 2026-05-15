/**
 * @repo/database — Admin Queries
 * Functions specifically designed for the Admin Dashboard.
 * These require an authenticated Supabase Client (to satisfy RLS) 
 * instead of generating their own public client.
 */

import { getServerSupabase } from "../server";
import { assertRestaurantId } from "../helpers/rls";
import type { MenuItem, Reservation, ReservationStatus, Database, LoyalVisit, AnalyticsEvent } from "../types";
// DbClient is no longer used, we use ReturnType<typeof getServerSupabase> directly in parameters.

/**
 * Fetches all menu items for a restaurant, ignoring `is_available` flag.
 * Needed for the Admin panel to toggle visibility of exhausted items.
 */
export async function getAdminMenu(
  supabase: ReturnType<typeof getServerSupabase>,
  restaurantId: string
): Promise<MenuItem[]> {
  assertRestaurantId(restaurantId);

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`[admin_menu] Failed to fetch menu: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Toggles the `is_available` status of a menu item.
 */
export async function toggleAdminMenuItem(
  supabase: ReturnType<typeof getServerSupabase>,
  id: string,
  restaurantId: string
): Promise<MenuItem> {
  assertRestaurantId(id);
  assertRestaurantId(restaurantId);

  // 1. Read current state
  const { data: current, error: fetchError } = await supabase
    .from("menu_items")
    .select("id, is_available")
    .eq("id", id)
    .eq("restaurant_id", restaurantId)
    .single();

  if (fetchError || !current) {
    throw new Error(`[admin_menu] Item "${id}" not found: ${fetchError?.message}`);
  }

  // 2. Flip the state
  const { data: updated, error: updateError } = await supabase
    .from("menu_items")
    .update({ is_available: !current.is_available })
    .eq("id", id)
    .eq("restaurant_id", restaurantId)
    .select()
    .single();

  if (updateError || !updated) {
    throw new Error(`[admin_menu] Failed to toggle item "${id}": ${updateError?.message}`);
  }

  return updated;
}

/**
 * Fetches all reservations for a given restaurant.
 */
export async function getAdminReservations(
  supabase: ReturnType<typeof getServerSupabase>,
  restaurantId: string
): Promise<Reservation[]> {
  assertRestaurantId(restaurantId);

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) {
    throw new Error(`[admin_reservations] Failed to fetch: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Updates the status of a reservation.
 */
export async function updateAdminReservationStatus(
  supabase: ReturnType<typeof getServerSupabase>,
  id: string,
  restaurantId: string,
  status: ReservationStatus
): Promise<Reservation> {
  assertRestaurantId(id);
  assertRestaurantId(restaurantId);

  const { data, error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id)
    .eq("restaurant_id", restaurantId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`[admin_reservations] Failed to update status: ${error?.message}`);
  }

  return data;
}

/**
 * Fetches recent analytics events for aggregation in the Admin panel.
 */
export async function getAdminAnalyticsEvents(
  supabase: ReturnType<typeof getServerSupabase>,
  restaurantId: string,
  days: number = 30
) {
  assertRestaurantId(restaurantId);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days);

  const { data, error } = await supabase
    .from("analytics_events")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .gte("created_at", thirtyDaysAgo.toISOString());

  if (error) {
    throw new Error(`[admin_analytics] Failed to fetch events: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Fetches returning visitors stats.
 */
export async function getAdminLoyaltyStats(
  supabase: ReturnType<typeof getServerSupabase>,
  restaurantId: string
): Promise<Pick<LoyalVisit, "visit_count" | "cookie_hash">[]> {
  assertRestaurantId(restaurantId);

  const { data, error } = await supabase
    .from("loyal_visits")
    .select("visit_count, cookie_hash")
    .eq("restaurant_id", restaurantId);

  if (error) {
    throw new Error(`[admin_loyalty] Failed to fetch loyalty stats: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Fetches all experiences for Delica.
 */
export async function getAdminExperiences(
  supabase: ReturnType<typeof getServerSupabase>,
  restaurantId: string
) {
  assertRestaurantId(restaurantId);

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("date", { ascending: false });

  if (error) {
    throw new Error(`[admin_experiences] Failed to fetch experiences: ${error.message}`);
  }

  return data ?? [];
}
