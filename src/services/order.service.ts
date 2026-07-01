import { eq, and, sql } from 'drizzle-orm';
import { db as getDb } from '@/db';
import { orders, orderItems, products } from '@/db/schema';

export interface CreateOrderParams {
  userId: string | null;
  paymentMethod: 'mercadopago' | 'whatsapp_efectivo';
  totalArs: number;
  items: Array<{
    productId: string;
    quantity: number;
    priceArs: number;
    name: string;
    img: string;
    rarity: string;
  }>;
}

export async function createOrder(params: CreateOrderParams) {
  const db = getDb();

  const [order] = await db
    .insert(orders)
    .values({
      userId: params.userId,
      paymentMethod: params.paymentMethod,
      totalArs: String(params.totalArs),
    })
    .returning();

  if (!order) throw new Error('Failed to create order');

  await db.insert(orderItems).values(
    params.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      priceArsAtPurchase: String(item.priceArs),
      productName: item.name,
      productImg: item.img,
      productRarity: item.rarity,
    })),
  );

  return order;
}

export async function deleteOrder(orderId: string) {
  const db = getDb();
  await db.delete(orders).where(eq(orders.id, orderId));
}

export async function getOrder(orderId: string) {
  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return { ...order, items };
}

export async function adminMarkAsPaid(orderId: string) {
  const db = getDb();

  await db.transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) throw new Error('Pedido no encontrado');
    if (order.status !== 'reservado') {
      throw new Error('Solo pedidos reservados pueden marcarse como pagados');
    }

    const items = await tx
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    for (const item of items) {
      const result = await tx
        .update(products)
        .set({ stock: sql`${products.stock} - ${item.quantity}` })
        .where(
          and(
            eq(products.id, item.productId),
            sql`${products.stock} >= ${item.quantity}`,
          ),
        );

      if (result.count === 0) {
        throw new Error(
          `Stock insuficiente para ${item.productName}`,
        );
      }
    }

    await tx
      .update(orders)
      .set({ status: 'pagado' })
      .where(eq(orders.id, orderId));
  });
}

export async function updateOrderToPaid(
  orderId: string,
  mpPaymentId: string,
) {
  const db = getDb();

  await db.transaction(async (tx) => {
    // Get the order
    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) throw new Error('Order not found');
    if (order.status !== 'reservado') {
      throw new Error(`Order cannot transition from ${order.status} to pagado`);
    }

    // Get order items
    const items = await tx
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    // Decrement stock for each item with safety check
    for (const item of items) {
      const result = await tx
        .update(products)
        .set({ stock: sql`${products.stock} - ${item.quantity}` })
        .where(
          and(
            eq(products.id, item.productId),
            sql`${products.stock} >= ${item.quantity}`,
          ),
        );

      if (result.count === 0) {
        throw new Error(
          `Error al actualizar stock: producto ${item.productId}. Stock insuficiente.`,
        );
      }
    }

    // Update order status
    await tx
      .update(orders)
      .set({
        status: 'pagado',
        mpPaymentId,
      })
      .where(eq(orders.id, orderId));
  });
}
