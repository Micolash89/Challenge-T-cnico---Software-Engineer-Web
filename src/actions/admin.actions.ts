'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

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

function mapAuthUser(u: { id: string; email?: string; user_metadata?: Record<string, unknown> }): UserProfile {
  return {
    id: u.id,
    email: u.email,
    name: (u.user_metadata?.full_name as string) ?? (u.user_metadata?.name as string),
    role: (u.user_metadata?.role as string) ?? 'user',
  };
}

export async function getAllUsersAction(params: {
  page?: number;
  pageSize?: number;
}): Promise<{ data: UserProfile[]; total: number; page: number; totalPages: number } | ActionResult> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const adminClient = createAdminClient();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

  const { data, error } = await adminClient.auth.admin.listUsers();

  if (error) return { error: error.message };

  const allUsers = data?.users ?? [];

  const start = (page - 1) * pageSize;
  const paged = allUsers.slice(start, start + pageSize);

  return {
    data: paged.map(mapAuthUser),
    total: allUsers.length,
    page,
    totalPages: Math.max(1, Math.ceil(allUsers.length / pageSize)),
  };
}

export async function getUserByIdAction(id: string): Promise<UserProfile | ActionResult> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const adminClient = createAdminClient();
  const { data, error } = await adminClient.auth.admin.getUserById(id);

  if (error || !data?.user) return { error: 'Usuario no encontrado' };

  return mapAuthUser(data.user);
}

export async function updateUserAction(
  id: string,
  _prev: ActionResult | null | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const name = formData.get('name') as string;

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.updateUserById(id, {
    user_metadata: { full_name: name },
  });

  if (error) return { error: error.message };

  revalidatePath('/admin/users');
  return { success: true };
}

export async function deleteUserAction(userId: string): Promise<ActionResult> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  if (currentUser?.id === userId) {
    return { error: 'No puedes eliminarte a ti mismo' };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(userId);

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
        img: string;
        price: string;
        category: string;
        rarity: string;
        stock: number;
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
      'id, name, slug, img, price, category, rarity, stock, active, product_line_name',
      { count: 'exact' },
    )
    .order('name', { ascending: true })
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
