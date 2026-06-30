import Link from 'next/link';
import { ROUTES } from '@/constants/routes.constants';
import { RegisterForm } from './register-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata = {
  title: 'Crear cuenta — TCG Store',
};

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Crear cuenta</CardTitle>
        <CardDescription className="text-center">
          Registrate para empezar a comprar
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
