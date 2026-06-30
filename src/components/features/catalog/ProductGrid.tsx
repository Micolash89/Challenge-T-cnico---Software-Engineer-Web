import type { Product } from '@/types/product.types';
import { ProductCard } from './ProductCard';
import ButtonUp from '../layout/ButtonUp';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-20 text-center text-body text-graphite">
        No se encontraron productos.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      <ButtonUp/>
    </div>
  );
}
