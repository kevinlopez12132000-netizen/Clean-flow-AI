'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSiteUrl } from '@/lib/site-url';
import type { ActionState } from '@/lib/action-state';

export async function signup(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirm_password') ?? '');

  const fieldErrors: Record<string, string> = {};
  if (!email) fieldErrors.email = 'Ingresa tu correo.';
  if (password.length < 8) fieldErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
  if (password !== confirmPassword) fieldErrors.confirm_password = 'Las contraseñas no coinciden.';
  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Revisa los campos marcados.', fieldErrors };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${siteUrl}/auth/confirm?next=/onboarding` },
  });

  if (error) {
    const message = error.message.toLowerCase().includes('already registered')
      ? 'Ese correo ya está registrado.'
      : 'No se pudo crear la cuenta. Intenta de nuevo.';
    return { status: 'error', message };
  }

  if (data.session) redirect('/onboarding');

  return {
    status: 'success',
    message: 'Cuenta creada. Revisa tu correo para confirmarla antes de iniciar sesión.',
  };
}
