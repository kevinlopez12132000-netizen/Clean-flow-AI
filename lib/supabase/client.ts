import { createBrowserClient } from '@supabase/ssr';

// Not typed against lib/types.ts's Database interface yet — that type is a
// hand-written placeholder. Regenerate it with the Supabase CLI
// (`supabase gen types typescript`) once the schema is live, then pass it
// here as `createBrowserClient<Database>(...)`.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
