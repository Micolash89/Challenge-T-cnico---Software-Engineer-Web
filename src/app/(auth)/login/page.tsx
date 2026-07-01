import Link from 'next/link';
import { ROUTES } from '@/constants/routes.constants';
import { LoginForm } from './login-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata = {
  title: 'Iniciar sesión — TCG Store',
};

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Iniciar sesión</CardTitle>
        <CardDescription className="text-center">
          Ingresá con tu cuenta para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />

        <p className="mt-6 text-center text-body-sm text-graphite ">
          ¿No tenés cuenta?{' '}
          <Link
            href={ROUTES.REGISTER}
            className="font-medium text-cobalt-link underline-offset-2 hover:underline "
          >
            Registrate
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
