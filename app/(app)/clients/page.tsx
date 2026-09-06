import Link from 'next/link';
import { requireBusiness } from '@/lib/business';
import { createClient } from '@/lib/supabase/server';
import { FormBanner } from '@/components/form-banner';
import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { deleteClient } from './actions';

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { business } = await requireBusiness();
  const params = await searchParams;
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <Link
          href="/clients/new"
          className="rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Agregar cliente
        </Link>
      </div>

      {params.success && <FormBanner status="success" message={params.success} />}
      {params.error && <FormBanner status="error" message={params.error} />}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Nombre</th>
              <th className="px-4 py-2 font-medium">Contacto</th>
              <th className="px-4 py-2 font-medium">Dirección</th>
              <th className="px-4 py-2 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(clients ?? []).map((client) => (
              <tr key={client.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2">{client.name}</td>
                <td className="px-4 py-2 text-slate-500">{client.email ?? client.phone ?? '—'}</td>
                <td className="px-4 py-2 text-slate-500">{client.address}</td>
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/clients/${client.id}/edit`}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Editar
                    </Link>
                    <form action={deleteClient.bind(null, client.id)}>
                      <ConfirmSubmitButton
                        label="Eliminar"
                        confirmMessage={`¿Eliminar a ${client.name}? Esta acción no se puede deshacer.`}
                      />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(clients ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  Aún no hay clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
