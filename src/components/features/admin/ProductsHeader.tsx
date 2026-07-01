'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductForm } from '@/components/features/admin/ProductForm';
import { createProductAction } from '@/actions/product.actions';
import { Plus } from 'lucide-react';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';

const B = ADMIN_I18N.buttons;

export function ProductsHeader() {
  const [showNewModal, setShowNewModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{ADMIN_I18N.pageTitles.products}</h1>
        <Button onClick={() => setShowNewModal(true)} className="h-10 gap-2">
          <Plus className="mr-1 size-5" />
          {B.newProduct}
        </Button>
      </div>

      {showNewModal && (
        <ProductForm
          action={createProductAction}
          mode="create"
          open={showNewModal}
          onClose={() => setShowNewModal(false)}
        />
      )}
    </>
  );
}
