
# Duelist TCG — Challenge Técnico
Universidad Nacional de La Matanza / AranturiApps
<p align="center">
  <img src="public/images/unlam_logo.png" alt="UNLaM" height="80" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="public/images/aranguriapps-logo.svg" alt="AranturiApps" height="80" />
</p>

## De qué trata
E-commerce de cartas Yu-Gi-Oh! TCG pensado para el mercado argentino. Catálogo dinámico con filtros por URL, carrito persistente, pagos con Mercado Pago y reservas por WhatsApp. Panel admin para gestionar productos, órdenes y usuarios. Escalable a otros TCGs (Pokémon, MTG) insertando datos — sin cambiar frontend.

**Demo:** [https://duelist-tcg.vercel.app/](https://duelist-tcg.vercel.app/)

## Usuarios de prueba

| Email | Contraseña |
|---|---|
| `user1@user.com` | `1234567A?` |
| `user2@user.com` | `1234567A?` |
| `admin1@admin.com` | `1234567A?` |
| `admin2@admin.com` | `1234567A?` |

## Stack

| Tecnología | Por qué |
|---|---|
| Next.js 16 App Router | Framework con el que más cómodo me siento. App Router, Server Components y Server Actions se adaptaron bien. |
| Supabase | Lo pedía el challenge. Postgres + Auth en un solo servicio. |
| Drizzle ORM | Me la recomendó la IA, funciona muy bien con Next.js. Es type-safe y cercano a SQL. |
| Tailwind CSS v4 | Viene con create-next-app, lo personalicé con el diseño Apple que definí. |
| shadcn/ui | Componentes base sin atarte a un framework cerrado. |
| Zustand | Para el carrito con persistencia en localStorage. |
| Mercado Pago SDK | Preference API + Wallet Brick. |
| Zod | Validación en Server Actions. |
| Vitest | Testing unitario (tests generados por IA, revisados por mí). |

## Reglas de negocio
- Stock se descuenta solo cuando la orden pasa a "pagado"
- Catálogo manejado por URL: `?stock=true&category=X&page=2`
- Estados: `reservado → pagado` (descuenta stock) | `reservado → cancelado` | `pagado` no cambia
- Medios de pago: Mercado Pago y WhatsApp/efectivo

## Arquitectura de carpetas

```
src/
├── app/
│   ├── (shop)/              → layout público (Navbar + Footer)
│   │   ├── page.tsx         → Home: carrusel + top vendidos
│   │   ├── [product_line_name]/page.tsx → catálogo dinámico (server-side)
│   │   └── cart/page.tsx
│   ├── (auth)/              → login / registro
│   ├── (admin)/admin/       → dashboard y gestión de pedidos (protegido)
│   └── api/mercadopago/webhook/route.ts
├── actions/                 → Server Actions (auth, product, order)
├── components/ui/           → shadcn + presentacionales puros
├── components/features/     → componentes con estado/lógica por dominio
├── constants/               → strings y config, sin hardcodear
├── db/schema.ts             → definición Drizzle
├── hooks/useCartStore.ts    → Zustand
├── lib/supabase/, validations/
└── services/                → capa de acceso a datos (product/order)

proxy.ts                     → reemplazo de middleware.ts (protección de rutas)
```

## AI Orchestration
- **OpenCode** como agente principal, con skills de **Gentle AI** para contexto específico
- **MCP Context7** para consultar documentación actualizada
- **Engram** para memoria persistente entre sesiones
- **Claude y Gemini** para planificar y pensar diseño antes de codear
- Skills instalados: next-best-practices, drizzle, supabase, zod, vitest, tailwind-v4-shadcn, mercadolibre, seo, otros
- Muchas decisiones las tomó la IA con mi supervisión (Drizzle, tests, CI de GitHub que estoy aprendiendo)

## Instalación

```bash
pnpm install
```

Variables de entorno (`.env.local`):

```
DATABASE_URL
SUPABASE_SERVICE_ROLE_KEY
MP_ACCESS_TOKEN
MP_WEBHOOK_SECRET
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_WHATSAPP_NUMBER
NEXT_PUBLIC_URL
```

```bash
pnpm db:push    # Sincronizar schema con Supabase
pnpm dev        # http://localhost:3000
```

## Comandos

`pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm test --run` · `pnpm db:push` · `pnpm db:studio`

---

<p align="center">
  <a href="https://github.com/Micolash89">
    <img style="border-radius: 50%;" src="https://github.com/Micolash89.png" width="115">
    <br>
    <sub>Javier Espindola</sub>
  </a>
  <br>
  <a href="https://www.linkedin.com/in/javier-espindola/">
    <img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
</p>
