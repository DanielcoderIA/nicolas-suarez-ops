import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

/**
 * E2E: Flujo de Reserva Completo
 * 
 * Verifica que un cliente puede:
 * 1. Navegar a la página de reservas
 * 2. Llenar y enviar el formulario
 * 3. Recibir confirmación visual
 * 4. Que los datos persistan correctamente en Supabase
 */

// Initialize Supabase admin client for verification
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const RESTAURANTS = [
  { name: "La Carreta", id: "11111111-1111-1111-1111-111111111111" },
  { name: "Mar y Tierra", id: "22222222-2222-2222-2222-222222222222" },
  { name: "Delica", id: "33333333-3333-3333-3333-333333333333" },
];

RESTAURANTS.forEach((restaurant) => {
  test.describe(`Reservas en ${restaurant.name}`, () => {
    test("Debe completar una reserva exitosamente", async ({ page }) => {
      const testName = `E2E Test ${Math.random().toString(36).substring(7)}`;
      const testPhone = "3001234567";
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split("T")[0];

      // 1. Navegar a /reservas
      await page.goto("/reservas");

      // 2. Llenar el formulario
      await page.fill('input[name="client_name"]', testName);
      await page.fill('input[name="whatsapp"]', testPhone);
      await page.fill('input[name="date"]', dateString);
      await page.selectOption('select[name="time"]', "19:00");
      await page.selectOption('select[name="guests"]', "2");
      await page.fill('textarea[name="notes"]', "Mesa cerca de la ventana - E2E Test");

      // 3. Enviar formulario
      await page.click('button[type="submit"]');

      // 4. Verificar mensaje de confirmación visible
      // Buscamos texto que indique éxito (según context_prd.md)
      await expect(page.locator("text=¡Reserva enviada!")).toBeVisible({ timeout: 10000 });
      await expect(page.locator("text=WhatsApp")).toBeVisible();

      // 5. Verificar en Supabase que reserva existe
      if (supabaseUrl && supabaseServiceKey) {
        const { data, error } = await supabase
          .from("reservations")
          .select("*")
          .eq("client_name", testName)
          .eq("restaurant_id", restaurant.id)
          .single();

        expect(error).toBeNull();
        expect(data).not.toBeNull();
        expect(data.whatsapp).toBe(testPhone);
        expect(data.status).toMatch(/pending|notified/);
        
        // Cleanup: Delete the test reservation
        await supabase.from("reservations").delete().eq("id", data.id);
      } else {
        console.warn("Supabase env vars missing, skipping DB verification.");
      }
    });
  });
});
