import { Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes.constants';
import { Toaster } from '@/components/ui/sonner';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-fog px-5">
      <Button asChild variant="default" className="mb-5 h-10 px-5">
        <Link href={ROUTES.HOME}>
          <Home className="size-5" />
          Volver al inicio
        </Link>
      </Button>
      {children}
      <Toaster position="top-right" />
    </div>
  );
}
