"use client";

import { useEffect, useRef } from "react";
import { X,  ShoppingBag, ShoppingBagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCartStore";
import { ROUTES } from "@/constants/routes.constants";
import LessCartButton from "./LessCartButton";
import PlusCartButton from "./PlusCartButton";
import RemoveItemCartButton from "./RemoveItemButton";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, clearCart } = useCartStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const totalItems = items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );
  const totalCost = items.reduce((sum, item) => sum + Number(item.cost), 0);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
        className={`fixed inset-0 z-50 bg-black/10 backdrop-blur-xs transition-opacity duration-344 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-snow shadow-xl transition-transform duration-344 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-silver-mist px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag />
            <h2 className="font-heading text-heading-sm font-semibold text-ink">
              Carrito
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex size-6 items-center justify-center rounded-full text-graphite transition-colors hover:bg-fog hover:text-ink hover:cursor-pointer bg-gray-100"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5">
            <div className="flex size-40 items-center justify-center rounded-full bg-fog">
              <ShoppingBagIcon className="size-24 text-graphite" />
            </div>
            <p className="text-body text-graphite">Tu carrito está vacío</p>
            <Link
              href={ROUTES.HOME}
              onClick={onClose}
              className="text-body-sm font-medium text-cobalt-link underline-offset-2 hover:underline"
            >
              Ver productos
            </Link>
          </div>
        )}

        {/* Items */}
        {items.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-lg bg-fog p-3"
                  >
                    {/* Image */}
                    <div className="relative size-21  ">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="100px"
                        className="object-contain "
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between ">
                        <div>
                          <h3 className="text-body-sm font-medium text-ink line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-caption text-graphite">
                            {item.rarity}
                          </p>
                        </div>
                     <RemoveItemCartButton item={item} />
                      </div>
                      <div className="flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <LessCartButton item={item} />
                          <span className="w-8 text-center text-body-sm font-medium text-ink">
                            {item.quantity}
                          </span>
                          <PlusCartButton item={item} />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-body-sm font-semibold text-ink">
                            $
                            {(
                              Number(item.price) * Number(item.quantity)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-silver-mist px-5 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-body text-graphite">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
                <span className="font-heading text-heading-sm font-semibold text-ink">
                  ${totalCost.toLocaleString("es-AR")}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="flex-1 rounded-lg border border-silver-mist px-4 py-2.5 text-body-sm font-medium text-graphite transition-colors hover:bg-fog hover:text-ink cursor-pointer"
                >
                  Vaciar
                </button>
                <Link
                  href={ROUTES.CART}
                  onClick={onClose}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-body-sm font-medium text-snow transition-opacity hover:opacity-90 cursor-pointer"
                >
                  Ver carrito
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
