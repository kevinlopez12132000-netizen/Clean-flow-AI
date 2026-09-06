import { ResetPasswordForm } from './reset-password-form';

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Restablece tu contraseña</h1>
        <p className="mt-1 text-sm text-slate-500">Elige una nueva contraseña para tu cuenta.</p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
