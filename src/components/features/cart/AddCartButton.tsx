"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/useCartStore";
import { Product } from "@/types/product.types";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function AddCartButton({ product }: { product: Product }) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast("Producto agregado al carrito");
    addItem(product);
  };

  return (
    <Button
      className=" my-4 mt-auto h-10 w-full rounded-md bg-primary text-sm font-semibold text-white hover:bg-primary/90 hover:cursor-pointer"
      onClick={handleAddToCart}
    >
      <Plus className="mr-2 size-6" />
      <span>Agregar</span>
    </Button>
  );
}
