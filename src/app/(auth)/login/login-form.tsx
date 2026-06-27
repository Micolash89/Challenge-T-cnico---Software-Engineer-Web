'use client';

import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import { signInAction } from '@/actions/auth.actions';

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <div className="rounded-xl bg-caution/10 px-4 py-3 text-body-sm text-caution">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-body-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@email.com"
          className="rounded-xl border border-silver-mist bg-snow px-4 py-2.5 text-body-sm text-ink outline-none transition-colors placeholder:text-graphite/50 focus:border-ink/30 focus:ring-1 focus:ring-ink/20"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-body-sm font-medium text-ink">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="rounded-xl border border-silver-mist bg-snow px-4 py-2.5 text-body-sm text-ink outline-none transition-colors placeholder:text-graphite/50 focus:border-ink/30 focus:ring-1 focus:ring-ink/20"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 flex items-center justify-center gap-2 rounded-full bg-azure px-6 py-3 text-body-sm font-medium text-snow transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {pending ? 'Ingresando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
