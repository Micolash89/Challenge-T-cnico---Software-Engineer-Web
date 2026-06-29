import { Breadcrumbs } from '@/components/features/admin/Breadcrumbs';
import { Pagination } from '@/components/features/admin/Pagination';
import { UsersTable } from '@/components/features/admin/UsersTable';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { getAllUsersAction } from '@/actions/admin.actions';

export const metadata = {
  title: `Usuarios — Admin`,
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page) || 1);

  const result = await getAllUsersAction({ page: currentPage, pageSize: 10 });

  if ('error' in result) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumbs
          items={[
            { label: ADMIN_I18N.breadcrumbs.home, href: '/admin/dashboard' },
            { label: ADMIN_I18N.pageTitles.users },
          ]}
        />
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const userData = 'data' in result ? result.data : [];
  const total = 'total' in result ? result.total : 0;
  const totalPages = 'totalPages' in result ? result.totalPages : 1;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: ADMIN_I18N.breadcrumbs.home, href: '/admin/dashboard' },
          { label: ADMIN_I18N.pageTitles.users },
        ]}
      />

      <h1 className="text-2xl font-bold">{ADMIN_I18N.pageTitles.users}</h1>

      {userData.length === 0 ? (
        <p className="text-muted-foreground">{ADMIN_I18N.empty.noUsers}</p>
      ) : (
        <>
          <UsersTable users={userData} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/users"
          />

          <p className="text-sm text-muted-foreground">
            {total} usuario{total !== 1 ? 's' : ''} en total
          </p>
        </>
      )}
    </div>
  );
}
