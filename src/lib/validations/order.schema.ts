import { z } from 'zod';

export const createOrderSchema = z.object({
  paymentMethod: z.enum(['mercadopago', 'whatsapp_efectivo']),
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        quantity: z.number().int().positive(),
        price_ars: z.number().positive(),
        name: z.string().min(1),
        img: z.string().min(1),
        rarity: z.string().min(1),
      }),
    )
    .min(1, 'El carrito está vacío'),
  total: z.number().positive(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
