/**
 * @repo/database — Notification Services
 * Handles webhook dispatch to n8n and HMAC validation.
 *
 * api_specification.md: §Webhooks — HMAC-SHA256, x-n8n-signature header
 * executive_summary.md: WhatsApp push instantáneo por nueva reserva
 *
 * ⚠️ Server-side ONLY. NEVER import in client components.
 */

import { createHmac, timingSafeEqual } from "crypto";
import type { Reservation, RestaurantSlug } from "../types";

// ─── Types ────────────────────────────────────────────────────

/** Payload sent FROM our API TO n8n to trigger WhatsApp messages. */
export interface N8NReservationPayload {
  reservationId: string;
  restaurantName: string;
  restaurantSlug: RestaurantSlug;
  clientName: string;
  clientWhatsapp: string;
  date: string;
  time: string;
  guests: number;
  notes: string | null;
  confirmationUrl: string;
  adminWhatsapp: string;
}

/** Payload sent FROM n8n BACK TO our webhook as a callback. */
export interface N8NCallbackPayload {
  reservationId: string;
  whatsappSent: boolean;
  adminNotified: boolean;
  timestamp: string;
  workflow: string;
}

// ─── Restaurant Metadata ──────────────────────────────────────

interface RestaurantMeta {
  name: string;
  slug: RestaurantSlug;
  domain: string;
  address: string;
}

const RESTAURANT_META: Record<string, RestaurantMeta> = {
  "11111111-1111-1111-1111-111111111111": {
    name: "La Carreta",
    slug: "la-carreta",
    domain: "lacarreta.co",
    address: "Zipaquirá, Cundinamarca",
  },
  "22222222-2222-2222-2222-222222222222": {
    name: "Mar y Tierra Zipa",
    slug: "mar-y-tierra",
    domain: "marytierrazipa.co",
    address: "Zipaquirá, Cundinamarca",
  },
  "33333333-3333-3333-3333-333333333333": {
    name: "Delica",
    slug: "delica",
    domain: "delicazipa.co",
    address: "Zipaquirá, Cundinamarca",
  },
};

// ─── HMAC Validation ──────────────────────────────────────────

/**
 * Validates an HMAC-SHA256 signature from n8n.
 *
 * Uses timing-safe comparison to prevent timing attacks.
 * The signature header format is: `sha256=<hex>`
 *
 * @param rawBody - The raw request body as string
 * @param signature - The `x-n8n-signature` header value
 * @param secret - The N8N_WEBHOOK_SECRET env variable
 * @returns true if signature is valid
 */
export function validateHMAC(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) return false;

  const expected = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;

  // Both strings must have the same byte length for timingSafeEqual
  if (signature.length !== expected.length) return false;

  try {
    return timingSafeEqual(
      Buffer.from(signature, "utf8"),
      Buffer.from(expected, "utf8")
    );
  } catch {
    return false;
  }
}

// ─── WhatsApp Message Builder ─────────────────────────────────

/**
 * Builds a human-readable WhatsApp confirmation message in Spanish.
 *
 * @param reservation - The reservation data
 * @param restaurantId - UUID of the restaurant
 * @returns Formatted message string
 */
export function buildWhatsAppMessage(
  reservation: Reservation,
  restaurantId: string
): string {
  const meta = RESTAURANT_META[restaurantId];
  const restaurantName = meta?.name ?? "Restaurante";
  const address = meta?.address ?? "Zipaquirá";

  // Format date to readable Spanish
  const dateObj = new Date(`${reservation.date}T12:00:00`);
  const formattedDate = dateObj.toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Convert 24h time to 12h with AM/PM
  const [hours, minutes] = reservation.time.split(":");
  const h = parseInt(hours ?? "0", 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  const formattedTime = `${h12}:${minutes} ${ampm}`;

  return [
    `✅ *Reserva Confirmada — ${restaurantName}*`,
    ``,
    `👤 *Nombre:* ${reservation.client_name}`,
    `📅 *Fecha:* ${formattedDate}`,
    `🕐 *Hora:* ${formattedTime}`,
    `👥 *Personas:* ${reservation.guests}`,
    reservation.notes ? `📝 *Notas:* ${reservation.notes}` : null,
    ``,
    `📍 *Dirección:* ${address}`,
    ``,
    `¡Te esperamos! 🍽️`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

// ─── n8n Webhook Dispatcher ───────────────────────────────────

/**
 * Sends a reservation to n8n to trigger the WhatsApp notification workflow.
 *
 * The function is fire-and-forget with a 10s timeout. If n8n doesn't respond,
 * the reservation stays as `pending` and n8n handles retry polling.
 *
 * @param reservation - The newly created reservation
 * @param n8nWebhookUrl - The n8n webhook URL from env
 * @param adminWhatsapp - Nicolás's WhatsApp number
 * @returns true if n8n acknowledged, false if timeout/error
 */
export async function sendReservationToN8N(
  reservation: Reservation,
  n8nWebhookUrl: string,
  adminWhatsapp: string
): Promise<boolean> {
  const meta = RESTAURANT_META[reservation.restaurant_id];

  if (!meta) {
    console.error(
      `[notifications] Unknown restaurant_id: ${reservation.restaurant_id}`
    );
    return false;
  }

  const payload: N8NReservationPayload = {
    reservationId: reservation.id,
    restaurantName: meta.name,
    restaurantSlug: meta.slug,
    clientName: reservation.client_name,
    clientWhatsapp: reservation.whatsapp,
    date: new Date(`${reservation.date}T12:00:00`).toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: reservation.time,
    guests: reservation.guests,
    notes: reservation.notes,
    confirmationUrl: `https://${meta.domain}/reservas/${reservation.id}`,
    adminWhatsapp,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(
        `[notifications] n8n returned ${response.status}: ${await response.text()}`
      );
      return false;
    }

    console.log(
      `[notifications] ✅ Reservation ${reservation.id} sent to n8n successfully`
    );
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.warn(
        `[notifications] ⏱️ n8n timeout for reservation ${reservation.id} — will remain pending`
      );
    } else {
      console.error(
        `[notifications] ❌ Failed to reach n8n:`,
        error instanceof Error ? error.message : error
      );
    }
    return false;
  }
}
