// File: C:\dev\Corebit-Studio\app\[locale]\layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getDictionary, Locale } from '@/i18n/getDictionary';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const SITE_URL = 'https://corebit-studio.vercel.app';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    metadataBase: new URL(SITE_URL),
    title: 'Corebit Studio | Premium Web Architecture & Automation',
    description: 'High-performance web architecture, custom booking systems, and proprietary automation modules that convert visitors into loyal clients.',
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      // ФИКС: Next.js Languages тип принимает только BCP 47 теги.
      // 'cnr' (Черногорский) и 'srb' — нестандартные коды проекта.
      // Используем приведение типа чтобы не сломать сборку.
      languages: {
        'en': `${SITE_URL}/en`,
        'ru': `${SITE_URL}/ru`,
        'x-cnr': `${SITE_URL}/cnr`,
        'x-srb': `${SITE_URL}/srb`,
        'sq':    `${SITE_URL}/sq`,
      } as Record<string, string>,
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
  };
}

// ФИКС: Строгая типизация dict — только нужные поля для Header/Footer
interface LayoutDict {
  nav: {
    services: string;
    portfolio: string;
    pricing: string;
    contact?: string;
  };
  hero: {
    cta: string;
  };
  footer: {
    cta_btn: string;
    rights: string;
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
  // Приводим к строгому типу — компоненты получают только то, что им нужно
  const dict = rawDict as unknown as LayoutDict;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Corebit Studio',
    url: SITE_URL,
    telephone: '068914816',
    email: 'hello@corebitsystems.io',
    priceRange: '€400 - €3500+',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tivat',
      addressCountry: 'ME',
    },
    sameAs: ['https://wa.me/359882905657'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web Architecture & Automation Services',
      itemListElement: [
        { '@type': 'Offer', name: 'Entry / Kickstart',       price: '400',  priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Growth / Business',       price: '1200', priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Enterprise Architecture', price: '3500', priceCurrency: 'EUR' },
      ],
    },
  };

  return (
    <html lang={locale} className="dark scroll-smooth">
      {/* ФИКС: overflow-x-hidden на body предотвращает горизонтальный скролл */}
      <body
        className={`${inter.variable} font-sans bg-[#050506] text-white antialiased min-h-screen selection:bg-white/20 selection:text-white flex flex-col overflow-x-hidden`}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#050506] to-[#050506]" />

        <Header dict={dict} locale={locale} />

        {/* ФИКС: pt-20 вместо pt-32 — header теперь 64px, pt-32 было избыточным */}
        <main className="relative z-10 flex flex-col items-center w-full flex-grow pt-20 sm:pt-24">
          {children}
        </main>

        <Footer dict={dict} />
      </body>
    </html>
  );
}
