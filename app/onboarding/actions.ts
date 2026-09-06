'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { ActionState } from '@/lib/action-state';
import type { CleaningType } from '@/lib/types';

const CLEANING_TYPES: CleaningType[] = ['residencial', 'comercial', 'ambas'];

export async function createBusiness(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  const serviceArea = String(formData.get('service_area') ?? '').trim();
  const cleaningType = String(formData.get('cleaning_type') ?? '');

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'El nombre del negocio es requerido.';
  if (!phone) fieldErrors.phone = 'El teléfono es requerido.';
  if (!city) fieldErrors.city = 'La ciudad es requerida.';
  if (!serviceArea) fieldErrors.service_area = 'La zona de servicio es requerida.';
  if (!CLEANING_TYPES.includes(cleaningType as CleaningType)) {
    fieldErrors.cleaning_type = 'Selecciona un tipo de limpieza.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Revisa los campos marcados.', fieldErrors };
  }

  const { error } = await supabase.from('businesses').insert({
    name,
    phone,
    city,
    service_area: serviceArea,
    cleaning_type: cleaningType,
    owner_id: user.id,
  });

  if (error) {
    return { status: 'error', message: 'No se pudo crear el negocio. Intenta de nuevo.' };
  }

  redirect('/');
}
