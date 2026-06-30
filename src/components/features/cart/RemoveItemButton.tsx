import { useCartStore } from "@/hooks/useCartStore";
import { CartItem } from "@/types/product.types";
import { Trash2 } from "lucide-react";

export default function RemoveItemCartButton({ item }: { item: CartItem }) {
  const { removeItem } = useCartStore();
  return (
    <>
      <button
        onClick={() => removeItem(item.id)}
        className="flex size-7 items-center justify-center rounded-full text-graphite transition-colors hover:bg-caution/10 hover:text-caution group cursor-pointer hover:bg-red-100"
        title="Eliminar producto"
      >
        <Trash2 className="size-3.5 group-hover:text-red-500 " />
      </button>
    </>
  );
}
