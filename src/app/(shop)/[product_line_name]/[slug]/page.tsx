import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductBySlug } from '@/services/product.service';
import { VALID_PRODUCT_LINES } from '@/constants/database.constants';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ product_line_name: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps) {
  const { product_line_name, slug } = await params;
  const product = await getProductBySlug(product_line_name, slug);

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  return {
    title: `${product.name} — ${product_line_name.toUpperCase()}`,
    description: `${product.name} — ${product.rarity} de ${product.category}`,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { product_line_name, slug } = await params;

  if (!VALID_PRODUCT_LINES.includes(product_line_name as typeof VALID_PRODUCT_LINES[number])) {
    notFound();
  }

  const product = await getProductBySlug(product_line_name, slug);

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
          {/* Rarity */}
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-fog px-4 py-1.5 text-caption font-medium uppercase tracking-wide text-graphite">
              {product.rarity}
            </span>
            <span className="text-caption font-medium uppercase text-graphite">
              {product.category}
            </span>
          </div>

          {/* Name */}
          <h1 className="font-heading text-heading font-semibold leading-[1.17] tracking-[-0.6px] text-ink">
            {product.name}
          </h1>

          {/* Price */}
          <p className="font-heading text-heading-sm font-semibold text-ink">
            ${product.price_ars.toLocaleString('es-AR')}
          </p>

          {/* Stock */}
          <p className={`text-body-sm font-medium ${product.stock > 0 ? 'text-graphite' : 'text-caution'}`}>
            {product.stock > 0
              ? `En stock — ${product.stock} unidades`
              : 'Sin stock'}
          </p>

          {/* Divider */}
          <div className="h-px bg-silver-mist" />

          {/* CTA */}
          <button
            disabled={product.stock === 0}
            className="w-full rounded-full bg-azure px-6 py-3 text-body font-medium text-snow transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
