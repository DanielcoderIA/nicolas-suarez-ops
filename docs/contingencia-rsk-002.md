# Protocolo de Contingencia RSK-002: Fallo de n8n

> Este protocolo debe activarse si el servicio n8n deja de funcionar y las notificaciones de reserva no llegan a Nicolás ni a los clientes.

## 🚨 Detección del Fallo
- El monitor de **UptimeRobot** envía alerta de "Down" para las URLs de n8n.
- Nicolás nota que no recibe alertas de WhatsApp por nuevas reservas.
- Las reservas en la base de datos se quedan en estado `pending` por más de 5 minutos.

## 🛠️ Activación del Fallback (Twilio)

Para cambiar el sistema de notificaciones a Twilio **sin tocar el código**, sigue estos pasos:

### 1. Preparar credenciales de Twilio
Asegúrate de tener acceso a:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM` (ej: `whatsapp:+14155238886`)

### 2. Cambiar Proveedor en Vercel
1. Ingresa al Dashboard de Vercel para las apps públicas (`la-carreta`, `mar-y-tierra`, `delica`).
2. Ve a **Settings** -> **Environment Variables**.
3. Busca la variable `NOTIFICATION_PROVIDER`.
4. Cambia su valor de `n8n` a `twilio`.
5. **Re-deploy**: Ve a la pestaña **Deployments**, selecciona el último y elige **Redeploy** (esto aplica el cambio de variable de entorno inmediatamente).

### 3. Verificar Funcionamiento
1. Realiza una reserva de prueba en cualquiera de los sitios.
2. Confirma que recibes el mensaje de WhatsApp (esta vez enviado vía Twilio).

## 🔙 Retorno a la Normalidad (n8n operativo)

Una vez que n8n esté arriba:
1. Cambia `NOTIFICATION_PROVIDER` de nuevo a `n8n` en Vercel.
2. Ejecuta un **Redeploy**.
3. Procesa manualmente las reservas que hayan quedado "atrapadas" si es necesario.

## 📋 Variables de Entorno Necesarias para Twilio
Si no están configuradas, añádelas en Vercel:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `ADMIN_WHATSAPP` (El número de Nicolás en formato E.164, ej: `+57300...`)
