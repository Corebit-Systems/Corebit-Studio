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
      languages: {
        'en': `${SITE_URL}/en`,
        'ru': `${SITE_URL}/ru`,
        'cnr': `${SITE_URL}/cnr`,
        'srb': `${SITE_URL}/srb`,
        'sq': `${SITE_URL}/sq`,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const dict = await getDictionary(locale as Locale);

  // Advanced AEO/SEO Schema with OfferCatalog for new Pricing Tiers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Corebit Studio",
    "url": SITE_URL,
    "telephone": "068914816",
    "email": "hello@corebitsystems.io",
    "priceRange": "€400 - €3500+",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tivat",
      "addressCountry": "ME"
    },
    "sameAs": ["https://wa.me/359882905657"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Web Architecture & Automation Services",
      "itemListElement": [
        { "@type": "Offer", "name": "Entry / Kickstart", "price": "400", "priceCurrency": "EUR" },
        { "@type": "Offer", "name": "Growth / Business", "price": "1200", "priceCurrency": "EUR" },
        { "@type": "Offer", "name": "Enterprise Architecture", "price": "3500", "priceCurrency": "EUR" }
      ]
    }
  };

  return (
    <html lang={locale} className="dark scroll-smooth">
      <body className={`${inter.variable} bg-[#050506] text-white antialiased min-h-screen selection:bg-white/20 selection:text-white flex flex-col`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#050506] to-[#050506]"></div>
        
        <Header dict={dict} locale={locale} />
        
        <main className="relative z-10 flex flex-col items-center w-full flex-grow pt-32">
          {children}
        </main>

        <Footer dict={dict} />
      </body>
    </html>
  );
}
