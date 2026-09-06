export function FormBanner({ status, message }: { status: 'success' | 'error'; message: string }) {
  const styles =
    status === 'success'
      ? 'border-brand-200 bg-brand-50 text-brand-800'
      : 'border-red-200 bg-red-50 text-red-700';

  return <div className={`rounded-md border px-3 py-2 text-sm ${styles}`}>{message}</div>;
}
