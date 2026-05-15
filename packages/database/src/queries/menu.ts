/**
 * @repo/database — Menu Queries
 * All queries enforce restaurant_id scoping (Zero-Trust Multi-Tenancy).
 */

import { getPublicSupabase } from "../client";
import { getAdminSupabase } from "../server";
import { assertRestaurantId } from "../helpers/rls";
import type { MenuItem, MenuCategory } from "../types";

/**
 * Fetches menu items for a specific restaurant.
 * Public: RLS filters `is_available = true` automatically.
 *
 * @param restaurantId - UUID of the restaurant (REQUIRED — multi-tenant isolation)
 * @param category - Optional category filter
 * @returns Array of available menu items, ordered by category + sort_order
 */
export async function getMenuByRestaurant(
  restaurantId: string,
  category?: MenuCategory
): Promise<MenuItem[]> {
  assertRestaurantId(restaurantId);

  const supabase = getPublicSupabase();

  let query = supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("is_available", true)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`[menu] Failed to fetch menu: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Fetches a single menu item by ID.
 * Validates restaurant_id ownership before returning.
 *
 * @param itemId - UUID of the menu item
 * @param restaurantId - UUID of the restaurant (ownership check)
 */
export async function getMenuItem(
  itemId: string,
  restaurantId: string
): Promise<MenuItem | null> {
  assertRestaurantId(restaurantId);

  const supabase = getPublicSupabase();

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", itemId)
    .eq("restaurant_id", restaurantId)
    .single();

  if (error) return null;
  return data;
}

/**
 * Invierte la disponibilidad de un ítem de menú (is_available: true ↔ false).
 * Requiere cliente autenticado con service role — exclusivo del Admin panel.
 *
 * Flujo CU-002: Admin → toggle → PATCH /api/menu/items/[id] → ISR revalidate 5s.
 * SLA: cambio visible en el sitio público en < 5 s.
 *
 * @param id           - UUID del ítem de menú a modificar
 * @param restaurantId - UUID del restaurante dueño del ítem (multi-tenant scoping)
 * @returns El MenuItem actualizado con el nuevo valor de is_available
 * @throws si algún UUID es inválido, el ítem no existe o falla la consulta
 */
export async function toggleMenuItem(
  id: string,
  restaurantId: string
): Promise<MenuItem> {
  // Valida ambos UUIDs antes de cualquier operación en BD
  assertRestaurantId(id);
  assertRestaurantId(restaurantId);

  // Usa el cliente admin (service role) — esta operación solo ocurre en el server
  // del Admin panel, donde no hay CookieStore disponible en este contexto.
  const supabase = getAdminSupabase();

  // Paso 1: leer el estado actual, scoped a restaurant_id (defensa multi-tenant)
  const { data: current, error: fetchError } = await supabase
    .from("menu_items")
    .select("id, is_available")
    .eq("id", id)
    .eq("restaurant_id", restaurantId)
    .single();

  if (fetchError || !current) {
    throw new Error(
      `[menu] Item "${id}" not found in restaurant "${restaurantId}": ` +
        (fetchError?.message ?? "no row returned")
    );
  }

  // Paso 2: escribir el valor invertido con doble filtro por seguridad
  const { data: updated, error: updateError } = await supabase
    .from("menu_items")
    .update({ is_available: !current.is_available })
    .eq("id", id)
    .eq("restaurant_id", restaurantId)
    .select()
    .single();

  if (updateError || !updated) {
    throw new Error(
      `[menu] Failed to toggle item "${id}": ` +
        (updateError?.message ?? "no row returned after update")
    );
  }

  return updated;
}
