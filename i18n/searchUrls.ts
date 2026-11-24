import type { Locale } from './getDictionary';

export const searchSiteUrl = 'https://studio.corebitsystems.io';
export const searchLocales = ['en', 'ru', 'cnr', 'srb', 'sq'] as const satisfies readonly Locale[];

export const searchLanguageTags = {
  en: 'en',
  ru: 'ru',
  cnr: 'sr-ME',
  srb: 'sr-RS',
  sq: 'sq-AL',
} satisfies Record<Locale, string>;

export function searchAlternates(pathFor: (locale: Locale) => string | undefined) {
  const languages: Record<string, string> = {};
  for (const locale of searchLocales) {
    const path = pathFor(locale);
    if (path) languages[searchLanguageTags[locale]] = searchSiteUrl + path;
  }
  if (languages.en) languages['x-default'] = languages.en;
  return languages;
}
