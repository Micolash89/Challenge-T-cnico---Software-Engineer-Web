import { z } from 'zod';

export const PASSWORD_REQUIREMENTS = [
  { label: 'Mínimo 8 caracteres', test: (pw: string) => pw.length >= 8 },
  { label: 'Al menos una mayúscula', test: (pw: string) => /[A-Z]/.test(pw) },
  { label: 'Al menos un número', test: (pw: string) => /\d/.test(pw) },
  { label: 'Al menos un carácter especial', test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
] as const;

export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial');

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const signUpSchema = z
  .object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z
      .string()
      .min(1, 'El email es requerido')
      .email('Email inválido'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
