'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({
  label,
  pendingLabel,
  className = '',
}: {
  label: string;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {pending ? (pendingLabel ?? 'Guardando…') : label}
    </button>
  );
}
