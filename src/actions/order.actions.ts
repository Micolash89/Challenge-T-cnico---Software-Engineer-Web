'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { db as getDb } from '@/db';
import { orderItems } from '@/db/schema';
import { preferenceClient } from '@/lib/mercadopago';
import { createOrder, getOrder, adminMarkAsPaid } from '@/services/order.service';
import { createOrderSchema } from '@/lib/validations/order.schema';

export interface OrderActionResult {
  error?: string;
  orderId?: string;
  paymentMethod?: string;
  redirectUrl?: string;
  preferenceId?: string;
}

export interface UpdateOrderResult {
  error?: string;
  success?: boolean;
}

export interface ReservationData {
  error?: string;
  orderId?: string;
  items?: Array<{
    name: string;
    rarity: string;
    quantity: number;
    price_ars: number;
  }>;
  total?: number;
}

async function checkAdminAuth(): Promise<UpdateOrderResult | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !['admin', 'super_admin'].includes(user.user_metadata?.role)) {
    return { error: 'No autorizado' };
  }

  return null;
}

export async function getOrderItemsAction(
  orderId: string,
): Promise<{ items: Array<Record<string, unknown>> } | UpdateOrderResult> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const db = getDb();
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return { items: items as Array<Record<string, unknown>> };
}

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: 'pagado' | 'cancelado',
): Promise<UpdateOrderResult> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  if (newStatus === 'pagado') {
    try {
      await adminMarkAsPaid(orderId);
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Error al actualizar el pedido' };
    }
  } else {
    const supabase = await createClient();
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) return { error: 'Pedido no encontrado' };
    if (order.status !== 'reservado') return { error: 'Solo pedidos reservados pueden cancelarse' };

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'cancelado' })
      .eq('id', orderId);

    if (updateError) return { error: updateError.message };
  }

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function createOrderAction(
  _prev: OrderActionResult | null,
  formData: FormData,
): Promise<OrderActionResult> {
  const paymentMethod = formData.get('paymentMethod') as
    | 'mercadopago'
    | 'whatsapp_efectivo'
    | '';
  const itemsRaw = formData.get('items') as string;
  const totalRaw = formData.get('total') as string;

  let items: Array<{
    id: string;
    quantity: number;
    price_ars: number;
    name: string;
    img: string;
    rarity: string;
  }>;

  try {
    items = JSON.parse(itemsRaw);
  } catch {
    return { error: 'Error al leer los items del carrito' };
  }

  const parsed = createOrderSchema.safeParse({
    paymentMethod,
    items,
    total: Number(totalRaw),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Datos inválidos';
    return { error: firstError };
  }

  if (!paymentMethod) {
    return { error: 'Seleccioná un método de pago' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? null;

  // For WhatsApp: create order immediately as "reservado"
  if (paymentMethod === 'whatsapp_efectivo') {
    const order = await createOrder({
      userId,
      paymentMethod: parsed.data.paymentMethod,
      totalArs: parsed.data.total,
      items: parsed.data.items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        priceArs: item.price_ars,
        name: item.name,
        img: item.img,
        rarity: item.rarity,
      })),
    });

    return {
      orderId: order.id,
      paymentMethod: 'whatsapp_efectivo',
      redirectUrl: `/checkout/reservation?order=${order.id}`,
    };
  }

  // For MP: create order as "reservado" + create preference
  const order = await createOrder({
    userId,
    paymentMethod: parsed.data.paymentMethod,
    totalArs: parsed.data.total,
    items: parsed.data.items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      priceArs: item.price_ars,
      name: item.name,
      img: item.img,
      rarity: item.rarity,
    })),
  });

  try {
    const mpPreference = await preferenceClient.create({
      body: {
        items: parsed.data.items.map((item) => {
          const rawPrice = item.price_ars;
          const unitPrice = rawPrice > 1 ? rawPrice : rawPrice * 1000;
          return {
            id: item.id,
            title: `${item.name} — ${item.rarity}`,
            unit_price: unitPrice,
            quantity: item.quantity,
            currency_id: 'ARS',
          };
        }),
        external_reference: order.id,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_URL}/checkout/pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/mercadopago/webhook`,
      },
    });

    const preferenceId = mpPreference.id;
    if (!preferenceId) {
      return { error: 'Error al crear la preferencia de pago. Intentalo de nuevo.' };
    }

    return {
      orderId: order.id,
      paymentMethod: 'mercadopago',
      preferenceId,
    };
  } catch (err) {
    console.error('MP preference error:', err);
    return { error: 'Error al crear la preferencia de pago. Intentalo de nuevo.' };
  }
}

export async function getOrderForReservationAction(
  orderId: string,
): Promise<ReservationData> {
  const order = await getOrder(orderId);
  if (!order) return { error: 'Pedido no encontrado' };

  return {
    orderId: order.id,
    items: order.items.map((item) => ({
      name: item.productName,
      rarity: item.productRarity,
      quantity: item.quantity,
      price_ars: Number(item.priceArsAtPurchase),
    })),
    total: Number(order.totalArs),
  };
}
