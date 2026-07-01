import { Breadcrumbs } from '@/components/features/admin/Breadcrumbs';
import { Pagination } from '@/components/features/admin/Pagination';
import { UsersTable } from '@/components/features/admin/UsersTable';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { getAllUsersAction } from '@/actions/admin.actions';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: `Usuarios — Admin`,
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page) || 1);

  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const currentUserId = currentUser?.id ?? '';
  const currentUserRole = (currentUser?.user_metadata?.role as string) ?? 'user';

  const result = await getAllUsersAction({ page: currentPage, pageSize: 10 });

  const isError = 'error' in result;

  const userData = !isError && 'data' in result ? result.data : [];
  const total = !isError && 'total' in result ? result.total : 0;
  const totalPages = !isError && 'totalPages' in result ? result.totalPages : 1;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: ADMIN_I18N.breadcrumbs.home, href: '/admin/dashboard' },
          { label: ADMIN_I18N.pageTitles.users },
        ]}
      />
      <div className='flex items-center gap-2'>
        <h1 className="text-2xl font-bold self-end">{ADMIN_I18N.pageTitles.users}</h1>
        <p className="text-sm text-muted-foreground self-end">
            {total} usuario{total !== 1 ? 's' : ''} en total
          </p>
      </div>

      {isError ? (
        <p className="text-destructive">{ADMIN_I18N.errors.generic}</p>
      ) : userData.length === 0 ? (
        <p className="text-muted-foreground">{ADMIN_I18N.empty.noUsers}</p>
      ) : (
        <>
          <UsersTable users={userData} currentUserId={currentUserId} currentUserRole={currentUserRole} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/users"
          />

          
        </>
      )}
    </div>
  );
}
