'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { ActionState } from '@/lib/action-state';

export async function updatePassword(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirm_password') ?? '');

  const fieldErrors: Record<string, string> = {};
  if (password.length < 8) fieldErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
  if (password !== confirmPassword) fieldErrors.confirm_password = 'Las contraseñas no coinciden.';
  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Revisa los campos marcados.', fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: 'error',
      message: 'El enlace expiró o no es válido. Solicita uno nuevo desde "Olvidé mi contraseña".',
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { status: 'error', message: 'No se pudo actualizar la contraseña.' };
  }

  redirect('/login?message=Contraseña actualizada. Inicia sesión con tu nueva contraseña.');
}
