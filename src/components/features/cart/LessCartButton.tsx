import { useCartStore } from "@/hooks/useCartStore";
import { CartItem } from "@/types/product.types";
import { Minus } from "lucide-react";

export default function LessCartButton({ item }: { item: CartItem }) {
  const { updateQuantity } = useCartStore();

  return (
    <button
      disabled={item.quantity === 1}
      onClick={() => updateQuantity(item.id, item.quantity - 1)}
      className={`flex size-7 items-center justify-center rounded-full border border-silver-mist text-graphite transition-colors bg-white hover:bg-fog hover:text-ink cursor-pointer ${
        item.quantity === 1 ? " opacity-50" : ""
      }`}
      title="restar producto"
    >
      <Minus className="size-3" />
    </button>
  );
}
