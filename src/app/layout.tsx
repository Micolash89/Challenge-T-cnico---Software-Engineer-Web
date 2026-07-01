import type { Metadata, Viewport } from 'next';
import { SITE } from '@/constants/site.constants';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${SITE.NAME} | Tienda de Cartas Yu-Gi-Oh! TCG`,
    template: `%s | ${SITE.NAME}`,
  },
  description: SITE.DESCRIPTION,

  keywords: [...SITE.KEYWORDS],

  authors: [{ name: SITE.AUTHOR, url: SITE.URL }],
  creator: SITE.AUTHOR,
  publisher: SITE.PUBLISHER,

  metadataBase: new URL(SITE.URL),
  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: SITE.LOCALE,
    url: SITE.URL,
    siteName: SITE.NAME,
    title: `${SITE.NAME} | Tienda de Cartas Yu-Gi-Oh! TCG`,
    description: SITE.OG_DESCRIPTION,
    images: [
      {
        url: SITE.OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE.NAME} - Tienda de cartas Yu-Gi-Oh!`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `${SITE.NAME} | Tienda de Cartas Yu-Gi-Oh! TCG`,
    description: SITE.OG_DESCRIPTION,
    creator: SITE.TWITTER_CREATOR,
    images: [SITE.OG_IMAGE],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [...SITE.ICONS.FAVICON],
    apple: [...SITE.ICONS.APPLE],
  },

  manifest: SITE.MANIFEST,
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: SITE.THEME_COLOR.LIGHT },
    { media: '(prefers-color-scheme: dark)', color: SITE.THEME_COLOR.DARK },
  ],
  width: 'device-width',
  initialScale: 1,
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
