'use client';

import { useActionState } from 'react';
import { createBusiness } from './actions';
import { initialActionState } from '@/lib/action-state';
import { SubmitButton } from '@/components/submit-button';
import { FormBanner } from '@/components/form-banner';
import { FieldError } from '@/components/field-error';

export function OnboardingForm() {
  const [state, formAction] = useActionState(createBusiness, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state.status === 'error' && state.message && <FormBanner status="error" message={state.message} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Nombre del negocio
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="organization"
          placeholder="Ej. Limpieza Total"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-base"
        />
        <FieldError message={state.fieldErrors?.name} />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
          Teléfono
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Ej. 555-123-4567"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-base"
        />
        <FieldError message={state.fieldErrors?.phone} />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-slate-700">
          Ciudad
        </label>
        <input
          id="city"
          name="city"
          type="text"
          autoComplete="address-level2"
          placeholder="Ej. Guadalajara"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-base"
        />
        <FieldError message={state.fieldErrors?.city} />
      </div>

      <div>
        <label htmlFor="service_area" className="block text-sm font-medium text-slate-700">
          Zona de servicio
        </label>
        <input
          id="service_area"
          name="service_area"
          type="text"
          placeholder="Ej. Zona metropolitana, radio de 20km"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-base"
        />
        <FieldError message={state.fieldErrors?.service_area} />
      </div>

      <div>
        <label htmlFor="cleaning_type" className="block text-sm font-medium text-slate-700">
          Tipo de limpieza
        </label>
        <select
          id="cleaning_type"
          name="cleaning_type"
          defaultValue=""
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-base"
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          <option value="residencial">Residencial</option>
          <option value="comercial">Comercial</option>
          <option value="ambas">Ambas</option>
        </select>
        <FieldError message={state.fieldErrors?.cleaning_type} />
      </div>

      <SubmitButton label="Crear negocio" pendingLabel="Creando…" className="w-full py-3" />
    </form>
  );
}
