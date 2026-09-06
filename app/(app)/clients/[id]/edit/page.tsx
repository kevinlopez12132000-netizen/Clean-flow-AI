import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireBusiness } from '@/lib/business';
import { createClient } from '@/lib/supabase/server';
import { ClientForm } from '../../client-form';

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { business } = await requireBusiness();
  const supabase = await createClient();

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('business_id', business.id)
    .maybeSingle();

  if (!client) notFound();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <Link href="/clients" className="text-sm text-brand-700 hover:underline">
          ← Volver a clientes
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Editar cliente</h1>
      </div>
      <ClientForm mode="edit" client={client} />
    </div>
  );
}
