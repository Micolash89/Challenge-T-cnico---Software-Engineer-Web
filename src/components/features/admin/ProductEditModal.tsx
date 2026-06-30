'use client';

import { useTransition, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { updateProductAction } from '@/actions/product.actions';

interface ProductRow {
  id: string;
  name: string;
  category: string;
  rarity: string;
  stock: number;
  price_ars: number;
}

interface ProductEditModalProps {
  product: ProductRow;
  onClose: () => void;
}

export function ProductEditModal({
  product,
  onClose,
}: ProductEditModalProps) {
  const [isPending, startTransition] = useTransition();
  const [priceArs, setPriceArs] = useState(String(product.price_ars));
  const [stock, setStock] = useState(String(product.stock));
  const [img, setImg] = useState('');
  const [active, setActive] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set('priceArs', priceArs);
      formData.set('stock', stock);
      formData.set('img', img);
      formData.set('name', product.name);
      formData.set('slug', '');
      formData.set('type', 'card');
      formData.set('category', product.category);
      formData.set('rarity', product.rarity);
      formData.set('rarityCode', '');
      formData.set('product_line_name', '');
      formData.set('productId', '0');

      const updateBound = updateProductAction.bind(null, product.id);
      const result = await updateBound(null, formData);

      if (result?.error) {
        toast.error(`Error al actualizar el producto: ${result.error}`);
      } else {
        toast.success('Producto actualizado correctamente');
        onClose();
      }
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[95vw] max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full shadow-md ${
                active ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            Editar producto: {product.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-120px)]">
          <div className="space-y-5">
            {/* Info fields (read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">ID</Label>
                <Input value={product.id} disabled className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Categoría</Label>
                <Input value={product.category} disabled className="bg-muted/50" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Rareza</Label>
              <Input value={product.rarity} disabled className="bg-muted/50" />
            </div>

            {/* Editable fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceArs">Precio ARS</Label>
                <Input
                  id="priceArs"
                  type="number"
                  value={priceArs}
                  onChange={(e) => setPriceArs(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="img">URL de Imagen</Label>
              <Input
                id="img"
                value={img}
                onChange={(e) => setImg(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            {/* Active toggle */}
            <Label className="flex items-center justify-between rounded-xl border-2 p-4 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={active}
                  onCheckedChange={(checked) => setActive(!!checked)}
                />
                <div>
                  <p className="text-sm font-medium">
                    Producto {active ? 'Activo' : 'Inactivo'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {active ? 'Visible para usuarios' : 'Oculto para usuarios'}
                  </p>
                </div>
              </div>
              <div
                className={`h-3 w-3 rounded-full shadow-md ${
                  active ? 'bg-green-500' : 'bg-red-500'
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
                  <div className="relative aspect-[3/4] w-40 overflow-hidden rounded-xl bg-muted shadow-lg">
                    <Image
                      src={img || '/placeholder.svg'}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex flex-col-reverse justify-end gap-3 border-t pt-4 sm:flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
