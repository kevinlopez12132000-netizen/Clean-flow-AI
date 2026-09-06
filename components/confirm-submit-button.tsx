'use client';

import { useFormStatus } from 'react-dom';

export function ConfirmSubmitButton({
  label,
  pendingLabel,
  confirmMessage,
  className = '',
}: {
  label: string;
  pendingLabel?: string;
  confirmMessage: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      className={`rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {pending ? (pendingLabel ?? 'Eliminando…') : label}
    </button>
  );
}
