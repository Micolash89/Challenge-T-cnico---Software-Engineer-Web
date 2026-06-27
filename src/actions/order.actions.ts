'use server';

import { createClient } from '@/lib/supabase/server';
import { preferenceClient } from '@/lib/mercadopago';
import { createOrder } from '@/services/order.service';
import { createOrderSchema } from '@/lib/validations/order.schema';
import { WHATSAPP } from '@/constants/whatsapp.constants';

export interface OrderActionResult {
  error?: string;
  orderId?: string;
  redirectUrl?: string;
}

export async function createOrderAction(
  _prev: OrderActionResult | null,
  formData: FormData,
): Promise<OrderActionResult> {
  const paymentMethod = formData.get('paymentMethod') as
    | 'mercadopago'
    | 'whatsapp_efectivo';
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

  // Get current user (optional — orders can be anonymous for WhatsApp)
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

  if (paymentMethod === 'whatsapp_efectivo') {
    const message = WHATSAPP.TEMPLATE({
      id: order.id.slice(0, 8),
      items: parsed.data.items.map((item) => ({
        name: item.name,
        rarity: item.rarity,
        quantity: item.quantity,
        price_ars: item.price_ars,
      })),
      total: parsed.data.total,
    });

    const phone = WHATSAPP.NUMBER;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    return {
      orderId: order.id,
      redirectUrl: whatsappUrl,
    };
  }

  // Mercado Pago
  try {
    const mpPreference = await preferenceClient.create({
      body: {
        items: parsed.data.items.map((item) => ({
          id: item.id,
          title: `${item.name} — ${item.rarity}`,
          unit_price: item.price_ars,
          quantity: item.quantity,
          currency_id: 'ARS',
        })),
        external_reference: order.id,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/checkout/success?order_id=${order.id}`,
          failure: `${process.env.NEXT_PUBLIC_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_URL}/checkout/pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/mercadopago/webhook`,
      },
    });

    return {
      orderId: order.id,
      redirectUrl: mpPreference.init_point,
    };
  } catch (err) {
    console.error('MP preference error:', err);
    return { error: 'Error al crear la preferencia de pago' };
  }
}
