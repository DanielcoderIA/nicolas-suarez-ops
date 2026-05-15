/**
 * @repo/database — Reservation Queries
 * All queries enforce restaurant_id scoping.
 */

import { getPublicSupabase } from "../client";
import { assertRestaurantId } from "../helpers/rls";
import type { Reservation, ReservationInsert, ReservationStatus } from "../types";

/**
 * Creates a new reservation (public endpoint).
 * Inserts with status = 'pending'. RLS allows anonymous INSERT.
 *
 * @param payload - Reservation data (restaurant_id is REQUIRED)
 * @returns The created reservation
 */
export async function createReservation(
  payload: ReservationInsert
): Promise<Reservation> {
  assertRestaurantId(payload.restaurant_id);

  const supabase = getPublicSupabase();

  // Destructure `status` out of payload so it doesn't conflict with the
  // explicit override below — avoids the TS duplicate-key / type mismatch error.
  const { status: _status, ...rest } = payload;

  const { data, error } = await supabase
    .from("reservations")
    .insert({
      ...rest,
      status: "pending" as const,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`[reservations] Failed to create: ${error.message}`);
  }

  if (!data) {
    throw new Error("[reservations] No data returned after insert");
  }

  return data;
}

/**
 * Fetches reservations for a restaurant with optional filters.
 * ⚠️ Use with authenticated server client only (contains whatsapp).
 *
 * @param restaurantId - UUID of the restaurant
 * @param filters - Optional date/status filters
 */
export async function getReservationsByRestaurant(
  restaurantId: string,
  filters?: {
    date?: string;
    status?: ReservationStatus;
    page?: number;
    limit?: number;
  }
): Promise<{ data: Reservation[]; count: number }> {
  assertRestaurantId(restaurantId);

  const supabase = getPublicSupabase();
  const page = filters?.page ?? 1;
  const limit = Math.min(filters?.limit ?? 20, 100);
  const offset = (page - 1) * limit;

  let query = supabase
    .from("reservations")
    .select("*", { count: "exact" })
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters?.date) {
    query = query.eq("date", filters.date);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`[reservations] Failed to fetch: ${error.message}`);
  }

  return { data: data ?? [], count: count ?? 0 };
}
