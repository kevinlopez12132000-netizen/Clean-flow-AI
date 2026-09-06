'use client';

import { useActionState } from 'react';
import { updatePassword } from './actions';
import { initialActionState } from '@/lib/action-state';
import { SubmitButton } from '@/components/submit-button';
import { FormBanner } from '@/components/form-banner';
import { FieldError } from '@/components/field-error';

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(updatePassword, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state.status === 'error' && state.message && <FormBanner status="error" message={state.message} />}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Nueva contraseña
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

      <SubmitButton label="Actualizar contraseña" pendingLabel="Actualizando…" className="w-full py-3" />
    </form>
  );
}
