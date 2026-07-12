// File: c:\dev\Corebit-Studio\app\[locale]\terms-of-service\page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getDictionary, Locale } from '@/i18n/getDictionary';
import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ru' },
    { locale: 'cnr' },
    { locale: 'srb' },
    { locale: 'sq' }
  ];
}

function getTermsOfService(locale: string) {
  try {
    const filePath = path.join(process.cwd(), 'content', 'legal', 'terms', `${locale}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to read terms of service for ${locale}`, error);
    return { title: 'Terms of Service', subtitle: '', last_updated: '', sections: [] };
  }
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const SITE_URL = 'https://studio.corebitsystems.io';
  const content = getTermsOfService(locale);

  return {
    title: content.title || "Terms of Service",
    description: content.subtitle || "",
    alternates: {
      canonical: `${SITE_URL}/${locale}/terms-of-service`,
      languages: {
        'x-default': `${SITE_URL}/en/terms-of-service`,
        en:  `${SITE_URL}/en/terms-of-service`,
        ru:  `${SITE_URL}/ru/terms-of-service`,
        'sq-AL': `${SITE_URL}/sq/terms-of-service`,
        'sr-RS': `${SITE_URL}/srb/terms-of-service`,
        'sr-ME': `${SITE_URL}/cnr/terms-of-service`,
      } as Record<string, string>,
    },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}/terms-of-service`,
      title: content.title || "Terms of Service",
      description: content.subtitle || "",
      siteName: 'Corebit Studio',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title || "Terms of Service",
      description: content.subtitle || "",
    }
  };
}

export default async function TermsOfServicePage({ params: { locale } }: { params: { locale: Locale } }) {
  const rawDict = await getDictionary(locale);
  const policiesDict = (rawDict.policies as any) || {};
  const content = getTermsOfService(locale);
  const backBtn = policiesDict.back_btn || 'Back to Home';

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
        <p className="text-base sm:text-lg text-neutral-400 font-light">
          {content.subtitle}
        </p>
        <span className="text-xs text-neutral-500 font-mono">{content.last_updated}</span>
      </div>

      <div className="flex flex-col gap-6 sm:gap-8 p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl">
        {content.sections && content.sections.map((sec: any, i: number) => (
          <div key={i} className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">{sec.title}</h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-light">{sec.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
