import Link from 'next/link';

const FOOTER_LINKS = [
  { label: 'Yu-Gi-Oh!', href: '/yugioh' },
  { label: 'Pokémon', href: '/pokemon' },
  { label: 'MTG', href: '/mtg' },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-silver-mist bg-snow">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-5 py-8 md:flex-row md:justify-between">
        <p className="text-body-sm text-graphite">
          &copy; {new Date().getFullYear()} TCG Store. Todos los derechos
          reservados.
        </p>
        <nav className="flex gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body-sm text-graphite transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
