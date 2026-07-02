'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { signInSchema, signUpSchema } from '@/lib/validations/auth.schema';
import { ROUTES } from '@/constants/routes.constants';

export interface AuthActionResult {
  error?: string;
  success?: boolean;
}

const SUPABASE_ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': 'Email o contraseña incorrectos',
  'Email not confirmed': 'Email no confirmado',
  'Email rate limit exceeded': 'Demasiados intentos. Esperá unos minutos e intentá de nuevo.',
  'User already registered': 'Ya existe una cuenta con ese email.',
  'For security purposes, you can only request this after':
    'Esperá unos segundos antes de intentar de nuevo.',
};

function mapError(message: string): string {
  for (const [key, value] of Object.entries(SUPABASE_ERROR_MAP)) {
    if (message.startsWith(key)) return value;
  }
  return message;
}

export async function signInAction(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Datos inválidos';
    return { error: firstError };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: mapError(error.message) };
  }

  const redirectTo = (formData.get('redirect') as string) || ROUTES.HOME;
  redirect(redirectTo);
}

export async function signUpAction(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Datos inválidos';
    return { error: firstError };
  }

  const origin = (await headers()).get('origin');
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: mapError(error.message) };
  }

  return { success: true };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(ROUTES.HOME);
}
