import { ProductGrid } from '@/components/features/catalog/ProductGrid';

export function TopProductsGrid() {
  // TODO: Replace with real DB query in Phase 2
  return (
    <div className="text-center text-graphite">
      <ProductGrid products={[]} />
    </div>
  );
}
