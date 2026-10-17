import { Suspense } from 'react';
import { getProductsByLineAction, getProductSortsAction } from "@/actions/product.actions";
import { ProductGrid } from "@/components/features/catalog/ProductGrid";
import { CatalogFilters } from "@/components/features/catalog/CatalogFilters";
import { Pagination } from "@/components/features/catalog/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface CatalogPageProps {
  params: Promise<{ product_line_name: string }>;
  searchParams: Promise<{
    stock?: string;
    category?: string;
    rarity?: string;
    search?: string;
    page?: string;
  }>;
}

async function CatalogContent({ params, searchParams }: CatalogPageProps) {
  const { product_line_name } = await params;
  const sp = await searchParams;
  
  const stock = sp.stock !== "false";
  const category = sp.category ?? undefined;
  const rarity = sp.rarity ?? undefined;
  const search = sp.search ?? undefined;
  const page = Number(sp.page ?? 1);

  const [products, sorts] = await Promise.all([
    getProductsByLineAction({
      productLine: product_line_name,
      onlyInStock: stock,
      category,
      rarity,
      search,
      page,
    }),
    getProductSortsAction(product_line_name),
  ]);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-heading font-semibold text-ink">
          {product_line_name.toUpperCase()}
        </h1>
        <p className="mt-1 text-body text-graphite">
          {products.total} productos encontrados
        </p>
      </div>

      <div className="mb-8">
        <CatalogFilters categories={sorts.categories} rarities={sorts.rarities} />
      </div>

      <ProductGrid products={products.data} />

      {products.totalPages > 1 && (
        <Pagination currentPage={products.page} totalPages={products.totalPages} />
      )}
    </div>
  );
}

export default async function CatalogPage(props: CatalogPageProps) {
  return (
    <Suspense fallback={
        <div className="mx-auto w-full max-w-[1200px] px-5 py-10">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="flex flex-wrap gap-3 mb-8">
            <Skeleton className="h-9 w-64 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
    }>
      <CatalogContent {...props} />
    </Suspense>
  );
}
