import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductById } from '@/services/product.service';
import { VALID_PRODUCT_LINES } from '@/constants/database.constants';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import AddCartButton from '@/components/features/cart/AddCartButton';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ product_line_name: string; id: string }>;
}

const RARITY_COLORS: Record<string, string> = {
  Common: '#808080',
  Rare: '#1565C0',
  'Super Rare': '#E65100',
  'Ultra Rare': '#F9A825',
  'Secret Rare': '#6A1B9A',
  'Ultimate Rare': '#C62828',
  'Ghost Rare': '#FFFFFF',
};

function getRarityColor(rarity: string): string {
  return RARITY_COLORS[rarity] ?? '#707070';
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { product_line_name, id } = await params;
  const product = await getProductById(product_line_name, id);

  if (!product) return { title: 'Producto no encontrado' };

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

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { product_line_name, id } = await params;

  if (!VALID_PRODUCT_LINES.includes(product_line_name as typeof VALID_PRODUCT_LINES[number])) notFound();

  const product = await getProductById(product_line_name, id);
  if (!product) notFound();

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-10">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-snow">
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={`object-contain p-8 ${isOutOfStock ? 'opacity-70' : ''}`}
            priority
          />

          <Badge
            className="absolute top-3 left-3 text-xs font-bold px-3 py-1.5 cursor-default z-10"
            style={{ backgroundColor: getRarityColor(product.rarity), color: '#fff' }}
          >
            {product.rarity}
          </Badge>

          {isLowStock && (
            <Badge variant="secondary" className="absolute bottom-3 right-3 text-xs cursor-default z-10">
              ¡Últimas {product.stock}!
            </Badge>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 rounded-3xl">
              <Badge variant="destructive" className="px-6 py-3 rounded-full font-bold text-sm">
                SIN STOCK
              </Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center gap-6">
          <Card className="border-0 bg-transparent shadow-none">
            <CardContent className="flex flex-col gap-4 p-0">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-caption font-medium uppercase tracking-wide">
                  {product.rarity}
                </Badge>
                <Badge variant="outline" className="text-caption font-medium uppercase">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="text-caption font-medium uppercase">
                  {product.rarity_code}
                </Badge>
              </div>

              <span className="text-caption font-medium uppercase tracking-wide text-graphite">
                {product.type === 'box' ? 'Box' : 'Carta'} · #{product.productId}
              </span>

              <h1 className="font-heading text-heading font-semibold leading-[1.17] tracking-[-0.6px] text-ink">
                {product.name}
              </h1>

              <p className="font-heading text-heading-sm font-semibold text-ink">
                $ {product.price} USD
              </p>

              <p className={`text-body-sm font-medium ${isOutOfStock ? 'text-caution' : isLowStock ? 'text-caution' : 'text-graphite'}`}>
                {isOutOfStock
                  ? 'Sin stock'
                  : isLowStock
                    ? `¡Últimas ${product.stock} unidades!`
                    : `En stock — ${product.stock} unidades`
                }
              </p>

              <Separator />

              <AddCartButton product={product} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
