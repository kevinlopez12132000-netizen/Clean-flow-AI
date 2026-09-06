import { redirect } from 'next/navigation';
import { type EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

// Landing point for Supabase auth emails (signup confirmation, password
// recovery): exchanges the token_hash for a session, then hands off to
// `next` (e.g. /onboarding or /reset-password).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      redirect(next);
    }
  }

  redirect('/login?error=El enlace no es válido o expiró.');
}
