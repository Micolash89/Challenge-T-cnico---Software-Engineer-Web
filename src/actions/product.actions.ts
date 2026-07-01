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
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import type { GetProductsParams } from '@/services/product.service';

export interface ActionResult {
  error?: string;
  success?: boolean;
}

async function checkAdminAuth(): Promise<{ error: string } | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !['admin', 'super_admin'].includes(user.user_metadata?.role)) {
    return { error: ADMIN_I18N.errors.unauthorized };
  }

  return null;
}

function mapZodFirstError(issues: { message: string }[]): string {
  const E = ADMIN_I18N.errors;
  const msg = issues[0]?.message ?? E.generic;
  return msg;
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
    return { error: mapZodFirstError(parsed.error.issues) };
  }

  try {
    await createProduct(parsed.data);
  } catch {
    return { error: ADMIN_I18N.errors.productCreateFailed };
  }

  revalidatePath('/admin/products');
  return { success: true };
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
    return { error: mapZodFirstError(parsed.error.issues) };
  }

  await updateProduct(id, parsed.data);

  revalidatePath('/admin/products');
  return { success: true };
}

export async function softDeleteProductAction(
  id: string,
): Promise<ActionResult> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const deleted = await softDeleteProduct(id);

  if (!deleted) {
    return { success: false, error: ADMIN_I18N.errors.productNotFound };
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
    return { success: false, error: ADMIN_I18N.errors.productNotFound };
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
