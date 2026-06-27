import Link from 'next/link';
import { ROUTES } from '@/constants/routes.constants';
import { RegisterForm } from './register-form';

export const metadata = {
  title: 'Crear cuenta — TCG Store',
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="rounded-3xl bg-snow p-8">
        <h1 className="mb-1 font-heading text-heading-sm font-semibold text-ink">
          Crear cuenta
        </h1>
        <p className="mb-8 text-body-sm text-graphite">
          Registrate para empezar a comprar
        </p>

        <RegisterForm />

        <p className="mt-6 text-center text-body-sm text-graphite">
          ¿Ya tenés cuenta?{' '}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-cobalt-link underline-offset-2 hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
