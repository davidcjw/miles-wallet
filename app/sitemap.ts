import type { MetadataRoute } from 'next';

const SITE_URL = 'https://miles-wallet.davidcjw.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
