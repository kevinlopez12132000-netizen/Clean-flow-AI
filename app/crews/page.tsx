import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/is-configured';
import { SetupNotice } from '@/components/setup-notice';

export default async function CrewsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Cuadrillas</h1>
        <SetupNotice />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: crews } = await supabase
    .from('crews')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Cuadrillas</h1>
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
          </div>
        ))}
        {(crews ?? []).length === 0 && (
          <p className="text-slate-400">Aún no hay cuadrillas registradas.</p>
        )}
      </div>
    </div>
  );
}
