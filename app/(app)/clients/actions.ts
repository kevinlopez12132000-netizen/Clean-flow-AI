'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireBusiness } from '@/lib/business';
import { createClient } from '@/lib/supabase/server';
import type { ActionState } from '@/lib/action-state';

function validateClientForm(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const address = String(formData.get('address') ?? '').trim();
  const notes = String(formData.get('notes') ?? '').trim();

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'El nombre es requerido.';
  if (!address) fieldErrors.address = 'La dirección es requerida.';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'Correo inválido.';
  }

  return {
    fieldErrors,
    values: {
      name,
      email: email || null,
      phone: phone || null,
      address,
      notes: notes || null,
    },
  };
}

export async function createClientRecord(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { business } = await requireBusiness();
  const { fieldErrors, values } = validateClientForm(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Revisa los campos marcados.', fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('clients').insert({ ...values, business_id: business.id });

  if (error) {
    return { status: 'error', message: 'No se pudo guardar el cliente.' };
  }

  revalidatePath('/clients');
  redirect('/clients?success=Cliente creado correctamente.');
}

export async function updateClientRecord(
  clientId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { business } = await requireBusiness();
  const { fieldErrors, values } = validateClientForm(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Revisa los campos marcados.', fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('clients')
    .update(values)
    .eq('id', clientId)
    .eq('business_id', business.id);

  if (error) {
    return { status: 'error', message: 'No se pudo actualizar el cliente.' };
  }

  revalidatePath('/clients');
  redirect('/clients?success=Cliente actualizado correctamente.');
}

export async function deleteClient(clientId: string) {
  const { business } = await requireBusiness();
  const supabase = await createClient();

  await supabase.from('clients').delete().eq('id', clientId).eq('business_id', business.id);

  revalidatePath('/clients');
  redirect('/clients?success=Cliente eliminado.');
}
