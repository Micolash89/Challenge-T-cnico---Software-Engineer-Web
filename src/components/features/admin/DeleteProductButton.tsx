'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { deleteProductAction } from '@/actions/product.actions';
import { Trash2 } from 'lucide-react';

interface DeleteProductButtonProps {
  productId: string;
}

const B = ADMIN_I18N.buttons;

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProductAction(productId);
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
      {B.delete}
    </Button>
  );
}
