/**
 * @repo/database — RLS Enforcement Helpers
 * Zero-Trust Multi-Tenancy: every query MUST include restaurant_id.
 *
 * These helpers ensure:
 * 1. Every query is scoped to a specific restaurant_id (UUID)
 * 2. Admin users can only access their assigned restaurants
 * 3. No data leaks between tenants, even if RLS has a gap
 *
 * Defense-in-depth: RLS in PostgreSQL + application-level filtering here.
 */

import type { AdminUser } from "../types";

/**
 * Validates that a UUID string has the correct format.
 * Prevents injection of malformed IDs.
 */
export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id
  );
}

/**
 * Validates restaurant_id format. Throws if invalid.
 * Use at every API boundary before querying.
 *
 * @throws {Error} if the restaurant ID is not a valid UUID
 */
export function assertRestaurantId(
  restaurantId: string | undefined | null
): asserts restaurantId is string {
  if (!restaurantId || !isValidUUID(restaurantId)) {
    throw new Error(
      `[RLS] Invalid restaurant_id: "${restaurantId ?? "undefined"}". Must be a valid UUID.`
    );
  }
}

/**
 * Checks whether an admin user has access to a specific restaurant.
 * Superadmins (restaurants = null) have access to all restaurants.
 *
 * @param admin - The admin user profile
 * @param restaurantId - The restaurant UUID to check access for
 * @returns true if the admin has access, false otherwise
 */
export function hasRestaurantAccess(
  admin: AdminUser,
  restaurantId: string
): boolean {
  // Superadmin: null restaurants array means unrestricted access
  if (admin.restaurants === null) {
    return true;
  }

  return admin.restaurants.includes(restaurantId);
}

/**
 * Asserts that an admin user has access to a restaurant.
 * Use in API Routes before any mutation.
 *
 * @throws {Error} with 403-style message if access denied
 */
export function assertRestaurantAccess(
  admin: AdminUser,
  restaurantId: string
): void {
  assertRestaurantId(restaurantId);

  if (!hasRestaurantAccess(admin, restaurantId)) {
    throw new Error(
      `[RLS] Admin "${admin.email}" (role: ${admin.role}) does not have access to restaurant "${restaurantId}". ` +
        `Assigned restaurants: [${(admin.restaurants ?? []).join(", ")}]`
    );
  }
}

/**
 * Returns the list of restaurant IDs an admin can access.
 * Superadmins get an empty array (meaning: don't filter, return all).
 * Regular admins get their assigned restaurant UUIDs.
 *
 * Use this to build multi-tenant queries:
 * - Empty array = no restaurant_id filter (superadmin)
 * - Non-empty = filter by `restaurant_id IN (...)`
 */
export function getAccessibleRestaurants(admin: AdminUser): string[] {
  // Superadmin: null means all restaurants → return empty to signal "no filter"
  if (admin.restaurants === null) {
    return [];
  }

  return admin.restaurants;
}

/**
 * Determines if the admin is a superadmin with unrestricted access.
 */
export function isSuperAdmin(admin: AdminUser): boolean {
  return admin.role === "superadmin" && admin.restaurants === null;
}
