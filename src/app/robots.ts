import type { MetadataRoute } from 'next';
import { SITE } from '@/constants/site.constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/admin/*',
          '/checkout',
          '/checkout/',
          '/api/',
          '/perfil',
          '/perfil/',
        ],
      },
    ],
    sitemap: `${SITE.URL}/sitemap.xml`,
  };
}
