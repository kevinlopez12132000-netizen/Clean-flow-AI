import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/is-configured';
import { SetupNotice } from '@/components/setup-notice';
import { StatCard } from '@/components/stat-card';

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <SetupNotice />
      </div>
    );
  }

  const supabase = await createClient();

  const [{ count: clientCount }, { count: crewCount }, { count: jobCount }, { data: pendingPayments }] =
    await Promise.all([
      supabase.from('clients').select('*', { count: 'exact', head: true }),
      supabase.from('crews').select('*', { count: 'exact', head: true }).eq('active', true),
      supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_at', new Date().toISOString()),
      supabase.from('payments').select('amount_cents').eq('status', 'pending'),
    ]);

  const pendingTotal = (pendingPayments ?? []).reduce((sum, p) => sum + p.amount_cents, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Clientes" value={String(clientCount ?? 0)} />
        <StatCard label="Cuadrillas activas" value={String(crewCount ?? 0)} />
        <StatCard label="Trabajos próximos" value={String(jobCount ?? 0)} />
        <StatCard label="Pagos pendientes" value={`$${(pendingTotal / 100).toFixed(2)}`} />
      </div>
    </div>
  );
}
