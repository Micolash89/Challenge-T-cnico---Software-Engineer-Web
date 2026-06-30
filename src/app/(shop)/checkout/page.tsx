"use client";

import { useActionState, useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, ArrowLeft, ShoppingBag, Banknote } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCartStore";
import { createOrderAction } from "@/actions/order.actions";
import { ROUTES } from "@/constants/routes.constants";
import EmptyCart from "@/components/features/cart/EmptyCart";
import LinkShopButton from "@/components/features/cart/LinkShopButton";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<
    "mercadopago" | "whatsapp_efectivo"
  >("mercadopago");
  const [state, formAction, pending] = useActionState(createOrderAction, null);

  // Redirect when the action returns a URL
  useEffect(() => {
    if (state?.redirectUrl) {
      clearCart();
      window.location.href = state.redirectUrl;
    }
  }, [state?.redirectUrl, clearCart]);

  // If cart is empty, show message
  if (items.length === 0 && !pending) {
    return <EmptyCart url={ROUTES.HOME} />;
  }

  const total = items.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-10 relative">
      <LinkShopButton url={ROUTES.CART} message="volver al carrito" />

      <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
        {/* ── Left: Payment method ── */}
        <div className=" lg:col-span-3">
          <div className="flex items-center gap-2 ">
            <Banknote size={50} />
            <h1 className="mb-8 font-heading text-heading font-semibold text-ink">
              Checkout
            </h1>
          </div>

          {/* Error */}
          {state?.error && (
            <div className="mb-6 rounded-xl bg-caution/10 px-4 py-3 text-body-sm text-caution">
              {state.error}
            </div>
          )}

          <form action={formAction} className="md:sticky md:top-21"> 
            <input type="hidden" name="paymentMethod" value={paymentMethod} />
            <input
              type="hidden"
              name="items"
              value={JSON.stringify(
                items.map((item) => ({
                  id: item.id,
                  quantity: item.quantity,
                  price_ars: item.price_ars,
                  name: item.name,
                  img: item.img,
                  rarity: item.rarity,
                })),
              )}
            />
            <input type="hidden" name="total" value={total} />

            <h2 className="mb-4 font-heading text-subheading font-semibold text-ink">
              Método de pago
            </h2>

            <div className="flex flex-col gap-3">
              {/* Mercado Pago */}
              <label
                className={`flex cursor-pointer items-center gap-4 rounded-lg border py-4 px-5 transition-colors justify-between ${
                  paymentMethod === "mercadopago"
                    ? "border-ink/30 bg-ink/5"
                    : "border-silver-mist bg-snow hover:border-ink/20"
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  value="mercadopago"
                  checked={paymentMethod === "mercadopago"}
                  onChange={() => setPaymentMethod("mercadopago")}
                  className="size-4 accent-ink hidden"
                />

                <div className="flex flex-col">
                  <span className="text-body-sm font-medium text-ink">
                    Mercado Pago
                  </span>
                  <span className="text-caption text-graphite">
                    Tarjeta de crédito, débito o efectivo
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/mercadopago-seeklogo.png"
                    alt="Mercado Pago"
                    width={40}
                    height={40}
                    className="object-contain  h-auto w-auto"
                  />
                </div>
              </label>

              {/* WhatsApp / Efectivo */}
              <label
                className={`flex cursor-pointer items-center gap-4 rounded-lg border py-4 px-5 transition-colors justify-between ${
                  paymentMethod === "whatsapp_efectivo"
                    ? "border-ink/30 bg-ink/5"
                    : "border-silver-mist bg-snow hover:border-ink/20"
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  value="whatsapp_efectivo"
                  checked={paymentMethod === "whatsapp_efectivo"}
                  onChange={() => setPaymentMethod("whatsapp_efectivo")}
                  className="size-4 accent-ink hidden"
                />
                <div className="flex flex-col">
                  <span className="text-body-sm font-medium text-ink capitalize">
                    Efectivo / deposito bancario
                  </span>
                  <span className="text-caption text-graphite">
                    Te contactas por WhatsApp para coordinar el pago/seña y
                    retiro del producto
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/icons8-whatsapp-144.png"
                    alt="WhatsApp"
                    width={30}
                    height={30}
                    className="object-contain  h-auto w-auto"
                  />
                </div>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-body font-medium text-snow transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer hover:bg-primary/80"
            >
              {pending && <Loader2 className="size-5 animate-spin" />}
              {pending
                ? "Procesando..."
                : paymentMethod === "mercadopago"
                  ? "Ir a pagar"
                  : "Confirmar pedido"}
            </button>
          </form>

          {state?.redirectUrl && (
            <div className="mt-4 rounded-xl bg-ink/5 p-4 text-body-sm text-ink">
              Redirigiendo...
            </div>
          )}
        </div>

        {/* ── Right: Order summary ── */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl bg-snow p-6">
            <h2 className="mb-4 font-heading text-subheading font-semibold text-ink">
              Resumen del pedido
            </h2>

            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-fog">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex flex-1 justify-between">
                    <div>
                      <p className="text-body-sm font-medium text-ink line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-caption text-graphite">
                        {item.rarity} x{item.quantity}
                      </p>
                    </div>
                    <span className="text-body-sm font-medium text-ink">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 h-px bg-silver-mist" />

            <div className="mt-4 flex items-center justify-between">
              <span className="font-heading text-heading-sm font-semibold text-ink">
                Total
              </span>
              <span className="font-heading text-heading-sm font-semibold text-ink">
                ${total.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
