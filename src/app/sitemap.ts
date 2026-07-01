import type { MetadataRoute } from 'next';
import { SITE } from '@/constants/site.constants';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE.URL}/yugioh`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
