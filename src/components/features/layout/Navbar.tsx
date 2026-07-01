"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  LogIn,
  LogOut,
  LayoutDashboard,
  Menu,
  User,
} from "lucide-react";
import { useCartStore } from "@/hooks/useCartStore";
import { CartDrawer } from "@/components/features/cart/CartDrawer";
import { ROUTES } from "@/constants/routes.constants";
import { signOutAction } from "@/actions/auth.actions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { variantsNormalUpDown } from "@/lib/animation-variants";

const NAV_LINKS = [{ label: "Yu-Gi-Oh!", href: "/yugioh" }] as const;

interface NavbarProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function Navbar({ isAuthenticated, isAdmin }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <>
      <motion.header
        variants={variantsNormalUpDown}
        initial="hidden"
        animate="visible"
        className="sticky top-0 z-50 w-full border-b border-silver-mist bg-fog/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-11 max-w-[1200px] items-center justify-between px-5">
          {/* Mobile: Hamburger */}
          <div className="flex md:hidden">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="flex w-[280px] flex-col sm:w-[320px]"
              >
                <SheetHeader>
                  <SheetTitle className="text-left font-heading text-lg border-b px-1 py-2">
                    <span>Navegación</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-2 flex flex-col gap-1 ">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg transition-colors hover:bg-accent"
                    >
                      <div className="flex size-11 items-center justify-center rounded-lg ml-1 bg-snow">
                        <Image
                          src="/images/yugioh-back.jpg"
                          alt={link.label}
                          width={15}
                          height={15}
                          className="rounded-sm object-contain w-full h-full"
                        />
                      </div>
                      <span className="text-sm font-medium text-ink">
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>

                {isAdmin && (
                  <div className="mt-1 px-4">
                    <Link
                      href={ROUTES.ADMIN.DASHBOARD}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-5 rounded-lg p-3 pl-0 transition-colors hover:bg-accent"
                    >
                      <LayoutDashboard className="size-5 text-black" />
                      <span className="text-sm font-medium text-ink">
                        Dashboard
                      </span>
                    </Link>
                  </div>
                )}
                {!isAdmin && isAuthenticated && (
                  <div className="mt-1 px-4">
                    <Link
                      href={ROUTES.PROFILE}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-5 rounded-lg p-3 transition-colors hover:bg-accent"
                    >
                      <User className="size-5 text-ink/80" />
                      <span className="text-sm font-medium text-ink">
                        Perfil
                      </span>
                    </Link>
                  </div>
                )}
                <Link
                  href={ROUTES.CART}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-5 rounded-lg p-3 transition-colors hover:bg-accent"
                >
                  <ShoppingBag className="size-5 text-ink/80" />
                  <span className="text-sm font-medium text-ink">
                    Carrito ({itemCount})
                  </span>
                </Link>

                <div className="mt-auto border-t border-silver-mist px-4 pb-4 pt-3">
                  {isAuthenticated ? (
                    <form action={signOutAction}>
                      <button
                        type="submit"
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                      >
                        <LogOut className="size-5 text-ink/80" />
                        <span className="text-sm font-medium text-ink">
                          Cerrar sesión
                        </span>
                      </button>
                    </form>
                  ) : (
                    <Link
                      href={ROUTES.LOGIN}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                    >
                      <LogIn className="size-5 text-ink/80" />
                      <span className="text-sm font-medium text-ink">
                        Ingresar
                      </span>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

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

          {/* Desktop Nav */}
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
                className="hidden md:flex items-center gap-1.5 text-[13px] font-medium text-ink/80 transition-colors hover:text-ink"
              >
                <LayoutDashboard className="size-[18px]" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {!isAdmin && isAuthenticated && (
              <Link
                href={ROUTES.PROFILE}
                title="Ir al perfil"
                className="hidden md:flex items-center gap-1.5 text-[13px] font-medium text-ink/80 transition-colors hover:text-ink"
              >
                <User className="size-[18px]" />
                <span className="hidden sm:inline">Perfil</span>
              </Link>
            )}

            {isAuthenticated ? (
              <form action={signOutAction} className="hidden md:block">
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
                className="hidden md:flex items-center gap-1.5 text-[13px] font-medium text-ink/80 transition-colors hover:text-ink"
              >
                <LogIn className="size-[18px]" />
                <span className="hidden sm:inline">Ingresar</span>
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => setDrawerOpen(true)}
              title="Carrito"
              className="relative flex cursor-pointer items-center gap-1 text-ink/80 transition-colors hover:text-ink"
            >
              <ShoppingBag className="size-6" />
              {itemCount > 0 && (
                <span className="flex size-3 items-center justify-center rounded-full bg-ink text-[10px] font-medium text-snow absolute bottom-0 right-0 bg-red-600">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
