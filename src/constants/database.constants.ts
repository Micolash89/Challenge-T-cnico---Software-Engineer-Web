export const DB_TABLES = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
} as const;

export const ORDER_STATUS = {
  RESERVADO: 'reservado',
  PAGADO: 'pagado',
  CANCELADO: 'cancelado',
} as const;

export const PAYMENT_METHOD = {
  MERCADOPAGO: 'mercadopago',
  WHATSAPP_EFECTIVO: 'whatsapp_efectivo',
} as const;

export const PRODUCT_TYPE = {
  CARD: 'card',
  BOX: 'box',
} as const;

export const VALID_PRODUCT_LINES = ['yugioh', 'pokemon', 'mtg'] as const;
