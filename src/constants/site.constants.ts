export const SITE = {
  NAME: 'Duelist-tcg',
  URL: process.env.NEXT_PUBLIC_URL ?? 'https://duelist-tcg.vercel.app',
  DESCRIPTION:
    'Comprá cartas de Yu-Gi-Oh! TCG originales en Argentina. Singles, sobres y mazos con envíos a todo el país y pago con Mercado Pago. Stock actualizado y precios competitivos. - Challengue técnico',
  OG_DESCRIPTION:
    'Comprá cartas de Yu-Gi-Oh! TCG originales en Argentina. Singles, sobres y mazos con envíos a todo el país.',
  LOCALE: 'es_AR',
  AUTHOR: 'Espindola Javier Nicolas',
  PUBLISHER: 'Duelist-tcg',
  OG_IMAGE: '/images/page-screen.jpg',
  KEYWORDS: [
    'Yu-Gi-Oh cartas Argentina',
    'comprar cartas Yugioh',
    'Yu-Gi-Oh TCG tienda',
    'singles Yugioh',
    'sobres Yugioh Argentina',
    'mazos Yugioh',
    'cartas originales Yugioh',
    'TCG store Argentina',
    'Duelist-tcg',
    'Challengue técnico',
  ],
  TWITTER_CREATOR: '@duelist_tcg',
  THEME_COLOR: {
    LIGHT: '#ffffff',
    DARK: '#000000',
  },
  ICONS: {
    FAVICON: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    APPLE: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  MANIFEST: '/site.webmanifest',
} as const;
