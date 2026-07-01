import Link from "next/link";
import { ShoppingBagIcon } from "lucide-react";

export default function EmptyCart({ url }: { url: string }) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 px-5">
      <div className="flex size-20 items-center justify-center rounded-full bg-fog">
        <ShoppingBagIcon size={35} className="text-graphite" />
      </div>
      <h1 className="font-heading text-heading-sm font-semibold text-ink">
        Tu carrito está vacío
      </h1>
      <p className="text-body text-graphite text-center text-sm">
        Agregá productos para empezar a comprar
      </p>
      <Link
        href={url}
        className="mt-2 rounded-lg bg-primary px-6 py-3 text-body-sm font-medium text-snow transition-opacity hover:bg-primary/80 hover:cursor-pointer"
      >
        Ver productos
      </Link>
    </div>
  );
}
