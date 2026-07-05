// File: C:\dev\Corebit-Studio\i18n\getDictionary.ts
import 'server-only';

// ФИКС: 'srb' вместо 'sr' — синхронизация с middleware и LangSwitcher
export type Locale = 'en' | 'ru' | 'cnr' | 'srb' | 'sq';

const dictionaries: Record<Locale, () => Promise<Record<string, unknown>>> = {
  en:  () => import('./dictionaries/en.json').then((module) => module.default as Record<string, unknown>),
  ru:  () => import('./dictionaries/ru.json').then((module) => module.default as Record<string, unknown>),
  cnr: () => import('./dictionaries/cnr.json').then((module) => module.default as Record<string, unknown>),
  srb: () => import('./dictionaries/srb.json').then((module) => module.default as Record<string, unknown>),
  sq:  () => import('./dictionaries/sq.json').then((module) => module.default as Record<string, unknown>),
};

export const getDictionary = async (locale: Locale) => {
  return (dictionaries[locale] ?? dictionaries.en)();
};
