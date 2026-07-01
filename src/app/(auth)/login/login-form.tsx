'use client';

import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInAction } from '@/actions/auth.actions';

export function LoginForm({ redirectTo = '/' }: { redirectTo?: string }) {
  const [state, formAction, pending] = useActionState(signInAction, null);

  return (<>
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="redirect" value={redirectTo} />
      {state?.error && (
        <div className="rounded-xl bg-caution/10 px-4 py-3 text-body-sm text-caution">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@email.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" disabled={pending} className="mt-2 w-full h-10 rounded-lg cursor-pointer">
        {pending ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Ingresando...
          </>
        ) : (
          'Iniciar sesión'
        )}
      </Button>
    </form>
    </>
  );
}
