import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/features/admin/AdminSidebar';
import { Toaster } from '@/components/ui/sonner';


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const role = user?.user_metadata?.role as string | undefined;
  if (!user || !['admin', 'super_admin'].includes(role ?? '')) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
