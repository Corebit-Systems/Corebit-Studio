// File: C:\dev\Corebit-Studio\app\[locale]\layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getDictionary, Locale } from '@/i18n/getDictionary';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const SITE_URL = 'https://corebit-studio.vercel.app';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    metadataBase: new URL(SITE_URL),

    title: 'Corebit Studio | High-Performance Web Architecture & Automation',
    description:
      'We architect proprietary business automation modules and ultra-fast Next.js web platforms with sub-100ms load times. Based in Tivat, Montenegro.',

    // ── Canonical & hreflang alternates ──────────────────────────────────
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      // NOTE: 'cnr' and 'srb' are project-internal codes, not BCP-47,
      // so we use the 'x-' extension prefix to keep the build clean.
      languages: {
        en:      `${SITE_URL}/en`,
        ru:      `${SITE_URL}/ru`,
        'x-cnr': `${SITE_URL}/cnr`,
        'x-srb': `${SITE_URL}/srb`,
        sq:      `${SITE_URL}/sq`,
      } as Record<string, string>,
    },

    // ── Open Graph ────────────────────────────────────────────────────────
    openGraph: {
      type:        'website',
      url:         `${SITE_URL}/${locale}`,
      siteName:    'Corebit Studio',
      title:       'Corebit Studio | High-Performance Web Architecture & Automation',
      description: 'We architect proprietary business automation modules and ultra-fast Next.js web platforms with sub-100ms load times. Based in Tivat, Montenegro.',
      locale:      locale === 'en' ? 'en_US' : locale,
      images: [
        {
          url:    OG_IMAGE,
          width:  1200,
          height: 630,
          alt:    'Corebit Studio — Premium Glassmorphic Web Architecture Banner',
          type:   'image/png',
        },
      ],
    },

    // ── Twitter / X Card ─────────────────────────────────────────────────
    twitter: {
      card:        'summary_large_image',
      site:        '@CorebitStudio',
      creator:     '@CorebitStudio',
      title:       'Corebit Studio | High-Performance Web Architecture & Automation',
      description: 'Proprietary automation modules & ultra-fast Next.js platforms. Sub-100ms load times. Tivat, Montenegro.',
      images:      [OG_IMAGE],
    },

    // ── Viewport ──────────────────────────────────────────────────────────
    viewport: {
      width:        'device-width',
      initialScale: 1,
      maximumScale: 5,
    },

    // ── Robots ────────────────────────────────────────────────────────────
    robots: {
      index:          true,
      follow:         true,
      googleBot: {
        index:               true,
        follow:              true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet':       -1,
      },
    },

    // ── Extra ─────────────────────────────────────────────────────────────
    keywords: [
      'web architecture Montenegro',
      'Next.js automation agency',
      'booking system Tivat',
      'high-performance web platforms',
      'custom automation modules',
      'Corebit Studio',
    ],
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
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const rawDict = await getDictionary(locale as Locale);
  const dict = rawDict as unknown as LayoutDict;

  // ── Schema.org JSON-LD — ProfessionalService entity (AEO anchor) ───────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type':    'ProfessionalService',
    name:       'Corebit Studio',
    image:      OG_IMAGE,
    '@id':      SITE_URL,
    url:        SITE_URL,
    telephone:  '+38268914816',
    email:      'hello@corebitsystems.io',
    priceRange: '€360 - €3150',
    address: {
      '@type':          'PostalAddress',
      addressLocality:  'Tivat',
      addressCountry:   'ME',
    },
    geo: {
      '@type':    'GeoCoordinates',
      latitude:   '42.4350',
      longitude:  '18.6961',
    },
    openingHoursSpecification: {
      '@type':      'OpeningHoursSpecification',
      dayOfWeek:    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens:        '09:00',
      closes:       '18:00',
    },
    sameAs: ['https://wa.me/359882905657'],
    // Offer catalogue for rich results
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name:    'Web Architecture & Automation Services',
      itemListElement: [
        { '@type': 'Offer', name: 'Entry / Kickstart',       price: '360',  priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Growth / Business',       price: '1080', priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Enterprise Architecture', price: '3150', priceCurrency: 'EUR' },
      ],
    },
  };

  return (
    <html lang={locale} className="dark scroll-smooth">
      {/* overflow-x-hidden on body prevents horizontal scroll */}
      <body
        className={`${inter.variable} font-sans bg-[#050506] text-white antialiased min-h-screen selection:bg-white/20 selection:text-white flex flex-col overflow-x-hidden`}
      >
        {/* Schema.org JSON-LD — injected server-side, zero client JS cost */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#050506] to-[#050506]" />

        <Header dict={dict} locale={locale} />

        {/* pt-20 → header is ~64px, pt-32 was excessive */}
        <main className="relative z-10 flex flex-col items-center w-full flex-grow pt-20 sm:pt-24">
          {children}
        </main>

        <Footer dict={dict} />
      </body>
    </html>
  );
}
