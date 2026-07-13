// File: C:\dev\Corebit-Studio\app\[locale]\layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AnalyticsConsentProvider from '@/components/AnalyticsConsentProvider';
import FloatingWidgets from '@/components/FloatingWidgets';
import { getDictionary, Locale } from '@/i18n/getDictionary';

const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap', weight: ['400', '500', '700'] });
const SITE_URL = 'https://studio.corebitsystems.io';

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
    icons: {
      icon: '/icon.png',
      shortcut: '/favicon.ico',
      apple: '/apple-icon.png',
    },

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
  cookie: {
    text: string;
    accept: string;
    link: string;
    reject?: string;
  };
  faq: {
    items: Array<{ q: string; a: string }>;
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
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const rawDict = await getDictionary(locale as Locale);
  const dict    = rawDict as unknown as LayoutDict;

  // ── Schema.org JSON-LD — 2 independent entity blocks (no array wrapper) ─────
  // Connected via @id references to prevent graph fragmentation.
  const professionalServiceLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Corebit Studio",
    "image": `${SITE_URL}/og-image-en.png`,
    "@id": "https://corebitsystems.io/#organization",
    "url": SITE_URL,
    "telephone": "+38268914816",
    "email": "corebitstudio@corebitsystems.io",
    "priceRange": "€360 - €3150",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tivat",
      "addressCountry": "Montenegro"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 42.4350,
      "longitude": 18.6961
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+38268914816",
        "contactType": "customer support",
        "areaServed": ["ME", "RS", "AL"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+359882905657",
        "contactType": "International Sales & WhatsApp Support",
        "areaServed": "Worldwide"
      }
    ],
    "sameAs": [
      "https://wa.me/359882905657",
      "https://t.me/corebitsystems"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Web Architecture & Automation Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "Entry / Kickstart",
          "price": "360",
          "priceCurrency": "EUR"
        },
        {
          "@type": "Offer",
          "name": "Growth / Business",
          "price": "1080",
          "priceCurrency": "EUR"
        },
        {
          "@type": "Offer",
          "name": "Enterprise Architecture",
          "price": "3150",
          "priceCurrency": "EUR"
        }
      ]
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Marko J."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Before switching to Corebit Studio, we were losing up to 20% of evening bookings due to the slow loading of our old website. The team built an instant booking system for us. Excellent ROI."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Elena R."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "We were looking for a local agency that understands hotel business on the Adriatic. Direct bookings through the website bypassing aggregators grew by 35%."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Christophe B."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "For our business, it is critical that clients can easily send inquiries in one click. Now we get clean, verified leads directly to our corporate email without spam."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Anja V."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Automation saved our customer service. Thanks to Corebit Studio, the integration of schedules went seamlessly. Fully responsive and intuitive."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Thomas M."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Exceptional technical expertise, scalable Next.js code, and strict compliance with deadlines. Highly recommended."
      }
    ]
  };

  const faqPageLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "publisher": {
      "@id": "https://corebitsystems.io/#organization"
    },
    "provider": {
      "@id": "https://corebitsystems.io/#organization"
    },
    "mainEntity": dict.faq?.items?.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    })) || []
  };

  return (
    <html lang={locale} className="dark scroll-smooth">
      <head>
        <link rel="alternate" href={`${SITE_URL}/en`} hrefLang="x-default" />
        <link rel="alternate" href={`${SITE_URL}/en`} hrefLang="en" />
        <link rel="alternate" href={`${SITE_URL}/ru`} hrefLang="ru" />
        <link rel="alternate" href={`${SITE_URL}/sq`} hrefLang="sq" />
        <link rel="alternate" href={`${SITE_URL}/cnr`} hrefLang="sr-ME" />
        <link rel="alternate" href={`${SITE_URL}/srb`} hrefLang="sr-RS" />
        {/* Consolidated linked JSON-LD blocks to prevent graph fragmentation */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageLd) }} />
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
        <AnalyticsConsentProvider />

        {/* Global floating user utilities (FAB contact menu + Scroll-to-top) */}
        <FloatingWidgets locale={locale as Locale} />
      </body>
    </html>
  );
}
