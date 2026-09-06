'use client';

import { useActionState } from 'react';
import { signup } from './actions';
import { initialActionState } from '@/lib/action-state';
import { SubmitButton } from '@/components/submit-button';
import { FormBanner } from '@/components/form-banner';
import { FieldError } from '@/components/field-error';

export function SignupForm() {
  const [state, formAction] = useActionState(signup, initialActionState);

  if (state.status === 'success' && state.message) {
    return <FormBanner status="success" message={state.message} />;
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.status === 'error' && state.message && <FormBanner status="error" message={state.message} />}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-base"
        />
        <FieldError message={state.fieldErrors?.email} />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-base"
        />
        <FieldError message={state.fieldErrors?.password} />
      </div>

      <div>
        <label htmlFor="confirm_password" className="block text-sm font-medium text-slate-700">
          Confirmar contraseña
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-base"
        />
        <FieldError message={state.fieldErrors?.confirm_password} />
      </div>

      <SubmitButton label="Crear cuenta" pendingLabel="Creando…" className="w-full py-3" />
    </form>
  );
}
