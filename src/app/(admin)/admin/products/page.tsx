import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/features/admin/Breadcrumbs';
import { Pagination } from '@/components/features/admin/Pagination';
import { DeleteProductButton } from '@/components/features/admin/DeleteProductButton';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { getAllProductsAction } from '@/actions/admin.actions';

export const metadata = {
  title: `Productos — Admin`,
};

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string; rarity?: string; stock?: string }>;
}

const T = ADMIN_I18N.tables;
const B = ADMIN_I18N.buttons;

export default async function ProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page) || 1);
  const categoryFilter = sp.category ?? '';
  const rarityFilter = sp.rarity ?? '';
  const stockFilter = sp.stock ?? '';

  const result = await getAllProductsAction({
    page: currentPage,
    pageSize: 10,
    category: categoryFilter || undefined,
    rarity: rarityFilter || undefined,
    stock: stockFilter || undefined,
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
  const total = 'total' in result ? result.total : 0;
  const totalPages = 'totalPages' in result ? result.totalPages : 1;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: ADMIN_I18N.breadcrumbs.home, href: '/admin/dashboard' },
          { label: ADMIN_I18N.pageTitles.products },
        ]}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{ADMIN_I18N.pageTitles.products}</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-1 h-4 w-4" />
            {B.newProduct}
          </Link>
        </Button>
      </div>

      <form method="GET" action="/admin/products" className="flex flex-wrap gap-2">
        <input
          type="text"
          name="category"
          placeholder={ADMIN_I18N.filters.category}
          defaultValue={categoryFilter}
          className="rounded-lg border bg-background px-3 py-2 text-sm"
        />
        <input
          type="text"
          name="rarity"
          placeholder={ADMIN_I18N.filters.rarity}
          defaultValue={rarityFilter}
          className="rounded-lg border bg-background px-3 py-2 text-sm"
        />
        <select
          name="stock"
          className="rounded-lg border bg-background px-3 py-2 text-sm"
          defaultValue={stockFilter}
        >
          <option value="">{ADMIN_I18N.buttons.clear}</option>
          <option value="true">{ADMIN_I18N.filters.inStock}</option>
          <option value="false">{ADMIN_I18N.filters.outOfStock}</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          {ADMIN_I18N.buttons.filter}
        </button>
      </form>

      {productsData.length === 0 ? (
        <p className="text-muted-foreground">{ADMIN_I18N.empty.noProducts}</p>
      ) : (
        <>
          <div className="rounded-xl border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.name}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.category}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.rarity}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.stock}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.price}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">{T.actions}</th>
                </tr>
              </thead>
              <tbody>
                {productsData.map((product, index) => (
                  <tr
                    key={product.id}
                    className={index % 2 === 1 ? 'bg-muted/30' : 'bg-white'}
                  >
                    <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{product.category}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{product.rarity}</td>
                    <td className="px-4 py-3 text-sm">{product.stock}</td>
                    <td className="px-4 py-3 text-sm">${Number(product.price_ars).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>{B.edit}</Link>
                        </Button>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/products"
          />

          <p className="text-sm text-muted-foreground">
            {total} producto{total !== 1 ? 's' : ''} en total
          </p>
        </>
      )}
    </div>
  );
}
