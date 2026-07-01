'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  createProductSchema,
  updateProductSchema,
} from '@/lib/validations/product.schema';
import {
  createProduct,
  updateProduct,
  softDeleteProduct,
  reactivateProduct,
  getProductsByLine,
  getProductSorts,
} from '@/services/product.service';
import type { GetProductsParams } from '@/services/product.service';

export interface ActionResult {
  error?: string;
  success?: boolean;
}

async function checkAdminAuth(): Promise<{ error: string } | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !['admin', 'super_admin'].includes(user.user_metadata?.role)) {
    return { error: 'Unauthorized' };
  }

  return null;
}

export async function createProductAction(
  _prev: ActionResult | null | undefined,
  formData: FormData,
): Promise<ActionResult | undefined> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const raw = Object.fromEntries(formData.entries());
  const parsed = createProductSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Invalid data';
    return { error: firstError };
  }

  await createProduct(parsed.data);

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function updateProductAction(
  id: string,
  _prev: ActionResult | null | undefined,
  formData: FormData,
): Promise<ActionResult | undefined> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const raw = Object.fromEntries(formData.entries());
  const parsed = updateProductSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Invalid data';
    return { error: firstError };
  }

  await updateProduct(id, parsed.data);

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function softDeleteProductAction(
  id: string,
): Promise<ActionResult> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const deleted = await softDeleteProduct(id);

  if (!deleted) {
    return { success: false, error: 'Producto no encontrado' };
  }

  revalidatePath('/admin/products');
  return { success: true };
}

export async function reactivateProductAction(
  id: string,
): Promise<ActionResult> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const product = await reactivateProduct(id);

  if (!product) {
    return { success: false, error: 'Producto no encontrado' };
  }

  revalidatePath('/admin/products');
  return { success: true };
}

export async function getProductsByLineAction(params: GetProductsParams) {
  return getProductsByLine(params);
}

export async function getProductSortsAction(productLine: string) {
  return getProductSorts(productLine);
}
