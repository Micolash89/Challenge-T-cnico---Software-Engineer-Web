'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface ActionResult {
  error?: string;
  success?: boolean;
}

// ---------------------------------------------------------------------------
// Auth guard
// ---------------------------------------------------------------------------

async function checkAdminAuth(): Promise<ActionResult | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !['admin', 'super_admin'].includes(user.user_metadata?.role)) {
    return { error: 'Unauthorized' };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  role: string;
}

export async function getAllUsersAction(params: {
  page?: number;
  pageSize?: number;
}): Promise<{ data: UserProfile[]; total: number; page: number; totalPages: number } | ActionResult> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const supabase = await createClient();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

  const { data: users, error, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    return { error: error.message };
  }

  const data: UserProfile[] = (users ?? []).map((u) => ({
    id: u.id,
    email: u.email,
    name: u.full_name ?? u.name,
    role: u.role ?? 'user',
  }));

  return {
    data,
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getUserByIdAction(id: string): Promise<UserProfile | ActionResult> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const supabase = await createClient();
  const { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !user) {
    return { error: 'User not found' };
  }

  return {
    id: user.id,
    email: user.email,
    name: user.full_name ?? user.name,
    role: user.role ?? 'user',
  };
}

export async function updateUserAction(
  id: string,
  _prev: ActionResult | null | undefined,
  formData: FormData,
): Promise<ActionResult | undefined> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: name, email })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/users/${id}`);
  return { success: true };
}

export async function promoteUserAction(userId: string): Promise<ActionResult> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const supabase = await createClient();
  const { data: currentUser } = await supabase.auth.getUser();
  if (currentUser?.user?.id === userId) {
    return { error: 'No puedes modificar tu propio rol' };
  }

  const { data: target } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  const currentRole = target?.role;
  let newRole: string;

  if (currentRole === 'user') newRole = 'admin';
  else if (currentRole === 'admin') newRole = 'super_admin';
  else return { error: 'No se puede ascender más' };

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) return { error: error.message };

  revalidatePath('/admin/users');
  return { success: true };
}

export async function demoteUserAction(userId: string): Promise<ActionResult> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const supabase = await createClient();
  const { data: currentUser } = await supabase.auth.getUser();
  if (currentUser?.user?.id === userId) {
    return { error: 'No puedes modificar tu propio rol' };
  }

  const { data: target } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  const currentRole = target?.role;
  let newRole: string;

  if (currentRole === 'super_admin') newRole = 'admin';
  else if (currentRole === 'admin') newRole = 'user';
  else return { error: 'No se puede descender más' };

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) return { error: error.message };

  revalidatePath('/admin/users');
  return { success: true };
}

// ---------------------------------------------------------------------------
// Dashboard metrics
// ---------------------------------------------------------------------------

export async function getDashboardMetricsAction(): Promise<{
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}> {
  const supabase = await createClient();

  const [{ count: totalProducts }, { count: totalOrders }, { data: revenueData }] =
    await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_ars').eq('status', 'pagado'),
    ]);

  const totalRevenue =
    revenueData?.reduce((sum, o) => sum + (Number(o.total_ars) || 0), 0) ?? 0;

  return {
    totalProducts: totalProducts ?? 0,
    totalOrders: totalOrders ?? 0,
    totalRevenue,
  };
}

// ---------------------------------------------------------------------------
// Products listing
// ---------------------------------------------------------------------------

export async function getProductSortsAdminAction(): Promise<
  | { categories: string[]; rarities: string[] }
  | ActionResult
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('category, rarity');

  if (error) {
    return { error: error.message };
  }

  const categories = [...new Set((data ?? []).map((p: { category: string }) => p.category))].sort();
  const rarities = [...new Set((data ?? []).map((p: { rarity: string }) => p.rarity))].sort();

  return { categories, rarities };
}

export async function getAllProductsAction(params: {
  page?: number;
  pageSize?: number;
  category?: string;
  rarity?: string;
  stock?: string;
  search?: string;
  active?: string;
}): Promise<
  | {
      data: Array<{
        id: string;
        name: string;
        slug: string;
        category: string;
        rarity: string;
        stock: number;
        price_ars: number;
        active: boolean;
        product_line_name: string;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }
  | ActionResult
> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const supabase = await createClient();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

  let query = supabase
    .from('products')
    .select(
      'id, name, slug, category, rarity, stock, price_ars, active, product_line_name',
      { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (params.category) {
    query = query.eq('category', params.category);
  }

  if (params.rarity) {
    query = query.eq('rarity', params.rarity);
  }

  if (params.search) {
    query = query.ilike('name', `%${params.search}%`);
  }

  if (params.active === 'true') {
    query = query.eq('active', true);
  } else if (params.active === 'false') {
    query = query.eq('active', false);
  }

  if (params.stock === 'true') {
    query = query.gt('stock', 0);
  } else if (params.stock === 'false') {
    query = query.eq('stock', 0);
  }

  const { data, error, count } = await query;

  if (error) {
    return { error: error.message };
  }

  return {
    data: data ?? [],
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getProductByIdAction(id: string): Promise<
  | {
      id: string;
      name: string;
      slug: string;
      type: string;
      img: string;
      price: string;
      price_ars: number;
      rarity: string;
      rarity_code: string;
      category: string;
      product_line_name: string;
      productId: number;
      stock: number;
      active: boolean;
      featured: boolean;
    }
  | ActionResult
> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return { error: 'Product not found' };
  }

  return data;
}

// ---------------------------------------------------------------------------
// Orders listing
// ---------------------------------------------------------------------------

export async function getOrdersList(params: {
  page?: number;
  pageSize?: number;
  status?: string;
}) {
  const supabase = await createClient();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (params.status && ['reservado', 'pagado', 'cancelado'].includes(params.status)) {
    query = query.eq('status', params.status);
  }

  const { data, error, count } = await query;

  if (error) {
    return { error: error.message };
  }

  return {
    data: data ?? [],
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getOrdersByUserAction(userId: string) {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return data ?? [];
}

export async function getOrderDetail(id: string) {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return { error: 'Order not found' };
  }

  return data;
}
