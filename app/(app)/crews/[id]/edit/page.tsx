import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireBusiness } from '@/lib/business';
import { createClient } from '@/lib/supabase/server';
import { CrewForm } from '../../crew-form';

export default async function EditCrewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { business } = await requireBusiness();
  const supabase = await createClient();

  const { data: crew } = await supabase
    .from('crews')
    .select('*')
    .eq('id', id)
    .eq('business_id', business.id)
    .maybeSingle();

  if (!crew) notFound();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <Link href="/crews" className="text-sm text-brand-700 hover:underline">
          ← Volver a cuadrillas
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Editar cuadrilla</h1>
      </div>
      <CrewForm mode="edit" crew={crew} />
    </div>
  );
}
