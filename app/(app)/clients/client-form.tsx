'use client';

import { useActionState } from 'react';
import { createClientRecord, updateClientRecord } from './actions';
import { initialActionState } from '@/lib/action-state';
import { SubmitButton } from '@/components/submit-button';
import { FormBanner } from '@/components/form-banner';
import { FieldError } from '@/components/field-error';
import type { Client } from '@/lib/types';

export function ClientForm({ mode, client }: { mode: 'create' | 'edit'; client?: Client }) {
  const action =
    mode === 'edit' && client ? updateClientRecord.bind(null, client.id) : createClientRecord;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      {state.status === 'error' && state.message && <FormBanner status="error" message={state.message} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          defaultValue={client?.name}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <FieldError message={state.fieldErrors?.name} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={client?.email ?? ''}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <FieldError message={state.fieldErrors?.email} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={client?.phone ?? ''}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-700">
          Dirección
        </label>
        <input
          id="address"
          name="address"
          defaultValue={client?.address}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <FieldError message={state.fieldErrors?.address} />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
          Notas
        </label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={client?.notes ?? ''}
          rows={3}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <SubmitButton
        label={mode === 'create' ? 'Crear cliente' : 'Guardar cambios'}
        pendingLabel="Guardando…"
      />
    </form>
  );
}
