import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Breadcrumbs } from '@/components/features/admin/Breadcrumbs';
import { UserRoleBadge } from '@/components/features/admin/UserRoleBadge';
import { UserEditForm } from '@/components/features/admin/UserEditForm';
import { UserRoleControls } from '@/components/features/admin/UserRoleControls';
import { UserOrdersTable } from '@/components/features/admin/UserOrdersTable';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import {
  getUserByIdAction,
  updateUserAction,
  promoteUserAction,
  demoteUserAction,
  getOrdersByUserAction,
} from '@/actions/admin.actions';

export const metadata = {
  title: `Usuario — Admin`,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const result = await getUserByIdAction(id);

  if ('error' in result) {
    notFound();
  }

  const user = result as { id: string; email?: string; name?: string; role: string };

  const ordersResult = await getOrdersByUserAction(id);
  const orders = Array.isArray(ordersResult) ? ordersResult : [];

  const userOrders = orders.map((o: Record<string, unknown>) => ({
    id: o.id as string,
    status: (o.status as 'reservado' | 'pagado' | 'cancelado') ?? 'reservado',
    totalArs: Number(o.total_ars ?? o.totalArs ?? 0),
    createdAt: String(o.created_at ?? o.createdAt ?? ''),
  }));

  const promote = async (userId: string) => {
    'use server';
    await promoteUserAction(userId);
  };

  const demote = async (userId: string) => {
    'use server';
    await demoteUserAction(userId);
  };

  const editAction = async (
    prev: { error?: string; success?: boolean } | null,
    formData: FormData,
  ): Promise<{ error?: string; success?: boolean }> => {
    'use server';
    const result = await updateUserAction(id, prev, formData);
    return result ?? { success: true };
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: ADMIN_I18N.breadcrumbs.home, href: '/admin/dashboard' },
          { label: ADMIN_I18N.breadcrumbs.users, href: '/admin/users' },
          { label: user.name ?? user.email ?? 'Usuario' },
        ]}
      />

      <h1 className="text-2xl font-bold">
        {user.name ?? 'Usuario'}
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User info */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Información del Usuario</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{ADMIN_I18N.tables.name}</dt>
              <dd>{user.name ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{ADMIN_I18N.tables.email}</dt>
              <dd>{user.email ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{ADMIN_I18N.tables.role}</dt>
              <dd>
                <UserRoleBadge role={user.role} />
              </dd>
            </div>
          </dl>
        </div>

        {/* Role management */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Rol</h2>
          <UserRoleControls
            targetUserId={id}
            currentUserId={currentUser?.id ?? ''}
            currentRole={user.role}
            onPromote={promote}
            onDemote={demote}
          />
        </div>
      </div>

      {/* Edit user */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Editar Usuario</h2>
        <UserEditForm
          action={editAction}
          defaultValues={{
            name: user.name ?? '',
            email: user.email ?? '',
          }}
        />
      </div>

      {/* User orders */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Órdenes del Usuario</h2>
        {userOrders.length > 0 ? (
          <UserOrdersTable orders={userOrders} />
        ) : (
          <p className="text-sm text-muted-foreground">Este usuario no tiene órdenes</p>
        )}
      </div>
    </div>
  );
}
