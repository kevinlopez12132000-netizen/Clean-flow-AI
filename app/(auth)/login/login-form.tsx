'use client';

import { useActionState } from 'react';
import { login } from './actions';
import { initialActionState } from '@/lib/action-state';
import { SubmitButton } from '@/components/submit-button';
import { FormBanner } from '@/components/form-banner';
import { FieldError } from '@/components/field-error';

export function LoginForm({
  initialMessage,
  initialError,
}: {
  initialMessage?: string;
  initialError?: string;
}) {
  const [state, formAction] = useActionState(login, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state.status === 'idle' && initialMessage && (
        <FormBanner status="success" message={initialMessage} />
      )}
      {state.status === 'idle' && initialError && <FormBanner status="error" message={initialError} />}
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
          autoComplete="current-password"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-base"
        />
        <FieldError message={state.fieldErrors?.password} />
      </div>

      <SubmitButton label="Iniciar sesión" pendingLabel="Ingresando…" className="w-full py-3" />
    </form>
  );
}
