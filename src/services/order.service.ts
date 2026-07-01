import { eq, and, sql } from 'drizzle-orm';
import { db as getDb } from '@/db';
import { orders, orderItems, products, paymentSessions } from '@/db/schema';

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

    // Decrement stock for each item
    for (const item of items) {
      await tx
        .update(products)
        .set({ stock: sql`${products.stock} - ${item.quantity}` })
        .where(
          and(
            eq(products.id, item.productId),
            // Only decrement if enough stock (safety check)
          ),
        );
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

export interface CreatePaymentSessionParams {
  userId: string | null;
  totalArs: number;
  items: Array<{
    id: string;
    quantity: number;
    price_ars: number;
    name: string;
    img: string;
    rarity: string;
  }>;
  externalReference: string;
}

export async function createPaymentSession(params: CreatePaymentSessionParams) {
  const db = getDb();
  const [session] = await db
    .insert(paymentSessions)
    .values({
      items: JSON.stringify(params.items),
      totalArs: String(params.totalArs),
      userId: params.userId,
      externalReference: params.externalReference,
    })
    .returning();
  return session;
}

export async function getPaymentSession(externalReference: string) {
  const db = getDb();
  const [session] = await db
    .select()
    .from(paymentSessions)
    .where(eq(paymentSessions.externalReference, externalReference))
    .limit(1);
  return session ?? null;
}

export async function updatePaymentSessionPreferenceId(
  externalReference: string,
  preferenceId: string,
) {
  const db = getDb();
  await db
    .update(paymentSessions)
    .set({ preferenceId, updatedAt: new Date() })
    .where(eq(paymentSessions.externalReference, externalReference));
}

export async function createPaidOrderFromSession(
  externalReference: string,
  mpPaymentId: string,
) {
  const db = getDb();

  await db.transaction(async (tx) => {
    const [session] = await tx
      .select()
      .from(paymentSessions)
      .where(eq(paymentSessions.externalReference, externalReference))
      .limit(1);

    if (!session) throw new Error('Payment session not found');
    if (session.completed) throw new Error('Payment session already completed');

    const items = session.items as Array<{
      id: string;
      quantity: number;
      price_ars: number;
      name: string;
      img: string;
      rarity: string;
    }>;

    // Verify stock before decrementing
    for (const item of items) {
      const [product] = await tx
        .select({ stock: products.stock })
        .from(products)
        .where(eq(products.id, item.id))
        .limit(1);

      if (!product) throw new Error(`Producto no encontrado: ${item.name}`);
      if (Number(product.stock) < item.quantity) {
        throw new Error(
          `Stock insuficiente para ${item.name}. Disponible: ${product.stock}, solicitado: ${item.quantity}`,
        );
      }
    }

    // Create the order
    const [order] = await tx
      .insert(orders)
      .values({
        userId: session.userId,
        status: 'pagado',
        paymentMethod: 'mercadopago',
        totalArs: session.totalArs,
        mpPaymentId,
      })
      .returning();

    if (!order) throw new Error('Failed to create order');

    // Create order items
    await tx.insert(orderItems).values(
      items.map((item) => ({
        orderId: order.id,
        productId: item.id,
        quantity: item.quantity,
        priceArsAtPurchase: String(item.price_ars),
        productName: item.name,
        productImg: item.img,
        productRarity: item.rarity,
      })),
    );

    // Decrement stock
    for (const item of items) {
      const result = await tx
        .update(products)
        .set({ stock: sql`${products.stock} - ${item.quantity}` })
        .where(
          and(
            eq(products.id, item.id),
            sql`${products.stock} >= ${item.quantity}`,
          ),
        );

      if (result.count === 0) {
        throw new Error(`Error al actualizar stock: ${item.name}`);
      }
    }

    // Mark session as completed
    await tx
      .update(paymentSessions)
      .set({ completed: true, updatedAt: new Date() })
      .where(eq(paymentSessions.externalReference, externalReference));
  });
}
