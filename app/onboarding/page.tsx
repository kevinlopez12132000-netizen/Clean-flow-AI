import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OnboardingForm } from './onboarding-form';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <p className="text-xl font-semibold text-brand-700">CleanFlow-AI</p>
          <h1 className="mt-2 text-lg font-medium text-slate-900">Cuéntanos sobre tu negocio</h1>
          <p className="mt-1 text-sm text-slate-500">
            Esto configura tu cuenta. Podrás editarlo más adelante.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
