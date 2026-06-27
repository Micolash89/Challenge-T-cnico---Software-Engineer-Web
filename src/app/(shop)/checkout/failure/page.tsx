import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes.constants';

export const metadata = {
  title: 'Pago rechazado — TCG Store',
};

export default function CheckoutFailurePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 px-5">
      <div className="flex size-20 items-center justify-center rounded-full bg-caution/10">
        <XCircle className="size-10 text-caution" />
      </div>
      <h1 className="font-heading text-heading-sm font-semibold text-ink">
        Pago rechazado
      </h1>
      <p className="max-w-sm text-center text-body text-graphite">
        El pago no pudo completarse. Podés intentar con otro método o volver a
        intentar.
      </p>
      <div className="flex gap-3">
        <Link
          href={ROUTES.CART}
          className="rounded-full border border-silver-mist px-6 py-3 text-body-sm font-medium text-ink transition-colors hover:bg-fog"
        >
          Volver al carrito
        </Link>
        <Link
          href="/checkout"
          className="rounded-full bg-azure px-6 py-3 text-body-sm font-medium text-snow transition-opacity hover:opacity-90"
        >
          Reintentar
        </Link>
      </div>
    </div>
  );
}
