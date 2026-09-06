import Link from 'next/link';
import { LoginForm } from './login-form';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Inicia sesión</h1>
        <p className="mt-1 text-sm text-slate-500">Accede a tu cuenta de CleanFlow-AI.</p>
      </div>
      <LoginForm initialMessage={params.message} initialError={params.error} />
      <div className="space-y-1 text-center text-sm">
        <p>
          <Link href="/forgot-password" className="text-brand-700 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
        <p className="text-slate-500">
          ¿No tienes cuenta?{' '}
          <Link href="/signup" className="text-brand-700 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
