'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/hooks/useCartStore';
import { ROUTES } from '@/constants/routes.constants';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = items.reduce((sum, item) => sum + item.cost, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 px-5">
        <div className="flex size-20 items-center justify-center rounded-full bg-fog">
          <ShoppingBag className="size-10 text-graphite" />
        </div>
        <h1 className="font-heading text-heading-sm font-semibold text-ink">
          Tu carrito está vacío
        </h1>
        <p className="text-body text-graphite">
          Agregá productos para empezar a comprar
        </p>
        <Link
          href={ROUTES.HOME}
          className="mt-2 rounded-full bg-azure px-6 py-3 text-body-sm font-medium text-snow transition-opacity hover:opacity-90"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href={ROUTES.HOME}
            className="mb-2 flex items-center gap-1 text-body-sm text-graphite transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            Seguir comprando
          </Link>
          <h1 className="font-heading text-heading font-semibold text-ink">
            Carrito
          </h1>
          <p className="mt-1 text-body-sm text-graphite">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="rounded-full border border-silver-mist px-4 py-2 text-body-sm font-medium text-graphite transition-colors hover:border-caution/30 hover:text-caution"
        >
          Vaciar carrito
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-5 rounded-3xl bg-snow p-5"
          >
            {/* Image */}
            <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-fog">
              <Image
                src={item.img}
                alt={item.name}
                fill
                sizes="96px"
                className="object-contain p-2"
              />
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-heading-sm font-semibold text-ink">
                    {item.name}
                  </h3>
                  <p className="text-body-sm text-graphite">
                    {item.rarity} — {item.category}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="flex size-8 items-center justify-center rounded-full text-graphite transition-colors hover:bg-caution/10 hover:text-caution"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="flex size-8 items-center justify-center rounded-full border border-silver-mist text-graphite transition-colors hover:bg-fog hover:text-ink"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-10 text-center text-body font-medium text-ink">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex size-8 items-center justify-center rounded-full border border-silver-mist text-graphite transition-colors hover:bg-fog hover:text-ink"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <span className="font-heading text-subheading font-semibold text-ink">
                  ${(item.price_ars * item.quantity).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 ml-auto flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-snow p-6">
        <div className="flex items-center justify-between">
          <span className="text-body text-graphite">Subtotal</span>
          <span className="text-body font-medium text-ink">
            ${totalCost.toLocaleString('es-AR')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-body text-graphite">Envío</span>
          <span className="text-body-sm text-graphite">A convenir</span>
        </div>
        <div className="h-px bg-silver-mist" />
        <div className="flex items-center justify-between">
          <span className="font-heading text-heading-sm font-semibold text-ink">
            Total
          </span>
          <span className="font-heading text-heading-sm font-semibold text-ink">
            ${totalCost.toLocaleString('es-AR')}
          </span>
        </div>
        <button
          onClick={() => router.push('/checkout')}
          className="mt-2 rounded-full bg-azure px-6 py-3 text-body font-medium text-snow transition-opacity hover:opacity-90"
        >
          Continuar compra
        </button>
      </div>
    </div>
  );
}
