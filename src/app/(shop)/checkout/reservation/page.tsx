"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Clock, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getOrderForReservationAction } from "@/actions/order.actions";
import type { ReservationData } from "@/actions/order.actions";
import { WHATSAPP } from "@/constants/whatsapp.constants";
import { variantsNormalDownUp } from "@/lib/animation-variants";
import LinkShopButton from "@/components/features/cart/LinkShopButton";

export default function ReservationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order");
  const [data, setData] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const [autoOpened, setAutoOpened] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.replace("/cart");
      return;
    }

    getOrderForReservationAction(orderId).then((result) => {
      setData(result);
      setLoading(false);

      if (!result.error && result.items && result.total !== undefined) {
        const message = WHATSAPP.TEMPLATE({
          id: orderId.slice(0, 8),
          items: result.items,
          total: result.total,
        });
        const phone = WHATSAPP.NUMBER;
        setWaUrl(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
      }
    });
  }, [orderId, router]);

  const openWhatsApp = useCallback(() => {
    if (waUrl) {
      window.open(waUrl, "_blank");
      setAutoOpened(true);
    }
  }, [waUrl]);

  useEffect(() => {
    if (waUrl && !autoOpened) {
      const timer = setTimeout(() => {
        openWhatsApp();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [waUrl, autoOpened, openWhatsApp]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 px-5">
        <Loader2 className="size-10 animate-spin text-graphite" />
        <p className="text-body text-graphite">Cargando tu pedido...</p>
      </div>
    );
  }

  if (data?.error || !data?.orderId) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 px-5">
        <div className="flex size-20 items-center justify-center rounded-full bg-caution/10">
          <Clock className="size-10 text-caution" />
        </div>
        <h1 className="font-heading text-heading-sm font-semibold text-ink">
          Pedido no encontrado
        </h1>
        <p className="max-w-sm text-center text-body text-graphite">
          No pudimos encontrar tu pedido. Volvé al carrito e intentá de nuevo.
        </p>
        <button
          onClick={() => router.push("/cart")}
          className="mt-2 flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-body-sm font-medium text-snow transition-opacity hover:opacity-90 cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Volver al carrito
        </button>
      </div>
    );
  }

  const itemCount = data.items?.length ?? 0;

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-[700px] flex-col items-center justify-center gap-6 px-5 py-10">
      <motion.div
        variants={variantsNormalDownUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-6 text-center"
      >
        <div className="flex size-20 items-center justify-center rounded-full bg-ink/5">
          <CheckCircle className="size-10 text-ink" />
        </div>

        <div>
          <h1 className="font-heading text-heading font-semibold text-ink">
            Pedido reservado
          </h1>
          <p className="mt-2 text-body-sm text-graphite">
            N° {data.orderId.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <div className="w-full max-w-md rounded-2xl bg-snow p-6 text-left">
          <p className="text-body-sm text-graphite leading-relaxed">
            Tu pedido de <strong className="text-ink">{itemCount} {itemCount === 1 ? "producto" : "productos"}</strong> fue reservado correctamente.
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-body-sm text-graphite">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-ink">•</span>
              El stock se reserva por <strong className="text-ink">24 horas</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-ink">•</span>
              Para confirmar, realizá el pago o la seña acordada por WhatsApp
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-ink">•</span>
              Una vez confirmado el pago, se descontará el stock automáticamente
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center gap-3">
          {!autoOpened && (
            <p className="text-caption text-graphite animate-pulse">
              Abriendo WhatsApp...
            </p>
          )}
          {autoOpened && (
            <p className="text-caption text-graphite">
              ¿No se abrió? Hacé clic abajo
            </p>
          )}
          <button
            onClick={openWhatsApp}
            className="flex items-center gap-2 rounded-lg bg-green-400 px-8 py-3 text-body-sm font-medium text-snow transition-opacity hover:opacity-90 cursor-pointer"
          >
            <Image
              src="/images/icons8-whatsapp-144.png"
              alt="WhatsApp"
              width={20}
              height={20}

            />
            {autoOpened ? "Abrir WhatsApp de nuevo" : "Abrir WhatsApp"}
          </button>
        </div>

        <LinkShopButton url="/" message="Volver al inicio" />
      </motion.div>
    </div>
  );
}
