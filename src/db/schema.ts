import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';

// ── Enums ──
export const productTypeEnum = pgEnum('product_type', ['card', 'box']);
export const orderStatusEnum = pgEnum('order_status', [
  'reservado',
  'pagado',
  'cancelado',
]);
export const paymentMethodEnum = pgEnum('payment_method', [
  'mercadopago',
  'whatsapp_efectivo',
]);

// ── Products ──
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  type: productTypeEnum('type').notNull().default('card'),
  img: text('img').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  priceArs: decimal('price_ars', { precision: 12, scale: 2 }).notNull(),
  rarity: text('rarity').notNull(),
  rarityCode: text('rarity_code').notNull(),
  category: text('category').notNull(),
  product_line_name: text('product_line_name').notNull(),
  productId: integer('product_id').notNull(),
  stock: integer('stock').notNull().default(0),
  active: boolean('active').notNull().default(true),
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Orders ──
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  status: orderStatusEnum('status').notNull().default('reservado'),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  totalArs: decimal('total_ars', { precision: 12, scale: 2 }).notNull(),
  mpPaymentId: text('mp_payment_id'),
  whatsappSent: boolean('whatsapp_sent').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Order Items ──
export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id),
  quantity: integer('quantity').notNull(),
  priceArsAtPurchase: decimal('price_ars_at_purchase', {
    precision: 12,
    scale: 2,
  }).notNull(),
  productName: text('product_name').notNull(),
  productImg: text('product_img').notNull(),
  productRarity: text('product_rarity').notNull(),
});

// ── Payment Sessions (temporary, before order is created) ──
export const paymentSessions = pgTable('payment_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  items: jsonb('items').notNull(),
  totalArs: decimal('total_ars', { precision: 12, scale: 2 }).notNull(),
  userId: uuid('user_id'),
  externalReference: text('external_reference').notNull().unique(),
  preferenceId: text('preference_id'),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Inferred Types ──
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type PaymentSession = typeof paymentSessions.$inferSelect;
export type NewPaymentSession = typeof paymentSessions.$inferInsert;
