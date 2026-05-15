/**
 * @repo/database — Feature Flags (Vercel Edge Config)
 *
 * Provides runtime feature flags per restaurant using Vercel Edge Config.
 * Falls back to `true` if Edge Config is unavailable (fail-open for business continuity).
 *
 * context_sad.md: §Edge Config — feature flags por restaurante
 * executive_summary.md: Deploy Vercel — 1 proyecto por app
 *
 * ⚠️ Server-side ONLY. Do not import in client components.
 */

// ─── Flag Definitions ─────────────────────────────────────────

/** Available feature flags for the platform */
export type FeatureFlag =
  | "reservations_enabled"
  | "catas_enabled"
  | "loyalty_enabled";

/** Full flag key format: `{restaurantId}:{flag}` */
type FlagKey = `${string}:${FeatureFlag}`;

/** Shape of the Edge Config store */
type EdgeConfigStore = Partial<Record<FlagKey, boolean>>;

// ─── Edge Config Client ───────────────────────────────────────

/**
 * Lazily loads the Vercel Edge Config client.
 * Returns null if the `@vercel/edge-config` package or
 * EDGE_CONFIG env var is not available.
 */
async function getEdgeConfigClient(): Promise<{
  get: (key: string) => Promise<boolean | undefined>;
} | null> {
  try {
    const edgeConfigUrl = process.env.EDGE_CONFIG;
    if (!edgeConfigUrl) {
      return null;
    }

    // Dynamic import — @vercel/edge-config is an optional peer dependency.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = await (Function('return import("@vercel/edge-config")')() as Promise<{
      createClient: (url: string) => { get: (key: string) => Promise<boolean | undefined> };
    }>);
    return mod.createClient(edgeConfigUrl);
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────

/**
 * Gets the value of a feature flag for a specific restaurant.
 *
 * Resolution order:
 * 1. Edge Config: `{restaurantId}:{flag}` (per-restaurant override)
 * 2. Edge Config: `global:{flag}` (global default)
 * 3. Fallback: `true` (fail-open — features enabled by default)
 *
 * @param flag - The feature flag name
 * @param restaurantId - UUID of the restaurant
 * @returns boolean — whether the feature is enabled
 *
 * @example
 * ```ts
 * const canReserve = await getFeatureFlag("reservations_enabled", restaurantId);
 * if (!canReserve) {
 *   return <div>Las reservas están temporalmente deshabilitadas.</div>;
 * }
 * ```
 */
export async function getFeatureFlag(
  flag: FeatureFlag,
  restaurantId: string
): Promise<boolean> {
  try {
    const client = await getEdgeConfigClient();

    if (!client) {
      // Edge Config not available — fail open
      console.warn(
        `[featureFlags] Edge Config not available. Defaulting "${flag}" to true.`
      );
      return true;
    }

    // Check per-restaurant override first
    const restaurantKey: FlagKey = `${restaurantId}:${flag}`;
    const restaurantValue = await client.get(restaurantKey);
    if (typeof restaurantValue === "boolean") {
      return restaurantValue;
    }

    // Fall back to global flag
    const globalKey: FlagKey = `global:${flag}`;
    const globalValue = await client.get(globalKey);
    if (typeof globalValue === "boolean") {
      return globalValue;
    }

    // Ultimate fallback: enabled
    return true;
  } catch (error) {
    console.error(
      `[featureFlags] Error reading flag "${flag}":`,
      error instanceof Error ? error.message : error
    );
    // Fail open — never block business operations due to config errors
    return true;
  }
}

/**
 * Gets multiple feature flags at once for a restaurant.
 *
 * @param flags - Array of flag names
 * @param restaurantId - UUID of the restaurant
 * @returns Record of flag → boolean
 */
export async function getFeatureFlags(
  flags: FeatureFlag[],
  restaurantId: string
): Promise<Record<FeatureFlag, boolean>> {
  const results = await Promise.all(
    flags.map(async (flag) => {
      const value = await getFeatureFlag(flag, restaurantId);
      return [flag, value] as const;
    })
  );

  return Object.fromEntries(results) as Record<FeatureFlag, boolean>;
}
