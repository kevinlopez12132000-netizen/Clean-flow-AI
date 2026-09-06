'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { ActionState } from '@/lib/action-state';

export async function login(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  const fieldErrors: Record<string, string> = {};
  if (!email) fieldErrors.email = 'Ingresa tu correo.';
  if (!password) fieldErrors.password = 'Ingresa tu contraseña.';
  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Revisa los campos marcados.', fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: 'error', message: 'Correo o contraseña incorrectos.' };
  }

  redirect('/');
}
