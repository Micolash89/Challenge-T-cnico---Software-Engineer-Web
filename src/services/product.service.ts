import { eq, and, gt, asc, count, ilike } from 'drizzle-orm';
import { db as getDb } from '@/db';
import { products } from '@/db/schema';
import type { Product, DataProduct, DataSorts } from '@/types/product.types';
import type { CreateProductInput, UpdateProductInput } from '@/lib/validations/product.schema';

export interface GetProductsParams {
  productLine: string;
  onlyInStock?: boolean;
  category?: string;
  rarity?: string;
  search?: string;
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
    search,
    page = 1,
    pageSize = 20,
  } = params;

  const conditions = [
    eq(products.product_line_name, productLine),
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

  if (search) {
    conditions.push(ilike(products.name, `%${search}%`));
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

export async function getProductById(
  productLine: string,
  id: string,
): Promise<Product | null> {
  const [product] = await getDb()
    .select()
    .from(products)
    .where(
      and(
        eq(products.product_line_name, productLine),
        eq(products.id, id),
      ),
    )
    .limit(1);

  return (product as unknown as Product) ?? null;
}

export async function getProductSorts(
  product_line_name: string,
): Promise<DataSorts> {
  const allProducts = await getDb()
    .select({
      category: products.category,
      rarity: products.rarity,
    })
    .from(products)
    .where(
      and(
        eq(products.product_line_name, product_line_name),
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

export async function createProduct(data: CreateProductInput): Promise<Product> {
  const [product] = await getDb()
    .insert(products)
    .values({
      name: data.name,
      slug: data.slug,
      type: data.type,
      img: data.img,
      price: data.price,
      priceArs: String(data.priceArs),
      rarity: data.rarity,
      rarityCode: data.rarityCode,
      category: data.category,
      product_line_name: data.product_line_name,
      productId: data.productId,
      stock: data.stock,
      active: data.active,
      featured: data.featured,
    })
    .returning();

  if (!product) throw new Error('Failed to create product');
  return product as unknown as Product;
}

export async function updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.img !== undefined) updateData.img = data.img;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.priceArs !== undefined) updateData.priceArs = String(data.priceArs);
  if (data.rarity !== undefined) updateData.rarity = data.rarity;
  if (data.rarityCode !== undefined) updateData.rarityCode = data.rarityCode;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.product_line_name !== undefined) updateData.product_line_name = data.product_line_name;
  if (data.productId !== undefined) updateData.productId = data.productId;
  if (data.stock !== undefined) updateData.stock = data.stock;
  if (data.active !== undefined) updateData.active = data.active;
  if (data.featured !== undefined) updateData.featured = data.featured;

  const [product] = await getDb()
    .update(products)
    .set(updateData)
    .where(eq(products.id, id))
    .returning();

  if (!product) throw new Error('Product not found');
  return product as unknown as Product;
}

export async function deleteProduct(id: string): Promise<Product | null> {
  const [existing] = await getDb()
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!existing) return null;

  const [product] = await getDb()
    .delete(products)
    .where(eq(products.id, id))
    .returning();

  return (product as unknown as Product) ?? null;
}
