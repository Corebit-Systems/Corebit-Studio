// File: C:\dev\Corebit-Studio\app\[locale]\layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { getDictionary, Locale } from '@/i18n/getDictionary';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });
const SITE_URL = 'https://corebit-studio.vercel.app';

// ── Per-locale metadata registry ─────────────────────────────────────────────
// Each entry drives title, description, OG image, and Twitter card for its route.
const LOCALE_META: Record<
  string,
  { title: string; description: string; ogLocale: string; twitterDesc: string; keywords: string[] }
> = {
  en: {
    title:       'Corebit Studio | High-Performance Web Architecture & Automation',
    description: 'We architect proprietary business automation modules and ultra-fast Next.js web platforms with sub-100ms load times. Based in Tivat, Montenegro.',
    ogLocale:    'en_US',
    twitterDesc: 'Proprietary automation modules & ultra-fast Next.js platforms. Sub-100ms. Tivat, Montenegro.',
    keywords:    ['web architecture Montenegro', 'Next.js automation agency', 'booking system Tivat', 'high-performance web platforms', 'custom automation modules', 'Corebit Studio'],
  },
  ru: {
    title:       'Corebit Studio | Высокопроизводительная веб-архитектура и автоматизация',
    description: 'Разработка проприетарных модулей автоматизации бизнеса и сверхбыстрых веб-платформ на Next.js с загрузкой до 100 мс. Тиват, Черногория.',
    ogLocale:    'ru_RU',
    twitterDesc: 'Модули автоматизации и сверхбыстрые платформы Next.js. Загрузка до 100 мс. Тиват, Черногория.',
    keywords:    ['веб-архитектура Черногория', 'Next.js агентство автоматизации', 'система бронирования Тиват', 'высокопроизводительные веб-платформы', 'Corebit Studio'],
  },
  cnr: {
    title:       'Corebit Studio | Vrhunska veb arhitektura i automatizacija poslovanja',
    description: 'Projektujemo sopstvene module za automatizaciju poslovanja i ultra brze Next.js veb platforme sa učitavanjem ispod 100ms. Tivat, Crna Gora.',
    ogLocale:    'sr_ME',
    twitterDesc: 'Moduli za automatizaciju i ultra brze Next.js platforme. Ispod 100ms. Tivat, Crna Gora.',
    keywords:    ['veb arhitektura Crna Gora', 'Next.js agencija automatizacija', 'sistem rezervacija Tivat', 'Corebit Studio'],
  },
  srb: {
    title:       'Corebit Studio | Vrhunska veb arhitektura i automatizacija poslovanja',
    description: 'Projektujemo sopstvene module za automatizaciju poslovanja i ultra brze Next.js veb platforme sa učitavanjem ispod 100ms. Tivat, Crna Gora.',
    ogLocale:    'sr_RS',
    twitterDesc: 'Moduli za automatizaciju i ultra brze Next.js platforme. Ispod 100ms. Tivat, Crna Gora.',
    keywords:    ['veb arhitektura Srbija', 'Next.js agencija automatizacija', 'sistem rezervacija', 'Corebit Studio'],
  },
  sq: {
    title:       'Corebit Studio | Arkitekturë Ueb me Performancë të Lartë & Automatizim',
    description: 'Ne projektojmë module të automatizimit të biznesit dhe platforma ueb ultra të shpejta Next.js me kohë ngarkimi nën 100ms. Tivat, Mal i Zi.',
    ogLocale:    'sq_AL',
    twitterDesc: 'Module automatizimi & platforma Next.js ultra të shpejta. Nën 100ms. Tivat, Mal i Zi.',
    keywords:    ['arkitekturë ueb Shqipëri', 'Next.js agjensi automatizim', 'sistem rezervimi Tivat', 'Corebit Studio'],
  },
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const meta     = LOCALE_META[locale] ?? LOCALE_META.en;
  const ogImage  = `${SITE_URL}/og-image-${locale in LOCALE_META ? locale : 'en'}.png`;
  const ogAltMap: Record<string, string> = {
    en:  'Corebit Studio — Premium Glassmorphic Web Architecture Banner',
    ru:  'Corebit Studio — Высокопроизводительная веб-архитектура',
    cnr: 'Corebit Studio — Vrhunska veb arhitektura i automatizacija',
    srb: 'Corebit Studio — Vrhunska veb arhitektura i automatizacija',
    sq:  'Corebit Studio — Arkitekturë Ueb me Performancë të Lartë',
  };

  return {
    metadataBase: new URL(SITE_URL),
    verification: {
      google: 'G8PO2v-HeIoMTxZXUb8qNopkCV6sQPH4Cd0VEftJyVQ',
    },

    title:       meta.title,
    description: meta.description,

    // ── Canonical & hreflang alternates ──────────────────────────────────
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        'x-default': `${SITE_URL}/en`,
        en:  `${SITE_URL}/en`,
        ru:  `${SITE_URL}/ru`,
        'sq-AL': `${SITE_URL}/sq`,
        'sr-RS': `${SITE_URL}/srb`,
        'sr-ME': `${SITE_URL}/cnr`,
      } as Record<string, string>,
    },

    // ── Open Graph ───────────────────────────────────────────────────────
    openGraph: {
      type:        'website',
      url:         `${SITE_URL}/${locale}`,
      siteName:    'Corebit Studio',
      title:       meta.title,
      description: meta.description,
      locale:      meta.ogLocale,
      images: [
        {
          url:    ogImage,
          width:  1200,
          height: 630,
          alt:    ogAltMap[locale] ?? ogAltMap.en,
          type:   'image/png',
        },
      ],
    },

    // ── Twitter / X Card ─────────────────────────────────────────────────
    twitter: {
      card:        'summary_large_image',
      site:        '@CorebitStudio',
      creator:     '@CorebitStudio',
      title:       meta.title,
      description: meta.twitterDesc,
      images:      [ogImage],
    },

    // ── Viewport ──────────────────────────────────────────────────────────
    viewport: {
      width:        'device-width',
      initialScale: 1,
      maximumScale: 5,
    },

    // ── Robots ────────────────────────────────────────────────────────────
    robots: {
      index:     true,
      follow:    true,
      googleBot: {
        index:               true,
        follow:              true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet':       -1,
      },
    },

    keywords:  meta.keywords,
    authors:   [{ name: 'Corebit Studio', url: SITE_URL }],
    creator:   'Corebit Studio',
    publisher: 'Corebit Studio',
  };
}

// ── Strict dictionary typing for Header / Footer ──────────────────────────
interface LayoutDict {
  nav: {
    services: string;
    portfolio: string;
    pricing:  string;
    contact?: string;
  };
  hero: {
    cta: string;
  };
  footer: {
    cta_btn: string;
    rights:  string;
  };
  cookie: {
    text: string;
    accept: string;
    link: string;
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const rawDict = await getDictionary(locale as Locale);
  const dict    = rawDict as unknown as LayoutDict;

  return (
    <html lang={locale} className="dark scroll-smooth">
      <body
        className={`${inter.variable} font-sans bg-[#050506] text-white antialiased min-h-screen selection:bg-white/20 selection:text-white flex flex-col overflow-x-hidden`}
      >
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#050506] to-[#050506]" />

        <Header dict={dict} locale={locale} />

        <main className="relative z-10 flex flex-col items-center w-full flex-grow pt-20 sm:pt-24">
          {children}
        </main>

        <Footer dict={dict} />

        {/* Global Compliance & Consent management */}
        <CookieBanner dict={dict.cookie} locale={locale} />

        {/* Vercel Speed & Analytics telemetry */}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
