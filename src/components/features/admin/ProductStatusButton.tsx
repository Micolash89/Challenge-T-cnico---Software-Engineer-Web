'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { softDeleteProductAction, reactivateProductAction } from '@/actions/product.actions';
import { Trash2, RotateCcw } from 'lucide-react';

interface ProductStatusButtonProps {
  productId: string;
  active: boolean;
}

const B = ADMIN_I18N.buttons;

export function ProductStatusButton({ productId, active }: ProductStatusButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const message = active
      ? '¿Dar de baja este producto?'
      : '¿Reactivar este producto?';

    if (!confirm(message)) return;

    startTransition(async () => {
      if (active) {
        await softDeleteProductAction(productId);
      } else {
        await reactivateProductAction(productId);
      }
    });
  };

  return (
    <Button
      variant={active ? 'destructive' : 'outline'}
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {active ? <Trash2 className="size-4" /> : <RotateCcw className="size-4" />}
      {active ? B.delete : B.reactivate}
    </Button>
  );
}
