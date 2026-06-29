import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product.types';
import { productDetailRoute } from '@/constants/routes.constants';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {

  console.log('ProductCard render', product);

  return (
    <Link
      href={productDetailRoute(product.product_line_name, product.name)}
      className="group flex flex-col overflow-hidden rounded-3xl bg-snow transition-colors hover:bg-fog"
    >
      <div className="relative aspect-square overflow-hidden bg-fog">
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-344 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <span className="text-caption font-medium uppercase text-graphite">
          {product.rarity}
        </span>
        <h3 className="font-heading text-body-sm font-semibold text-ink">
          {product.name}
        </h3>
        <span className="text-subheading font-semibold text-ink">
          {/* ${product.price_ars.toLocaleString('es-AR')} */}
          ${product.price}
        </span>
      </div>
    </Link>
  );
}
