import Link from 'next/link';
import { ROUTES } from '@/constants/routes.constants';
import { LoginForm } from './login-form';

export const metadata = {
  title: 'Iniciar sesión — TCG Store',
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="rounded-3xl bg-snow p-8">
        <h1 className="mb-1 font-heading text-heading-sm font-semibold text-ink">
          Iniciar sesión
        </h1>
        <p className="mb-8 text-body-sm text-graphite">
          Ingresá con tu cuenta para continuar
        </p>

        <LoginForm />

        <p className="mt-6 text-center text-body-sm text-graphite">
          ¿No tenés cuenta?{' '}
          <Link
            href={ROUTES.REGISTER}
            className="font-medium text-cobalt-link underline-offset-2 hover:underline"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
