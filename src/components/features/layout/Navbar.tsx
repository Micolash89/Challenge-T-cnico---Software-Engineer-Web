"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { useCartStore } from "@/hooks/useCartStore";
import { CartDrawer } from "@/components/features/cart/CartDrawer";
import { ROUTES } from "@/constants/routes.constants";
import { signOutAction } from "@/actions/auth.actions";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Yu-Gi-Oh!", href: "/yugioh" },
  { label: "Pokémon", href: "/pokemon" },
  { label: "MTG", href: "/mtg" },
] as const;

interface NavbarProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function Navbar({ isAuthenticated, isAdmin }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );



  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-silver-mist bg-fog/80 backdrop-blur-xl">
        <div className="mx-auto flex h-11 max-w-[1200px] items-center justify-between px-5">
          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className="font-heading text-lg font-semibold tracking-tight text-ink flex items-center gap-2"
          >
            <Image
              src="/images/rata-duelista-logo-1.jpg"
              alt="Logo"
              width={40}
              height={40}
              className="cursor-pointer rounded-2xl"
              priority
            />
            <span>TCG Store</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-ink/80 transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                href={ROUTES.ADMIN.DASHBOARD}
                title="Ir al dashboard"
                className="flex items-center gap-1.5 text-[13px] font-medium text-ink/80 transition-colors hover:text-ink"
              >
                <LayoutDashboard className="size-[18px]" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {isAuthenticated ? (
              <form action={signOutAction}>
                <button
                  type="submit"
                  title="Cerrar sesión"
                  className="flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-ink/80 transition-colors hover:text-ink"
                >
                  <LogOut className="size-[18px]" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </form>
            ) : (
              <Link
                href={ROUTES.LOGIN}
                title="Iniciar sesión"
                className="flex items-center gap-1.5 text-[13px] font-medium text-ink/80 transition-colors hover:text-ink"
              >
                <LogIn className="size-[18px]" />
                <span className="hidden sm:inline">Ingresar</span>
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => setDrawerOpen(true)}
              title="Carrito"
              className="relative flex cursor-pointer items-center gap-1 text-ink/80 transition-colors hover:text-ink "
            >
              <ShoppingBag className="size-6" />
              {itemCount > 0 && (
                <span className="flex size-3 items-center justify-center rounded-full bg-ink text-[10px] font-medium text-snow absolute bottom-0 right-0  bg-red-600">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
