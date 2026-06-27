import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/constants/routes.constants';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="min-h-screen bg-fog">
      <header className="border-b border-silver-mist bg-snow">
        <div className="mx-auto flex h-11 max-w-[1200px] items-center justify-between px-5">
          <span className="font-heading text-lg font-semibold tracking-tight text-ink">
            Admin — TCG Store
          </span>
          <span className="text-caption text-graphite">
            {user.email}
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-5 py-10">
        {children}
      </main>
    </div>
  );
}
