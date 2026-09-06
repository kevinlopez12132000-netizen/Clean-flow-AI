'use client';

import { useActionState } from 'react';
import { createCrewRecord, updateCrewRecord } from './actions';
import { initialActionState } from '@/lib/action-state';
import { SubmitButton } from '@/components/submit-button';
import { FormBanner } from '@/components/form-banner';
import { FieldError } from '@/components/field-error';
import type { Crew } from '@/lib/types';

export function CrewForm({ mode, crew }: { mode: 'create' | 'edit'; crew?: Crew }) {
  const action = mode === 'edit' && crew ? updateCrewRecord.bind(null, crew.id) : createCrewRecord;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      {state.status === 'error' && state.message && <FormBanner status="error" message={state.message} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Nombre de la cuadrilla
        </label>
        <input
          id="name"
          name="name"
          defaultValue={crew?.name}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <FieldError message={state.fieldErrors?.name} />
      </div>

      <div>
        <label htmlFor="members" className="block text-sm font-medium text-slate-700">
          Miembros
        </label>
        <input
          id="members"
          name="members"
          defaultValue={crew?.members?.join(', ') ?? ''}
          placeholder="Ej. Ana, Luis, Carla"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-slate-400">Separa los nombres con comas.</p>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="active"
          defaultChecked={crew?.active ?? true}
          className="h-4 w-4 rounded border-slate-300"
        />
        Cuadrilla activa
      </label>

      <SubmitButton
        label={mode === 'create' ? 'Crear cuadrilla' : 'Guardar cambios'}
        pendingLabel="Guardando…"
      />
    </form>
  );
}
