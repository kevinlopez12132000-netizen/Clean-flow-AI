import Link from 'next/link';
import { ClientForm } from '../client-form';

export default function NewClientPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <Link href="/clients" className="text-sm text-brand-700 hover:underline">
          ← Volver a clientes
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Agregar cliente</h1>
      </div>
      <ClientForm mode="create" />
    </div>
  );
}
