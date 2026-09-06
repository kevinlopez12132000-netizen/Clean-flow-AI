import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireBusiness } from '@/lib/business';
import { createClient } from '@/lib/supabase/server';
import { JobForm } from '../../job-form';

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { business } = await requireBusiness();
  const supabase = await createClient();

  const [{ data: job }, { data: clients }, { data: crews }] = await Promise.all([
    supabase.from('jobs').select('*').eq('id', id).eq('business_id', business.id).maybeSingle(),
    supabase.from('clients').select('id, name').eq('business_id', business.id).order('name'),
    supabase.from('crews').select('id, name').eq('business_id', business.id).order('name'),
  ]);

  if (!job) notFound();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <Link href="/schedule" className="text-sm text-brand-700 hover:underline">
          ← Volver a la agenda
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Editar trabajo</h1>
      </div>
      <JobForm mode="edit" job={job} clients={clients ?? []} crews={crews ?? []} />
    </div>
  );
}
