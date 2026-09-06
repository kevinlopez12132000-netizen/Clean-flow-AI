# CleanFlow-AI

Plataforma de gestión para negocios de limpieza: clientes, cuadrillas, agenda de trabajos y pagos, con optimización de rutas asistida por IA.

Este proyecto es independiente de MEMORA-Birthday-Magazine — no comparte código ni base de datos.

## Stack

- Next.js (App Router) + TypeScript + React Server Actions
- Tailwind CSS
- Supabase (Postgres, Auth, Row Level Security) — estructura multiempresa (multi-tenant)

## Setup

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un proyecto en [supabase.com](https://supabase.com) y copia `.env.example` a `.env.local`, completando:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (solo para tareas de servidor/admin, nunca exponerla al cliente)
   - `NEXT_PUBLIC_SITE_URL` (opcional; si no se define, los enlaces de correo de Supabase usan el host de la petición)
3. Aplica el esquema, en orden, a tu proyecto de Supabase (SQL Editor del dashboard o Supabase CLI):
   ```bash
   supabase db push
   ```
   - `supabase/migrations/0001_init.sql` — tablas base: `clients`, `crews`, `jobs`, `payments`.
   - `supabase/migrations/0002_multi_tenant.sql` — `businesses`, `business_members` y RLS por negocio (ver más abajo). Asume que las tablas de `0001` siguen vacías.
4. En el dashboard de Supabase, habilita la confirmación de correo (Authentication → Providers → Email) y define la plantilla/redirect de "Reset password" y "Confirm signup" para que apunten a `/auth/confirm` de este proyecto (la app ya construye esa URL).
5. Corre el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Autenticación y multiempresa

- **Auth**: registro, inicio/cierre de sesión y recuperación de contraseña con Supabase Auth (`app/(auth)/`). Los enlaces de confirmación de correo y recuperación de contraseña se resuelven en `app/auth/confirm/route.ts`.
- **Protección de rutas**: `middleware.ts` (vía `lib/supabase/middleware.ts`) redirige a `/login` si no hay sesión, y a `/onboarding` si el usuario no pertenece a ningún negocio. Cada página protegida además llama a `lib/business.ts#requireBusiness()` como segunda capa (defensa en profundidad), y todas las consultas filtran explícitamente por `business_id`.
- **Multiempresa**: `businesses` guarda los datos del negocio (nombre, teléfono, ciudad, zona de servicio, tipo de limpieza) y `business_members` la membresía usuario↔negocio (rol `owner`/`member`). `clients`, `crews`, `jobs` y `payments` referencian `business_id`.
- **RLS es la barrera real, no el filtro del frontend**: cada tabla tiene Row Level Security habilitado; las políticas usan la función `is_business_member(business_id)` (security definer) para exigir que el usuario autenticado sea miembro del negocio dueño de la fila, tanto para lectura como escritura. Aunque un bug en el código de la app olvidara filtrar por `business_id`, Postgres seguiría bloqueando el acceso cruzado entre negocios.
- **Onboarding**: `/onboarding` (mobile-first) crea la fila en `businesses` tras el registro; un trigger (`handle_new_business`) inscribe automáticamente al creador como `owner` en `business_members`.

## Dónde viven las cosas

- `app/(auth)/` — login, registro, recuperación y reseteo de contraseña (layout centrado, sin sidebar).
- `app/(app)/` — dashboard, clientes, cuadrillas, agenda y pagos, detrás del layout con sidebar/topbar (`app/(app)/layout.tsx`), que exige sesión + negocio.
- `app/onboarding/` — alta del negocio tras el registro.
- `app/auth/confirm/route.ts` — intercambia el `token_hash` de los correos de Supabase por una sesión.
- `app/logout/actions.ts` + `components/sign-out-button.tsx` — cierre de sesión.
- `app/api/optimize-route` — endpoint que ordena las paradas de una cuadrilla para un día dado (heurística de vecino más cercano sobre latitud/longitud), verificando que la cuadrilla pertenezca al negocio del solicitante. Placeholder para un solver real (OR-Tools, una API de ruteo, o un planificador asistido por LLM) cuando el volumen lo justifique.
- `lib/supabase/` — clientes de Supabase para navegador (`client.ts`), Server Components (`server.ts`) y middleware de sesión (`middleware.ts`).
- `lib/business.ts` — `requireBusiness()`, el guardia de servidor usado por el layout y las páginas protegidas.
- `lib/action-state.ts` — tipo compartido `ActionState` para formularios con Server Actions (`useActionState`).
- `lib/types.ts` — tipos de dominio (Business, BusinessMember, Client, Crew, Job, Payment) y el tipo `Database` (referencia; no está aplicado como genérico al cliente de Supabase — ver el comentario en `lib/supabase/client.ts`).
- `supabase/migrations/` — esquema SQL versionado.
- `components/submit-button.tsx`, `confirm-submit-button.tsx`, `form-banner.tsx`, `field-error.tsx` — piezas reutilizables de formularios (estado de carga, confirmación antes de eliminar, mensajes de éxito/error, errores de campo).

## Formularios (clientes, cuadrillas, trabajos)

Cada entidad tiene: lista (`page.tsx`), alta (`new/page.tsx`), edición (`[id]/edit/page.tsx`) y un formulario compartido (`*-form.tsx`) que usa una Server Action con `useActionState` para validación, estado de carga (`useFormStatus`) y mensajes de éxito/error. Eliminar pasa por un botón de confirmación (`ConfirmSubmitButton`) antes de invocar la Server Action de borrado. Los pagos siguen siendo de solo lectura por ahora.

## Placeholders pendientes

- **Stripe**: no integrado; la página de pagos solo lee `payments` (poblable manualmente o desde una integración futura).
- **IA**: el optimizador de rutas usa una heurística determinista (vecino más cercano), no un modelo de IA real.
