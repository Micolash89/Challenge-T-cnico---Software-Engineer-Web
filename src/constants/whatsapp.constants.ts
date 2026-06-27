export const WHATSAPP = {
  NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  TEMPLATE: (order: {
    id: string;
    items: Array<{
      name: string;
      rarity: string;
      quantity: number;
      price_ars: number;
    }>;
    total: number;
  }): string => {
    const lines = order.items.map(
      (item) =>
        `• ${item.name} [${item.rarity}] x ${item.quantity} - $${item.price_ars}`,
    );
    return (
      `Nuevo pedido numero : ${order.id}\n` +
      lines.join('\n') +
      `\n• Total: $${order.total}`
    );
  },
} as const;
