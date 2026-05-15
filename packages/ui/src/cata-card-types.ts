/**
 * @repo/ui — Shared types for CataCard
 * Mirrors the Supabase `experiences` table shape.
 * Kept separate so both CataCard and callers can import just the type.
 */

export interface Experience {
  id: string;
  restaurant_id: string;
  title: string;
  description: string | null;
  date: string;          // ISO date string: "2026-06-15"
  price: number;
  capacity: number;      // total seats
  booked: number;        // confirmed reservations
  /** Re-used for tag labels shown on the card (e.g. wine pairings, regions) */
  photos: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
