'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { updateOrderStatusAction } from '@/actions/order.actions';

interface OrderActionsProps {
  orderId: string;
  status: 'reservado' | 'pagado' | 'cancelado';
}

const B = ADMIN_I18N.buttons;

export function OrderActions({ orderId, status }: OrderActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleMarkAsPaid = () => {
    startTransition(async () => {
      try {
        const result = await updateOrderStatusAction(orderId, 'pagado');
        if ('error' in result && result.error) {
          toast.error(result.error);
        } else {
          toast.success('Pedido marcado como pagado');
        }
      } catch {
        toast.error('Error al marcar como pagado');
      }
    });
  };

  const handleCancel = () => {
    startTransition(async () => {
      try {
        const result = await updateOrderStatusAction(orderId, 'cancelado');
        if ('error' in result && result.error) {
          toast.error(result.error);
        } else {
          toast.success('Pedido cancelado');
        }
      } catch {
        toast.error('Error al cancelar el pedido');
      }
    });
  };

  if (status !== 'reservado') {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={handleMarkAsPaid}
        disabled={isPending}
      >
        {B.markPaid}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleCancel}
        disabled={isPending}
      >
        {B.cancelOrder}
      </Button>
    </div>
  );
}
