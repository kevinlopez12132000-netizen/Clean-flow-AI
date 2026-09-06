'use server';

import { createClient } from '@/lib/supabase/server';
import { getSiteUrl } from '@/lib/site-url';
import type { ActionState } from '@/lib/action-state';

export async function requestPasswordReset(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim();

  if (!email) {
    return { status: 'error', message: 'Ingresa tu correo.', fieldErrors: { email: 'Requerido.' } };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/confirm?next=/reset-password`,
  });

  // Always return the same success message whether or not the email is
  // registered, so this form can't be used to enumerate accounts.
  return {
    status: 'success',
    message: 'Si el correo existe en nuestro sistema, te enviamos un enlace para restablecer tu contraseña.',
  };
}
