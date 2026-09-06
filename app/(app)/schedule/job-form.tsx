'use client';

import { useActionState } from 'react';
import { createJobRecord, updateJobRecord } from './actions';
import { initialActionState } from '@/lib/action-state';
import { SubmitButton } from '@/components/submit-button';
import { FormBanner } from '@/components/form-banner';
import { FieldError } from '@/components/field-error';
import type { Job } from '@/lib/types';

function toDatetimeLocalValue(iso?: string) {
  if (!iso) return '';
  const date = new Date(iso);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

interface Option {
  id: string;
  name: string;
}

export function JobForm({
  mode,
  job,
  clients,
  crews,
}: {
  mode: 'create' | 'edit';
  job?: Job;
  clients: Option[];
  crews: Option[];
}) {
  const action = mode === 'edit' && job ? updateJobRecord.bind(null, job.id) : createJobRecord;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      {state.status === 'error' && state.message && <FormBanner status="error" message={state.message} />}

      <div>
        <label htmlFor="client_id" className="block text-sm font-medium text-slate-700">
          Cliente
        </label>
        <select
          id="client_id"
          name="client_id"
          defaultValue={job?.client_id ?? ''}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Selecciona un cliente
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        <FieldError message={state.fieldErrors?.client_id} />
      </div>

      <div>
        <label htmlFor="crew_id" className="block text-sm font-medium text-slate-700">
          Cuadrilla
        </label>
        <select
          id="crew_id"
          name="crew_id"
          defaultValue={job?.crew_id ?? ''}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Sin asignar</option>
          {crews.map((crew) => (
            <option key={crew.id} value={crew.id}>
              {crew.name}
            </option>
          ))}
        </select>
        <FieldError message={state.fieldErrors?.crew_id} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="scheduled_at" className="block text-sm font-medium text-slate-700">
            Fecha y hora
          </label>
          <input
            id="scheduled_at"
            name="scheduled_at"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(job?.scheduled_at)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <FieldError message={state.fieldErrors?.scheduled_at} />
        </div>
        <div>
          <label htmlFor="duration_minutes" className="block text-sm font-medium text-slate-700">
            Duración (min)
          </label>
          <input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            min={1}
            defaultValue={job?.duration_minutes ?? 60}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <FieldError message={state.fieldErrors?.duration_minutes} />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700">
          Estado
        </label>
        <select
          id="status"
          name="status"
          defaultValue={job?.status ?? 'scheduled'}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="scheduled">Agendado</option>
          <option value="in_progress">En progreso</option>
          <option value="completed">Completado</option>
          <option value="canceled">Cancelado</option>
        </select>
        <FieldError message={state.fieldErrors?.status} />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
          Notas
        </label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={job?.notes ?? ''}
          rows={3}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <SubmitButton
        label={mode === 'create' ? 'Crear trabajo' : 'Guardar cambios'}
        pendingLabel="Guardando…"
      />
    </form>
  );
}
