// File: C:\dev\Studio\i18n\getDictionary.ts
import 'server-only';

export type Locale = 'en' | 'ru' | 'cnr' | 'sr' | 'sq';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ru: () => import('./dictionaries/ru.json').then((module) => module.default),
  cnr: () => import('./dictionaries/cnr.json').then((module) => module.default),
  sr: () => import('./dictionaries/sr.json').then((module) => module.default),
  sq: () => import('./dictionaries/sq.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.en();
};
