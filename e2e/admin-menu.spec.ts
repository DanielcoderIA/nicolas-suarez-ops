import { test, expect } from "@playwright/test";

/**
 * E2E: Admin Menu Toggle & Revalidation
 * 
 * Verifica que:
 * 1. El admin puede loguearse (mock)
 * 2. Puede desactivar un plato
 * 3. El cambio se refleja en el sitio público en < 5s (ISR/On-demand)
 */

test.describe("Gestión de Menú y Revalidación", () => {
  test("Debe desactivar un plato y reflejarlo en el sitio público", async ({ browser }) => {
    // 1. Setup Admin Context
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    
    // Mock Magic Link Auth: Seteamos cookies directamente para saltar el email
    await adminContext.addCookies([
      { name: "sb-access-token", value: "mock-admin-token", domain: "localhost", path: "/", httpOnly: true, secure: false },
    ]);

    await adminPage.goto("http://localhost:3050/dashboard/menu");
    
    // Filtramos por un restaurante específico (La Carreta)
    await adminPage.selectOption('select', "11111111-1111-1111-1111-111111111111");
    
    // Buscamos el primer plato disponible
    const firstItem = adminPage.locator('div:has-text("● Disponible")').first();
    const itemName = await firstItem.locator('h3').textContent();
    const toggleButton = firstItem.locator('button:has-text("Marcar Agotado")');

    // 2. Acción: Desactivar plato
    await toggleButton.click();
    
    // Verificar feedback visual inmediato (Optimistic UI)
    await expect(firstItem.locator('text=○ Agotado')).toBeVisible();

    // 3. Verificación en Sitio Público (La Carreta)
    const publicContext = await browser.newContext();
    const publicPage = await publicContext.newPage();
    
    await publicPage.goto("http://localhost:3010/menu");

    // Según ISR revalidate: 5 y On-demand revalidation, debería desaparecer casi de inmediato
    // Reintentamos durante 5 segundos
    await expect(async () => {
      // Recargamos para forzar ver el cambio si es necesario o confiamos en el endpoint /api/revalidate
      // El test de revalidación on-demand es crítico
      const itemInPublic = publicPage.locator(`text=${itemName}`);
      await expect(itemInPublic).not.toBeVisible();
    }).toPass({ timeout: 6000 });

    // Cleanup: Restaurar plato
    await toggleButton.click();
    await expect(firstItem.locator('text=● Disponible')).toBeVisible();
  });
});
