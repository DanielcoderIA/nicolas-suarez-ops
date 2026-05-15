# Checklist de Lanzamiento — Sistema de Operación Digital

> Este documento consolida las validaciones críticas antes de pasar a producción.

## 🚀 Rendimiento (KPIs Core Web Vitals)
- [ ] **LCP (Largest Contentful Paint)**: < 2.5s en todos los sitios públicos.
- [ ] **CLS (Cumulative Layout Shift)**: < 0.1 para evitar saltos visuales.
- [ ] **FID (First Input Delay)**: < 100ms para interactividad inmediata.
- [ ] **TTFB (Time to First Byte)**: < 200ms mediante uso intensivo de ISR.
- [ ] **JS Bundle Size**: < 150KB gzip por página para carga rápida en móviles.

## 🔒 Seguridad y Privacidad
- [ ] **RLS (Row Level Security)**: Activo en Supabase. Las tablas `analytics_events` y `loyal_visits` no permiten lectura pública.
- [ ] **Rate Limiting**: Activo en `POST /api/reservations` (Máx 5/hora por IP).
- [ ] **HMAC Validation**: Webhooks de n8n validados mediante firma secreta.
- [ ] **Zero PII**: No se guardan nombres, emails ni teléfonos en analítica ni fidelización pasiva.

## 🧪 Funcionalidad (E2E)
- [ ] **Flujo de Reserva**: Verificado en La Carreta, Mar y Tierra y Delica.
- [ ] **Notificaciones**: El webhook a n8n dispara el WhatsApp de confirmación correctamente.
- [ ] **Admin Panel**: Toggle de disponibilidad de menú funciona y revalida el sitio público en < 5s.
- [ ] **Mobile UX**: Flujo de reserva completable en < 3 toques/30 segundos.

## 📈 SEO y Analytics
- [ ] **Schema.org**: JSON-LD de tipo `Restaurant` válido en todas las homes.
- [ ] **Sitemaps**: Generados dinámicamente y enviados a Google Search Console.
- [ ] **GA4 Events**: Registro correcto de `page_view`, `menu_view` y `reservation_complete`.

## 🛠️ Operación y Contingencia
- [ ] **Monitoreo**: UptimeRobot configurado para alertar caídas en < 2 min.
- [ ] **Contingencia RSK-002**: Documentada y lista para activar Twilio si n8n falla.
- [ ] **Admin Mobile**: Gestión de menú optimizada para uso desde celular por Nicolás.

---
*Actualizado: Mayo 2025*
