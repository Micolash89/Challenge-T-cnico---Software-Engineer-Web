import { Breadcrumbs } from '@/components/features/admin/Breadcrumbs';
import { Pagination } from '@/components/features/admin/Pagination';
import { ProductsTable } from '@/components/features/admin/ProductsTable';
import { ProductsFilters } from '@/components/features/admin/ProductsFilters';
import { ProductsHeader } from '@/components/features/admin/ProductsHeader';
import { getAllProductsAction, getProductSortsAdminAction } from '@/actions/admin.actions';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';

export const metadata = {
  title: `Productos — Admin`,
};

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string; rarity?: string; stock?: string; search?: string; active?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page) || 1);
  const categoryFilter = sp.category ?? '';
  const rarityFilter = sp.rarity ?? '';
  const stockFilter = sp.stock ?? '';
  const searchFilter = sp.search ?? '';
  const activeFilter = sp.active ?? '';

  const sortsResult = await getProductSortsAdminAction();
  const categories = 'categories' in sortsResult ? sortsResult.categories : [];
  const rarities = 'rarities' in sortsResult ? sortsResult.rarities : [];

  const result = await getAllProductsAction({
    page: currentPage,
    pageSize: 10,
    category: categoryFilter || undefined,
    rarity: rarityFilter || undefined,
    stock: stockFilter || undefined,
    search: searchFilter || undefined,
    active: activeFilter || undefined,
  });

  if ('error' in result && result.error) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumbs
          items={[
            { label: ADMIN_I18N.breadcrumbs.home, href: '/admin/dashboard' },
            { label: ADMIN_I18N.pageTitles.products },
          ]}
        />
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const productsData = 'data' in result ? result.data : [];
  const totalPages = 'totalPages' in result ? result.totalPages : 1;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: ADMIN_I18N.breadcrumbs.home, href: '/admin/dashboard' },
          { label: ADMIN_I18N.pageTitles.products },
        ]}
      />

      <ProductsHeader />

      <ProductsFilters categories={categories} rarities={rarities} />

      {productsData.length === 0 ? (
        <p className="text-muted-foreground">{ADMIN_I18N.empty.noProducts}</p>
      ) : (
        <>
          <ProductsTable products={productsData} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/products"
          />

        </>
      )}
    </div>
  );
}
