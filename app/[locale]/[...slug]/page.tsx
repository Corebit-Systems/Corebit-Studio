// File: c:\dev\Corebit-Studio\app\[locale]\[...slug]\page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, Locale } from '@/i18n/getDictionary';
import { getServiceSearchCopy } from '@/i18n/serviceSearchContent';
import { socialMetadata } from '@/i18n/socialMetadata';
import { searchAlternates, searchOrganizationId, searchSiteUrl as SITE_URL } from '@/i18n/searchUrls';
import { SpeedCheckWidget } from '@/components/LazyWidgets';
import RoiCalculator, { type RoiCalculatorDict } from '@/components/RoiCalculator';
import type { SpeedCheckDict } from '@/components/SpeedCheckWidget';
import PortfolioShowcase, { type PortfolioShowcaseDict } from '@/components/PortfolioShowcase';
import AutomationModules, { type AutomationDict } from '@/components/AutomationModules';
import PricingSection, { type PricingDict } from '@/components/PricingSection';
import ContactForm from '@/components/ContactForm';
import HeroSection, { type HeroDict } from '@/components/HeroSection';
import FAQSection from '@/components/FAQSection';
import ReviewsAccordion from '@/components/ReviewsAccordion';
import BeforeAfterSlider, { type BeforeAfterDict } from '@/components/BeforeAfterSlider';
import ScrollAnimate from '@/components/ScrollAnimate';
import { projectWorkflowAnchor, type ProjectReferenceId } from '@/components/projectReference';
import TechEcosystem from '@/components/TechEcosystem';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import slugMapData from '@/i18n/slug-map.json';

// Heavy client-only widgets deferred to avoid blocking the RSC shell


export const dynamicParams = false;

// ── Slug-map helpers ────────────────────────────────────────────────────────
type SlugEntry = { id: string; slugs: Record<string, string> };
const slugMap: SlugEntry[] = slugMapData as SlugEntry[];

/**
 * Given the incoming locale + slug string, resolve the canonical entry id and
 * the full alternates map {bcp47Tag: absoluteURL}.
 */
function resolveSlugEntry(
  locale: string,
  slugStr: string,
): { entry: SlugEntry; alternates: Record<string, string> } | null {
  const entry = slugMap.find((e) => e.slugs[locale] === slugStr);
  if (!entry) return null;

  const alternates = searchAlternates(language => {
    const slug = entry.slugs[language];
    return slug ? `/${language}/${slug}` : undefined;
  });
  return { entry, alternates };
}

const locations = [
  'montenegro', 'serbia', 'albania', 'north_macedonia', 'bosnia_herzegovina', 'kosovo', 'greece', 'croatia', 'slovenia',
  'budva', 'tivat', 'podgorica', 'bar', 'kotor', 'herceg_novi', 'belgrade', 'novi_sad', 'nis', 'tirana', 'durres',
  'saranda', 'skopye', 'ohrid', 'sarajevo', 'mostar', 'trebinje', 'pristina', 'athens', 'thessaloniki', 'chalcidice',
  'zagreb', 'split', 'dubrovnik', 'ljubljana', 'maribor'
];
const services = ['rent-a-car', 'sto', 'restoran', 'salon', 'nekretnine', 'hoteli', 'charter', 'klinike', 'ciscenje', 'transferi'];
const locales = ['en', 'ru', 'cnr', 'srb', 'sq'];



const serviceNames: Record<string, Record<string, string>> = {
  en: {
    "rent-a-car": "for car rental",
    "sto": "for auto service (STO)",
    "restoran": "for restaurant and cafe",
    "salon": "for beauty salon",
    "nekretnine": "for real estate agency",
    "hoteli": "for hotel and villa",
    "charter": "for yacht charter",
    "klinike": "for medical clinic",
    "ciscenje": "for cleaning services",
    "transferi": "for airport transfer"
  },
  ru: {
    "rent-a-car": "для аренды авто",
    "sto": "для автосервиса (СТО)",
    "restoran": "для ресторана и кафе",
    "salon": "для салона красоты",
    "nekretnine": "для агентства недвижимости",
    "hoteli": "для отеля и виллы",
    "charter": "для аренды яхт",
    "klinike": "для клиники и стоматологии",
    "ciscenje": "для клининговой службы",
    "transferi": "для трансфера и такси"
  },
  cnr: {
    "rent-a-car": "za rent a car",
    "sto": "za auto servis (STO)",
    "restoran": "za restoran i kafić",
    "salon": "za salon ljepote",
    "nekretnine": "za agenciju za nekretnine",
    "hoteli": "za hotel i vilu",
    "charter": "za iznajmljivanje jahti",
    "klinike": "za medicinsku kliniku",
    "ciscenje": "za usluge čišćenja",
    "transferi": "za transfere i taksi"
  },
  srb: {
    "rent-a-car": "za rent a car",
    "sto": "za auto servis (STO)",
    "restoran": "za restoran i kafić",
    "salon": "za salon lepote",
    "nekretnine": "za agenciju za nekretnine",
    "hoteli": "za hotel i vilu",
    "charter": "za iznajmljivanje jahti",
    "klinike": "za medicinsku kliniku",
    "ciscenje": "za usluge čišćenja",
    "transferi": "za transfere i taksi"
  },
  sq: {
    "rent-a-car": "për makina me qira",
    "sto": "për auto-servis",
    "restoran": "për restorant dhe kafene",
    "salon": "për sallon bukurie",
    "nekretnine": "për agjenci imobiliare",
    "hoteli": "për hotel dhe vilë",
    "charter": "për rent a jaht",
    "klinike": "për klinikë mjekësore",
    "ciscenje": "për shërbime pastrimi",
    "transferi": "për transferta dhe taksi"
  }
};

const serviceReplacements: Record<string, Record<string, string>> = {
  en: {
    phrase: "restaurants, auto services, and car rentals",
    "rent-a-car": "car rentals",
    "sto": "auto services",
    "restoran": "restaurants",
    "salon": "beauty salons",
    "nekretnine": "real estate agencies",
    "hoteli": "hotels and villas",
    "charter": "yacht charters",
    "klinike": "medical clinics",
    "ciscenje": "cleaning services",
    "transferi": "airport transfers"
  },
  ru: {
    phrase: "ресторанов, автосервисов и аренды авто",
    "rent-a-car": "аренды авто",
    "sto": "автосервисов",
    "restoran": "ресторанов",
    "salon": "салонов красоты",
    "nekretnine": "агентств недвижимости",
    "hoteli": "отелей и вилл",
    "charter": "аренды яхт",
    "klinike": "медицинских клиник",
    "ciscenje": "клининговых услуг",
    "transferi": "трансферов и такси"
  },
  cnr: {
    phrase: "restorane, auto servise i rent a car",
    "rent-a-car": "rent a car",
    "sto": "auto servise",
    "restoran": "restorane",
    "salon": "salone ljepote",
    "nekretnine": "agencije za nekretnine",
    "hoteli": "hotele i vile",
    "charter": "iznajmljivanje jahti",
    "klinike": "medicinske klinike",
    "ciscenje": "usluge čišćenja",
    "transferi": "transfere i taksi"
  },
  srb: {
    phrase: "restorane, auto servise i rent a car",
    "rent-a-car": "rent a car",
    "sto": "auto servise",
    "restoran": "restorane",
    "salon": "salone lepote",
    "nekretnine": "agencije za nekretnine",
    "hoteli": "hotele i vile",
    "charter": "iznajmljivanje jahti",
    "klinike": "medicinske klinike",
    "ciscenje": "usluge čišćenja",
    "transferi": "transfere i taksi"
  },
  sq: {
    phrase: "restorante, auto-servise dhe makina me qira",
    "rent-a-car": "makina me qira",
    "sto": "auto-servise",
    "restoran": "restorante",
    "salon": "sallone bukurie",
    "nekretnine": "agjenci imobiliare",
    "hoteli": "hotele dhe vila",
    "charter": "rent a jaht",
    "klinike": "klinika mjekësore",
    "ciscenje": "shërbime pastrimi",
    "transferi": "transferta dhe taksi"
  }
};

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string[] }> = [];

  for (const entry of slugMap) {
    for (const [locale, slug] of Object.entries(entry.slugs)) {
      if (locales.includes(locale) && slug) {
        params.push({ locale, slug: [slug] });
      }
    }
  }

  return params;
}


export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const slugStr = slug[0];

  // ── Resolve cross-locale alternates from slug-map ─────────────────────
  const resolved = resolveSlugEntry(locale, slugStr);

  // Fallback: parse legacy {service}-sajt-{city} pattern for unknown slugs
  let city = '';
  let service = '';

  if (resolved) {
    // Derive city/service from id for title/description templates
    const parts = resolved.entry.id.split('_');
    // id examples: "budva", "budva_restoran", "budva_rent_a_car"
    const serviceKeys = ['rent', 'sto', 'restoran', 'salon', 'nekretnine', 'hoteli', 'charter', 'klinike', 'ciscenje', 'transferi'];
    const svcIdx = parts.findIndex((p) => serviceKeys.includes(p));
    city = svcIdx > 0 ? parts.slice(0, svcIdx).join('_') : parts.join('_');
    service = svcIdx > 0 ? parts.slice(svcIdx).join('_').replace('rent_a_car', 'rent-a-car') : '';
  } else if (slugStr.includes('-sajt-')) {
    const parts = slugStr.split('-sajt-');
    if (parts.length !== 2) notFound();
    service = parts[0];
    city = parts[1];
  } else {
    city = slugStr;
  }

  const isValidCity = locations.includes(city.toLowerCase());
  const isValidService = !service || services.includes(service.toLowerCase());

  if (!isValidCity || !isValidService || slug.length > 1) {
    notFound();
  }

  const rawDict = await getDictionary(locale);
  const geoDict = (rawDict as any).geo || {};
  const activeGeo = geoDict[city.toLowerCase()] || { name: city, where: city };
  const where = activeGeo.where;

  const canonical = `${SITE_URL}/${locale}/${slugStr}`;
  const serviceCopy = getServiceSearchCopy(locale, resolved?.entry.id);
  const serviceName = serviceNames[locale][service.toLowerCase()] ?? service;
  const subject = serviceName ? `${serviceName} ${where}` : where;
  const titles: Record<Locale, string> = {
    en: `Web Design ${subject}`,
    ru: `Разработка сайтов ${subject}`,
    cnr: `Izrada sajtova ${subject}`,
    srb: `Izrada sajtova ${subject}`,
    sq: `Zhvillim faqesh interneti ${subject}`,
  };
  const serviceDescriptions: Record<Locale, string> = {
    en: `Website design and development ${subject}. Explore our projects and see what each package includes.`,
    ru: `Разработка сайтов под ключ ${subject}. Посмотрите примеры проектов, цены и состав тарифов.`,
    cnr: `Dizajn i izrada sajtova ${subject}. Pogledajte primjere projekata, cijene i sadržaj paketa.`,
    srb: `Dizajn i izrada sajtova ${subject}. Pogledajte primere projekata, cene i sadržaj paketa.`,
    sq: `Dizajnim dhe zhvillim faqesh interneti ${subject}. Shikoni shembuj projektesh, çmimet dhe çfarë përfshijnë paketat.`,
  };
  const locationDescriptions: Record<Locale, string> = {
    en: `Websites and online booking ${where} for restaurants, auto repair shops, salons and car rental companies. View projects and prices.`,
    ru: `Сайты с онлайн-бронированием ${where} для ресторанов, автосервисов, салонов и проката авто. Посмотрите проекты и цены.`,
    cnr: `Sajtovi i online rezervacije ${where} za restorane, auto servise, salone i rent-a-car agencije. Pogledajte projekte i cijene.`,
    srb: `Sajtovi i online rezervacije ${where} za restorane, auto servise, salone i rent-a-car agencije. Pogledajte projekte i cene.`,
    sq: `Faqe interneti dhe rezervime online ${where} për restorante, autoservise, sallone dhe agjenci makinash me qira. Shikoni projektet dhe çmimet.`,
  };
  const title = `${serviceCopy?.title ?? titles[locale]} | Corebit Studio`;
  const description = serviceCopy?.description ?? (service ? serviceDescriptions[locale] : locationDescriptions[locale]);

  return {
    title,
    description,
    alternates: { canonical, languages: resolved?.alternates },
    ...socialMetadata(locale, canonical, title, description),
  };
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
  contact_form: any;
  faq: any;
  leak: { title: string; subtitle: string; text: string };
  roi: RoiCalculatorDict;
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

export default async function CatchAllSEOPage({
  params
}: {
  params: Promise<{ locale: Locale; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const rawDict = await getDictionary(locale);
  
  const slugStr = slug[0];
  let city = '';
  let service = '';

  const resolved = resolveSlugEntry(locale, slugStr);
  const serviceCopy = getServiceSearchCopy(locale, resolved?.entry.id);
  if (resolved) {
    const parts = resolved.entry.id.split('_');
    const serviceKeys = ['rent', 'sto', 'restoran', 'salon', 'nekretnine', 'hoteli', 'charter', 'klinike', 'ciscenje', 'transferi'];
    const svcIdx = parts.findIndex((p) => serviceKeys.includes(p));
    city = svcIdx > 0 ? parts.slice(0, svcIdx).join('_') : parts.join('_');
    service = svcIdx > 0 ? parts.slice(svcIdx).join('_').replace('rent_a_car', 'rent-a-car') : '';
  } else {
    // Fallback for legacy format
    if (slugStr.includes('-sajt-')) {
      const parts = slugStr.split('-sajt-');
      if (parts.length !== 2) {
        notFound();
      }
      service = parts[0];
      city = parts[1];
    } else {
      city = slugStr;
    }
  }

  const isValidCity = locations.includes(city.toLowerCase());
  const isValidService = !service || services.includes(service.toLowerCase());

  if (!isValidCity || !isValidService || slug.length > 1) {
    notFound();
  }

  // Dynamic geo-localization mapping for Balkan region & other locales fallback
  const defaults: Record<string, { name: string; where: string; destination: string }> = {
    en: { name: 'Montenegro', where: 'in Montenegro', destination: 'to Montenegro' },
    ru: { name: 'Черногория', where: 'в Черногории', destination: 'в Черногорию' },
    cnr: { name: 'Crna Gora', where: 'u Crnoj Gori', destination: 'u Crnu Goru' },
    srb: { name: 'Srbija', where: 'u Srbiji', destination: 'u Srbiju' },
    sq: { name: 'Mali i Zi', where: 'në Mal të Zi', destination: 'në Mal të Zi' }
  };

  const geoDict = (rawDict as any).geo || {};
  const cityKey = city.toLowerCase();

  const defaultGeo = defaults[locale] || defaults.en;
  const activeGeo = geoDict[cityKey] || {
    name: defaultGeo.name,
    where: defaultGeo.where,
    destination: defaultGeo.destination
  };

  // Service-specific phrase replacement
  const sMap = serviceReplacements[locale] || serviceReplacements.en;
  const targetPhrase = sMap.phrase;
  const replacementPhrase = sMap[service.toLowerCase()] || service;

  // Helper function to recursively interpolate string values in the dictionary
  const interpolate = (obj: any, path: string = ''): any => {
    try {
      if (typeof obj === 'string') {
        let val = obj
          .replace(/{(?:geo\.)?where}/g, activeGeo.where)
          .replace(/{(?:geo\.)?destination}/g, activeGeo.destination)
          .replace(/{(?:geo\.)?name}/g, activeGeo.name);

        if (service && val.includes(targetPhrase)) {
          val = val.replace(targetPhrase, replacementPhrase);
        }
        return val;
      }
      if (Array.isArray(obj)) {
        return obj.map((item, idx) => interpolate(item, `${path}[${idx}]`));
      }
      if (obj !== null && typeof obj === 'object') {
        const newObj: any = {};
        for (const key in obj) {
          newObj[key] = interpolate(obj[key], path ? `${path}.${key}` : key);
        }
        return newObj;
      }
      return obj;
    } catch (err) {
      console.error(`Error interpolating path "${path}":`, err);
      throw err;
    }
  };

  const dict = interpolate(rawDict) as unknown as PageDict;
  const projectByService: Partial<Record<string, ProjectReferenceId>> = {
    restoran: 'umami-bistro',
    sto: 'shift-drive',
    salon: 'aura-wellness',
  };
  const projectSlug = service ? projectByService[service.toLowerCase()] : 'umami-bistro';
  const featured = projectSlug
    ? { ...dict.portfolio.items[projectSlug], href: `/${locale}/portfolio/${projectSlug}` }
    : service === 'rent-a-car'
      ? { ...dict.automation.booking, href: '#modules', label: dict.automation.title, cta: dict.hero.module_cta }
      : undefined;
  const hero = serviceCopy
    ? { ...dict.hero, title: serviceCopy.title, subtitle: serviceCopy.description }
    : service
    ? { ...dict.hero, title: dict.hero.industry_title.replace('{industry}', replacementPhrase) }
    : dict.hero;

  const cityServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceCopy || service ? hero.title : dict.automation.seo_tagline || dict.automation.title,
    description: hero.subtitle,
    url: `${SITE_URL}/${locale}/${slugStr}`,
    provider: { '@id': searchOrganizationId },
    areaServed: geoDict[cityKey]?.name || city.replaceAll('_', ' '),
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 flex flex-col gap-24 md:gap-32">
      {/* Localized service and its area of operation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityServiceSchema).replace(/</g, '\\u003c') }}
      />

      <HeroSection dict={hero} starterPrice={dict.pricing.tier1.price} featured={featured} />
      {serviceCopy && (
        <section aria-labelledby="service-answer-title" className="mx-auto w-full max-w-4xl border-y border-white/10 py-6 sm:py-8">
          <h2 id="service-answer-title" className="text-2xl font-semibold tracking-tight">{serviceCopy.question}</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-300">{serviceCopy.answer}</p>
          {service && projectSlug && featured && (
            <a href={`${featured.href}#${projectWorkflowAnchor}`} className="mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-emerald-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400">
              {featured.title}<ArrowRight aria-hidden="true" size={15} />
            </a>
          )}
          <h3 id="service-quote-title" className="mt-6 text-lg font-semibold tracking-tight">{serviceCopy.briefTitle}</h3>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-neutral-300">{serviceCopy.brief}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-6">
            <a href="#contact" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400">
              {dict.hero.cta}<ArrowRight aria-hidden="true" size={15} />
            </a>
            <a href="#pricing" className="inline-flex min-h-11 items-center text-sm font-medium text-neutral-300 underline-offset-4 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400">
              {dict.pricing.title}
            </a>
          </div>
        </section>
      )}
      <ScrollAnimate>
        <BeforeAfterSlider dict={dict.before_after} />
      </ScrollAnimate>
      
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

      <ScrollAnimate>
        <AutomationModules dict={dict.automation} locale={locale} />
      </ScrollAnimate>

      <PortfolioShowcase dict={dict.portfolio} locale={locale} linkLabel={dict.hero.case_cta} />

      <SpeedCheckWidget dict={dict.speed_check} />
      <RoiCalculator dict={dict.roi} />
      <PricingSection dict={dict.pricing} locale={locale} />

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

      <TechEcosystem dict={dict.ecosystem} />
      <ReviewsAccordion dict={(dict as any).reviews} />
      <FAQSection dict={dict.faq} />
      <ContactForm dict={dict.contact_form} locale={locale} />
    </div>
  );
}
