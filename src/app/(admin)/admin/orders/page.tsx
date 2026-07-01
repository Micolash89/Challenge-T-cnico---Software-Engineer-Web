import { Breadcrumbs } from "@/components/features/admin/Breadcrumbs";
import { OrdersFilters } from "@/components/features/admin/OrdersFilters";
import { Pagination } from "@/components/features/admin/Pagination";
import { OrdersTable } from "@/components/features/admin/OrdersTable";
import { ADMIN_I18N } from "@/constants/admin-i18n.constants";
import { getOrdersList } from "@/actions/admin.actions";

export const metadata = {
  title: `Órdenes — Admin`,
};

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page) || 1);
  const statusFilter = sp.status ?? "";

  const result = await getOrdersList({
    page: currentPage,
    pageSize: 10,
    status: statusFilter || undefined,
  });

  if ("error" in result) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumbs
          items={[
            { label: ADMIN_I18N.breadcrumbs.home, href: "/admin/dashboard" },
            { label: ADMIN_I18N.pageTitles.orders },
          ]}
        />
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const orders = "data" in result ? result.data : [];
  const total = "total" in result ? result.total : 0;
  const totalPages = "totalPages" in result ? result.totalPages : 1;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: ADMIN_I18N.breadcrumbs.home, href: "/admin/dashboard" },
          { label: ADMIN_I18N.pageTitles.orders },
        ]}
      />

      <div className="flex  gap-1 ">
        <h1 className="text-2xl font-bold self-end">{ADMIN_I18N.pageTitles.orders}</h1>
        <p className="text-sm text-muted-foreground self-end">
          {total} orden{total !== 1 ? "es" : ""} en total
        </p>
      </div>

      <OrdersFilters statusFilter={statusFilter} />

      {orders.length === 0 ? (
        <p className="text-muted-foreground">{ADMIN_I18N.empty.noOrders}</p>
      ) : (
        <>
          <OrdersTable orders={orders} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/orders"
          />
        </>
      )}
    </div>
  );
}
