import { useCartStore } from "@/hooks/useCartStore";
import { CartItem } from "@/types/product.types";
import { Plus } from "lucide-react";

export default function PlusCartButton({ item }: { item: CartItem }) {
  const { updateQuantity } = useCartStore();

  return (
    <button
      onClick={() => updateQuantity(item.id, item.quantity + 1)}
      className="flex size-7 bg-white items-center justify-center rounded-full border border-silver-mist text-graphite transition-colors cursor-pointer  hover:bg-fog hover:text-ink"
      title="Agregar producto"
      disabled={item.quantity === item.stock}
    >
      <Plus className="size-3 " />
    </button>
  );
}
