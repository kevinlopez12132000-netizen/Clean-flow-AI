import Link from 'next/link';
import { requireBusiness } from '@/lib/business';
import { createClient } from '@/lib/supabase/server';
import { FormBanner } from '@/components/form-banner';
import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { deleteCrew } from './actions';

export default async function CrewsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { business } = await requireBusiness();
  const params = await searchParams;
  const supabase = await createClient();

  const { data: crews } = await supabase
    .from('crews')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cuadrillas</h1>
        <Link
          href="/crews/new"
          className="rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Agregar cuadrilla
        </Link>
      </div>

      {params.success && <FormBanner status="success" message={params.success} />}
      {params.error && <FormBanner status="error" message={params.error} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(crews ?? []).map((crew) => (
          <div key={crew.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{crew.name}</h2>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  crew.active ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {crew.active ? 'Activa' : 'Inactiva'}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {crew.members.length > 0 ? crew.members.join(', ') : 'Sin miembros asignados'}
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                href={`/crews/${crew.id}/edit`}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Editar
              </Link>
              <form action={deleteCrew.bind(null, crew.id)}>
                <ConfirmSubmitButton
                  label="Eliminar"
                  confirmMessage={`¿Eliminar la cuadrilla "${crew.name}"? Esta acción no se puede deshacer.`}
                />
              </form>
            </div>
          </div>
        ))}
        {(crews ?? []).length === 0 && (
          <p className="text-slate-400">Aún no hay cuadrillas registradas.</p>
        )}
      </div>
    </div>
  );
}
