'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { randomUUID } from 'node:crypto';
import { preferenceClient } from '@/lib/mercadopago';
import {
  createOrder,
  getOrder,
  createPaymentSession,
  getPaymentSession,
  updatePaymentSessionPreferenceId,
} from '@/services/order.service';
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

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: 'pagado' | 'cancelado',
): Promise<UpdateOrderResult> {
  const authError = await checkAdminAuth();
  if (authError) return authError;

  const supabase = await createClient();

  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) {
    return { error: 'Pedido no encontrado' };
  }

  if (order.status !== 'reservado') {
    return { error: 'Solo pedidos en estado reservado pueden actualizarse' };
  }

  if (newStatus === 'pagado') {
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('product_id, quantity')
      .eq('order_id', orderId);

    if (itemsError) {
      return { error: itemsError.message };
    }

    for (const item of items ?? []) {
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      });

      if (stockError) {
        return { error: `Error al actualizar stock: ${stockError.message}` };
      }
    }
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (updateError) {
    return { error: updateError.message };
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

export async function createMpPreferenceAction(
  _prev: OrderActionResult | null,
  formData: FormData,
): Promise<OrderActionResult> {
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
    paymentMethod: 'mercadopago',
    items,
    total: Number(totalRaw),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Datos inválidos';
    return { error: firstError };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? null;

  const externalReference = randomUUID();

  await createPaymentSession({
    userId,
    totalArs: parsed.data.total,
    items: parsed.data.items,
    externalReference,
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
        external_reference: externalReference,
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

    await updatePaymentSessionPreferenceId(externalReference, preferenceId);

    return {
      paymentMethod: 'mercadopago',
      preferenceId,
    };
  } catch (err) {
    console.error('MP preference error:', err);
    return { error: 'Error al crear la preferencia de pago. Intentalo de nuevo.' };
  }
}

export interface VerifyPaymentResult {
  verified: boolean;
  orderId?: string;
  error?: string;
}

export async function verifyPaymentAction(
  externalReference: string,
): Promise<VerifyPaymentResult> {
  const session = await getPaymentSession(externalReference);
  if (!session) {
    return { verified: false, error: 'Sesión de pago no encontrada' };
  }
  if (!session.completed) {
    return { verified: false };
  }
  return { verified: true };
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
