"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, ShoppingBagIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/hooks/useCartStore";
import { ROUTES } from "@/constants/routes.constants";
import { Button } from "@/components/ui/button";
import LessCartButton from "@/components/features/cart/LessCartButton";
import PlusCartButton from "@/components/features/cart/PlusCartButton";
import RemoveItemCartButton from "@/components/features/cart/RemoveItemButton";
import { ClearCartModal } from "@/components/features/cart/ClearCartModal";
import EmptyCart from "@/components/features/cart/EmptyCart";
import LinkShopButton from "@/components/features/cart/LinkShopButton";
import {
  variantsNormalDownUp,
  containerVariantsCascade,
} from "@/lib/animation-variants";

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CartPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [modalOpen, setModalOpen] = useState(false);

  const [totalItems, totalCost] = [
    items.reduce((sum, item) => sum + Number(item.quantity), 0),
    items.reduce((sum, item) => sum + Number(item.cost), 0),
  ];

  if (items.length === 0) {
    return <EmptyCart url={ROUTES.HOME} />;
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-10">
      <motion.div
        variants={variantsNormalDownUp}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <div className="flex items-center justify-between transition-colors">
          <div className="w-full">
            <div className="w-fit">
              <LinkShopButton url={ROUTES.YUGIOH} message="Seguir comprando" />
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-start md:items-center gap-0 md:gap-2 flex-col md:flex-row">
                <h1 className="font-heading text-heading font-semibold text-ink flex items-center gap-2">
                  <ShoppingBagIcon size={35} />
                  <span>Carrito</span>
                </h1>
                <p className="mt-1 text-body-sm text-graphite">
                  ( {totalItems} {totalItems === 1 ? "producto" : "productos"} )
                </p>
              </div>

              <Button
                onClick={() => setModalOpen(true)}
                variant="ghost"
                className="bg-white border border-silver-mist text-graphite hover:bg-red-200 hover:text-red-500 transition-colors flex items-center gap-1 px-3 py-1 cursor-pointer"
                size="lg"
                title="Vaciar Carrito"
              >
                <Trash2 className="size-5" />
                <span>Vaciar carrito</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-10 relative">
        <motion.div
          variants={containerVariantsCascade}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5 w-full"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariant}
              className="flex gap-5 rounded-lg bg-snow py-[6px] px-3"
            >
              <div className="relative size-25">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  sizes="100px"
                  className="object-contain p-2"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-heading-sm font-semibold text-ink">
                      {item.name}
                    </h3>
                    <p className=" text-xs text-graphite">
                      {item.rarity} - {item.category} - {" ( "}
                      {item.stock} disponibles{" )"}
                    </p>
                  </div>
                  <RemoveItemCartButton item={item} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LessCartButton item={item} />
                    <span className="w-10 text-center text-body font-medium text-ink">
                      {item.quantity}
                    </span>
                    <PlusCartButton item={item} />
                  </div>

                  <span className="font-heading text-subheading font-semibold text-ink">
                    ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={variantsNormalDownUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
          className="mt-8 h-fit ml-auto flex w-full md:max-w-sm flex-col gap-4 rounded-lg bg-snow p-6 md:sticky md:top-15 w-full"
        >
          <div className="flex items-center justify-between">
            <span className="text-body text-graphite">Subtotal</span>
            <span className="text-body font-medium text-ink">
              ${totalCost.toLocaleString("es-AR")}
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
              ${totalCost.toLocaleString("es-AR")}
            </span>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="mt-2 bg-black hover:bg-ink/80 rounded-lg hover:cursor-pointer px-6 py-3 text-body font-medium text-snow transition-opacity hover:opacity-90 flex items-center justify-center"
          >
            <span>Continuar compra</span>
            <ArrowRight className="size-5 ml-2 inline-block text-white" />
          </button>
        </motion.div>
      </div>

      <ClearCartModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={clearCart}
      />
    </div>
  );
}
