import type { Metadata } from 'next';
import { getDictionary, Locale } from '@/i18n/getDictionary';
import { getServiceSearchLinks } from '@/i18n/serviceSearchContent';
import { socialMetadata } from '@/i18n/socialMetadata';
import { searchAlternates, searchSiteUrl as SITE_URL } from '@/i18n/searchUrls';
import Link from 'next/link';
import { RoiCalculator, SpeedCheckWidget } from '@/components/LazyWidgets';
import type { ContactFormDict } from '@/components/ContactForm';
import type { BeforeAfterDict } from '@/components/BeforeAfterSlider';
import type { PricingDict } from '@/components/PricingSection';
import type { SpeedCheckDict } from '@/components/SpeedCheckWidget';
import { isProjectReference, projectReferenceQuery } from '@/components/projectReference';
import { describePricingSelection, readPricingSelection, type PricingSearchParams } from '@/components/pricingInquiry';
import dynamic from 'next/dynamic';

// Above-the-fold components: statically imported for critical path/LCP optimization
import HeroSection, { type HeroDict } from '@/components/HeroSection';
import PortfolioShowcase, { type PortfolioShowcaseDict } from '@/components/PortfolioShowcase';
import AutomationModules, { type AutomationDict } from '@/components/AutomationModules';
import ScrollAnimate from '@/components/ScrollAnimate';

// Below-the-fold components: dynamically loaded to split JS bundle and reduce TBT
const BeforeAfterSlider = dynamic(() => import('@/components/BeforeAfterSlider'));
const PricingSection = dynamic(() => import('@/components/PricingSection'));
const ContactForm = dynamic(() => import('@/components/ContactForm'));
const FAQSection = dynamic(() => import('@/components/FAQSection'));
const ReviewsAccordion = dynamic(() => import('@/components/ReviewsAccordion'));
const TechEcosystem = dynamic(() => import('@/components/TechEcosystem'));
const LeadMagnet = dynamic(() => import('@/components/LeadMagnet'));
const DevelopmentProcess = dynamic(() => import('@/components/DevelopmentProcess'));
const TechStackWidget = dynamic(() => import('@/components/TechStackWidget'));

// Non-SEO-critical interactive calculators: loaded without SSR to optimize initial HTML payload

import { ArrowRight, CheckCircle2 } from 'lucide-react';


// ── Per-locale page-level metadata (decoupled from layout inheritance chain) ──
const HOME_META: Record<string, { title: string; description: string }> = {
  en:  { title: 'Web Development & Online Booking in Montenegro | Corebit Studio', description: 'Web development studio in Tivat, Montenegro. Websites and online booking for restaurants, auto repair shops and car rental companies. Websites from €360.' },
  ru:  { title: 'Разработка сайтов в Черногории | Corebit Studio', description: 'Веб-студия в Тивате. Создаём сайты с онлайн-бронированием и записью для ресторанов, автосервисов и прокатов авто в Черногории. Базовый сайт от €360.' },
  cnr: { title: 'Izrada sajtova i onlajn rezervacije u Crnoj Gori | Corebit Studio', description: 'Veb studio u Tivtu. Izrađujemo sajtove sa onlajn rezervacijama za restorane, auto-servise i rent-a-car agencije u Crnoj Gori. Osnovni sajt od 360 €.' },
  srb: { title: 'Izrada sajtova i onlajn zakazivanje za firme | Corebit Studio', description: 'Izrađujemo sajtove sa onlajn zakazivanjem za restorane, auto-servise i salone lepote u Srbiji. Pogledajte primere projekata i pakete od 360 €.' },
  sq:  { title: 'Zhvillim faqesh dhe rezervime online në Mal të Zi | Corebit Studio', description: 'Studio uebi në Tivat. Ndërtojmë faqe me rezervime online për restorante, autoservise dhe biznese të makinave me qira në Mal të Zi. Faqe nga 360 €.' },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta     = HOME_META[locale] ?? HOME_META.en;
  const pageUrl  = `${SITE_URL}/${locale}`;

  return {
    title:       meta.title,
    description: meta.description,
    alternates: {
      canonical: pageUrl,
      languages: searchAlternates(language => `/${language}`),
    },
    ...socialMetadata(locale, pageUrl, meta.title, meta.description),
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


interface PageDict {
  hero: HeroDict;
  about: {
    title: string;
    desc: string;
    badges: string[];
  };
  automation: AutomationDict;
  portfolio: PortfolioShowcaseDict;
  pricing: PricingDict;
  contact_form: ContactFormDict;
  faq: FAQDict;
  leak: { title: string; subtitle: string; text: string };
  roi: {
    title: string;
    slider1_label: string;
    slider2_label: string;
    result_desc: string;
    cta_btn: string;
  };
  before_after: BeforeAfterDict;
  speed_check: SpeedCheckDict;
  ecosystem: {
    title: string;
    subtitle: string;
    core_label: string;
    ready_label: string;
    modules: {
      pms: { title: string; desc: string };
      pay: { title: string; desc: string };
      notify: { title: string; desc: string };
      seo: { title: string; desc: string };
    };
  };
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

export default async function HomePage({
  params,
  searchParams
}: {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<PricingSearchParams & { city?: string | string[]; [projectReferenceQuery]?: string | string[] }>;
}) {
  const { locale } = await params;
  const rawDict = await getDictionary(locale);

  // Dynamic geo-localization mapping for Balkan region & other locales fallback
  const defaults: Record<string, { name: string; where: string; destination: string }> = {
    en: { name: 'Montenegro', where: 'in Montenegro', destination: 'to Montenegro' },
    ru: { name: 'Черногория', where: 'в Черногории', destination: 'в Черногорию' },
    cnr: { name: 'Crna Gora', where: 'u Crnoj Gori', destination: 'u Crnu Goru' },
    srb: { name: 'Crna Gora', where: 'u Crnoj Gori', destination: 'u Crnu Goru' },
    sq: { name: 'Mali i Zi', where: 'në Mal të Zi', destination: 'në Mal të Zi' }
  };

  const geoDict = (rawDict as any).geo || {};
  const query = await searchParams;
  const { city, [projectReferenceQuery]: example } = query ?? {};
  const pricingSelection = readPricingSelection(query);
  const cityKey = (typeof city === 'string' ? city : 'montenegro').toLowerCase();

  const defaultGeo = defaults[locale] || defaults.en;
  const activeGeo = geoDict[cityKey] || {
    name: defaultGeo.name,
    where: defaultGeo.where,
    destination: defaultGeo.destination
  };

  // Helper function to recursively interpolate string values in the dictionary
  const interpolate = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/{(?:geo\.)?where}/g, activeGeo.where)
        .replace(/{(?:geo\.)?destination}/g, activeGeo.destination)
        .replace(/{(?:geo\.)?name}/g, activeGeo.name);
    }
    if (Array.isArray(obj)) {
      return obj.map(interpolate);
    }
    if (obj !== null && typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        newObj[key] = interpolate(obj[key]);
      }
      return newObj;
    }
    return obj;
  };

  const dict = interpolate(rawDict) as unknown as PageDict;
  const services = getServiceSearchLinks(locale);

  // Schema moved to layout.tsx for global SSR AEO extraction

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 flex flex-col gap-24 md:gap-32">

      {/* 1. Animated Hero Section */}
      <HeroSection
        dict={dict.hero}
        starterPrice={dict.pricing.tier1.price}
        featured={{ ...dict.portfolio.items['umami-bistro'], href: `/${locale}/portfolio/umami-bistro` }}
      />

      {/* 2. Before / After visual slider comparison */}
      <ScrollAnimate>
        <BeforeAfterSlider dict={dict.before_after} />
      </ScrollAnimate>

      {/* 3. About / Архитектура высокой конверсии */}
      <ScrollAnimate>
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
      </ScrollAnimate>

      {/* 4. Modules / Собственные модули */}
      <ScrollAnimate>
        <AutomationModules dict={dict.automation} locale={locale} />
      </ScrollAnimate>

      <section aria-labelledby="local-services-title" className="border-y border-white/10 py-6 sm:py-8">
        <h2 id="local-services-title" className="text-xl font-semibold tracking-tight sm:text-2xl">{services.title}</h2>
        <ul className="mt-3 flex flex-wrap gap-x-6">
          {services.links.map(({ href, title }) => (
            <li key={href}>
              <Link href={href} prefetch={false} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-emerald-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400">
                {title}<ArrowRight aria-hidden="true" size={15} className="shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Portfolio / Впечатляющие цифровые активы */}
      <PortfolioShowcase dict={dict.portfolio} locale={locale} linkLabel={dict.hero.case_cta} />

      {/* 6. Diagnostics, Warning Section, Calculator & Lead Magnet */}
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

      {/* PageSpeed Insights */}
      <SpeedCheckWidget dict={dict.speed_check} />

      {/* Interactive Profit Leakage Calculator */}
      <RoiCalculator dict={dict.roi} />

      {/* Checklist Lead Magnet */}
      <LeadMagnet locale={locale} />

      {/* 7. Interactive Business IT Ecosystem Diagram */}
      <TechEcosystem dict={dict.ecosystem} />

      {/* 8. Transparent Development Process Timeline */}
      <ScrollAnimate>
        <DevelopmentProcess locale={locale} />
      </ScrollAnimate>

      {/* 9. Client Reviews Accordion & Feedback Form + FAQ */}
      <ReviewsAccordion dict={(dict as any).reviews} />

      <FAQSection dict={dict.faq} />

      {/* 10. Pricing & TechStackWidget */}
      <PricingSection dict={dict.pricing} locale={locale} initialPayment={pricingSelection?.payment} />

      <TechStackWidget locale={locale} />

      {/* 11. Final Contact Lead Form */}
      <ContactForm
        dict={dict.contact_form}
        locale={locale}
        example={isProjectReference(example) ? example : undefined}
        initialPricing={pricingSelection && describePricingSelection(pricingSelection, dict.pricing)}
      />
    </div>
  );
}
