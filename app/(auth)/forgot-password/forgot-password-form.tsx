'use client';

import { useActionState } from 'react';
import { requestPasswordReset } from './actions';
import { initialActionState } from '@/lib/action-state';
import { SubmitButton } from '@/components/submit-button';
import { FormBanner } from '@/components/form-banner';
import { FieldError } from '@/components/field-error';

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordReset, initialActionState);

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

      <SubmitButton label="Enviar enlace" pendingLabel="Enviando…" className="w-full py-3" />
    </form>
  );
}
