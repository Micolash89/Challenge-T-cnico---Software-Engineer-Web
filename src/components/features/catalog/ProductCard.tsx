import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product.types";
import { productDetailRoute } from "@/constants/routes.constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddCartButton from "../cart/AddCartButton";

const RARITY_COLORS: Record<string, string> = {
  Common: "#808080",
  Rare: "#1565C0",
  "Super Rare": "#E65100",
  "Ultra Rare": "#F9A825",
  "Secret Rare": "#6A1B9A",
  "Ultimate Rare": "#C62828",
  "Ghost Rare": "#FFFFFF",
};

function getRarityColor(rarity: string): string {
  return RARITY_COLORS[rarity] ?? "#707070";
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <div
      className="group block"
      title={product.name}
    >
      <Card
        className={`h-full overflow-hidden border border-silver-mist/60 bg-snow transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg ${isOutOfStock ? "opacity-75" : ""}`}
      >
        <div className="relative aspect-square overflow-hidden bg-fog">
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-contain p-4 transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? "opacity-70" : ""}`}
            priority
          />

          <Badge
            className="absolute top-2 left-2 text-xs font-bold px-2 py-1 cursor-default z-10"
            style={{
              backgroundColor: getRarityColor(product.rarity),
              color: "#fff",
            }}
          >
            {product.rarity}
          </Badge>

          {isLowStock && (
            <Badge
              variant="secondary"
              className="absolute bottom-2 right-2 text-xs cursor-default z-10"
            >
              ¡Últimas {product.stock}!
            </Badge>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
              <Badge
                variant="destructive"
                className="px-4 py-2 rounded-full font-bold text-sm"
              >
                SIN STOCK
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="flex flex-col p-4 flex-grow">
          <h3 className="font-heading text-body-sm font-semibold text-ink truncate mb-1">
            {product.name}
          </h3>
          <p className="text-caption font-medium text-graphite mb-0.5">
            {product.rarity_code}
          </p>
          <span className="text-subheading font-semibold text-ink mt-1">
            ${product.price}
          </span>

          <AddCartButton product={product} />
        </CardContent>
      </Card>
    </div>
  );
}
