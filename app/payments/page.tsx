import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/is-configured';
import { SetupNotice } from '@/components/setup-notice';

const statusStyles: Record<string, string> = {
  paid: 'bg-brand-50 text-brand-700',
  pending: 'bg-amber-50 text-amber-700',
  overdue: 'bg-red-50 text-red-700',
};

export default async function PaymentsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Pagos</h1>
        <SetupNotice />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: payments } = await supabase
    .from('payments')
    .select('id, amount_cents, status, due_date, clients(name)')
    .order('due_date', { ascending: true });

  type PaymentRow = {
    id: string;
    amount_cents: number;
    status: string;
    due_date: string;
    clients: { name: string } | null;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pagos</h1>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Cliente</th>
              <th className="px-4 py-2 font-medium">Monto</th>
              <th className="px-4 py-2 font-medium">Vence</th>
              <th className="px-4 py-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {((payments ?? []) as unknown as PaymentRow[]).map((payment) => (
              <tr key={payment.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2">{payment.clients?.name ?? '—'}</td>
                <td className="px-4 py-2">${(payment.amount_cents / 100).toFixed(2)}</td>
                <td className="px-4 py-2 text-slate-500">
                  {new Date(payment.due_date).toLocaleDateString('es')}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusStyles[payment.status] ?? 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
            {(payments ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  No hay pagos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
