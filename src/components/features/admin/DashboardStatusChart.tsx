import { getDashboardChartData } from '@/services/admin.service';
import { StatusChartClient } from './chart-renderers';

export async function DashboardStatusChart() {
  const data = await getDashboardChartData();

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="mb-4 font-semibold text-sm">Estado de Órdenes</h3>
      <StatusChartClient data={data.statusDistribution} />
    </div>
  );
}
