import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/features/admin/Breadcrumbs';
import { DashboardStats } from '@/components/features/admin/DashboardStats';
import { ChartSkeleton } from '@/components/features/admin/ChartSkeleton';
import { DashboardTimelineChart } from '@/components/features/admin/DashboardTimelineChart';
import { DashboardRevenueChart } from '@/components/features/admin/DashboardRevenueChart';
import { DashboardStatusChart } from '@/components/features/admin/DashboardStatusChart';
import { getDashboardMetricsAction } from '@/actions/admin.actions';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';

export const metadata = {
  title: `Panel de Control — Admin`,
};

export default async function DashboardPage() {
  const metrics = await getDashboardMetricsAction();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: ADMIN_I18N.breadcrumbs.home, href: '/admin/dashboard' },
          { label: ADMIN_I18N.pageTitles.dashboard },
        ]}
      />

      <h1 className="text-2xl font-bold">{ADMIN_I18N.pageTitles.dashboard}</h1>

      <DashboardStats
        totalProducts={metrics.totalProducts}
        totalOrders={metrics.totalOrders}
        totalRevenue={metrics.totalRevenue}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<ChartSkeleton />}>
          <DashboardTimelineChart />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <DashboardRevenueChart />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <DashboardStatusChart />
        </Suspense>
      </div>
    </div>
  );
}
