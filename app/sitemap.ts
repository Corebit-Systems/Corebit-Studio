/**
 * app/sitemap.ts — Next.js App Router dynamic sitemap
 *
 * Sources URLs from:
 *  1. Locale root pages            → priority 1.0, daily
 *  2. Portfolio case-study pages   → priority 0.8, weekly
 *  3. SEO city+service landing pages → from slug-map.json
 *     - Generic city pages         → priority 0.75, daily
 *     - Niche service+city pages   → priority 0.6,  weekly
 *
 * NOTE: Legal/compliance pages (privacy-policy, cookie-policy, terms-of-service)
 * are deliberately excluded to conserve crawl budget. They link-from footer only.
 */

import { MetadataRoute } from 'next';
import slugMapData from '@/i18n/slug-map.json';

// Serve sitemap from CDN edge — revalidate every 24h
export const revalidate = 86400;

const SITE_URL = 'https://studio.corebitsystems.io';
const LOCALES  = ['en', 'ru', 'cnr', 'srb', 'sq'] as const;

const PORTFOLIOS = [
  'cupertino-roast',
  'shift-drive',
  'umami-bistro',
  'aura-wellness',
] as const;

// Niche service IDs present in slug-map entry ids (used to classify entries)
const SERVICE_IDS = ['rent_a_car', 'sto', 'restoran', 'salon', 'nekretnine', 'hoteli', 'charter', 'klinike', 'ciscenje', 'transferi'];

type SlugEntry = { id: string; slugs: Record<string, string> };
const slugMap: SlugEntry[] = slugMapData as SlugEntry[];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── 1. Core locale roots (priority 1.0) ───────────────────────────────────
  const localeRoutes: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url:             `${SITE_URL}/${locale}`,
    lastModified:    now,
    changeFrequency: 'daily',
    priority:        1.0,
  }));

  // ── 2. Portfolio pages (priority 0.8) ─────────────────────────────────────
  const portfolioRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    PORTFOLIOS.map((slug) => ({
      url:             `${SITE_URL}/${locale}/portfolio/${slug}`,
      lastModified:    now,
      changeFrequency: 'weekly' as const,
      priority:        0.8,
    })),
  );

  // ── 3. SEO landing pages from slug-map ────────────────────────────────────
  const cityRoutes:  MetadataRoute.Sitemap = [];
  const nicheRoutes: MetadataRoute.Sitemap = [];

  for (const entry of slugMap) {
    // Detect whether this entry is a niche (service+city) or generic (city) page
    const isNiche = SERVICE_IDS.some((svc) => entry.id.includes(`_${svc}`));

    for (const locale of LOCALES) {
      const slug = entry.slugs[locale];
      if (!slug) continue;

      const item = {
        url:             `${SITE_URL}/${locale}/${slug}`,
        lastModified:    now,
        changeFrequency: isNiche ? ('weekly' as const) : ('daily' as const),
        priority:        isNiche ? 0.6 : 0.75,
      };

      if (isNiche) {
        nicheRoutes.push(item);
      } else {
        cityRoutes.push(item);
      }
    }
  }

  return [
    ...localeRoutes,
    ...portfolioRoutes,
    ...cityRoutes,
    ...nicheRoutes,
  ];
}
