import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductById } from '@/services/product.service';
import { VALID_PRODUCT_LINES } from '@/constants/database.constants';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AddCartButton from '@/components/features/cart/AddCartButton';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ product_line_name: string; id: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps) {
  const { product_line_name, id } = await params;
  const product = await getProductById(product_line_name, id);

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  return {
    title: `${product.name} — ${product_line_name.toUpperCase()}`,
    description: `${product.name} — ${product.rarity} de ${product.category}`,
    openGraph: {
      title: product.name,
      description: `${product.name} — ${product.rarity} de ${product.category}`,
      images: [{ url: product.img }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { product_line_name, id } = await params;

  if (!VALID_PRODUCT_LINES.includes(product_line_name as typeof VALID_PRODUCT_LINES[number])) {
    notFound();
  }

  const product = await getProductById(product_line_name, id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-10">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ── Image ── */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-snow">
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-8"
            priority
          />
        </div>

        {/* ── Info ── */}
        <div className="flex flex-col justify-center gap-6">
          {/* Badges */}
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-caption font-medium uppercase tracking-wide">
              {product.rarity}
            </Badge>
            <Badge variant="outline" className="text-caption font-medium uppercase">
              {product.category}
            </Badge>
          </div>

          {/* Name */}
          <h1 className="font-heading text-heading font-semibold leading-[1.17] tracking-[-0.6px] text-ink">
            {product.name}
          </h1>

          {/* Price */}
          <p className="font-heading text-heading-sm font-semibold text-ink">
            ${product.price}
          </p>

          {/* Stock */}
          <p className={`text-body-sm font-medium ${product.stock > 0 ? 'text-graphite' : 'text-caution'}`}>
            {product.stock > 0
              ? `En stock — ${product.stock} unidades`
              : 'Sin stock'}
          </p>

          <Separator />

          {/* CTA */}
          <AddCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
