export function SetupNotice() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      Configura <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> y{' '}
      <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en{' '}
      <code className="rounded bg-amber-100 px-1">.env.local</code> (ver{' '}
      <code className="rounded bg-amber-100 px-1">.env.example</code>) y aplica{' '}
      <code className="rounded bg-amber-100 px-1">supabase/migrations/0001_init.sql</code> a tu
      proyecto de Supabase para ver datos reales aquí.
    </div>
  );
}
