// File: C:\dev\Corebit-Studio\app\[locale]\layout.tsx
import '@/app/zod-init';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AnalyticsConsentProvider from '@/components/AnalyticsConsentProvider';
import FloatingWidgets from '@/components/FloatingWidgets';
import { getDictionary, Locale } from '@/i18n/getDictionary';
import { searchLanguageTags, searchOrganizationId, searchSiteUrl as SITE_URL, searchWebsiteId } from '@/i18n/searchUrls';
import { studioContact } from '@/content/studioContact';
import { AiSalesWidget } from '@/components/LazyWidgets';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  weight: ['400', '500', '700'],
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
  preload: true,
});

// ── Per-locale metadata registry ─────────────────────────────────────────────
// Each entry drives title, description, OG image, and Twitter card for its route.
const LOCALE_META: Record<
  string,
  { title: string; description: string; ogLocale: string; twitterDesc: string; keywords: string[] }
> = {
  en: {
    title:       'Corebit Studio | Web Development & IT Systems for Hotels and Restaurants in Montenegro & Europe',
    description: 'We build high-converting websites and automation systems for premium hospitality and SMBs. Boost your bookings and revenue within 30 days.',
    ogLocale:    'en_US',
    twitterDesc: 'Boost bookings and revenue with high-converting websites and booking automation. Tailored for hotels, restaurants, and SMBs in Montenegro.',
    keywords:    ['hotel web design montenegro', 'restaurant booking software budva', 'it services tivat', 'web development montenegro', 'Corebit Studio'],
  },
  ru: {
    title:       'Corebit Studio | Разработка сайтов и ИТ-систем для отелей и ресторанов в Черногории',
    description: 'Создаем высококонверсионные сайты и системы автоматизации для премиального бизнеса. Увеличьте поток бронирований и доход вашего отеля или ресторана уже через 30 дней.',
    ogLocale:    'ru_RU',
    twitterDesc: 'Высококонверсионные сайты и системы автоматизации для отелей и ресторанов в Черногории. Рост броней за 30 дней.',
    keywords:    ['разработка сайтов для отелей черногория', 'автоматизация ресторанов будва тиват', 'ит услуги черногория', 'создание сайтов черногория', 'Corebit Studio'],
  },
  cnr: {
    title:       'Corebit Studio | Izrada sajtova i IT sistema za hotele i restorane u Crnoj Gori',
    description: 'Izrađujemo visoko-konverzione sajtove i sisteme automatizacije za crnogorski turizam i ugostiteljstvo na Jadranu. Povećajte broj direktnih rezervacija za 30% u roku od 30 dana.',
    ogLocale:    'sr_ME',
    twitterDesc: 'Izrada sajtova i online rezervacionih sistema za hotele i restorane u Crnoj Gori — Budva, Tivat, Kotor.',
    keywords:    ['izrada sajtova za hotele crna gora', 'automatizacija restorana budva tivat', 'it usluge crna gora', 'veb dizajn crna gora', 'Corebit Studio'],
  },
  srb: {
    title:       'Corebit Studio | Izrada sajtova i IT sistema za restorane i auto servise u Srbiji',
    description: 'Kreiramo visoko-konverzione sajtove i sisteme automatizacije za srpske restorane, auto servise i salone lepote. Više rezervacija i prijava online za 30 dana.',
    ogLocale:    'sr_RS',
    twitterDesc: 'Izrada sajtova i sistema za online rezervacije za restorane, auto servise i salone lepote u Srbiji — Beograd, Novi Sad.',
    keywords:    ['izrada sajtova za restorane srbija', 'automatizacija auto servisa beograd', 'it usluge srbija', 'veb dizajn beograd novi sad', 'Corebit Studio'],
  },
  sq: {
    title:       'Corebit Studio | Zhvillim Ueb & Sisteme IT për Hotele dhe Restorante në Mal të Zi',
    description: 'Ne ndërtojmë uebfaqe me konvertim të lartë dhe sisteme automatizimi për hoteleri dhe biznese. Rritni rezervimet dhe të ardhurat tuaja brenda 30 ditëve.',
    ogLocale:    'sq_AL',
    twitterDesc: 'Zhvillim ueb dhe sisteme automatizimi për hotele dhe restorante në Mal të Zi. Rritni të ardhurat tuaja.',
    keywords:    ['zhvillim uebfaqesh per hotele mal i zi', 'automatizim restorantesh budva', 'sherbime it mal i zi', 'dizajn ueb mal i zi', 'Corebit Studio'],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
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
      other: {
        'yandex-verification': '41ee1bc24c5e3a3e',
        'msvalidate.01': '313628409F2DAD61CADA8822F8BEC4AA',
      },
    },
    icons: {
      icon: '/icon.png',
      shortcut: '/favicon.ico',
      apple: '/apple-icon.png',
    },
    manifest: '/manifest.json',

    title:       meta.title,
    description: meta.description,



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

// ── Viewport — must be a separate export in Next.js 14+ ──────────────────────
export const generateViewport = (): Viewport => ({
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,
});


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
  policies?: {
    back_btn: string;
    privacy_title: string;
    cookie_title: string;
    terms_title: string;
  };
  cookie: {
    text: string;
    accept: string;
    link: string;
    reject?: string;
  };
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ru' },
    { locale: 'cnr' },
    { locale: 'srb' },
    { locale: 'sq' }
  ];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const rawDict = await getDictionary(locale as Locale);
  const dict    = rawDict as unknown as LayoutDict;

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": searchOrganizationId,
    "name": "Corebit Studio",
    "url": SITE_URL,
    "logo": `${SITE_URL}/apple-icon.png`,
    "telephone": studioContact.telephone,
    "email": studioContact.email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tivat",
      "addressCountry": "ME"
    },
    "parentOrganization": {
      "@type": "Organization",
      "name": "Corebit Systems",
      "@id": "https://corebitsystems.io/#organization",
      "url": "https://corebitsystems.io"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "WhatsApp",
      "url": studioContact.whatsappUrl,
    },
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": searchWebsiteId,
    "name": "Corebit Studio",
    "alternateName": ["Corebit Studio Montenegro", "Corebit"],
    "url": SITE_URL,
    "publisher": { "@id": searchOrganizationId }
  };

  return (
    <html lang={searchLanguageTags[locale as Locale] ?? 'en'} className="dark scroll-smooth">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
      </head>
      <body
        className={`${inter.className} bg-[#050506] text-white antialiased min-h-screen selection:bg-white/20 selection:text-white flex flex-col overflow-x-hidden`}
      >
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#050506] to-[#050506]" />

        <Header dict={dict} locale={locale} />

        <main className="relative z-10 flex flex-col items-center w-full flex-grow pt-20 sm:pt-24">
          {children}
        </main>

        <Footer dict={dict} locale={locale} />

        {/* Global Compliance & Consent management */}
        <CookieBanner dict={dict.cookie} locale={locale} />

        {/* Vercel telemetry — loaded only after affirmative cookie consent (GDPR/ePrivacy) */}
        <AnalyticsConsentProvider locale={locale} />

        {/* Global floating user utilities (FAB contact menu + Scroll-to-top) */}
        <FloatingWidgets locale={locale as Locale} />

        {/* Dynamic AI Sales widget */}
        <AiSalesWidget locale={locale} />
      </body>
    </html>
  );
}
