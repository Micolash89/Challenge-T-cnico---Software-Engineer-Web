'use client';

import { useTransition, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatARS } from '@/lib/format';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { updateOrderStatusAction, getOrderItemsAction } from '@/actions/order.actions';

const S = ADMIN_I18N.statuses;

interface OrderModalProps {
  order: Record<string, unknown>;
  onClose: () => void;
}

function getStatusIcon(status: string) {
  switch (status?.toLowerCase()) {
    case 'pagado':
    case 'paid':
      return <CheckCircle className="size-5" />;
    case 'reservado':
    case 'reserved':
    case 'pendiente':
    case 'pending':
      return <Clock className="size-5" />;
    case 'cancelado':
    case 'canceled':
      return <XCircle className="size-5" />;
    default:
      return <Clock className="size-5" />;
  }
}

export function OrderModal({ order, onClose }: OrderModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentStatus = (order.status as string) ?? 'reservado';
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const created = String(order.created_at ?? order.createdAt ?? '');
  const updated = String(order.updated_at ?? order.updatedAt ?? '');
  const datesMatch = created === updated || !updated;

  useEffect(() => {
    const fetchItems = async () => {
      setLoadingItems(true);
      const result = await getOrderItemsAction(order.id as string);
      if ('items' in result) {
        setItems(result.items);
      }
      setLoadingItems(false);
    };
    fetchItems();
  }, [order.id]);

  const handleStatusChange = (newStatus: string) => {
    const statusMap: Record<string, 'pagado' | 'cancelado'> = {
      PAGADO: 'pagado',
      CANCELADO: 'cancelado',
    };

    const mappedStatus = statusMap[newStatus];
    if (!mappedStatus) return;

    startTransition(async () => {
      try {
        const result = await updateOrderStatusAction(order.id as string, mappedStatus);

        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success(
            mappedStatus === 'pagado'
              ? 'Pedido marcado como pagado'
              : 'Pedido cancelado',
          );
          router.refresh();
          onClose();
        }
      } catch {
        toast.error('Error al cambiar el estado del pedido');
      }
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[95vh] p-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(currentStatus)}
            <span>Pedido #{(order.id as string).slice(0, 8)}</span>
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-semibold capitalize text-white ${
                currentStatus === 'pagado'
                  ? 'bg-[hsl(142,76%,36%)]'
                  : currentStatus === 'cancelado'
                    ? 'bg-[hsl(0,84%,60%)]'
                    : 'bg-[hsl(38,92%,50%)]'
              }`}
            >
              {getStatusIcon(currentStatus)}
              {S[currentStatus as keyof typeof S] ?? currentStatus}
            </span>
          </DialogTitle>
          <DialogDescription>
            Detalles y gestión del pedido
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-200px)]">
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">
                  ${formatARS(order.total_ars)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Items</p>
                <p className="text-lg font-semibold">{loadingItems ? '...' : items.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Método</p>
                <p className="text-lg font-semibold capitalize">
                  {String(order.payment_method) === 'mercadopago'
                    ? 'Mercado Pago'
                    : 'Depósito/Efectivo'}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Creado:</p>
                <p>{new Date(created).toLocaleString('es-AR')}</p>
              </div>
              {!datesMatch && (
                <div>
                  <p className="text-muted-foreground">Modificado:</p>
                  <p>{new Date(updated).toLocaleString('es-AR')}</p>
                </div>
              )}
            </div>

            {/* Items */}
            {items.length > 0 && (
              <div>
                <h4 className="mb-2 font-semibold">Items del pedido</h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {items.map((item) => (
                    <div
                      key={item.id as string}
                      className="rounded-lg border p-3"
                    >
                      <p className="truncate text-sm font-medium">
                        {String(item.productName ?? item.name ?? '-')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {String(item.productRarity ?? item.rarity ?? '')}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span>x{Number(item.quantity)}</span>
                        <span>${formatARS(item.priceArsAtPurchase ?? item.price_ars)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status change */}
            {currentStatus === 'reservado' && (
              <div className="space-y-3 border-t pt-4">
                <Label>Cambiar estado</Label>
                <Select onValueChange={handleStatusChange} disabled={isPending}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RESERVADO" disabled>
                      Reservado
                    </SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                    <SelectItem value="PAGADO">Pagado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
