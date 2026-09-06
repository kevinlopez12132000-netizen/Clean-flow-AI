'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireBusiness } from '@/lib/business';
import { createClient } from '@/lib/supabase/server';
import type { ActionState } from '@/lib/action-state';
import type { JobStatus } from '@/lib/types';

const JOB_STATUSES: JobStatus[] = ['scheduled', 'in_progress', 'completed', 'canceled'];

async function validateJobForm(
  formData: FormData,
  businessId: string
): Promise<{ fieldErrors: Record<string, string>; values: Record<string, unknown> }> {
  const supabase = await createClient();

  const clientId = String(formData.get('client_id') ?? '');
  const crewId = String(formData.get('crew_id') ?? '');
  const scheduledAtRaw = String(formData.get('scheduled_at') ?? '');
  const durationMinutes = Number(formData.get('duration_minutes') ?? 0);
  const status = String(formData.get('status') ?? 'scheduled');
  const notes = String(formData.get('notes') ?? '').trim();

  const fieldErrors: Record<string, string> = {};

  if (!clientId) {
    fieldErrors.client_id = 'Selecciona un cliente.';
  } else {
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('id', clientId)
      .eq('business_id', businessId)
      .maybeSingle();
    if (!client) fieldErrors.client_id = 'Cliente inválido.';
  }

  if (crewId) {
    const { data: crew } = await supabase
      .from('crews')
      .select('id')
      .eq('id', crewId)
      .eq('business_id', businessId)
      .maybeSingle();
    if (!crew) fieldErrors.crew_id = 'Cuadrilla inválida.';
  }

  const scheduledAt = scheduledAtRaw ? new Date(scheduledAtRaw) : null;
  if (!scheduledAtRaw || !scheduledAt || Number.isNaN(scheduledAt.getTime())) {
    fieldErrors.scheduled_at = 'Selecciona una fecha y hora válidas.';
  }

  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    fieldErrors.duration_minutes = 'La duración debe ser mayor a 0.';
  }

  if (!JOB_STATUSES.includes(status as JobStatus)) {
    fieldErrors.status = 'Estado inválido.';
  }

  return {
    fieldErrors,
    values: {
      client_id: clientId,
      crew_id: crewId || null,
      scheduled_at: scheduledAt?.toISOString(),
      duration_minutes: durationMinutes,
      status,
      notes: notes || null,
    },
  };
}

export async function createJobRecord(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const { business } = await requireBusiness();
  const { fieldErrors, values } = await validateJobForm(formData, business.id);

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Revisa los campos marcados.', fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('jobs').insert({ ...values, business_id: business.id });

  if (error) {
    return { status: 'error', message: 'No se pudo guardar el trabajo.' };
  }

  revalidatePath('/schedule');
  redirect('/schedule?success=Trabajo creado correctamente.');
}

export async function updateJobRecord(
  jobId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { business } = await requireBusiness();
  const { fieldErrors, values } = await validateJobForm(formData, business.id);

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Revisa los campos marcados.', fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('jobs')
    .update(values)
    .eq('id', jobId)
    .eq('business_id', business.id);

  if (error) {
    return { status: 'error', message: 'No se pudo actualizar el trabajo.' };
  }

  revalidatePath('/schedule');
  redirect('/schedule?success=Trabajo actualizado correctamente.');
}

export async function deleteJob(jobId: string) {
  const { business } = await requireBusiness();
  const supabase = await createClient();

  await supabase.from('jobs').delete().eq('id', jobId).eq('business_id', business.id);

  revalidatePath('/schedule');
  redirect('/schedule?success=Trabajo eliminado.');
}
