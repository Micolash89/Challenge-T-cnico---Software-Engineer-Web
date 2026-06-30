import { notFound } from 'next/navigation';
import { ProductGrid } from '@/components/features/catalog/ProductGrid';
import { CatalogFilters } from '@/components/features/catalog/CatalogFilters';
import { getProductsByLine, getProductSorts } from '@/services/product.service';
import { VALID_PRODUCT_LINES } from '@/constants/database.constants';
//import { Pagination } from '@/components/features/catalog/Pagination';

export const dynamic = 'force-dynamic';

interface CatalogPageProps {
  params: Promise<{ product_line_name: string }>;
  searchParams: Promise<{
    stock?: string;
    category?: string;
    rarity?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product_line_name: string }>;
}) {
  const { product_line_name } = await params;
  const displayName = product_line_name.toUpperCase();

  return {
    title: `${displayName} — Catálogo`,
    description: `Explora todas las cartas y boxes de ${displayName}`,
  };
}

export default async function CatalogPage({
  params,
  searchParams,
}: CatalogPageProps) {
  const { product_line_name } = await params;

  if (!VALID_PRODUCT_LINES.includes(product_line_name as typeof VALID_PRODUCT_LINES[number])) {
    notFound();
  }

  const { stock, category, rarity, page } = await searchParams;

  const [products, sorts] = await Promise.all([
    getProductsByLine({
      productLine: product_line_name,
      onlyInStock: stock === 'true',
      category,
      rarity,
      page: Number(page ?? 1),
    }),
    getProductSorts(product_line_name),
  ]);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-heading font-semibold text-ink">
          {product_line_name.toUpperCase()}
        </h1>
        <p className="mt-1 text-body text-graphite">
          {products.total} productos encontrados
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 overflow-x-auto pb-2">
        <CatalogFilters
          categories={sorts.categories}
          rarities={sorts.rarities}
        />
      </div>

      {/* Grid */}
      <ProductGrid products={products.data} />

      {/* Pagination */}
      {/* <Pagination currentPage={products.page} totalPages={products.totalPages} /> */}
    </div>
  );
}
