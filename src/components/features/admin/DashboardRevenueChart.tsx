import { getDashboardChartData } from '@/services/admin.service';
import { RevenueChartClient } from './chart-renderers';

export async function DashboardRevenueChart() {
  const data = await getDashboardChartData();

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="mb-4 font-semibold text-sm">Ingresos (últimos 7 días)</h3>
      <RevenueChartClient data={data.revenue} />
    </div>
  );
}
