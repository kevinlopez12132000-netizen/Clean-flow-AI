import Link from 'next/link';
import { CrewForm } from '../crew-form';

export default function NewCrewPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <Link href="/crews" className="text-sm text-brand-700 hover:underline">
          ← Volver a cuadrillas
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Agregar cuadrilla</h1>
      </div>
      <CrewForm mode="create" />
    </div>
  );
}
