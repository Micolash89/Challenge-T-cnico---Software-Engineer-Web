"use client";

import { useTransition, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { updateProductAction } from "@/actions/product.actions";

interface ProductRow {
  id: string;
  name: string;
  category: string;
  img: string;
  price: string;
  rarity: string;
  stock: number;
  active: boolean;
}

interface ProductEditModalProps {
  product: ProductRow;
  onClose: () => void;
}

export function ProductEditModal({ product, onClose }: ProductEditModalProps) {
  const [isPending, startTransition] = useTransition();
  const [stock, setStock] = useState(String(product.stock));
  const [img, setImg] = useState(product.img || "");
  const [price, setPrice] = useState(product.price);
  const [active, setActive] = useState(product.active);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("stock", stock);
      formData.set("active", String(active));
      formData.set("price", price);
      formData.set("img", img);

      if (img) {
        formData.set("img", img);
      }

      const updateBound = updateProductAction.bind(null, product.id);
      const result = await updateBound(null, formData);

      if (result?.error) {
        toast.error(`Error al actualizar el producto: ${result.error}`);
      } else {
        toast.success("Producto actualizado correctamente");
        onClose();
      }
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[95vw] max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pt-1 ">
            <div
              className={`h-3 w-3 rounded-lg shadow-md ml-2 ${
                active ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <div>
              <span>Editar producto: {}</span>

              <span>{product.name}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-120px)] ">
          <div className="space-y-5 p-3">
            {/* Info fields (read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">ID</Label>
                <Input value={product.id} disabled className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Categoría
                </Label>
                <Input
                  value={product.category}
                  disabled
                  className="bg-muted/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Rareza</Label>
              <Input value={product.rarity} disabled className="bg-muted/50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-xs">
                Precio
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
              />
            </div>

            {/* Editable fields */}
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-xs">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
              />
              {Number(stock) === 0 && (
                <p className="text-xs text-destructive font-medium">
                  Producto sin stock
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="img" className="text-xs">
                URL de Imagen
              </Label>
              <Input
                id="img"
                value={img}
                onChange={(e) => setImg(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            {/* Active toggle */}
            <Label className="flex items-center justify-between rounded-lg border-2 p-4 transition-all cursor-pointer px-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={active}
                  onCheckedChange={(checked) => setActive(!!checked)}
                  hidden
                />
                <div>
                  <p className="text-sm font-medium">
                    Producto {active ? "Activo" : "Inactivo"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {active ? "Visible para usuarios" : "Oculto para usuarios"}
                  </p>
                </div>
              </div>
              <div
                className={`h-3 w-3 rounded-lg shadow-md ${
                  active ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </Label>

            {/* Image preview */}
            {img && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Vista Previa</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </Button>
                </div>
                {showPreview && (
                  <div className="relative aspect-[3/4] w-40 overflow-hidden  bg-muted shadow-lg">
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="160px"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex flex-col-reverse justify-end gap-3 border-t pt-4 sm:flex-row ">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="w-full sm:w-auto h-9"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="w-full sm:w-auto h-9"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
