import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/features/admin/Breadcrumbs';
import { ProductForm } from '@/components/features/admin/ProductForm';
import { updateProductAction } from '@/actions/product.actions';
import { getProductByIdAction } from '@/actions/admin.actions';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import type { Product } from '@/types/product.types';

export const metadata = {
  title: `Editar Producto — Admin`,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getProductByIdAction(id);

  if ('error' in result) {
    notFound();
  }

  const product = result as unknown as Product;
  const updateBound = updateProductAction.bind(null, id);

  const defaults: Record<string, string | number | boolean> = {
    name: product.name,
    slug: product.slug,
    type: product.type as string,
    category: product.category,
    rarity: product.rarity,
    rarityCode: product.rarity_code,
    price: product.price,
    priceArs: product.price_ars,
    productLineName: product.product_line_name,
    productId: product.productId,
    img: product.img,
    stock: product.stock,
    active: product.active,
    featured: product.featured,
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: ADMIN_I18N.breadcrumbs.home, href: '/admin/dashboard' },
          { label: ADMIN_I18N.breadcrumbs.products, href: '/admin/products' },
          { label: `${ADMIN_I18N.breadcrumbs.edit}: ${product.name}` },
        ]}
      />

      <h1 className="text-2xl font-bold">
        {ADMIN_I18N.breadcrumbs.edit}: {product.name}
      </h1>

      <ProductForm
        action={updateBound}
        mode="edit"
        defaultValues={defaults}
      />
    </div>
  );
}
