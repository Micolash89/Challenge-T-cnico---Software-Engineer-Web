'use client';

import { useEffect, useState, useActionState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpAction } from '@/actions/auth.actions';
import { PASSWORD_REQUIREMENTS } from '@/lib/validations/auth.schema';
import { ROUTES } from '@/constants/routes.constants';

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(signUpAction, null);
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success('Cuenta creada. Revisá tu email para verificar.');
      setTimeout(() => router.push(`${ROUTES.LOGIN}?verified=false`), 2000);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          autoComplete="name"
          required
          placeholder="Tu nombre"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
        />

        <ul className="mt-1 flex flex-col gap-1">
          {PASSWORD_REQUIREMENTS.map((req) => {
            const met = req.test(password);
            return (
              <li
                key={req.label}
                className={`flex items-center gap-1.5 text-body-sm transition-colors ${
                  met ? 'text-ink' : 'text-graphite'
                }`}
              >
                {met && <Check className="size-3.5 shrink-0" />}
                <span className={met ? '' : 'ml-[22px]'}>{req.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Repetir contraseña</Label>
        <Input
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" disabled={pending} className="mt-2 w-full h-10 rounded-lg">
        {pending ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          'Crear cuenta'
        )}
      </Button>
    </form>
  );
}
