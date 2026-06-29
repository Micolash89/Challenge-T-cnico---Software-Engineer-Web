import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  status: 'reservado' | 'pagado' | 'cancelado';
  totalArs: number;
  createdAt: string;
}

interface UserOrdersTableProps {
  orders: OrderItem[];
}

const T = ADMIN_I18N.tables;
const S = ADMIN_I18N.statuses;

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  reservado: 'secondary',
  pagado: 'default',
  cancelado: 'destructive',
};

export function UserOrdersTable({ orders }: UserOrdersTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.product}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.total}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.status}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.date}</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">{T.actions}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={order.id}
              className={cn(
                'border-b last:border-b-0',
                index % 2 === 1 ? 'bg-muted/30' : 'bg-white',
              )}
            >
              <td className="px-4 py-3 text-sm">Pedido #{order.id.slice(0, 8)}</td>
              <td className="px-4 py-3 text-sm">${order.totalArs}</td>
              <td className="px-4 py-3">
                <Badge variant={STATUS_VARIANTS[order.status] ?? 'outline'}>
                  {S[order.status] ?? order.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    aria-label={`${ADMIN_I18N.buttons.view} Pedido #${order.id.slice(0, 8)}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
