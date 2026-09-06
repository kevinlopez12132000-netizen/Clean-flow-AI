import { Sidebar } from '@/components/sidebar';
import { SignOutButton } from '@/components/sign-out-button';
import { requireBusiness } from '@/lib/business';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { business, userEmail } = await requireBusiness();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <div>
            <p className="text-sm font-medium text-slate-900">{business.name}</p>
            <p className="text-xs text-slate-500">{userEmail}</p>
          </div>
          <SignOutButton />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
