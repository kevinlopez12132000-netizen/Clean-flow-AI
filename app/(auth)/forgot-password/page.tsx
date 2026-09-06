import Link from 'next/link';
import { ForgotPasswordForm } from './forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Recupera tu contraseña</h1>
        <p className="mt-1 text-sm text-slate-500">
          Te enviaremos un enlace por correo para restablecerla.
        </p>
      </div>
      <ForgotPasswordForm />
      <p className="text-center text-sm text-slate-500">
        <Link href="/login" className="text-brand-700 hover:underline">
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  );
}
