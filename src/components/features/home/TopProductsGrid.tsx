import type { Product } from '@/types/product.types';
import { ProductCard } from '@/components/features/catalog/ProductCard';

interface TopProductsGridProps {
  products: Product[];
}

export function TopProductsGrid({ products }: TopProductsGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-10 text-center text-body text-graphite">
        No hay productos disponibles.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
