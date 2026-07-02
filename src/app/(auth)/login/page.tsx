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

export default async function LoginPage(props: {
  searchParams?: Promise<{ redirect?: string; verified?: string }>;
}) {
  const searchParams = await props.searchParams;
  const redirectTo = searchParams?.redirect ?? '/';
  const verified = searchParams?.verified;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Iniciar sesión</CardTitle>
        <CardDescription className="text-center">
          Ingresá con tu cuenta para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        {verified === 'true' && (
          <div className="mb-4 rounded-xl bg-ink/5 px-4 py-3 text-body-sm text-ink">
            Email verificado. Ya podés iniciar sesión.
          </div>
        )}
        {verified === 'false' && (
          <div className="mb-4 rounded-xl bg-caution/10 px-4 py-3 text-body-sm text-caution">
            Revisá tu email para verificar la cuenta antes de iniciar sesión.
          </div>
        )}

        <LoginForm redirectTo={redirectTo} />

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
