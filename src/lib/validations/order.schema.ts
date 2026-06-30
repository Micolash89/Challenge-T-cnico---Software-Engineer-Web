import { z } from 'zod';

export const createOrderSchema = z.object({
  paymentMethod: z.enum(['mercadopago', 'whatsapp_efectivo'], {
    message: 'Seleccioná un método de pago',
  }),
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        quantity: z.coerce.number().int().positive('La cantidad debe ser mayor a 0'),
        price_ars: z.coerce.number().positive('El precio debe ser mayor a 0'),
        name: z.string().min(1),
        img: z.string().min(1),
        rarity: z.string().min(1),
      }),
    )
    .min(1, 'El carrito está vacío'),
  total: z.coerce.number().positive('El total debe ser mayor a 0'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
