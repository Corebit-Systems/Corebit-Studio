// File: C:\dev\Corebit-Studio\app\[locale]\page.tsx
import { getDictionary, Locale } from '@/i18n/getDictionary';
import BentoCard from '@/components/BentoCard';
import PricingSection from '@/components/PricingSection';
import ContactForm from '@/components/ContactForm';
import HeroSection from '@/components/HeroSection';
import FAQSection from '@/components/FAQSection';
import { ArrowRight, CheckCircle2, CalendarClock, Utensils, CalendarHeart } from 'lucide-react';

interface PageDict {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  about: {
    title: string;
    desc: string;
    badges: string[];
  };
  automation: {
    title: string;
    subtitle: string;
    seo_tagline?: string;
    tables: { title: string; desc: string };
    booking: { title: string; desc: string };
    schedule: { title: string; desc: string };
  };
  portfolio: {
    title: string;
    subtitle: string;
    items: Record<string, { title: string; desc: string }>;
  };
  pricing: PricingDict;
  contact_form: ContactFormDict;
  faq: FAQDict;
  leak: { title: string; subtitle: string; text: string };
}

interface FAQItem {
  q: string;
  a: string;
}

interface FAQDict {
  title: string;
  subtitle: string;
  items: FAQItem[];
}

interface PricingDict {
  title: string;
  subtitle: string;
  toggle_full: string;
  toggle_split: string;
  tier1: { title: string; price: number; desc: string; btn: string };
  tier2: { title: string; price: number; desc: string; btn: string };
  tier3: { title: string; price: number; desc: string; btn: string };
}

interface ContactFormDict {
  title: string;
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  error_rate: string;
  error_spam: string;
  error_general: string;
  gdpr_text: string;
  privacy_policy_link: string;
}

export default async function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const rawDict = await getDictionary(locale);
  const dict = rawDict as unknown as PageDict;

  const CupertinoVisual = (
    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 to-orange-600/20 flex items-center justify-center">
      <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="absolute w-24 h-24 bg-amber-500/20 blur-2xl rounded-full" />
      <div className="absolute w-32 h-16 border border-amber-500/30 rounded-xl bg-black/40 backdrop-blur-md shadow-2xl" />
    </div>
  );

  const ShiftDriveVisual = (
    <div className="absolute inset-0 bg-slate-950 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 border-[0.5px] border-lime-500/10 m-4 rounded-lg" />
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-lime-500/20" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-lime-500/20" />
      <div className="w-20 h-10 border border-lime-400/50 rounded bg-lime-900/20 shadow-[0_0_15px_rgba(132,204,22,0.2)]" />
    </div>
  );

  const UmamiVisual = (
    <div className="absolute inset-0 bg-gradient-to-br from-rose-950 to-red-900/40 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border border-red-500/30 absolute top-6 left-8 bg-red-500/5" />
      <div className="w-16 h-16 rounded-full border border-red-500/30 absolute bottom-6 right-10 bg-red-500/5" />
      <div className="w-28 h-14 border border-red-500/20 rounded-full absolute bg-black/40 backdrop-blur-md" />
    </div>
  );

  const AuraVisual = (
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-emerald-600/20 flex items-center justify-center">
      <div className="w-24 h-24 bg-emerald-400/20 rounded-full blur-xl absolute left-8" />
      <div className="w-24 h-24 bg-amber-200/10 rounded-full blur-xl absolute right-8" />
      <div className="w-3/4 h-1/2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl" />
    </div>
  );

  // Authoritative JSON-LD Microdata context (ProfessionalService + OfferCatalog + FAQPage unified)
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Corebit Studio",
      "image": "https://corebit-studio.vercel.app/og-image-en.png",
      "@id": "https://corebit-studio.vercel.app",
      "url": "https://corebit-studio.vercel.app",
      "telephone": "+38268914816",
      "email": "corebitstudio@corebitsystems.io",
      "priceRange": "€360 - €3150",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Tivat",
        "addressCountry": "ME"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "42.4350",
        "longitude": "18.6961"
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
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": dict.faq.items.map((item) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 flex flex-col gap-24 md:gap-32">
      {/* Schema.org Entity script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Animated Hero Section */}
      <HeroSection dict={dict.hero} locale={locale} />

      {/* About */}
      <section className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="flex flex-col gap-4 md:flex-1 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{dict.about.title}</h2>
          <p className="text-base text-neutral-400 leading-relaxed font-light">{dict.about.desc}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10 w-full md:flex-1">
          {dict.about.badges.map((badge: string, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm font-medium min-h-[52px]">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> {badge}
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="flex flex-col gap-8 sm:gap-12">
        <div className="text-center flex flex-col gap-3 sm:gap-4 px-2">
          {dict.automation.seo_tagline && (
            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-emerald-500 uppercase">
              {dict.automation.seo_tagline}
            </h3>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{dict.automation.title}</h2>
          <p className="text-base sm:text-xl text-neutral-400">{dict.automation.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          <BentoCard
            title={dict.automation.tables.title}
            description={dict.automation.tables.desc}
            icon={<Utensils size={24} aria-label="Restaurant table booking module icon" />}
            delay={0.1}
          />
          <BentoCard
            title={dict.automation.booking.title}
            description={dict.automation.booking.desc}
            icon={<CalendarClock size={24} aria-label="Time-slot booking calendar module icon" />}
            delay={0.2}
            className="md:col-span-2"
          />
          <BentoCard
            title={dict.automation.schedule.title}
            description={dict.automation.schedule.desc}
            icon={<CalendarHeart size={24} aria-label="Beauty salon appointment scheduler module icon" />}
            delay={0.3}
            className="md:col-span-3"
          />
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="flex flex-col gap-8 sm:gap-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[300px] sm:h-[400px] bg-emerald-600/5 blur-[200px] rounded-full pointer-events-none" />
        <div className="text-center flex flex-col gap-3 sm:gap-4 relative z-10 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{dict.portfolio.title}</h2>
          <p className="text-base sm:text-xl text-neutral-400">{dict.portfolio.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative z-10 items-stretch">
          <BentoCard
            href={`/${locale}/portfolio/cupertino-roast`}
            title={dict.portfolio.items['cupertino-roast'].title}
            description={dict.portfolio.items['cupertino-roast'].desc}
            visual={CupertinoVisual}
            visualAlt="Cupertino Roast — Premium artisan coffee house digital storefront with interactive menu"
            delay={0.1}
          />
          <BentoCard
            href={`/${locale}/portfolio/shift-drive`}
            title={dict.portfolio.items['shift-drive'].title}
            description={dict.portfolio.items['shift-drive'].desc}
            visual={ShiftDriveVisual}
            visualAlt="Shift & Drive STO — Automotive service portal with real-time mechanic slot booking interface"
            delay={0.2}
          />
          <BentoCard
            href={`/${locale}/portfolio/umami-bistro`}
            title={dict.portfolio.items['umami-bistro'].title}
            description={dict.portfolio.items['umami-bistro'].desc}
            visual={UmamiVisual}
            visualAlt="Umami Bistro — Restaurant website with interactive SVG live table reservation engine"
            delay={0.3}
          />
          <BentoCard
            href={`/${locale}/portfolio/aura-wellness`}
            title={dict.portfolio.items['aura-wellness'].title}
            description={dict.portfolio.items['aura-wellness'].desc}
            visual={AuraVisual}
            visualAlt="Aura Wellness — Glassmorphic booking platform for luxury beauty salon with step-by-step onboarding"
            delay={0.4}
          />
        </div>
      </section>

      {/* Pricing */}
      <PricingSection dict={dict.pricing} />

      {/* Warning Section: Losing Clients */}
      <section className="flex flex-col md:flex-row items-center gap-8 md:gap-16 p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[3rem] bg-red-950/10 border border-red-900/20 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="flex flex-col gap-4 md:flex-1 relative z-10">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-red-400 uppercase">
            {dict.leak.subtitle}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            {dict.leak.title}
          </h2>
          <p className="text-base text-neutral-400 leading-relaxed font-light">
            {dict.leak.text}
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <FAQSection dict={dict.faq} />

      {/* Contact */}
      <ContactForm dict={dict.contact_form} />
    </div>
  );
}
