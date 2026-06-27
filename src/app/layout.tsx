import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'TCG Store',
    template: '%s | TCG Store',
  },
  description: 'Trading Card Games e-commerce — Yu-Gi-Oh!, Pokémon, MTG',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
