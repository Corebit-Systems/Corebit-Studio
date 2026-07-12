import { MetadataRoute } from 'next';

const SITE_URL = 'https://studio.corebitsystems.io';

const locales = ['en', 'ru', 'cnr', 'srb', 'sq'] as const;

const portfolios = [
  'cupertino-roast',
  'shift-drive',
  'umami-bistro',
  'aura-wellness',
] as const;

const compliancePages = ['cookie-policy', 'privacy-policy', 'terms-of-service'] as const;

const locations = [
  'montenegro', 'serbia', 'albania', 'north_macedonia', 'bosnia_herzegovina', 'kosovo', 'greece', 'croatia', 'slovenia',
  'budva', 'tivat', 'podgorica', 'bar', 'kotor', 'herceg_novi', 'belgrade', 'novi_sad', 'nis', 'tirana', 'durres',
  'saranda', 'skopye', 'ohrid', 'sarajevo', 'mostar', 'trebinje', 'pristina', 'athens', 'thessaloniki', 'chalcidice',
  'zagreb', 'split', 'dubrovnik', 'ljubljana', 'maribor'
];

const services = ['rent-a-car', 'sto', 'restoran', 'salon'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 1. Core roots (priority 1.0, daily updates)
  const localeRoutes: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 1.0,
  }));

  // 2. Portfolio pages (priority 0.8, weekly updates)
  const portfolioRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    portfolios.map((slug) => ({
      url: `${SITE_URL}/${locale}/portfolio/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  );

  // 3. Compliance policies (priority 0.5, monthly updates)
  const policyRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    compliancePages.map((page) => ({
      url: `${SITE_URL}/${locale}/${page}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    }))
  );

  // 4. General city pages (priority 0.8, daily updates)
  const cityRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    locations.map((city) => ({
      url: `${SITE_URL}/${locale}/${city}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    }))
  );

  // 5. Niche city pages (priority 0.6, weekly updates)
  const nicheRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    locations.flatMap((city) =>
      services.map((service) => ({
        url: `${SITE_URL}/${locale}/${service}-sajt-${city}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      }))
    )
  );

  return [...localeRoutes, ...portfolioRoutes, ...policyRoutes, ...cityRoutes, ...nicheRoutes];
}
