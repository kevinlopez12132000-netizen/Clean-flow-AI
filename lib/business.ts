import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Business, BusinessRole } from '@/lib/types';

export interface BusinessContext {
  userId: string;
  userEmail: string | null;
  business: Business;
  role: BusinessRole;
}

// Server-side gate for every page/layout under the authenticated app: no
// user -> /login, user with no business membership yet -> /onboarding.
// Wrapped in React's cache() so a layout and its page can both call this
// within one request without issuing the membership query twice.
//
// This is a UX guard, not the security boundary — RLS (see
// supabase/migrations/0002_multi_tenant.sql) is what actually stops a user
// from reading or writing another business's rows even if this check were
// bypassed.
export const requireBusiness = cache(async (): Promise<BusinessContext> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: membership } = await supabase
    .from('business_members')
    .select('role, business:businesses(*)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (!membership || !membership.business) redirect('/onboarding');

  return {
    userId: user.id,
    userEmail: user.email ?? null,
    business: membership.business as unknown as Business,
    role: membership.role as BusinessRole,
  };
});
