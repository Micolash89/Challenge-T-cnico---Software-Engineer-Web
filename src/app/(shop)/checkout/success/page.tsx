import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes.constants';

export const metadata = {
  title: 'Pago exitoso — TCG Store',
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 px-5">
      <div className="flex size-20 items-center justify-center rounded-full bg-ink/5">
        <CheckCircle className="size-10 text-ink" />
      </div>
      <h1 className="font-heading text-heading-sm font-semibold text-ink">
        ¡Pago exitoso!
      </h1>
      <p className="max-w-sm text-center text-body text-graphite">
        Gracias por tu compra. Te enviaremos la confirmación y los detalles del
        envío a la brevedad.
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
