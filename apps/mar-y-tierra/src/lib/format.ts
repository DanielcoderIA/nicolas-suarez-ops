/**
 * Shared formatting utilities for Mar y Tierra.
 */

/** Format a number as Colombian Pesos (COP) without decimals. */
export function formatCOP(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}
