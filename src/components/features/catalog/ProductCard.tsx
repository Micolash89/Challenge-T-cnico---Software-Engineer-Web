import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product.types";
import { productDetailRoute } from "@/constants/routes.constants";
import AddCartButton from "../cart/AddCartButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={productDetailRoute(product.product_line_name, product.id)}
      className="group flex flex-col overflow-hidden rounded-lg bg-snow transition-colors"
      title={product.name}
    >
      <div className="relative aspect-square overflow-hidden ">
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-344 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-1 px-5 ">
        <span className="text-caption font-medium uppercase text-graphite">
          {product.rarity}
        </span>
        <h3 className="font-heading text-body-sm font-semibold text-ink truncate">
          {product.name}
        </h3>
        <span className="text-subheading font-semibold text-ink">
          ${product.price}
        </span>
      </div>

      <AddCartButton product={product} />
    </Link>
  );
}
