# CleanFlow-AI

Plataforma de gestión para negocios de limpieza: clientes, cuadrillas, agenda de trabajos y pagos, con optimización de rutas asistida por IA.

Este proyecto es independiente de MEMORA-Birthday-Magazine — no comparte código ni base de datos.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres, Auth, Row Level Security)

## Setup

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un proyecto en [supabase.com](https://supabase.com) y copia `.env.example` a `.env.local`, completando:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (solo para tareas de servidor/admin, nunca exponerla al cliente)
3. Aplica el esquema inicial (`supabase/migrations/0001_init.sql`) a tu proyecto de Supabase, vía el SQL Editor del dashboard o el Supabase CLI:
   ```bash
   supabase db push
   ```
4. Corre el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Dónde viven las cosas

- `app/` — páginas (App Router): dashboard, clientes, cuadrillas, agenda, pagos.
- `app/api/optimize-route` — endpoint que ordena las paradas de una cuadrilla para un día dado (heurística de vecino más cercano sobre latitud/longitud). Placeholder para un solver real (OR-Tools, una API de ruteo, o un planificador asistido por LLM) cuando el volumen lo justifique.
- `lib/supabase/` — clientes de Supabase para navegador (`client.ts`), Server Components (`server.ts`) y middleware de sesión (`middleware.ts`).
- `lib/types.ts` — tipos de dominio (Client, Crew, Job, Payment) y el tipo `Database` para el cliente tipado de Supabase.
- `supabase/migrations/` — esquema SQL versionado.

## Estado actual

Scaffold inicial: CRUD de lectura sobre clientes/cuadrillas/trabajos/pagos y el optimizador de rutas heurístico. Pendiente: formularios de alta/edición, autenticación de usuarios, e integración de un optimizador de rutas más sofisticado.
