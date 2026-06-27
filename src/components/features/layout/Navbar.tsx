'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/constants/routes.constants';

const NAV_LINKS = [
  { label: 'Yu-Gi-Oh!', href: '/yugioh' },
  { label: 'Pokémon', href: '/pokemon' },
  { label: 'MTG', href: '/mtg' },
] as const;

export function Navbar() {
  const [itemCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-silver-mist bg-fog/80 backdrop-blur-xl">
      <div className="mx-auto flex h-11 max-w-[1200px] items-center justify-between px-5">
        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="font-heading text-lg font-semibold tracking-tight text-ink"
        >
          TCG Store
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

        {/* Cart */}
        <Link
          href={ROUTES.CART}
          className="relative flex items-center gap-1 text-ink/80 transition-colors hover:text-ink"
        >
          <ShoppingBag className="size-5" />
          {itemCount > 0 && (
            <span className="flex size-4 items-center justify-center rounded-full bg-ink text-[10px] font-medium text-snow">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
