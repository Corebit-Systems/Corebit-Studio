import type { Metadata } from 'next';
import type { Locale } from './getDictionary';
import { searchLocales, searchSiteUrl } from './searchUrls';

const socialLocales: Record<Locale, string> = {
  en: 'en_US',
  ru: 'ru_RU',
  cnr: 'sr_ME',
  srb: 'sr_RS',
  sq: 'sq_AL',
};

export const socialImageSize = { width: 1200, height: 630 };
export const socialImageType = 'image/png';
export const socialImageAlt = 'Corebit Studio';

export function socialMetadata(
  locale: string,
  url: string,
  title: string,
  description: string,
): Pick<Metadata, 'openGraph' | 'twitter'> {
  const language = searchLocales.find(candidate => candidate === locale) ?? 'en';
  const imageUrl = `${searchSiteUrl}/${language}/opengraph-image`;

  return {
    openGraph: {
      type: 'website',
      url,
      siteName: 'Corebit Studio',
      title,
      description,
      locale: socialLocales[language],
      images: [{ url: imageUrl, ...socialImageSize, type: socialImageType, alt: socialImageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: imageUrl, alt: socialImageAlt }],
    },
  };
}
