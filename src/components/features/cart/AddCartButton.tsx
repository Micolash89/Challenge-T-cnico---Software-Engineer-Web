"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/useCartStore";
import { Product } from "@/types/product.types";
import { Plus, ShoppingCart, Ban } from "lucide-react";
import { toast } from "sonner";

export default function AddCartButton({ product }: { product: Product }) {
  const { addItem, items } = useCartStore();
  const isInCart = items.some((item) => item.id === product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast("Producto agregado al carrito");
    addItem(product);
  };

  if (isOutOfStock) {
    return (
      <Button
        disabled
        className="my-4 mt-auto h-10 w-full rounded-md bg-muted text-sm font-semibold text-muted-foreground cursor-not-allowed"
      >
        <Ban className="mr-2 size-4 text-destructive" />
        <span>Sin stock</span>
      </Button>
    );
  }

  if (isInCart) {
    return (
      <Button
        variant="outline"
        className="my-4 mt-auto h-10 w-full rounded-md text-sm font-semibold hover:cursor-pointer"
        onClick={handleAddToCart}
      >
        <Plus className="mr-2 size-4" />
        <span>Agregar más</span>
      </Button>
    );
  }

  return (
    <Button
      className="my-4 mt-auto h-10 w-full rounded-md bg-primary text-sm font-semibold text-white hover:bg-primary/90 hover:cursor-pointer"
      onClick={handleAddToCart}
    >
      <ShoppingCart className="mr-2 size-4" />
      <span>Agregar al carrito</span>
    </Button>
  );
}
