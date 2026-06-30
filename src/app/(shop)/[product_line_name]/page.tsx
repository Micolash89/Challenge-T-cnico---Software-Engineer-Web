"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductGrid } from "@/components/features/catalog/ProductGrid";
import { CatalogFilters } from "@/components/features/catalog/CatalogFilters";
import { Pagination } from "@/components/features/catalog/Pagination";
import { getProductsByLineAction, getProductSortsAction } from "@/actions/product.actions";
import type { DataProduct, DataSorts } from "@/types/product.types";

function CatalogContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const productLine = params.product_line_name as string;

  const [products, setProducts] = useState<DataProduct | null>(null);
  const [sorts, setSorts] = useState<DataSorts | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSorts, setLoadingSorts] = useState(true);
  const stock = searchParams.get("stock") === "true";
  const category = searchParams.get("category") ?? undefined;
  const rarity = searchParams.get("rarity") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const page = Number(searchParams.get("page") ?? 1);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const data = await getProductsByLineAction({
          productLine,
          onlyInStock: stock,
          category,
          rarity,
          search,
          page,
        });
        if (!cancelled) setProducts(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productLine, stock, category, rarity, search, page]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadingSorts(true);
      try {
        const data = await getProductSortsAction(productLine);
        if (!cancelled) setSorts(data);
      } finally {
        if (!cancelled) setLoadingSorts(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productLine]);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-heading font-semibold text-ink">
          {productLine.toUpperCase()}
        </h1>
        {loading ? (
          <Skeleton className="mt-1 h-4 w-36 bg-silver-mist" />
        ) : (
          <p className="mt-1 text-body text-graphite">
            {products?.total ?? 0} productos encontrados
          </p>
        )}
      </div>

      <div className="mb-8">
        {loadingSorts ? (
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-9 w-64 rounded-lg bg-silver-mist" />
            <Skeleton className="h-9 w-24 rounded-lg bg-silver-mist" />
            <Skeleton className="h-9 w-36 rounded-lg bg-silver-mist" />
            <Skeleton className="h-9 w-36 rounded-lg bg-silver-mist" />
          </div>
        ) : (
          sorts && <CatalogFilters categories={sorts.categories} rarities={sorts.rarities} />
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-lg bg-snow">
              <div className="relative aspect-square overflow-hidden bg-fog">
                <Skeleton className="h-full w-full rounded-none bg-silver-mist" />
              </div>
              <div className="flex flex-col gap-1 px-5 pt-3 pb-2">
                <Skeleton className="h-3 w-20 bg-silver-mist" />
                <Skeleton className="h-4 w-40 bg-silver-mist" />
                <Skeleton className="h-5 w-24 bg-silver-mist" />
              </div>
              <div className="px-5 pb-4">
                <Skeleton className="h-10 w-full rounded-md bg-silver-mist" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        products && <ProductGrid products={products.data} />
      )}

      {products && products.totalPages > 1 && (
        <Pagination currentPage={products.page} totalPages={products.totalPages} />
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={null}>
      <CatalogContent />
    </Suspense>
  );
}
