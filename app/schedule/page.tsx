import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/is-configured';
import { SetupNotice } from '@/components/setup-notice';
import { RouteOptimizer } from './route-optimizer';

export default async function SchedulePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Agenda</h1>
        <SetupNotice />
      </div>
    );
  }

  const supabase = await createClient();

  const [{ data: crews }, { data: jobs }] = await Promise.all([
    supabase.from('crews').select('id, name').eq('active', true).order('name'),
    supabase
      .from('jobs')
      .select('id, scheduled_at, status, clients(name)')
      .order('scheduled_at', { ascending: true })
      .limit(20),
  ]);

  type JobRow = { id: string; scheduled_at: string; status: string; clients: { name: string } | null };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Agenda</h1>

      <RouteOptimizer crews={crews ?? []} />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Fecha</th>
              <th className="px-4 py-2 font-medium">Cliente</th>
              <th className="px-4 py-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {((jobs ?? []) as unknown as JobRow[]).map((job) => (
              <tr key={job.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2">{new Date(job.scheduled_at).toLocaleString('es')}</td>
                <td className="px-4 py-2">{job.clients?.name ?? '—'}</td>
                <td className="px-4 py-2 text-slate-500">{job.status}</td>
              </tr>
            ))}
            {(jobs ?? []).length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                  No hay trabajos agendados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
