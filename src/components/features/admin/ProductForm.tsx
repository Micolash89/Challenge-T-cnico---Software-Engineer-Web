'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import type { ActionResult } from '@/actions/product.actions';

const F = ADMIN_I18N.form;

interface ProductFormProps {
  action: (
    prev: ActionResult | null | undefined,
    formData: FormData,
  ) => Promise<ActionResult | undefined>;
  defaultValues?: Record<string, string | number | boolean>;
  mode: 'create' | 'edit';
}

export function ProductForm({
  action,
  defaultValues = {},
  mode,
}: ProductFormProps) {
  const [state, formAction] = useActionState(action, null);

  const inputClass = 'min-h-10';

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <div
          role="alert"
          className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.error}
        </div>
      )}

      {/* Name + Slug row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{F.name}</Label>
          <Input
            id="name"
            name="name"
            defaultValue={defaultValues.name as string}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="slug">{F.slug}</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={defaultValues.slug as string}
            className={inputClass}
          />
        </div>
      </div>

      {/* Type + Category row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="type">{F.type}</Label>
          <select
            id="type"
            name="type"
            defaultValue={(defaultValues.type as string) ?? 'card'}
            className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${inputClass}`}
          >
            <option value="card">{F.card}</option>
            <option value="box">{F.box}</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">{F.category}</Label>
          <Input
            id="category"
            name="category"
            defaultValue={defaultValues.category as string}
            className={inputClass}
          />
        </div>
      </div>

      {/* Rarity + Rarity Code row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="rarity">{F.rarity}</Label>
          <Input
            id="rarity"
            name="rarity"
            defaultValue={defaultValues.rarity as string}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="rarityCode">{F.rarityCode}</Label>
          <Input
            id="rarityCode"
            name="rarityCode"
            defaultValue={defaultValues.rarityCode as string}
            className={inputClass}
          />
        </div>
      </div>

      {/* Price + Price ARS row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="price">{F.price}</Label>
          <Input
            id="price"
            name="price"
            defaultValue={defaultValues.price as string}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="priceArs">{F.priceArs}</Label>
          <Input
            id="priceArs"
            name="priceArs"
            defaultValue={defaultValues.priceArs as string}
            className={inputClass}
          />
        </div>
      </div>

      {/* Product line + Product ID row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="product_line_name">{F.productLine}</Label>
          <Input
            id="product_line_name"
            name="product_line_name"
            defaultValue={defaultValues.product_line_name as string}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="productId">{F.productId}</Label>
          <Input
            id="productId"
            name="productId"
            type="number"
            defaultValue={defaultValues.productId as number}
            className={inputClass}
          />
        </div>
      </div>

      {/* Image URL + Stock row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="img">{F.imageUrl}</Label>
          <Input
            id="img"
            name="img"
            defaultValue={defaultValues.img as string}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="stock">{F.stock}</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            defaultValue={defaultValues.stock as number}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={defaultValues.active as boolean ?? true}
          className="size-4"
        />
        <Label htmlFor="active">{F.active}</Label>
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        {mode === 'create' ? F.createProduct : F.updateProduct}
      </Button>
    </form>
  );
}
