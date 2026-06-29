import { Breadcrumbs } from '@/components/features/admin/Breadcrumbs';
import { Pagination } from '@/components/features/admin/Pagination';
import { OrderActions } from '@/components/features/admin/OrderActions';
import { Badge } from '@/components/ui/badge';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { getOrdersList } from '@/actions/admin.actions';

export const metadata = {
  title: `Órdenes — Admin`,
};

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

const T = ADMIN_I18N.tables;
const S = ADMIN_I18N.statuses;

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  reservado: 'secondary',
  pagado: 'default',
  cancelado: 'destructive',
};

export default async function OrdersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page) || 1);
  const statusFilter = sp.status ?? '';

  const result = await getOrdersList({
    page: currentPage,
    pageSize: 10,
    status: statusFilter || undefined,
  });

  if ('error' in result) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumbs
          items={[
            { label: ADMIN_I18N.breadcrumbs.home, href: '/admin/dashboard' },
            { label: ADMIN_I18N.pageTitles.orders },
          ]}
        />
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const orders = 'data' in result ? result.data : [];
  const total = 'total' in result ? result.total : 0;
  const totalPages = 'totalPages' in result ? result.totalPages : 1;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: ADMIN_I18N.breadcrumbs.home, href: '/admin/dashboard' },
          { label: ADMIN_I18N.pageTitles.orders },
        ]}
      />

      <h1 className="text-2xl font-bold">{ADMIN_I18N.pageTitles.orders}</h1>

      <form method="GET" action="/admin/orders" className="flex flex-wrap gap-2">
        <select
          name="status"
          className="rounded-lg border bg-background px-3 py-2 text-sm"
          defaultValue={statusFilter}
        >
          <option value="">{ADMIN_I18N.filters.allStatuses}</option>
          <option value="reservado">{ADMIN_I18N.statuses.reservado}</option>
          <option value="pagado">{ADMIN_I18N.statuses.pagado}</option>
          <option value="cancelado">{ADMIN_I18N.statuses.cancelado}</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          {ADMIN_I18N.buttons.filter}
        </button>
      </form>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">{ADMIN_I18N.empty.noOrders}</p>
      ) : (
        <>
          <div className="rounded-xl border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.product}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.total}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.status}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.paymentMethod}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.date}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">{T.actions}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: Record<string, unknown>, index: number) => (
                  <tr
                    key={order.id as string}
                    className={index % 2 === 1 ? 'bg-muted/30' : 'bg-white'}
                  >
                    <td className="px-4 py-3 text-sm">Pedido #{String(order.id).slice(0, 8)}</td>
                    <td className="px-4 py-3 text-sm">${Number(order.total_ars).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANTS[order.status as string] ?? 'outline'}>
                        {S[order.status as keyof typeof S] ?? String(order.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {String(order.payment_method ?? order.paymentMethod)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(String(order.created_at ?? order.createdAt)).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <OrderActions
                        orderId={order.id as string}
                        status={(order.status as 'reservado' | 'pagado' | 'cancelado') ?? 'reservado'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/orders"
          />

          <p className="text-sm text-muted-foreground">
            {total} orden{total !== 1 ? 'es' : ''} en total
          </p>
        </>
      )}
    </div>
  );
}
