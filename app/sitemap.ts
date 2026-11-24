import type { MetadataRoute } from 'next';
import { searchLocales, searchSiteUrl } from '@/i18n/searchUrls';
import slugMap from '@/i18n/slug-map.json';
import { projectReferences } from '@/components/projectReference';

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = new Set<string>();

  for (const locale of searchLocales) {
    const home = `${searchSiteUrl}/${locale}`;
    urls.add(home);
    for (const project of Object.keys(projectReferences)) {
      urls.add(`${home}/portfolio/${project}`);
    }
    for (const entry of slugMap) {
      const slug = entry.slugs[locale];
      if (slug) urls.add(`${home}/${slug}`);
    }
  }

  return Array.from(urls, url => ({ url }));
}
