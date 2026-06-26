# AGENTS.md

> Instrucciones para agentes de IA que trabajen en este proyecto.
> Leé este archivo completo antes de escribir o modificar cualquier código.

---

## 🃏 Dominio del proyecto — TCG E-Commerce

Este proyecto es un **e-commerce de Trading Card Games (TCG)**, inicialmente para Yu-Gi-Oh!.
La arquitectura es **escalable**: agregar un nuevo juego (Pokémon, Magic: The Gathering) solo requiere insertar filas en la base de datos, sin tocar código frontend.

### Reglas de negocio críticas

**Catálogo dinámico por URL:**
El parámetro `[product_line_name]` en la ruta define qué juego se muestra. Los filtros van en los `searchParams` de la URL — nunca en `useState`.
```
/yugioh                              → todos los productos activos
/yugioh?stock=true                   → solo con stock disponible
/yugioh?category=Alliance+Insight   → filtro por categoría
/yugioh?rarity=Secret+Rare          → filtro por rareza
/yugioh?page=2                       → paginación
/yugioh?stock=true&category=X&page=2 → combinación de filtros
```

**Gestión de stock — regla absoluta:**
```
❌ El stock NUNCA se descuenta al agregar al carrito
❌ El stock NUNCA se descuenta al crear una reserva
✅ El stock se descuenta ÚNICAMENTE cuando el pedido pasa a estado "pagado"
```
Implementar siempre con `db.transaction()` para evitar race conditions.

**Estados de pedido:**
```ts
type OrderStatus = 'reservado' | 'pagado' | 'cancelado';
// reservado → pagado: descuenta stock (con transacción)
// reservado → cancelado: NO toca stock
// pagado → no puede cambiar de estado
```

**Métodos de pago:**
```ts
type PaymentMethod = 'mercadopago' | 'whatsapp_efectivo';
```

**WhatsApp:**
El número de teléfono y el template del mensaje van exclusivamente en `src/constants/whatsapp.constants.ts`.
El mensaje formateado sigue este patrón:
```
Nuevo pedido numero : {id}
• {nombre} [{rareza}] x {cantidad} - ${precio_ars}
• Total: ${total}
```

**Variables de entorno privadas del proyecto:**
```
DATABASE_URL                    ← Drizzle/Supabase (solo servidor)
SUPABASE_SERVICE_ROLE_KEY       ← solo servidor, nunca NEXT_PUBLIC_
MP_ACCESS_TOKEN                 ← Mercado Pago SDK (solo servidor)
MP_WEBHOOK_SECRET               ← verificación de webhooks (solo servidor)
NEXT_PUBLIC_SUPABASE_URL        ← público, cliente Supabase browser
NEXT_PUBLIC_SUPABASE_ANON_KEY   ← público, cliente Supabase browser
NEXT_PUBLIC_WHATSAPP_NUMBER     ← público, se usa en el cliente para generar la URL
NEXT_PUBLIC_URL                 ← URL base del deploy (Vercel)
```

---

## 🗂️ Stack & Entorno

- **Framework**: Next.js (App Router) con TypeScript estricto
- **Package manager**: `pnpm` — nunca uses `npm` ni `yarn`
- **OS del desarrollador**: Windows 11, terminal PowerShell
- **Rutas de proyecto**: bajo `D:\programacion\`

### Comandos esenciales

```bash
pnpm install          # instalar dependencias
pnpm dev              # servidor de desarrollo
pnpm build            # build de producción
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
pnpm test             # Vitest (modo interactivo / watch)
pnpm test --run       # Vitest (una sola pasada, para CI)
```

> Antes de dar una tarea por terminada, asegurate de que `pnpm lint` y `pnpm typecheck` pasen sin errores.
> `pnpm lint` detecta imports sin usar si el proyecto tiene la regla `no-unused-vars` o `@typescript-eslint/no-unused-vars` activa — que debe estar activa. Si no está, agregala al `eslint.config`.

---

## 📐 Referencia de Diseño

Aplicar la maquetación definida en `DESIGN.md` a los componentes existentes.  

Antes de escribir cualquier estilo, leer `DESIGN.md` completo y aplicar los tokens, tipografía, espaciado y componentes tal como están definidos ahí.

la tipografia tiene que estar en un archivo aparte 

```ts
// ✅ BIEN: en su archivo correspondiente
// src/lib/fonts.ts
// ejemplo
import { Poppins, Open_Sans } from "next/font/google"

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-poppins",
})

export const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-open-sans",
})
```

---

## 📁 Estructura de carpetas

```
src/
├── app/
│   ├── (shop)/                          ← Layout público con Navbar y Footer
│   │   ├── layout.tsx
│   │   ├── page.tsx                     ← Home: carrusel + top vendidas
│   │   ├── [product_line_name]/
│   │   │   ├── page.tsx                 ← Catálogo dinámico (lee searchParams)
│   │   │   └── [slug]/
│   │   │       └── page.tsx             ← Detalle de un solo producto
│   │   └── cart/
│   │       └── page.tsx
│   ├── (auth)/                          ← Layout sin Navbar
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (admin)/                         ← Grupo de layout — NO genera segmento de URL
│   │   ├── layout.tsx                   ← Verifica sesión admin en servidor (Server Component)
│   │   └── admin/                       ← Esta carpeta SÍ genera el prefijo /admin en la URL
│   │       ├── dashboard/
│   │       │   └── page.tsx             ← Ruta: /admin/dashboard — gráficos y estadísticas
│   │       ├── products/
│   │       │   └── page.tsx             ← Ruta: /admin/products — CRUD de productos
│   │       └── orders/
│   │           └── page.tsx             ← Ruta: /admin/orders — pedidos + cambio de estado
│   ├── api/
│   │   └── mercadopago/
│   │       └── webhook/
│   │           └── route.ts             ← Webhook de Mercado Pago
│   ├── layout.tsx
│   └── globals.css
├── actions/
│   ├── auth.actions.ts
│   ├── product.actions.ts
│   └── order.actions.ts
├── components/
│   ├── ui/                              ← shadcn + componentes presentacionales puros
│   └── features/
│       ├── home/
│       │   ├── HeroCarousel.tsx
│       │   └── TopProductsGrid.tsx
│       ├── catalog/
│       │   ├── ProductGrid.tsx
│       │   ├── ProductCard.tsx
│       │   └── CatalogFilters.tsx      ← Actualiza la URL, no useState
│       ├── cart/
│       │   ├── CartDrawer.tsx
│       │   ├── CartItem.tsx
│       │   └── CheckoutButtons.tsx
│       ├── auth/
│       │   ├── LoginForm.tsx
│       │   └── RegisterForm.tsx
│       └── admin/
│           ├── OrdersTable.tsx
│           ├── ProductsTable.tsx
│           └── SalesChart.tsx
├── constants/
│   ├── routes.constants.ts
│   ├── ui.constants.ts
│   ├── whatsapp.constants.ts           ← número de WA, template del mensaje
│   └── database.constants.ts
├── db/
│   ├── index.ts
│   └── schema.ts
├── hooks/
│   └── useCartStore.ts                 ← Zustand + persist
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── mercadopago.ts                  ← Inicialización del SDK de MP
│   └── validations/
│       ├── auth.schema.ts
│       ├── product.schema.ts
│       └── order.schema.ts
├── services/
│   ├── product.service.ts
│   └── order.service.ts
└── types/
    ├── product.types.ts
    └── order.types.ts
proxy.ts
drizzle.config.ts
```

Seguí esta estructura siempre. No crees archivos fuera de `src/` salvo config de raíz.

---

## 📦 Convención de Constantes — Regla Crítica

Las constantes son **ciudadanas de primera clase** en este proyecto. Nunca se definen inline ni dentro de componentes, hooks o servicios.

### Regla absoluta

```ts
// ❌ MAL: constante dentro de un componente
export function UserCard() {
  const MAX_NAME_LENGTH = 50;     // ← NUNCA acá
  const DB_COLLECTION = 'users';  // ← NUNCA acá
}

// ❌ MAL: constante en un archivo que no es constants/
// services/userService.ts
const COLLECTION_NAME = 'users'; // ← NUNCA acá

// ✅ BIEN: en su archivo de constantes correspondiente
// constants/database.constants.ts
export const DB_COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
} as const;
```

### Criterio para elegir el archivo correcto

| Tipo de constante | Archivo |
|---|---|
| Nombres de colecciones, queries, índices de DB | `constants/database.constants.ts` |
| URLs de endpoints, headers HTTP, códigos de estado | `constants/api.constants.ts` |
| Textos de UI, labels, placeholders, mensajes de error | `constants/ui.constants.ts` |
| Rutas de navegación (`/dashboard`, `/login`) | `constants/routes.constants.ts` |
| Constantes de un dominio específico (ej: pagos, roles) | `constants/[dominio].constants.ts` |

### Interfaces de las constantes

Cada archivo de constantes puede tener su archivo de tipos correspondiente en `src/types/`:

```ts
// types/database.types.ts
export interface DbCollectionConfig {
  name: string;
  indexes: string[];
}

// constants/database.constants.ts
import type { DbCollectionConfig } from '@/types/database.types';

export const USERS_COLLECTION: DbCollectionConfig = {
  name: 'users',
  indexes: ['email', 'createdAt'],
} as const;
```

### Nombrado de constantes

- Siempre en `UPPER_SNAKE_CASE`.
- Agrupadas en objetos cuando son del mismo dominio — no exportes decenas de constantes sueltas.
- Usá `as const` para garantizar tipos literales e inmutabilidad.

```ts
// ✅ BIEN: agrupadas, tipadas y con as const
export const API_ENDPOINTS = {
  USERS: {
    GET_ALL:   '/api/users',
    GET_BY_ID: (id: string) => `/api/users/${id}`,
    CREATE:    '/api/users',
  },
  PRODUCTS: {
    GET_ALL: '/api/products',
  },
} as const;
```

---

## 🧱 Principios SOLID — Aplicación Práctica

Estos principios son **obligatorios**. Aplicarlos no es opcional.

### S — Single Responsibility Principle
Cada módulo, componente, hook o función tiene **una sola razón para cambiar**.

```ts
// ❌ MAL: un componente que fetcha, valida y renderiza
export function UserCard() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetch('/api/user').then(...) }, []);
  if (!user?.email.includes('@')) return <p>Email inválido</p>;
  return <div>{user.name}</div>;
}

// ✅ BIEN: responsabilidades separadas
// services/userService.ts    → fetching
// hooks/useUser.ts           → estado y efecto
// utils/validators.ts        → validación
// components/ui/UserCard.tsx → solo renderizado
```

### O — Open/Closed Principle
El código está **abierto para extensión, cerrado para modificación**.

```ts
// ❌ MAL: cada nuevo tipo requiere modificar la función
function getButtonStyle(type: string) {
  if (type === 'primary') return 'bg-blue-500';
  if (type === 'danger')  return 'bg-red-500';
}

// ✅ BIEN: mapa de variantes extensible sin tocar el componente
const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-blue-500 text-white',
  danger:  'bg-red-500 text-white',
  ghost:   'bg-transparent border border-current',
};
```

### L — Liskov Substitution Principle
Los componentes hijos deben poder usarse en lugar de su abstracción sin romper nada.

```ts
// ✅ BIEN: IconButton extiende Button sin romper su contrato
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}
interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
}
```

### I — Interface Segregation Principle
No obligues a un módulo a depender de lo que no usa. Preferí interfaces pequeñas y específicas.

```ts
// ❌ MAL: interfaz gigante
interface UserRepository {
  getById(id: string): Promise<User>;
  getAll(): Promise<User[]>;
  create(data: CreateUserDto): Promise<User>;
  exportToCsv(): Promise<string>; // ← el repo no debería saber de CSV
}

// ✅ BIEN: interfaces segregadas
interface UserReader   { getById(id: string): Promise<User>; getAll(): Promise<User[]>; }
interface UserWriter   { create(data: CreateUserDto): Promise<User>; }
interface UserExporter { exportToCsv(): Promise<string>; }
```

### D — Dependency Inversion Principle
Los módulos de alto nivel dependen de abstracciones, no de implementaciones concretas.

```ts
// ❌ MAL: acoplado a Mongo
import { MongoUserRepository } from '@/services/MongoUserRepository';
export function useUsers() {
  const repo = new MongoUserRepository(); // ← acoplamiento duro
}

// ✅ BIEN: depende de la abstracción
interface IUserRepository { getAll(): Promise<User[]>; }
export function useUsers(repo: IUserRepository) { ... }
```

---

## ♻️ Reutilización de Código

### Antes de escribir algo nuevo
1. Buscá en `src/components/ui/` si ya existe un componente similar.
2. Buscá en `src/hooks/` si ya hay un hook para ese patrón.
3. Buscá en `src/utils/` si la función pura ya existe.
4. Buscá en `src/constants/` si la constante ya está definida.
5. Si no existe: **crealo genérico desde el principio**, no acoplado al caso específico.

### Tabla de extracción

| Si repetís algo… | Extraelo a… |
|---|---|
| Lógica de estado + efectos | `src/hooks/use[Nombre].ts` |
| Llamadas a API | `src/services/[dominio]Service.ts` |
| Función pura sin side effects | `src/utils/[nombre].ts` |
| Bloque JSX reutilizable | `src/components/ui/[Nombre].tsx` |
| Tipos compartidos | `src/types/[dominio].types.ts` |
| Valores fijos o strings literales | `src/constants/[dominio].constants.ts` |

### Composición sobre herencia

```tsx
// ✅ Composición
<Card>
  <Card.Header>Título</Card.Header>
  <Card.Body>Contenido</Card.Body>
  <Card.Footer>Acciones</Card.Footer>
</Card>
```

---

## 🏗️ Arquitectura de Componentes — Patrón Container-Presentational

Este patrón es **obligatorio** para cualquier sección que maneje datos, listas o formularios complejos. Es la principal defensa contra componentes que crecen sin control y colapsan la memoria en el compilador.

### ¿Por qué es crítico?

Un componente de más de ~200 líneas es una señal de alarma. Un componente de +500 líneas es un problema activo. Un componente de +1000 líneas **va a causar errores de memoria en el build** (`exit code 134`) porque Next.js intenta compilar todo el árbol de dependencias de ese archivo de una sola vez.

La solución no es aumentar la RAM de Node — es dividir el componente.

---

### Los tres niveles obligatorios

#### Nivel 1 — Contenedor (Smart Component)
**Responsabilidad única:** gestionar estado, efectos y lógica de negocio.
- Tiene `useState` y `useEffect` (o el custom hook correspondiente).
- **No contiene JSX estructural pesado** — solo orquesta y pasa datos hacia abajo.
- Vive en `components/features/` o directamente en `app/`.

```tsx
// components/features/registro/RegistroContainer.tsx
'use client';

import { useRegistroForm } from '@/hooks/useRegistroForm';
import { RegistroSecciones } from './RegistroSecciones';

export function RegistroContainer() {
  const { formData, errors, handleChange, handleSubmit, isLoading } = useRegistroForm();

  return (
    <RegistroSecciones
      formData={formData}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}
```

#### Nivel 2 — Listado / Ensamblado (Intermediary Component)
**Responsabilidad única:** recibir datos y componer los componentes hijos.
- Si hay un array: hace el `.map()` y devuelve instancias del componente individual.
- Si hay secciones: ensambla las secciones visuales en orden.
- No tiene lógica de negocio ni llamadas a APIs.

```tsx
// components/features/registro/RegistroSecciones.tsx
import { SeccionDatosPersonales } from './SeccionDatosPersonales';
import { SeccionDireccion } from './SeccionDireccion';
import { SeccionCredenciales } from './SeccionCredenciales';
import type { RegistroSeccionesProps } from '@/types/registro.types';

export function RegistroSecciones({ formData, errors, onChange, onSubmit, isLoading }: RegistroSeccionesProps) {
  return (
    <form onSubmit={onSubmit}>
      <SeccionDatosPersonales data={formData.personal} errors={errors.personal} onChange={onChange} />
      <SeccionDireccion       data={formData.direccion} errors={errors.direccion} onChange={onChange} />
      <SeccionCredenciales    data={formData.credenciales} errors={errors.credenciales} onChange={onChange} />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Registrando...' : 'Crear cuenta'}
      </button>
    </form>
  );
}
```

#### Nivel 3 — Detalle / Presentacional (Dumb Component)
**Responsabilidad única:** renderizar JSX y estilos. Nada más.
- Solo recibe props y devuelve JSX.
- Cero `useState`, cero `useEffect`, cero llamadas a APIs.
- Son los componentes más reutilizables del proyecto.
- Viven en `components/ui/` si son genéricos, o en `components/features/[dominio]/` si son específicos.

```tsx
// components/features/registro/SeccionDatosPersonales.tsx
import { FormField } from '@/components/ui/FormField';
import type { DatosPersonalesProps } from '@/types/registro.types';

export function SeccionDatosPersonales({ data, errors, onChange }: DatosPersonalesProps) {
  return (
    <fieldset>
      <legend>Datos personales</legend>
      <FormField label="Nombre"    name="nombre"    value={data.nombre}    error={errors?.nombre}    onChange={onChange} />
      <FormField label="Apellido"  name="apellido"  value={data.apellido}  error={errors?.apellido}  onChange={onChange} />
      <FormField label="Email"     name="email"     value={data.email}     error={errors?.email}     onChange={onChange} type="email" />
    </fieldset>
  );
}
```

---

### Señales de que hay que dividir un componente

Dividí cuando se cumple alguna de estas condiciones — **no hay límite de líneas**, un componente puede ser tan largo como el problema lo requiera:

| Señal | Acción |
|---|---|
| El mismo bloque de JSX aparece más de una vez (ej: un campo de formulario) | Extraé a `components/ui/` |
| Hay un `.map()` cuyo item tiene JSX propio | Extraé el item a un componente presentacional |
| Hay dos o más secciones visuales claramente diferenciadas | Cada sección puede ser su propio componente |
| Hay lógica de negocio Y renderizado en el mismo archivo | Separar en Container + Presentacional |
| La lógica de estado se puede reutilizar en otro componente | Extraé a un custom hook |

---

### Regla de los campos de formulario

Los campos de input **nunca se repiten**. Si un formulario tiene 10 campos, no hay 10 bloques JSX casi idénticos — hay 1 componente `FormField` y 10 instancias.

```tsx
// ❌ MAL: 10 bloques casi idénticos en el mismo archivo
<div>
  <label htmlFor="nombre">Nombre</label>
  <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} />
  {errors.nombre && <span>{errors.nombre}</span>}
</div>
<div>
  <label htmlFor="apellido">Apellido</label>
  <input id="apellido" name="apellido" value={form.apellido} onChange={handleChange} />
  {errors.apellido && <span>{errors.apellido}</span>}
</div>
// ... 8 más iguales

// ✅ BIEN: un componente reutilizable
// components/ui/FormField.tsx
export function FormField({ label, name, value, error, onChange, type = 'text' }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} aria-describedby={error ? `${name}-error` : undefined} />
      {error && <span id={`${name}-error`} role="alert">{error}</span>}
    </div>
  );
}
```

---

### Estructura de carpetas para features complejas

Cuando una feature tiene múltiples niveles (como un formulario de registro), usá una subcarpeta:

```
components/features/
└── registro/
    ├── RegistroContainer.tsx      # Nivel 1: Smart, maneja estado
    ├── RegistroSecciones.tsx      # Nivel 2: Ensambla secciones
    ├── SeccionDatosPersonales.tsx # Nivel 3: Presentacional
    ├── SeccionDireccion.tsx       # Nivel 3: Presentacional
    └── SeccionCredenciales.tsx    # Nivel 3: Presentacional
```

---

### Prevención de errores de memoria en el compilador

Estos patrones causan **out-of-memory en el build** (`exit code 134`). Evitalos activamente:

- **Barrel files pesados**: No importes `import { MiComponente } from '@/components'` si ese `index.ts` reexporta 50 cosas. Importá directo: `import { MiComponente } from '@/components/ui/MiComponente'`.
- **Librerías pesadas en Client Components**: `bcryptjs`, `nodemailer`, `sharp` y similares nunca van en `'use client'`. Usálos solo en Server Actions o Route Handlers.
- **Componentes monolíticos**: Un componente de +500 líneas obliga al compilador a mantener todo su árbol en memoria. Dividir es la solución, no aumentar `NODE_OPTIONS`.
- **Tailwind content demasiado amplio**: El `content` en `tailwind.config.ts` debe apuntar solo a `./src/**/*.{ts,tsx}`, nunca a rutas amplias del sistema.

---

## ⚡ Next.js Moderno — App Router, Server Actions y Patrones Actuales

Este proyecto usa las APIs modernas de Next.js. No uses patrones del Pages Router ni formas legacy.

### Server Components vs Client Components

El default es **Server Component**. Solo agregás `'use client'` cuando el componente necesita interactividad real.

```
✅ Server Component (default, sin directiva):
  - Fetch de datos
  - Acceso a DB, filesystem, variables de entorno
  - Renderizado estático o dinámico

✅ Client Component ('use client'):
  - useState, useEffect, useReducer
  - Event handlers (onClick, onChange, onSubmit)
  - APIs del browser (localStorage, window, etc.)
  - Librerías que solo corren en el cliente
```

Empujá `'use client'` lo más abajo posible en el árbol — que los componentes hoja sean los que lo usen, no los padres.

---

### Server Actions

Toda mutación de datos (crear, actualizar, eliminar, login, registro) va en un **Server Action**. Nunca en un Client Component directamente.

```
src/
└── actions/
    ├── auth.actions.ts       # login, registro, logout
    ├── user.actions.ts       # crear, actualizar, eliminar usuario
    └── [dominio].actions.ts  # una por dominio
```

#### Estructura de un Server Action

```ts
// actions/auth.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { RegisterFormData } from '@/types/auth.types';
import { ROUTES } from '@/constants/routes.constants';

export async function registerUser(formData: RegisterFormData) {
  // 1. Validar con Zod u otra librería
  // 2. Lógica de negocio (hashear password, guardar en DB, etc.)
  // 3. Revalidar o redirigir según resultado
  revalidatePath(ROUTES.DASHBOARD);
  redirect(ROUTES.LOGIN);
}
```

#### Cómo invocar un Server Action desde un Client Component

```tsx
// ✅ Forma moderna — useActionState (Next.js 14+)
'use client';

import { useActionState } from 'react';
import { registerUser } from '@/actions/auth.actions';

export function RegistroForm() {
  const [state, action, isPending] = useActionState(registerUser, null);

  return (
    <form action={action}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Registrando...' : 'Crear cuenta'}
      </button>
      {state?.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
```

#### Server Action directa en un Server Component (sin JS en el cliente)

```tsx
// ✅ El form llama al action directamente — sin 'use client'
import { registerUser } from '@/actions/auth.actions';

export default function RegistroPage() {
  return (
    <form action={registerUser}>
      <input name="email" type="email" />
      <button type="submit">Registrarse</button>
    </form>
  );
}
```

---

### Fetch de datos — forma moderna

```tsx
// ✅ En un Server Component — fetch directo, sin useEffect
// app/usuarios/page.tsx
import { getUsersService } from '@/services/userService';

export default async function UsuariosPage() {
  const users = await getUsersService(); // se ejecuta en el servidor

  return <UsuariosList users={users} />;
}
```

Nunca uses `useEffect` + `fetch` para obtener datos iniciales de una página. Eso es patrón legacy del Pages Router. En App Router los datos se obtienen en Server Components o con librerías como SWR/React Query para datos en tiempo real.

---

### Caché y revalidación

```ts
// Revalidar una ruta después de una mutación
revalidatePath('/usuarios');

// Revalidar por tag (más granular)
revalidateTag('usuarios');

// Fetch con configuración de caché
const data = await fetch('/api/...', { next: { revalidate: 60 } }); // revalida cada 60s
const data = await fetch('/api/...', { cache: 'no-store' });         // sin caché, siempre fresco
```

---

### Manejo de estados de carga y error

Usá los archivos especiales del App Router en lugar de lógica manual:

```
app/
├── usuarios/
│   ├── page.tsx         # contenido principal
│   ├── loading.tsx      # skeleton/spinner automático con Suspense
│   └── error.tsx        # boundary de error automático
```

```tsx
// app/usuarios/loading.tsx
export default function Loading() {
  return <SkeletonUsuarios />;
}

// app/usuarios/error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Ocurrió un error: {error.message}</p>
      <button onClick={reset}>Reintentar</button>
    </div>
  );
}
```

---

### Metadata y SEO

```tsx
// ✅ Estática
export const metadata = {
  title: 'Registro | Mi App',
  description: 'Creá tu cuenta',
};

// ✅ Dinámica
export async function generateMetadata({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id);
  return { title: `${user.name} | Mi App` };
}
```

---

### proxy.ts — reemplaza a middleware.ts

A partir de Next.js 16, `middleware.ts` está **deprecado**. El archivo correcto es `proxy.ts` con la función exportada como `proxy`.

```
# Ubicación — raíz del proyecto, al mismo nivel que package.json
proxy.ts         ✅  (raíz, NO dentro de src/)
src/             ← todo el código de la app va acá
drizzle.config.ts
AGENTS.md
```

```ts
// ✅ proxy.ts — Next.js 16 — raíz del proyecto
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // solo lógica de red: rewrites, redirects, headers
  // NO: queries a DB, autenticación compleja, lógica de negocio
  const token = request.cookies.get('sb-access-token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

**Qué va en `proxy.ts` y qué no:**

| ✅ Correcto en proxy.ts | ❌ No va en proxy.ts |
|---|---|
| Redirects basados en la URL | Queries a base de datos |
| Rewrites de rutas | Autenticación compleja con sesión |
| Modificar headers de request/response | Lógica de negocio |
| Chequeos optimistas de permisos (cookie existe / no existe) | Hashing, encriptado |
| A/B testing por URL | Llamadas a APIs externas pesadas |

La autenticación real (verificar token, validar sesión) va en **Server Actions** o **Route Handlers**, no en `proxy.ts`.

---

### Resumen de qué va dónde

| Tarea | Dónde |
|---|---|
| Interceptar requests, redirects, rewrites | `src/proxy.ts` con función `proxy()` |
| Obtener datos para una página | Server Component (`async/await` directo) |
| Crear / actualizar / eliminar datos | Server Action en `src/actions/` |
| Lógica de estado local e interactividad | Client Component + custom hook |
| Validación de formularios del servidor | Server Action con Zod |
| Variables de entorno privadas | Solo en Server Components / Server Actions |
| Variables de entorno públicas | `NEXT_PUBLIC_` prefix, disponibles en cliente |

---

## 🔷 Convenciones TypeScript

- `strict: true` en `tsconfig.json` — no lo desactivés.
- **Prohibido** usar `any`. Usá `unknown` con narrowing si es necesario.
- Preferí `interface` para objetos/componentes, `type` para uniones y utilidades.
- Todos los props de componentes tienen su propia interface con sufijo `Props`.
- Exportá los tipos reutilizables desde `src/types/`.
- Usá `as const` en todos los objetos de constantes.

```ts
interface UserCardProps { ... }
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };
```

---

## 🧩 Convenciones de Componentes

- Un componente por archivo, mismo nombre en PascalCase.
- Componentes en `src/components/ui/` son **puros y sin lógica de negocio**.
- Los Server Components son el default — usá `'use client'` solo cuando sea estrictamente necesario.
- Custom hooks empiezan con `use` y viven en `src/hooks/`.
- Textos hardcodeados (labels, placeholders, mensajes) van en `constants/ui.constants.ts`, no inline.

```tsx
// ✅ Estructura estándar
import type { ButtonProps } from '@/types/ui.types';
import { UI_LABELS } from '@/constants/ui.constants';

export function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants[variant]} {...props}>
      {children}
    </button>
  );
}
```

---

## 🎨 Estilo y Accesibilidad

- Implementá **mobile-first**: estilos base para mobile, overrides para desktop.
- Usá HTML semántico (`<nav>`, `<main>`, `<section>`, `<article>`, `<button>`).
- Toda imagen necesita `alt` descriptivo. Imágenes decorativas: `alt=""`.
- Los modales necesitan: foco al abrirse, `Escape` para cerrar, foco de retorno al trigger, `aria-hidden` en el fondo.
- Los formularios necesitan `<label>` por campo, errores con `aria-describedby`.
- Antes de crear cualquier componente visual, analizá las imágenes de `public/preview/desktop/` y `public/preview/mobile/`.

---

## 🤝 Estilo de Colaboración

- Antes de implementar, presentá opciones con sus trade-offs y dejá que el desarrollador elija.
- Cuando revisés código: señalá lo que está bien antes de sugerir mejoras.
- Si algo tiene múltiples enfoques válidos, no elijas por el desarrollador.
- Preguntá el razonamiento antes de sugerir cambios arquitecturales.
- Apuntá a recursos autoritativos (MDN, web.dev) cuando un concepto necesita más profundidad.

---

## 🧪 Testing

- Tests con **Vitest** + **React Testing Library**.
- Los archivos de test van junto al módulo: `Button.test.tsx` al lado de `Button.tsx`.
- Testeá **comportamiento**, no implementación interna.
- Cubrí: estado inicial, interacciones principales y casos de error.

```ts
// vitest.config.ts — ya configurado en el proyecto
// pnpm test         → modo interactivo
// pnpm test --run   → una pasada (para CI/CD)

describe('Button', () => {
  it('llama a onClick cuando se hace clic', () => { ... });
  it('no llama a onClick cuando está disabled', () => { ... });
  it('aplica la variante visual correcta', () => { ... });
});
```

---

## 🚫 Prohibiciones Explícitas

- ❌ No uses `npm` ni `yarn`. Solo `pnpm`.
- ❌ No uses `any` en TypeScript.
- ❌ No definas constantes dentro de componentes, hooks o servicios.
- ❌ No definas constantes fuera de `src/constants/`.
- ❌ No pongas lógica de negocio en componentes de UI.
- ❌ No hagas fetch directamente en componentes cliente — usá un service o un hook.
- ❌ No dupliques código existente en `utils/`, `hooks/`, `components/ui/` o `constants/`.
- ❌ No uses `'use client'` innecesariamente.
- ❌ No ignores los estilos de referencia de `DESING.md`, sino tiene el modo dark los creas en base a ese archivo
- ❌ No uses `// eslint-disable` sin comentario que justifique por qué.
- ❌ No dejes imports sin usar — antes de terminar cualquier tarea, revisá que cada import del archivo esté siendo usado en el código. Si no se usa, eliminalo. Esto incluye iconos, componentes, tipos, hooks y utilidades.
- ❌ No pongas mutaciones de datos en Client Components — usá Server Actions en `src/actions/`.
- ❌ No uses `'use client'` en un componente padre cuando solo el hijo lo necesita — empujalo hacia abajo.
- ❌ No accedas a variables de entorno privadas en Client Components — solo en Server Components o Server Actions.
- ❌ No uses patrones del Pages Router (`getServerSideProps`, `getStaticProps`) — este proyecto usa App Router.
- ❌ No uses `middleware.ts` — está deprecado en Next.js 16. Usá `proxy.ts` con la función exportada como `proxy`.
- ❌ No pongas lógica de negocio, queries a DB ni autenticación compleja en `proxy.ts` — solo redirects, rewrites y modificación de headers.
- ❌ No repitas bloques JSX similares (campos de formulario, cards, items) — extraé a un componente en `ui/`.
- ❌ No importes desde barrel files (`index.ts`) que reexportan muchas cosas — importá directo al archivo fuente.
- ❌ No uses librerías de servidor (`bcryptjs`, `nodemailer`, `sharp`) en componentes `'use client'` — usá Server Actions o Route Handlers.

---

## ✅ Checklist antes de cada commit

- [ ] el diseño implementado tiene que respetar esa estética del `DESING.md`
- [ ] No hay bloques JSX repetidos — extraídos a componentes `ui/` reutilizables
- [ ] Las importaciones van directo al archivo fuente, no a barrel files
- [ ] Todos los archivos modificados o creados no tienen imports sin usar (iconos, componentes, tipos, hooks)
- [ ] El fetch de datos iniciales está en Server Components, no en `useEffect`
- [ ] Todas las constantes nuevas están en `src/constants/[dominio].constants.ts`
- [ ] Todos los tipos nuevos están en `src/types/[dominio].types.ts`
- [ ] `pnpm typecheck` pasa sin errores
- [ ] `pnpm lint` pasa sin errores ni warnings ignorados
- [ ] `pnpm test --run` pasa en verde (Vitest)
- [ ] No hay `any`, no hay constantes inline, no hay lógica duplicada
- [ ] El diseño respeta mobile-first y es accesible por teclado