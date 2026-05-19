# 📘 DOCUMENTATION — Sistema de Operación Digital

**Nicolás Suárez · Zipaquirá, Cundinamarca**  
**Versión**: 0.1.0 · **Stack**: Next.js 16 · TypeScript 5.9 · Supabase · Turborepo  
**Generada**: 2026-05-19

---

## Archivos de Documentación

Esta documentación técnica está organizada en 3 archivos por tema:

### [📐 Parte 1 — Visión General, Arquitectura y Base de Datos](./DOCUMENTATION_01_overview.md)
1. Visión General del Proyecto
2. Arquitectura General (diagrama + flujo de datos)
3. Stack Tecnológico completo
4. Estructura del Proyecto (árbol con 90+ archivos)
5. Esquema de Base de Datos (7 tablas + RLS + funciones RPC + seeds)

### [🔐 Parte 2 — APIs, Seguridad e Integraciones](./DOCUMENTATION_02_apis.md)
6. Referencia de API (públicas + protegidas)
7. Autenticación y Seguridad (3 capas multi-tenant)
8. Integración n8n / WhatsApp (flujo completo)
9. Sistema de Fidelización Pasiva (SHA-256, zero-PII)
10. Feature Flags (Vercel Edge Config)
11. Analítica (custom events GA4)
12. Notificaciones Realtime (Supabase postgres_changes)

### [🚀 Parte 3 — Operaciones, CI/CD, Testing y Deployment](./DOCUMENTATION_03_ops.md)
13. Renderizado y Performance (ISR, WebP, Core Web Vitals)
14. CI/CD Pipeline (GitHub Actions: 4 jobs)
15. E2E Testing (Playwright: 4 suites)
16. Deployment (Vercel: 5 proyectos)
17. Paquete @repo/ui — Design System (18 componentes + 2 hooks)
18. Paquete @repo/database — Capa de Datos (queries + services)
19. Flujos Críticos de Negocio (CU-001, CU-002, CU-003)
20. Monitoreo y Observabilidad
21. Guía de Desarrollo Local

---

## Documentación Complementaria

| Archivo | Propósito |
|---|---|
| [contingencia-rsk-002.md](./contingencia-rsk-002.md) | Runbook: fallback n8n → Twilio |
| [env-production.md](./env-production.md) | Variables de entorno para producción |
| [launch-checklist.md](./launch-checklist.md) | Checklist pre-lanzamiento |

---

> **Nota**: Esta documentación fue derivada exclusivamente del código fuente existente. Ninguna funcionalidad fue inventada o asumida.
