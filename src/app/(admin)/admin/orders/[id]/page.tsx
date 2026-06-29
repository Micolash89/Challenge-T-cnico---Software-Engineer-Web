import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/features/admin/Breadcrumbs';
import { OrderActions } from '@/components/features/admin/OrderActions';
import { Badge } from '@/components/ui/badge';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { getOrderDetail } from '@/actions/admin.actions';

export const metadata = {
  title: `Pedido — Admin`,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const T = ADMIN_I18N.tables;
const S = ADMIN_I18N.statuses;

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  reservado: 'secondary',
  pagado: 'default',
  cancelado: 'destructive',
};

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getOrderDetail(id);

  if ('error' in result) {
    notFound();
  }

  const order = result as Record<string, unknown>;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: ADMIN_I18N.breadcrumbs.home, href: '/admin/dashboard' },
          { label: ADMIN_I18N.breadcrumbs.orders, href: '/admin/orders' },
          { label: `${ADMIN_I18N.breadcrumbs.orderDetail} #${String(order.id).slice(0, 8)}` },
        ]}
      />

      <h1 className="text-2xl font-bold">
        {ADMIN_I18N.breadcrumbs.orderDetail} #{String(order.id).slice(0, 8)}
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order info */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Información del Pedido</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{T.status}</dt>
              <dd>
                <Badge variant={STATUS_VARIANTS[order.status as string] ?? 'outline'}>
                  {S[order.status as keyof typeof S] ?? String(order.status)}
                </Badge>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{T.total}</dt>
              <dd className="font-medium">${Number(order.total_ars).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{T.paymentMethod}</dt>
              <dd>{String(order.payment_method ?? order.paymentMethod)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{T.date}</dt>
              <dd>{new Date(String(order.created_at ?? order.createdAt)).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        {/* Actions */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Acciones</h2>
          <OrderActions
            orderId={order.id as string}
            status={(order.status as 'reservado' | 'pagado' | 'cancelado') ?? 'reservado'}
          />
        </div>
      </div>

      {/* Order items */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Productos</h2>
        {order.items && (order.items as Array<Record<string, unknown>>).length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.product}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Cantidad</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Precio</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(order.items as Array<Record<string, unknown>>).map((item: Record<string, unknown>, index: number) => (
                <tr
                  key={item.id as string}
                  className={index % 2 === 1 ? 'bg-muted/30' : 'bg-white'}
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      {Boolean(item.productImg ?? item.product_img) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={String(item.productImg ?? item.product_img)}
                          alt={String(item.productName ?? item.product_name)}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      )}
                      <span>{String(item.productName ?? item.product_name ?? item.name)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{String(item.quantity)}</td>
                  <td className="px-4 py-3 text-sm">${Number(item.priceArsAtPurchase ?? item.price_ars_at_purchase ?? item.price).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-sm">
                    ${(Number(item.quantity) * Number(item.priceArsAtPurchase ?? item.price_ars_at_purchase ?? item.price)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-muted-foreground">No hay productos en este pedido</p>
        )}
      </div>
    </div>
  );
}
