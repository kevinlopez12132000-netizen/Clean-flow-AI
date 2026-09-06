import Link from 'next/link';
import { SignupForm } from './signup-form';

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Crea tu cuenta</h1>
        <p className="mt-1 text-sm text-slate-500">Empieza a gestionar tu negocio de limpieza.</p>
      </div>
      <SignupForm />
      <p className="text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-brand-700 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
