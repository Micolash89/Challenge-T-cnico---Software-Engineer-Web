import { describe, it, expect, vi } from 'vitest';
import { markAsPaidFromWebhook, type OrderDbClient } from '@/services/order.service';
import { orders, products } from '@/db/schema';

function createMockTx({
  order,
  items,
  stockUpdateCount = 1,
}: {
  order: { id: string; status: string } | null;
  items: Array<{ productId: string; quantity: number; productName: string }>;
  stockUpdateCount?: number;
}) {
  // update() se usa dos veces: stock de productos y status de la orden.
  const where = vi
    .fn()
    .mockResolvedValueOnce({ count: stockUpdateCount }) // products stock update
    .mockResolvedValueOnce(undefined); // orders status update

  const set = vi.fn().mockReturnValue({ where });
  const update = vi.fn().mockReturnValue({ set });

  const select = vi.fn().mockImplementation(() => ({
    // El primer select es de `orders` (con .limit), el segundo de `orderItems` (sin .limit).
    from: vi.fn().mockImplementation((table) => {
      if (table === orders) {
        return {
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(order ? [order] : []),
          }),
        };
      }
      return {
        where: vi.fn().mockResolvedValue(items),
      };
    }),
  }));

  return { select, update, set, where };
}

function createMockDb(mockTx: ReturnType<typeof createMockTx>): OrderDbClient {
  const mockDb = {
    transaction: vi.fn(async (callback: (tx: unknown) => Promise<void>) =>
      callback(mockTx),
    ),
  };
  return mockDb as unknown as OrderDbClient;
}

describe('order.service - markAsPaidFromWebhook', () => {
  it('descuenta stock y marca la orden como pagada', async () => {
    const mockTx = createMockTx({
      order: { id: 'order-1', status: 'reservado' },
      items: [{ productId: 'prod-1', quantity: 2, productName: 'Carta' }],
    });

    await markAsPaidFromWebhook('order-1', createMockDb(mockTx));

    expect(mockTx.update).toHaveBeenCalledWith(products);
    expect(mockTx.update).toHaveBeenCalledWith(orders);
    expect(mockTx.set).toHaveBeenCalledWith({ status: 'pagado' });
  });

  it('lanza error si el pedido no existe', async () => {
    const mockTx = createMockTx({ order: null, items: [] });

    await expect(
      markAsPaidFromWebhook('missing', createMockDb(mockTx)),
    ).rejects.toThrow('Pedido no encontrado');
  });

  it('lanza error si la orden ya no está reservada', async () => {
    const mockTx = createMockTx({
      order: { id: 'order-1', status: 'pagado' },
      items: [],
    });

    await expect(
      markAsPaidFromWebhook('order-1', createMockDb(mockTx)),
    ).rejects.toThrow('Solo pedidos reservados pueden marcarse como pagados');
  });

  it('hace rollback si el stock es insuficiente', async () => {
    const mockTx = createMockTx({
      order: { id: 'order-1', status: 'reservado' },
      items: [{ productId: 'prod-1', quantity: 99, productName: 'Carta rara' }],
      stockUpdateCount: 0,
    });

    await expect(
      markAsPaidFromWebhook('order-1', createMockDb(mockTx)),
    ).rejects.toThrow('Stock insuficiente para Carta rara');
    expect(mockTx.set).not.toHaveBeenCalledWith({ status: 'pagado' });
  });
});
