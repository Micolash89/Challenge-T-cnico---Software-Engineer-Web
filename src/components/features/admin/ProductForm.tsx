"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_I18N } from "@/constants/admin-i18n.constants";
import { toast } from "sonner";
import type { ActionResult } from "@/actions/product.actions";
import { PackagePlus, PackageSearch } from "lucide-react";

const F = ADMIN_I18N.form;

interface ProductFormProps {
  action: (
    prev: ActionResult | null | undefined,
    formData: FormData,
  ) => Promise<ActionResult | undefined>;
  defaultValues?: Record<string, string | number | boolean>;
  mode: "create" | "edit";
  open: boolean;
  onClose: () => void;
}

function Required() {
  return <span className="text-destructive ml-0.5">*</span>;
}

export function ProductForm({
  action,
  defaultValues = {},
  mode,
  open,
  onClose,
}: ProductFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, null);
  const [isActive, setIsActive] = useState(
    (defaultValues.active as boolean) ?? true,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Producto creado correctamente");
      router.refresh();
      onClose();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router, onClose]);

  const inputClass = "min-h-10";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl w-[95vw] max-h-[95vh] rounded-lg pt-2">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">
            {mode === "create" ? (
              <PackagePlus className="size-5" />
            ) : (
              <PackageSearch className="size-5" />
            )}
            {mode === "create" ? "Nuevo Producto" : "Editar Producto"}
          </DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-5 md:p-3">
          {/* Name + Slug row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="name" className="text-xs">
                {F.name} <Required />
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={defaultValues.name as string}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="slug" className="text-xs">
                {F.slug} <Required />
              </Label>
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
            <div className="flex flex-col gap-1">
              <Label htmlFor="type" className="text-xs">
                {F.type} <Required />
              </Label>
              <select
                id="type"
                name="type"
                defaultValue={(defaultValues.type as string) ?? "card"}
                className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${inputClass}`}
              >
                <option value="card">{F.card}</option>
                <option value="box">{F.box}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="category" className="text-xs">
                {F.category} <Required />
              </Label>
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
            <div className="flex flex-col gap-1">
              <Label htmlFor="rarity" className="text-xs">
                {F.rarity} <Required />
              </Label>
              <Input
                id="rarity"
                name="rarity"
                defaultValue={defaultValues.rarity as string}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="rarityCode" className="text-xs">
                {F.rarityCode} <Required />
              </Label>
              <Input
                id="rarityCode"
                name="rarityCode"
                defaultValue={defaultValues.rarityCode as string}
                className={inputClass}
              />
            </div>
          </div>

          {/* Price row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="price" className="text-xs">
                {F.price} <Required />
              </Label>
              <Input
                id="price"
                name="price"
                defaultValue={defaultValues.price as string}
                className={inputClass}
              />
            </div>
          </div>

          {/* Product line + Product ID row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="product_line_name" className="text-xs">
                {F.productLine} <Required />
              </Label>
              <Input
                id="product_line_name"
                name="product_line_name"
                defaultValue={defaultValues.product_line_name as string}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="productId" className="text-xs">
                {F.productId} <Required />
              </Label>
              <Input
                id="productId"
                name="productId"
                type="text"
                defaultValue={defaultValues.productId as string}
                className={inputClass}
              />
            </div>
          </div>

          {/* Image URL + Stock row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="img" className="text-xs">
                {F.imageUrl} <Required />
              </Label>
              <Input
                id="img"
                name="img"
                defaultValue={defaultValues.img as string}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="stock" className="text-xs">
                {F.stock} <Required />
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                defaultValue={defaultValues.stock as number}
                className={inputClass}
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-1">
            <input type="hidden" name="active" value={String(isActive)} />
            <input
              id="active"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="size-5"
            />
            <Label htmlFor="active" className="text-xs">
              {F.active}
            </Label>
          </div>

          <div className="flex flex-col-reverse justify-end gap-3 border-t pt-2 sm:flex-row ">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto h-9"
            >
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto h-9">
              {mode === "create" ? F.createProduct : F.updateProduct}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
