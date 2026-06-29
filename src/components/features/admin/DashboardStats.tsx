import Link from 'next/link';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';

interface DashboardStatsProps {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

const D = ADMIN_I18N.dashboard;

export function DashboardStats({
  totalProducts,
  totalOrders,
  totalRevenue,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Link
        href="/admin/products"
        className="rounded-xl border bg-card p-6 transition-colors hover:bg-accent/50"
      >
        <p className="text-sm text-muted-foreground">{D.products}</p>
        <p className="mt-2 text-3xl font-bold">{totalProducts}</p>
      </Link>

      <Link
        href="/admin/orders"
        className="rounded-xl border bg-card p-6 transition-colors hover:bg-accent/50"
      >
        <p className="text-sm text-muted-foreground">{D.orders}</p>
        <p className="mt-2 text-3xl font-bold">{totalOrders}</p>
      </Link>

      <Link
        href="/admin/orders"
        className="rounded-xl border bg-card p-6 transition-colors hover:bg-accent/50"
      >
        <p className="text-sm text-muted-foreground">{D.revenue}</p>
        <p className="mt-2 text-3xl font-bold">${totalRevenue}</p>
      </Link>
    </div>
  );
}
