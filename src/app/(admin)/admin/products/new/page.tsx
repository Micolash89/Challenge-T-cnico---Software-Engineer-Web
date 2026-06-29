import { Breadcrumbs } from '@/components/features/admin/Breadcrumbs';
import { ProductForm } from '@/components/features/admin/ProductForm';
import { createProductAction } from '@/actions/product.actions';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';

export const metadata = {
  title: `Nuevo Producto — Admin`,
};

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: ADMIN_I18N.breadcrumbs.home, href: '/admin/dashboard' },
          { label: ADMIN_I18N.breadcrumbs.products, href: '/admin/products' },
          { label: ADMIN_I18N.breadcrumbs.newProduct },
        ]}
      />

      <h1 className="text-2xl font-bold">{ADMIN_I18N.breadcrumbs.newProduct}</h1>

      <ProductForm action={createProductAction} mode="create" />
    </div>
  );
}
