'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Search, Package, Sparkles, PackageCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CatalogFiltersProps {
  categories: string[];
  rarities: string[];
}

export function CatalogFilters({ categories, rarities }: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') ?? '';
  const activeRarity = searchParams.get('rarity') ?? '';
  const activeStock = searchParams.get('stock') !== 'false';
  const activeSearch = searchParams.get('search') ?? '';

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.delete('page');
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      updateParams({ search: value });
    },
    300,
  );

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-graphite" />
        <Input
          defaultValue={activeSearch}
          onChange={(e) => debouncedSearch(e.target.value)}
          placeholder="Buscar productos..."
          className="h-9 w-full rounded-lg border border-silver-mist bg-snow pl-9 text-body-sm text-ink placeholder:text-graphite/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {/* Stock toggle */}
      <Button
        variant={activeStock ? "default" : "outline"}
        size="sm"
        onClick={() => updateParams({ stock: activeStock ? 'false' : '' })}
        className="h-9 gap-1.5"
      >
        {activeStock ? (
          <PackageCheck className="size-4" />
        ) : (
          <Package className="size-4" />
        )}
        En stock
      </Button>

      {/* Category Select */}
      <Select
        value={activeCategory}
        onValueChange={(value) => updateParams({ category: value === 'all' ? '' : value })}
      >
        <SelectTrigger className="h-9 min-w-[140px] rounded-lg border border-silver-mist bg-snow text-body-sm text-ink">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <span className="flex items-center gap-2">
              <Package className="size-4" />
              Todas
            </span>
          </SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Rarity Select */}
      <Select
        value={activeRarity}
        onValueChange={(value) => updateParams({ rarity: value === 'all' ? '' : value })}
      >
        <SelectTrigger className="h-9 min-w-[140px] rounded-lg border border-silver-mist bg-snow text-body-sm text-ink">
          <SelectValue placeholder="Rareza" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <span className="flex items-center gap-2">
              <Sparkles className="size-4" />
              Todas
            </span>
          </SelectItem>
          {rarities.map((rar) => (
            <SelectItem key={rar} value={rar}>
              {rar}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
