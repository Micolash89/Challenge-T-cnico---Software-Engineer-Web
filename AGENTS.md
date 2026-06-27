# AGENTS.md

> Read this file completely before writing or modifying any code.
> Skills installed (drizzle, supabase, next-best-practices, react-best-practices,
> composition-patterns, shadcn, typescript-advanced-types, nodejs-backend-patterns,
> tailwind-v4-shadcn, accessibility, seo, mercado-libre, zod) cover framework patterns.
> This file covers only project-specific rules.

---

## Project Domain — TCG E-Commerce

Trading Card Games e-commerce, initially Yu-Gi-Oh!.
Scalable to any game (Pokémon, MTG) by inserting rows in the DB — no frontend code changes.

### Critical Business Rules

**Dynamic catalog via URL — never useState for filters:**
```
/yugioh                              → all active products
/yugioh?stock=true                   → in-stock only
/yugioh?category=Alliance+Insight    → filter by category
/yugioh?rarity=Secret+Rare           → filter by rarity
/yugioh?page=2                       → pagination
/yugioh?stock=true&category=X&page=2 → combined filters
```

**Stock management — absolute rule:**
```
❌ Stock is NEVER decremented when adding to cart
❌ Stock is NEVER decremented when creating a reservation
✅ Stock is decremented ONLY when order status changes to "pagado"
```
Always use `db.transaction()` to prevent race conditions.

**Order status:**
```ts
type OrderStatus = 'reservado' | 'pagado' | 'cancelado';
// reservado → pagado:    decrements stock (with transaction)
// reservado → cancelado: does NOT touch stock
// pagado    → cannot change
```

**Payment methods:**
```ts
type PaymentMethod = 'mercadopago' | 'whatsapp_efectivo';
```

**WhatsApp message template** — lives only in `src/constants/whatsapp.constants.ts`:
```
Nuevo pedido numero : {id}
• {name} [{rarity}] x {qty} - ${price_ars}
• Total: ${total}
```

---

## Environment Variables

```
# Server only — never NEXT_PUBLIC_
DATABASE_URL
SUPABASE_SERVICE_ROLE_KEY
MP_ACCESS_TOKEN
MP_WEBHOOK_SECRET

# Public — browser client
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_WHATSAPP_NUMBER
NEXT_PUBLIC_URL
```

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router + TypeScript strict |
| Package manager | `pnpm` only — never npm or yarn |
| Styles | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (Postgres) |
| ORM | Drizzle ORM |
| Auth | Supabase Auth |
| Cart state | Zustand + persist middleware |
| Forms | React Hook Form + Zod |
| Payments | Mercado Pago SDK |
| Tests | Vitest + React Testing Library |
| CI | GitHub Actions |
| Deploy | Vercel |
| OS / Terminal | Windows 11, PowerShell |

### Key commands
```powershell
pnpm dev
pnpm build
pnpm lint
pnpm typecheck      # tsc --noEmit
pnpm test --run     # Vitest single pass (CI)
pnpm db:push        # Drizzle push schema
pnpm db:studio      # Drizzle Studio
```

---

## Folder Structure

```
src/
├── app/
│   ├── (shop)/                       ← public layout (Navbar + Footer)
│   │   ├── layout.tsx
│   │   ├── page.tsx                  ← Home: carousel + top products
│   │   ├── [product_line_name]/
│   │   │   ├── page.tsx              ← Dynamic catalog (reads searchParams server-side)
│   │   │   └── [slug]/page.tsx       ← Single product detail
│   │   └── cart/page.tsx
│   ├── (auth)/                       ← layout without Navbar
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (admin)/                      ← layout group — does NOT generate URL segment
│   │   ├── layout.tsx                ← verifies admin session (Server Component)
│   │   └── admin/                    ← generates /admin prefix in URL
│   │       ├── dashboard/page.tsx    ← /admin/dashboard
│   │       ├── products/page.tsx     ← /admin/products
│   │       └── orders/page.tsx       ← /admin/orders
│   ├── api/mercadopago/webhook/route.ts
│   ├── layout.tsx
│   └── globals.css
├── actions/
│   ├── auth.actions.ts
│   ├── product.actions.ts
│   └── order.actions.ts
├── components/
│   ├── ui/                           ← shadcn + pure presentational components
│   └── features/
│       ├── home/
│       ├── catalog/
│       ├── cart/
│       ├── auth/
│       └── admin/
├── constants/
│   ├── routes.constants.ts
│   ├── ui.constants.ts
│   ├── whatsapp.constants.ts
│   └── database.constants.ts
├── db/
│   ├── index.ts
│   └── schema.ts
├── hooks/
│   └── useCartStore.ts               ← Zustand + persist
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── fonts.ts                      ← Next.js font config (not inline)
│   ├── mercadopago.ts
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
proxy.ts                              ← root level, NOT inside src/
drizzle.config.ts
DESIGN.md
```

---

## proxy.ts — replaces middleware.ts

`middleware.ts` is deprecated in Next.js 16. Use `proxy.ts` at project root.

```ts
// proxy.ts — project root (same level as package.json)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Only: redirects, rewrites, headers
  // Never: DB queries, complex auth, business logic
  const token = request.cookies.get('sb-access-token');
  if (!token) return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

Real session verification goes in `(admin)/layout.tsx` as a Server Component — not in proxy.ts.

---

## Design

Before writing any styles, read `DESIGN.md` completely.
Apply its tokens, typography, spacing and components exactly as defined.
If dark mode is not defined in DESIGN.md, infer it from the same file's palette.

---

## Hard Rules

```
❌ No npm or yarn — pnpm only
❌ No `any` in TypeScript
❌ No inline constants — all constants in src/constants/*.constants.ts
❌ No business logic in UI components
❌ No data fetching in Client Components with useEffect — use Server Components
❌ No data mutations in Client Components — use Server Actions in src/actions/
❌ No `'use client'` on a parent when only the child needs it — push it down
❌ No private env vars in Client Components
❌ No Pages Router patterns (getServerSideProps, getStaticProps)
❌ No middleware.ts — use proxy.ts
❌ No business logic or DB queries in proxy.ts
❌ No unused imports — check every file before committing
❌ No barrel file imports — import directly from source file
```

---

## Commit Checklist

- [ ] `pnpm typecheck` passes with zero errors
- [ ] `pnpm lint` passes with zero warnings
- [ ] `pnpm test --run` all green
- [ ] No unused imports in any modified file
- [ ] All new constants in `src/constants/`
- [ ] All new types in `src/types/`
- [ ] Initial data fetch in Server Components, not useEffect
- [ ] Design matches DESIGN.md (mobile-first, dark mode if defined)