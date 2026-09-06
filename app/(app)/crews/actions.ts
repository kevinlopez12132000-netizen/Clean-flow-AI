'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireBusiness } from '@/lib/business';
import { createClient } from '@/lib/supabase/server';
import type { ActionState } from '@/lib/action-state';

function validateCrewForm(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const membersRaw = String(formData.get('members') ?? '');
  const active = formData.get('active') === 'on';

  const members = membersRaw
    .split(',')
    .map((member) => member.trim())
    .filter(Boolean);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'El nombre de la cuadrilla es requerido.';

  return { fieldErrors, values: { name, members, active } };
}

export async function createCrewRecord(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { business } = await requireBusiness();
  const { fieldErrors, values } = validateCrewForm(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Revisa los campos marcados.', fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('crews').insert({ ...values, business_id: business.id });

  if (error) {
    return { status: 'error', message: 'No se pudo guardar la cuadrilla.' };
  }

  revalidatePath('/crews');
  redirect('/crews?success=Cuadrilla creada correctamente.');
}

export async function updateCrewRecord(
  crewId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { business } = await requireBusiness();
  const { fieldErrors, values } = validateCrewForm(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Revisa los campos marcados.', fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('crews')
    .update(values)
    .eq('id', crewId)
    .eq('business_id', business.id);

  if (error) {
    return { status: 'error', message: 'No se pudo actualizar la cuadrilla.' };
  }

  revalidatePath('/crews');
  redirect('/crews?success=Cuadrilla actualizada correctamente.');
}

export async function deleteCrew(crewId: string) {
  const { business } = await requireBusiness();
  const supabase = await createClient();

  await supabase.from('crews').delete().eq('id', crewId).eq('business_id', business.id);

  revalidatePath('/crews');
  redirect('/crews?success=Cuadrilla eliminada.');
}
