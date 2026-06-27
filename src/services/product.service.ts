import { eq, and, gt, asc, count } from 'drizzle-orm';
import { db as getDb } from '@/db';
import { products } from '@/db/schema';
import type { Product, DataProduct, DataSorts } from '@/types/product.types';

export interface GetProductsParams {
  productLine: string;
  onlyInStock?: boolean;
  category?: string;
  rarity?: string;
  page?: number;
  pageSize?: number;
}

export async function getProductsByLine(
  params: GetProductsParams,
): Promise<DataProduct> {
  const {
    productLine,
    onlyInStock = false,
    category,
    rarity,
    page = 1,
    pageSize = 20,
  } = params;

  const conditions = [
    eq(products.productLineName, productLine),
    eq(products.active, true),
  ];

  if (onlyInStock) {
    conditions.push(gt(products.stock, 0));
  }

  if (category) {
    conditions.push(eq(products.category, category));
  }

  if (rarity) {
    conditions.push(eq(products.rarity, rarity));
  }

  const where = and(...conditions);

  const [totalResult] = await getDb()
    .select({ total: count() })
    .from(products)
    .where(where);

  const total = Number(totalResult?.total ?? 0);
  const totalPages = Math.ceil(total / pageSize);

  const data = await getDb()
    .select()
    .from(products)
    .where(where)
    .orderBy(asc(products.name))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return {
    data: data as unknown as Product[],
    page,
    limit: pageSize,
    total,
    totalPages,
  };
}

export async function getProductBySlug(
  productLine: string,
  slug: string,
): Promise<Product | null> {
  const [product] = await getDb()
    .select()
    .from(products)
    .where(
      and(
        eq(products.productLineName, productLine),
        eq(products.slug, slug),
        eq(products.active, true),
      ),
    )
    .limit(1);

  return (product as unknown as Product) ?? null;
}

export async function getProductSorts(
  productLine: string,
): Promise<DataSorts> {
  const allProducts = await getDb()
    .select({
      category: products.category,
      rarity: products.rarity,
    })
    .from(products)
    .where(
      and(
        eq(products.productLineName, productLine),
        eq(products.active, true),
      ),
    );

  const categories = [
    ...new Set(allProducts.map((p: { category: string }) => p.category)),
  ].sort();
  const rarities = [
    ...new Set(allProducts.map((p: { rarity: string }) => p.rarity)),
  ].sort();

  return { categories, rarities };
}

export async function getTopProducts(
  limit = 8,
): Promise<Product[]> {
  const data = await getDb()
    .select()
    .from(products)
    .where(eq(products.active, true))
    .orderBy(asc(products.name))
    .limit(limit);

  return data as unknown as Product[];
}
