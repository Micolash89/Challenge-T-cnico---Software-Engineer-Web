import { eq, and, sql } from 'drizzle-orm';
import { db as getDb } from '@/db';
import { orders, orderItems, products } from '@/db/schema';

export async function getCart(userId: string) {
    const db = getDb();
    const [order] = await db
        .select()
        .from(orders)
        .where(and(eq(orders.userId, userId), eq(orders.status, 'reservado')))
        .limit(1);

    if (!order) return null;

    const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

    return { ...order, items };
}