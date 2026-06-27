import Link from 'next/link';
import { Clock } from 'lucide-react';
import { ROUTES } from '@/constants/routes.constants';

export const metadata = {
  title: 'Pago pendiente — TCG Store',
};

export default function CheckoutPendingPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 px-5">
      <div className="flex size-20 items-center justify-center rounded-full bg-fog">
        <Clock className="size-10 text-graphite" />
      </div>
      <h1 className="font-heading text-heading-sm font-semibold text-ink">
        Pago pendiente
      </h1>
      <p className="max-w-sm text-center text-body text-graphite">
        Estamos esperando la confirmación del pago. Te notificaremos cuando se
        acredite.
      </p>
      <Link
        href={ROUTES.HOME}
        className="mt-2 rounded-full bg-azure px-6 py-3 text-body-sm font-medium text-snow transition-opacity hover:opacity-90"
      >
        Seguir comprando
      </Link>
    </div>
  );
}
