'use client';

import { useTransition, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { softDeleteProductAction, reactivateProductAction } from '@/actions/product.actions';
import { Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface ProductStatusButtonProps {
  productId: string;
  active: boolean;
}

const B = ADMIN_I18N.buttons;

export function ProductStatusButton({ productId, active }: ProductStatusButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);


  const handleConfirm = () => {
    setShowModal(false);
    startTransition(async () => {
      const action = active ? softDeleteProductAction : reactivateProductAction;
      const result = await action(productId);
      if (result?.success) {
        toast.success(active ? 'Producto dado de baja' : 'Producto reactivado');
      } else if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <Button
        variant={active ? 'destructive' : 'outline'}
        size="sm"
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className='flex items-center gap-1'
      >
        {active ? <Trash2 className="size-5 text-red-600" /> : <RotateCcw className="size-5" />}
        <span className='text-red-600'>

        {active ? B.delete : B.reactivate}
        </span>
      </Button>

      <ConfirmationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        title={active ? 'Dar de Baja' : 'Reactivar producto'}
        description={
          active
            ? '¿Estás seguro de dar de baja este producto? Los usuarios no podrán verlo.'
            : '¿Estás seguro de reactivar este producto?'
        }
        confirmLabel={active ? 'Dar de baja' : 'Reactivar'}
        variant={ 'default'}
        loading={isPending}
      />
    </>
  );
}
