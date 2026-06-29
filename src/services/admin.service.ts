import { createClient } from '@/lib/supabase/server';

export interface DashboardChartData {
  timeline: Array<{ date: string; orders: number }>;
  revenue: Array<{ date: string; amount: number }>;
  statusDistribution: Array<{ name: string; value: number }>;
}

/**
 * Fetches chart data for the admin dashboard:
 * - Timeline: last 7 days order counts
 * - Revenue: last 7 days revenue from "pagado" orders
 * - Status distribution: order counts grouped by status
 */
export async function getDashboardChartData(): Promise<DashboardChartData> {
  const supabase = await createClient();

  // Calculate date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const since = sevenDaysAgo.toISOString();

  // Fetch all orders from last 7 days (the grouping happens in JS since we
  // need to handle both Supabase response format and potential missing dates)
  const { data: orders } = await supabase
    .from('orders')
    .select('created_at, status, total_ars')
    .gte('created_at', since);

  // Build date range for last 7 days
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  // Timeline: count orders per day
  const timeline = dates.map((date) => {
    const count =
      orders?.filter((o) => o.created_at?.startsWith(date))?.length ?? 0;
    return { date: date.slice(5), orders: count };
  });

  // Revenue: sum total_ars for "pagado" orders per day
  const pagados = orders?.filter((o) => o.status === 'pagado') ?? [];
  const revenue = dates.map((date) => {
    const amount =
      pagados
        .filter((o) => o.created_at?.startsWith(date))
        .reduce((sum, o) => sum + (Number(o.total_ars) || 0), 0) ?? 0;
    return { date: date.slice(5), amount };
  });

  // Status distribution: count orders by status
  const statusMap: Record<string, number> = {
    reservado: 0,
    pagado: 0,
    cancelado: 0,
  };
  for (const order of orders ?? []) {
    const s = order.status as string;
    if (s in statusMap) statusMap[s]++;
  }
  const statusDistribution = Object.entries(statusMap).map(
    ([name, value]) => ({ name, value }),
  );

  return { timeline, revenue, statusDistribution };
}
