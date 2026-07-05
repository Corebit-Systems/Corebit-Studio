// File: C:\dev\Corebit-Studio\app\sitemap.ts
import { MetadataRoute } from 'next';

const SITE_URL = 'https://corebit-studio.vercel.app';

const locales    = ['en', 'ru', 'cnr', 'srb', 'sq'] as const;
const portfolios = [
  'cupertino-roast',
  'shift-drive',
  'umami-bistro',
  'aura-wellness',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Main locale roots (priority 1.0) ─────────────────────────────────
  const localeRoutes: MetadataRoute.Sitemap = locales.map((locale) => ({
    url:             `${SITE_URL}/${locale}`,
    lastModified:    now,
    changeFrequency: 'weekly',
    priority:        1.0,
  }));

  // ── Portfolio sub-pages per locale (priority 0.8) ─────────────────────
  const portfolioRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    portfolios.map((slug) => ({
      url:             `${SITE_URL}/${locale}/portfolio/${slug}`,
      lastModified:    now,
      changeFrequency: 'weekly' as const,
      priority:        0.8,
    }))
  );

  return [...localeRoutes, ...portfolioRoutes];
}
