import { getDashboardChartData } from '@/services/admin.service';
import { TimelineChartClient } from './chart-renderers';

export async function DashboardTimelineChart() {
  const data = await getDashboardChartData();

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="mb-4 font-semibold text-sm">Órdenes (últimos 7 días)</h3>
      <TimelineChartClient data={data.timeline} />
    </div>
  );
}
