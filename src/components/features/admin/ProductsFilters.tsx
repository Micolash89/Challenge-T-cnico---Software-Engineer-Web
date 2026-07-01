'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Search, Package, Sparkles, PackageCheck, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';

interface ProductsFiltersProps {
  categories: string[];
  rarities: string[];
}

export function ProductsFilters({ categories, rarities }: ProductsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') ?? '';
  const activeRarity = searchParams.get('rarity') ?? '';
  const activeSearch = searchParams.get('search') ?? '';
  const activeStock = searchParams.get('stock') ?? '';
  const activeFilter = searchParams.get('active') ?? '';

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
      router.push(`/admin/products?${params.toString()}`);
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
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          defaultValue={activeSearch}
          onChange={(e) => debouncedSearch(e.target.value)}
          placeholder="Buscar productos..."
          className="h-9 w-full pl-9"
        />
      </div>

      {/* Stock toggle */}
      <Button
        variant={activeStock === 'true' ? 'default' : 'outline'}
        size="sm"
        onClick={() => updateParams({ stock: activeStock === 'true' ? '' : 'true' })}
        className="h-9 gap-1.5"
      >
        <PackageCheck className="size-4" />
        En stock
      </Button>

      {/* Inactive toggle */}
      <Button
        variant={activeFilter === 'false' ? 'default' : 'outline'}
        size="sm"
        onClick={() => updateParams({ active: activeFilter === 'false' ? '' : 'false' })}
        className="h-9 gap-1.5"
      >
        <EyeOff className="size-4" />
        Inactivos
      </Button>

      {/* Category Select */}
      <Select
        value={activeCategory}
        onValueChange={(value) => updateParams({ category: value === 'all' ? '' : value })}
      >
        <SelectTrigger className="h-9 min-w-[140px]">
          <SelectValue placeholder={ADMIN_I18N.filters.category} />
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
        <SelectTrigger className="h-9 min-w-[140px]">
          <SelectValue placeholder={ADMIN_I18N.filters.rarity} />
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
