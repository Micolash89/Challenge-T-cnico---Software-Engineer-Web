"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { verifyPaymentAction } from "@/actions/order.actions";
import { ROUTES } from "@/constants/routes.constants";
import { variantsNormalDownUp } from "@/lib/animation-variants";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("external_reference");
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(!!orderId);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!orderId) return;
    const ref = orderId;

    async function check() {
      const result = await verifyPaymentAction(ref);
      if (result.verified) {
        setVerified(true);
        setChecking(false);
        stopPolling();
      }
    }

    check();
    pollRef.current = setInterval(check, 3000);

    return stopPolling;
  }, [orderId, stopPolling]);

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 px-5">
      <motion.div
        variants={variantsNormalDownUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-4 text-center"
      >
        {checking ? (
          <>
            <div className="flex size-20 items-center justify-center rounded-full bg-fog">
              <Loader2 className="size-10 animate-spin text-graphite" />
            </div>
            <h1 className="font-heading text-heading-sm font-semibold text-ink">
              Verificando pago...
            </h1>
            <p className="max-w-sm text-body text-graphite">
              Estamos confirmando tu pago. Esto puede tomar unos segundos.
            </p>
          </>
        ) : verified ? (
          <>
            <div className="flex size-20 items-center justify-center rounded-full bg-ink/5">
              <CheckCircle className="size-10 text-ink" />
            </div>
            <h1 className="font-heading text-heading-sm font-semibold text-ink">
              ¡Pago exitoso!
            </h1>
            <p className="max-w-sm text-body text-graphite">
              Gracias por tu compra. Te enviaremos la confirmación y los
              detalles del envío a la brevedad.
            </p>
            <Link
              href={ROUTES.HOME}
              className="mt-2 rounded-lg bg-primary px-6 py-3 text-body-sm font-medium text-snow transition-opacity hover:opacity-90"
            >
              Seguir comprando
            </Link>
          </>
        ) : (
          <>
            <div className="flex size-20 items-center justify-center rounded-full bg-caution/10">
              <Loader2 className="size-10 text-caution" />
            </div>
            <h1 className="font-heading text-heading-sm font-semibold text-ink">
              Pago en proceso
            </h1>
            <p className="max-w-sm text-body text-graphite">
              El pago fue registrado pero estamos esperando la confirmación.
              Refresca la página en unos momentos.
            </p>
            <Link
              href={ROUTES.HOME}
              className="mt-2 rounded-lg bg-primary px-6 py-3 text-body-sm font-medium text-snow transition-opacity hover:opacity-90"
            >
              Volver al inicio
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
