# Documentación Técnica — Parte 3: Operaciones, CI/CD, Testing y Deployment

---

## 13. Renderizado y Performance

### 13.1 Estrategia por Aplicación

| App | Puerto Dev | Rendering | Revalidate | Justificación |
|---|---|---|---|---|
| La Carreta | 3010 | SSG + ISR 5s | `revalidate = 5` en `/menu` | Menú cambia frecuentemente (toggle platos) |
| Mar y Tierra | 3020 | SSG + ISR 5s | `revalidate = 5` en `/menu` | Misma razón |
| Delica | 3030 | SSG | Estático | Contenido editorial, cambia poco |
| Chef | 3040 | SSG | Estático | Perfil profesional |
| Admin | 3050 | CSR | No aplica | Datos en tiempo real, todo client-side |

### 13.2 ISR On-Demand

Cuando Nicolás toggle un plato en el admin, el sitio público refleja el cambio en <5s gracias a ISR automático. Opcionalmente, `POST /api/revalidate` permite forzar revalidación inmediata con `revalidatePath()`.

### 13.3 Optimización de Imágenes

**Componente**: `packages/ui/src/image-uploader.tsx`

Pipeline de compresión client-side:
1. Selección del archivo (input o drag & drop)
2. Validación: máximo 5MB en raw, solo JPEG/PNG/WebP
3. Redimensionamiento con Canvas API (`max-width: 1200px`)
4. Conversión a WebP (`quality: 0.7`)
5. Verificación: resultado < 200KB
6. Upload a Supabase Storage → URL pública CDN

### 13.4 Core Web Vitals (Objetivos)

| Métrica | Target | Estrategia |
|---|---|---|
| LCP | < 2.5s | SSG + edge cache + WebP < 200KB |
| FID | < 100ms | Minimal JS en sitios públicos |
| CLS | < 0.1 | Aspect ratios fijos en imágenes |
| Bundle JS | < 150KB gzip | Code splitting + tree shaking |

---

## 14. CI/CD Pipeline

### 14.1 GitHub Actions Workflow

**Archivo**: `.github/workflows/ci.yml`

```
Trigger: push → main, PR → main/develop

Jobs:
  ┌──────────────────┐
  │  quality          │  Lint → Type-check → Build
  │  (ubuntu-latest)  │  timeout: 15min
  └────────┬─────────┘
           │ needs
  ┌────────▼─────────┐
  │  e2e              │  Playwright tests (solo push → main)
  │  (ubuntu-latest)  │  timeout: 20min
  └────────┬─────────┘
           │ needs
  ┌────────▼─────────┐
  │  deploy           │  Trigger Vercel deploy (gatekeeper)
  │  (ubuntu-latest)  │  Solo si E2E pasa
  └────────┬─────────┘
           │ if: failure()
  ┌────────▼─────────┐
  │  notifications    │  Email de fallo
  └──────────────────┘
```

### 14.2 Concurrency

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true  # Cancela runs previos del mismo branch
```

### 14.3 Secrets Requeridos

| Secret | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Build + E2E |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build + E2E |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo E2E (verificación DB) |
| `TURBO_TOKEN` | Cache remoto Turborepo |

---

## 15. E2E Testing

### 15.1 Suite de Tests

**Framework**: Playwright 1.49.1  
**Config**: `playwright.config.ts`

| Test File | Cobertura |
|---|---|
| `reservas.spec.ts` | Flujo completo de reserva en los 3 restaurantes |
| `admin-menu.spec.ts` | Toggle disponibilidad de platos |
| `auth.spec.ts` | Login/logout del panel admin |
| `security.spec.ts` | Rate limiting, HMAC, aislamiento RLS |

### 15.2 Tests de Seguridad Detallados

```typescript
// 1. API sin JWT → 401
test("GET /api/reservations sin JWT debe retornar 401", ...);

// 2. Rate Limit → 429 en la 6ta request
test("Rate Limit: Bloquea la 6ta reserva desde la misma IP", ...);

// 3. Webhook sin HMAC → 401
test("Webhook HMAC: POST sin firma válida debe retornar 401", ...);

// 4. Cross-tenant → 403
test("Multi-tenant: Admin A no puede acceder a datos de Restaurante B", ...);
```

### 15.3 Ejecución

```bash
# Local
npx playwright test

# CI (con browsers instalados)
npx playwright install --with-deps
npm run test
```

---

## 16. Deployment

### 16.1 Vercel — 1 Proyecto por App

| App | Proyecto Vercel | Dominio |
|---|---|---|
| La Carreta | web-la-carreta | lacarreta.co |
| Mar y Tierra | web-mar-y-tierra | marytierrazipa.co |
| Delica | web-delica | delicazipa.co |
| Chef | web-chef | nicolassuarez.co |
| Admin | web-admin | admin.nicolassuarez.co |

### 16.2 Variables de Entorno por Entorno

Cada app requiere sus propias variables en Vercel:

**Todas las apps**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Apps públicas** (la-carreta, mar-y-tierra, delica):
- `SUPABASE_SERVICE_ROLE_KEY`
- `N8N_WEBHOOK_URL`
- `ADMIN_WHATSAPP`
- `ANALYTICS_INTERNAL_TOKEN`
- `REVALIDATION_SECRET`

**Admin**:
- `SUPABASE_SERVICE_ROLE_KEY`
- `N8N_WEBHOOK_SECRET`
- `EDGE_CONFIG` (opcional)

### 16.3 Build Command

Turborepo maneja el build:
```bash
turbo build --filter=web-la-carreta  # Build una app específica
turbo build                          # Build todo el monorepo
```

---

## 17. Paquete @repo/ui — Design System

### 17.1 Componentes Exportados (18 total)

| Componente | Tipo | Archivo | Propósito |
|---|---|---|---|
| `Button` | Atómico | `button.tsx` | Botón multi-brand con variantes |
| `CustomImage` | Atómico | `custom-image.tsx` | Wrapper de imagen con validación |
| `NavBar` | Compuesto | `navbar.tsx` | Navegación responsiva multi-brand |
| `HeroSection` | Compuesto | `hero-section.tsx` | Hero con overlay + CTA |
| `MenuCard` | Compuesto | `menu-card.tsx` | Tarjeta de plato del menú |
| `ReservationForm` | Compuesto | `reservation-form.tsx` | Formulario de reserva |
| `Footer` | Compuesto | `footer.tsx` | Footer multi-restaurante |
| `BottomNav` | Compuesto | `bottom-nav.tsx` | Nav inferior móvil |
| `ImageUploader` | Admin | `image-uploader.tsx` | Upload + compresión WebP |
| `CataCard` | Especializado | `cata-card.tsx` | Tarjeta experiencia Delica |
| `AnalyticsWidget` | Admin | `analytics-widget.tsx` | Widget dashboard |
| `ScrollReveal` | Behavioral | `scroll-reveal.tsx` | Animación intersection observer |
| `LoyaltyTracker` | Behavioral | `LoyaltyTracker.tsx` | Componente fidelización |
| `SectionHeader` | Compuesto | `section-header.tsx` | Header reutilizable |

### 17.2 Hooks Exportados

| Hook | Archivo | Propósito |
|---|---|---|
| `useAnalytics` | `hooks/useAnalytics.ts` | Tracking GA4 custom events |
| `useLoyalty` | `hooks/useLoyalty.ts` | Fidelización pasiva SHA-256 |

### 17.3 Patrones de Uso

```typescript
// En apps públicas
import { NavBar, HeroSection, MenuCard, Footer, ReservationForm } from "@repo/ui";
import { useLoyalty } from "@repo/ui";

// En admin
import { ImageUploader, AnalyticsWidget } from "@repo/ui";
```

---

## 18. Paquete @repo/database — Capa de Datos

### 18.1 Exports y Sub-paths

| Import Path | Archivo | Propósito |
|---|---|---|
| `@repo/database` | `index.ts` | `getPublicSupabase()` + todos los types |
| `@repo/database/server` | `server.ts` | `getServerSupabase()`, `getAdminSupabase()`, `validateSession()`, `getAdminProfile()` |
| `@repo/database/queries/menu` | `queries/menu.ts` | `getMenuByRestaurant()`, `toggleMenuItem()` |
| `@repo/database/queries/reservations` | `queries/reservations.ts` | `createReservation()`, `getReservationsByRestaurant()` |
| `@repo/database/queries/experiences` | `queries/experiences.ts` | `getPublishedExperiences()`, `getExperience()` |
| `@repo/database/queries/admin` | `queries/admin.ts` | `toggleAdminMenuItem()`, `updateAdminReservationStatus()` |
| `@repo/database/helpers/rls` | `helpers/rls.ts` | `assertRestaurantId()`, `assertRestaurantAccess()` |
| `@repo/database/services/notifications` | `services/notifications.ts` | `sendReservationToN8N()`, `validateHMAC()`, `buildWhatsAppMessage()` |
| `@repo/database/config/featureFlags` | `config/featureFlags.ts` | `getFeatureFlag()`, `getFeatureFlags()` |
| `@repo/database/types` | `types.ts` | Todos los tipos TypeScript |

### 18.2 Convenciones

- **Toda query** llama `assertRestaurantId()` como primera línea
- **Toda tabla** tiene `restaurant_id` (excepto `admin_users`)
- **Zero `any`** — tipado estricto end-to-end
- **Type aliases** (no interfaces) para compatibilidad con Supabase generics

---

## 19. Flujos Críticos de Negocio

### CU-001: Cliente Reserva Mesa (< 30s)

```
Google → sitio público → menú → formulario reserva → submit
  → POST /api/reservations → INSERT (pending)
  → n8n webhook → WhatsApp cliente + WhatsApp Nicolás
  → n8n callback → UPDATE (notified)
```

**SLA**: < 30 segundos del submit a la confirmación visual.

### CU-002: Nicolás Desactiva Plato (< 20s)

```
Admin celular → /dashboard/menu → toggle switch
  → PATCH /api/menu/items/[id] → UPDATE is_available
  → ISR revalidate (5s) → sitio público actualizado
```

**SLA**: < 20 segundos, < 3 toques en móvil.

### CU-003: Fidelización Pasiva

```
1ra visita → cookie ns_visitor (1 año) → SHA-256 hash → upsert_loyal_visit
2da visita → cookie detectado → visit_count++ → UI adapta contenido
```

**Privacidad**: NUNCA se almacena nombre, email ni datos personales.

---

## 20. Monitoreo y Observabilidad

### 20.1 Logging

Todos los componentes de servidor usan logging estructurado con prefijos:

| Prefijo | Componente |
|---|---|
| `[analytics]` | API analytics events |
| `[webhook/n8n]` | Webhook n8n |
| `[notifications]` | Servicio notificaciones |
| `[menu]` | Queries de menú |
| `[reservations]` | Queries de reservas |
| `[RLS]` | Helpers de seguridad |
| `[featureFlags]` | Edge Config |
| `[database]` | Env validation |
| `[Auth Callback]` | Auth callback |

### 20.2 Uptime Monitoring

Config: `infrastructure/monitoring/uptime-config.md`
- UptimeRobot monitorea URLs de n8n
- Alertas de "Down" → activar RSK-002

---

## 21. Guía de Desarrollo Local

### Requisitos

- Node.js 18+
- npm 10+
- Cuenta Supabase (proyecto configurado)
- n8n (opcional, para WhatsApp)

### Setup

```bash
# 1. Clonar
git clone https://github.com/[org]/nicolas-suarez-ops.git
cd nicolas-suarez-ops

# 2. Instalar dependencias
npm install

# 3. Configurar env (cada app necesita su .env.local)
cp apps/la-carreta/.env.local.example apps/la-carreta/.env.local
# Editar con credenciales Supabase reales

# 4. Ejecutar SQL schema en Supabase
# Copiar packages/database/src/schema.sql → SQL Editor de Supabase

# 5. Dev server (todas las apps)
npm run dev

# 6. Dev server (una app)
turbo dev --filter=web-la-carreta
```

### Puertos de Desarrollo

| App | Puerto |
|---|---|
| La Carreta | http://localhost:3010 |
| Mar y Tierra | http://localhost:3020 |
| Delica | http://localhost:3030 |
| Chef | http://localhost:3040 |
| Admin | http://localhost:3050 |

### Comandos Útiles

```bash
npm run build        # Build completo monorepo
npm run lint         # Lint todos los packages
npm run type-check   # TypeScript check
npm run test         # E2E tests Playwright
npm run dev          # Dev server todas las apps
```

---

*Documentación generada el 2026-05-19 por auditoría completa del código fuente.*  
*Archivos auditados: 90+ archivos en apps/, packages/, infrastructure/, e2e/, docs/.*
