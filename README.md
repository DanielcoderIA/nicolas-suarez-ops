# Sistema de Operación Digital — Nicolás Suárez · Zipaquirá

Plataforma unificada para la gestión de 3 restaurantes en Zipaquirá, diseñada para operar de forma autónoma mientras Nicolás Suárez (Chef y Gerente) está en cocina.

## 🏗️ Arquitectura del Ecosistema

El proyecto es un **Monorepo gestionado con Turborepo** que contiene 5 aplicaciones Next.js 14 (App Router) y paquetes compartidos:

### Aplicaciones (Apps)
- **La Carreta (`/apps/la-carreta`)**: Cocina tradicional. [lacarreta.co](https://lacarreta.co)
- **Mar y Tierra (`/apps/mar-y-tierra`)**: Restaurante diferenciado. [marytierrazipa.co](https://marytierrazipa.co)
- **Delica (`/apps/delica`)**: Experiencias y catas. [delicazipa.co](https://delicazipa.co)
- **Perfil Chef (`/apps/chef`)**: Marca personal. [nicolassuarez.co](https://nicolassuarez.co)
- **Admin Panel (`/apps/admin`)**: Gestión centralizada. [admin.nicolassuarez.co](https://admin.nicolassuarez.co)

### Stack Tecnológico
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS.
- **Backend/DB**: Supabase (PostgreSQL + Auth + Storage + Realtime).
- **Automación**: n8n (Railway/Render) + WhatsApp Business API.
- **Testing**: Playwright (E2E) + Lighthouse (Performance).
- **Infraestructura**: Vercel (Deploy) + UptimeRobot (Monitoreo).

---

## 🚀 Guía de Inicio Rápido

### Requisitos
- Node.js >= 18
- Cuenta en Supabase
- Cuenta en Vercel

### Instalación Local
```bash
# 1. Clonar el repositorio
git clone <url-del-repo>

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Copia el ejemplo de env en cada app
cp apps/admin/.env.local.example apps/admin/.env.local

# 4. Correr en modo desarrollo
npm run dev
```

### Ejecución de Tests
```bash
# Correr tests E2E
npm run test

# Correr auditoría de performance
npx ts-node scripts/lighthouse-check.ts
```

---

## 🚢 Despliegue a Producción

El despliegue está automatizado mediante **GitHub Actions**. Al hacer merge a la rama `main`:
1. Se ejecutan los tests de calidad (Lint, Type-check, Build).
2. Se ejecutan los tests E2E de Playwright.
3. Si todo pasa, Vercel realiza el despliegue automático de las 5 aplicaciones.

Para configurar nuevas variables de entorno, consulta [docs/env-production.md](docs/env-production.md).

---

## 🛡️ Protocolos de Emergencia
En caso de fallo en el sistema de notificaciones n8n, consulta el **Runbook de Contingencia RSK-002** en [docs/contingencia-rsk-002.md](docs/contingencia-rsk-002.md) para activar el fallback de Twilio.

---
© 2025 Nicolás Suárez · Zipaquirá, Colombia.
