'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface CatalogFiltersProps {
  categories: string[];
  rarities: string[];
}

export function CatalogFilters({ categories, rarities }: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') ?? '';
  const activeRarity = searchParams.get('rarity') ?? '';
  const activeStock = searchParams.get('stock') === 'true';

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-3">
      {/* Stock filter */}
      <button
        onClick={() => updateParam('stock', activeStock ? '' : 'true')}
        data-active={activeStock}
        className="rounded-full border border-silver-mist px-4 py-1.5 text-body-sm text-ink transition-colors data-[active=true]:bg-ink data-[active=true]:text-snow"
      >
        En stock
      </button>

      {/* Category filter */}
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() =>
            updateParam('category', cat === activeCategory ? '' : cat)
          }
          data-active={cat === activeCategory}
          className="rounded-full border border-silver-mist px-4 py-1.5 text-body-sm text-ink transition-colors data-[active=true]:bg-ink data-[active=true]:text-snow"
        >
          {cat}
        </button>
      ))}

      {/* Rarity filter */}
      {rarities.map((rar) => (
        <button
          key={rar}
          onClick={() =>
            updateParam('rarity', rar === activeRarity ? '' : rar)
          }
          data-active={rar === activeRarity}
          className="rounded-full border border-silver-mist px-4 py-1.5 text-body-sm text-ink transition-colors data-[active=true]:bg-ink data-[active=true]:text-snow"
        >
          {rar}
        </button>
      ))}
    </div>
  );
}
