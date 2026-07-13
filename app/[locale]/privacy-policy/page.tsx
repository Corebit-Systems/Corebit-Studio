// File: c:\dev\Corebit-Studio\app\[locale]\privacy-policy\page.tsx
// SSG: legal content is imported statically at build time — zero runtime fs I/O
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getDictionary, Locale } from '@/i18n/getDictionary';

// Static imports — bundled at build time, no fs.readFileSync in runtime
import privacyEn  from '@/content/legal/privacy/en.json';
import privacyRu  from '@/content/legal/privacy/ru.json';
import privacyCnr from '@/content/legal/privacy/cnr.json';
import privacySrb from '@/content/legal/privacy/srb.json';
import privacySq  from '@/content/legal/privacy/sq.json';

const SITE_URL = 'https://studio.corebitsystems.io';

const policyMap: Record<string, typeof privacyEn> = {
  en: privacyEn,
  ru: privacyRu,
  cnr: privacyCnr,
  srb: privacySrb,
  sq: privacySq,
};

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return ['en', 'ru', 'cnr', 'srb', 'sq'].map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const content = policyMap[locale] ?? policyMap.en;

  return {
    title:       content.title || 'Privacy Policy',
    description: content.subtitle || '',
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy-policy`,
      languages: {
        'x-default': `${SITE_URL}/en/privacy-policy`,
        en:           `${SITE_URL}/en/privacy-policy`,
        ru:           `${SITE_URL}/ru/privacy-policy`,
        'sq-AL':      `${SITE_URL}/sq/privacy-policy`,
        'sr-RS':      `${SITE_URL}/srb/privacy-policy`,
        'sr-ME':      `${SITE_URL}/cnr/privacy-policy`,
      } as Record<string, string>,
    },
    openGraph: {
      type:        'website',
      url:         `${SITE_URL}/${locale}/privacy-policy`,
      title:       content.title || 'Privacy Policy',
      description: content.subtitle || '',
      siteName:    'Corebit Studio',
    },
    twitter: {
      card:        'summary_large_image',
      title:       content.title || 'Privacy Policy',
      description: content.subtitle || '',
    },
  };
}

export default async function PrivacyPolicyPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const rawDict   = await getDictionary(locale);
  const policies  = (rawDict.policies as any) || {};
  const content   = policyMap[locale] ?? policyMap.en;
  const backBtn   = policies.back_btn || 'Back to Home';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-24 flex flex-col gap-8 sm:gap-12">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit min-h-[44px]"
      >
        <ArrowLeft size={20} /> {backBtn}
      </Link>

      <div className="flex flex-col gap-3">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-tight">
          {content.title}
        </h1>
        <p className="text-base sm:text-lg text-neutral-400 font-light">{content.subtitle}</p>
        <span className="text-xs text-neutral-500 font-mono">{content.last_updated}</span>
      </div>

      <div className="flex flex-col gap-6 sm:gap-8 p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl">
        {content.sections?.map((sec: any, i: number) => (
          <div key={i} className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">{sec.title}</h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-light">{sec.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
