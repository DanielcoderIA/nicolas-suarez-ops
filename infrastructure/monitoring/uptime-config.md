# Monitoreo de Uptime — Sistema de Operación Digital

> Configuración de monitoreo para las 5 aplicaciones del ecosistema Nicolás Suárez.

---

## UptimeRobot — Configuración

### URLs a Monitorear

| # | URL | Tipo | Intervalo | Alerta |
|---|---|---|---|---|
| 1 | `https://lacarreta.co` | HTTP(S) | 2 min | Email + WhatsApp |
| 2 | `https://marytierrazipa.co` | HTTP(S) | 2 min | Email + WhatsApp |
| 3 | `https://delicazipa.co` | HTTP(S) | 2 min | Email + WhatsApp |
| 4 | `https://nicolassuarez.co` | HTTP(S) | 2 min | Email |
| 5 | `https://admin.nicolassuarez.co` | HTTP(S) | 2 min | Email + WhatsApp |
| 6 | `https://lacarreta.co/api/webhooks/n8n` | Keyword "error" (ausencia) | 5 min | Email |
| 7 | `https://marytierrazipa.co/api/webhooks/n8n` | Keyword "error" (ausencia) | 5 min | Email |
| 8 | `https://delicazipa.co/api/webhooks/n8n` | Keyword "error" (ausencia) | 5 min | Email |

### Configuración de Alertas

```
Contacto: nicolas@nicolassuarez.co
Tipo: Email (primario) + Webhook a n8n (secundario)
Umbral: 2 fallos consecutivos antes de alertar
Intervalo: Cada 2 minutos
```

### Pasos de Configuración en UptimeRobot

1. Ir a [https://uptimerobot.com](https://uptimerobot.com) → Crear cuenta gratuita
2. **Add New Monitor** → Seleccionar tipo `HTTP(S)`
3. Ingresar URL, nombre descriptivo (ej: "La Carreta - Producción")
4. Establecer intervalo a **2 minutos**
5. Configurar contacto de alerta → Email del admin
6. Repetir para cada URL de la tabla anterior

---

## Contingencia RSK-002: Fallo de n8n

### Detección

Si el monitor de n8n detecta fallo (las URLs `/api/webhooks/n8n` devuelven error):

1. UptimeRobot envía alerta a Nicolas
2. n8n no puede enviar mensajes de WhatsApp
3. Las reservas siguen creándose pero quedan en `status: pending`

### Activación de Twilio como Respaldo

**Prerrequisito:** Tener cuenta Twilio con número verificado para WhatsApp.

#### Paso 1: Variables de entorno (ya configuradas en .env.local)
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
ADMIN_WHATSAPP=+573009999999
```

#### Paso 2: Activar modo Twilio
En cada app pública, cambiar temporalmente la función de notificación:

```typescript
// En el flujo de POST /api/reservations, reemplazar:
// await sendReservationToN8N(reservation, n8nUrl, adminWhatsapp);
// Por:
await sendReservationViaTwilio(reservation, adminWhatsapp);
```

#### Paso 3: Implementación Twilio de emergencia

```typescript
import twilio from "twilio";

async function sendReservationViaTwilio(
  reservation: Reservation,
  adminWhatsapp: string
): Promise<boolean> {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );

  const message = buildWhatsAppMessage(reservation, reservation.restaurant_id);

  try {
    // Enviar al cliente
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM!,
      to: `whatsapp:${reservation.whatsapp}`,
      body: message,
    });

    // Enviar a Nicolás
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM!,
      to: `whatsapp:${adminWhatsapp}`,
      body: `🔔 Nueva reserva:\n${message}`,
    });

    return true;
  } catch (error) {
    console.error("[twilio-fallback] Error:", error);
    return false;
  }
}
```

#### Paso 4: Restablecer n8n

Una vez n8n vuelva a funcionar:
1. Verificar que el monitor de UptimeRobot marque UP
2. Revertir el código al flujo normal con `sendReservationToN8N()`
3. Procesar reservas `pending` que hayan quedado sin notificar:
   ```sql
   SELECT * FROM reservations 
   WHERE status = 'pending' 
   AND created_at > now() - interval '24 hours';
   ```

---

## Dashboard de Status

Para verificar el estado en tiempo real:

| Servicio | URL de verificación |
|---|---|
| Vercel (deploy) | `https://vercel.com/dashboard` |
| Supabase (DB) | `https://supabase.com/dashboard` |
| n8n (automación) | URL del n8n self-hosted |
| UptimeRobot | `https://stats.uptimerobot.com/` |

---

## Checklist Post-Incidente

- [ ] Identificar causa raíz
- [ ] Verificar que todas las reservas pendientes fueron notificadas
- [ ] Revisar logs de errores en Vercel
- [ ] Actualizar runbook si es necesario
- [ ] Comunicar resolución a Nicolás
