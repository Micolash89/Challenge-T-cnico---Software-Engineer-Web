'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store, Plus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { signOutAction } from '@/actions/auth.actions';

const S = ADMIN_I18N.sidebar;

const navigation = [
  { name: S.dashboard, href: '/admin/dashboard', icon: LayoutDashboard },
  { name: S.products, href: '/admin/products', icon: Package },
  { name: S.orders, href: '/admin/orders', icon: ShoppingCart },
  { name: S.users, href: '/admin/users', icon: Users },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

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
          'fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r bg-card transition-transform duration-200 md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold">Panel Admin</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <div key={item.href} className="flex items-center gap-1">
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.name}
                </Link>
                {item.name === S.products && (
                  <Link
                    href="/admin/products/new"
                    onClick={() => setIsOpen(false)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    aria-label={ADMIN_I18N.buttons.newProduct}
                  >
                    <Plus className="h-4 w-4" />
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Store className="h-4 w-4 shrink-0" />
            {S.backToStore}
          </Link>

          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {S.logout}
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-2 top-2 z-50 flex h-9 w-9 items-center justify-center rounded-md bg-background shadow-md md:hidden"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
    </>
  );
}
