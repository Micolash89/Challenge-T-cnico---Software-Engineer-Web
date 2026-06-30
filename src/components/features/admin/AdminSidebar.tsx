"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Store,
  Plus,
  Users,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_I18N } from "@/constants/admin-i18n.constants";
import { signOutAction } from "@/actions/auth.actions";
import {
  containerVariantsCascade,
  variantsParams,
} from "@/lib/animation-variants";
import Image from "next/image";

const S = ADMIN_I18N.sidebar;

const navigation = [
  { name: S.dashboard, href: "/admin/dashboard", icon: LayoutDashboard },
  { name: S.products, href: "/admin/products", icon: Package },
  { name: S.orders, href: "/admin/orders", icon: ShoppingCart },
  { name: S.users, href: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r bg-card transition-transform duration-200 md:static md:translate-x-0 ",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header with branding */}
        <div className="relative flex h-13 items-center justify-between border-b px-6">
          <h2 className="text-lg font-semibold">La Rata Duelista</h2>
          <Image
            src="/images/rata-duelista-logo-1.jpg"
            alt="Logo"
            width={40}
            height={40}
            className="cursor-pointer rounded-2xl"
            priority
          />
        </div>

        {/* Navigation */}
        <motion.nav
          variants={containerVariantsCascade}
          initial="hidden"
          animate="visible"
          className="flex-1 space-y-1 p-4"
        >
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <motion.div
                key={item.href}
                variants={variantsParams("y", 0.35, index * 0.08, 12)}
                className="flex items-center gap-1"
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {item.name}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        {/* Footer */}
        <div className="border-t p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Store className="size-5 shrink-0" />
            {S.backToStore}
          </Link>

          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="size-5 shrink-0" />
              {S.logout}
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-2 top-2 z-50 flex h-9 w-9 items-center justify-center rounded-md bg-background shadow-md md:hidden"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </>
  );
}
