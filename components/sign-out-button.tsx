'use client';

import { useFormStatus } from 'react-dom';
import { signOut } from '@/app/logout/actions';

function Button() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? 'Saliendo…' : 'Cerrar sesión'}
    </button>
  );
}

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button />
    </form>
  );
}
