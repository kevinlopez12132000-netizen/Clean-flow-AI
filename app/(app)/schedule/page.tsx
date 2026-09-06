import Link from 'next/link';
import { requireBusiness } from '@/lib/business';
import { createClient } from '@/lib/supabase/server';
import { FormBanner } from '@/components/form-banner';
import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { RouteOptimizer } from './route-optimizer';
import { deleteJob } from './actions';

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { business } = await requireBusiness();
  const params = await searchParams;
  const supabase = await createClient();

  const [{ data: crews }, { data: jobs }] = await Promise.all([
    supabase
      .from('crews')
      .select('id, name')
      .eq('business_id', business.id)
      .eq('active', true)
      .order('name'),
    supabase
      .from('jobs')
      .select('id, scheduled_at, status, clients(name)')
      .eq('business_id', business.id)
      .order('scheduled_at', { ascending: true })
      .limit(50),
  ]);

  type JobRow = { id: string; scheduled_at: string; status: string; clients: { name: string } | null };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Agenda</h1>

      {params.success && <FormBanner status="success" message={params.success} />}
      {params.error && <FormBanner status="error" message={params.error} />}

      <RouteOptimizer crews={crews ?? []} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Trabajos</h2>
        <Link
          href="/schedule/new"
          className="rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Agregar trabajo
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Fecha</th>
              <th className="px-4 py-2 font-medium">Cliente</th>
              <th className="px-4 py-2 font-medium">Estado</th>
              <th className="px-4 py-2 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {((jobs ?? []) as unknown as JobRow[]).map((job) => (
              <tr key={job.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2">{new Date(job.scheduled_at).toLocaleString('es')}</td>
                <td className="px-4 py-2">{job.clients?.name ?? '—'}</td>
                <td className="px-4 py-2 text-slate-500">{job.status}</td>
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/schedule/${job.id}/edit`}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Editar
                    </Link>
                    <form action={deleteJob.bind(null, job.id)}>
                      <ConfirmSubmitButton
                        label="Eliminar"
                        confirmMessage="¿Eliminar este trabajo? Esta acción no se puede deshacer."
                      />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(jobs ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
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
