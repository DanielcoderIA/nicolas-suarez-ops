# Variables de Entorno en Producción

> Lista maestra de variables necesarias para el despliegue en Vercel. Cada una de las 5 aplicaciones del ecosistema requiere estas configuraciones.

## 🔑 Variables Comunes (Mismas en todas las apps)

| Variable | Descripción | Valor sugerido / Fuente |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | Dashboard de Supabase -> Settings -> API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Llave pública anónima | Dashboard de Supabase -> Settings -> API |
| `SUPABASE_SERVICE_ROLE_KEY` | Llave secreta (Server-side ONLY) | Dashboard de Supabase -> Settings -> API |
| `ANALYTICS_INTERNAL_TOKEN` | Token para asegurar /api/analytics | Generar UUID aleatorio |
| `REVALIDATION_SECRET` | Token para asegurar /api/revalidate | Generar UUID aleatorio |
| `N8N_WEBHOOK_SECRET` | Secreto para validar firma HMAC | Coincidir con el header `x-n8n-signature` |

## 🛰️ Variables por Aplicación

### Apps Públicas (La Carreta, Mar y Tierra, Delica)
| Variable | Descripción | Nota |
|---|---|---|
| `N8N_WEBHOOK_URL` | URL del workflow de n8n | Específico por restaurante o común con selector |
| `NEXT_PUBLIC_GA4_ID` | ID de Google Analytics 4 | Una propiedad de GA4 distinta por restaurante |
| `NOTIFICATION_PROVIDER` | `n8n` o `twilio` | Controla el flujo de notificaciones (Default: `n8n`) |

### Apps Admin y Perfil
| Variable | Descripción | Nota |
|---|---|---|
| `ADMIN_MAGIC_LINK_URL` | URL base para redirección de Auth | `https://admin.nicolassuarez.co` |

---

## 🏗️ Configuración en Vercel

1. Ir a **Settings** -> **Environment Variables**.
2. Añadir las variables listadas arriba.
3. Asegurarse de marcar `Production`, `Preview` y `Development` según corresponda.
4. **IMPORTANTE**: No compartir `SUPABASE_SERVICE_ROLE_KEY` ni `N8N_WEBHOOK_SECRET` en el lado del cliente (sin prefijo `NEXT_PUBLIC_`).
