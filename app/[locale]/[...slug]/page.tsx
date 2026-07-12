// File: c:\dev\Corebit-Studio\app\[locale]\[...slug]\page.tsx
import { Metadata } from 'next';
import { getDictionary, Locale } from '@/i18n/getDictionary';
import BentoCard from '@/components/BentoCard';
import PricingSection from '@/components/PricingSection';
import ContactForm from '@/components/ContactForm';
import HeroSection from '@/components/HeroSection';
import FAQSection from '@/components/FAQSection';
import RoiCalculator from '@/components/RoiCalculator';
import ReviewsAccordion from '@/components/ReviewsAccordion';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import SpeedCheckWidget from '@/components/SpeedCheckWidget';
import TechEcosystem from '@/components/TechEcosystem';
import { ArrowRight, CheckCircle2, CalendarClock, Utensils, CalendarHeart } from 'lucide-react';

export const dynamicParams = false;

const locations = [
  'montenegro', 'serbia', 'albania', 'north_macedonia', 'bosnia_herzegovina', 'kosovo', 'greece', 'croatia', 'slovenia',
  'budva', 'tivat', 'podgorica', 'bar', 'kotor', 'herceg_novi', 'belgrade', 'novi_sad', 'nis', 'tirana', 'durres',
  'saranda', 'skopye', 'ohrid', 'sarajevo', 'mostar', 'trebinje', 'pristina', 'athens', 'thessaloniki', 'chalcidice',
  'zagreb', 'split', 'dubrovnik', 'ljubljana', 'maribor'
];
const services = ['rent-a-car', 'sto', 'restoran', 'salon'];
const locales = ['en', 'ru', 'cnr', 'srb', 'sq'];

const SITE_URL = 'https://studio.corebitsystems.io';

const serviceNames: Record<string, Record<string, string>> = {
  en: {
    "rent-a-car": "for car rental",
    "sto": "for auto service (STO)",
    "restoran": "for restaurant and cafe",
    "salon": "for beauty salon"
  },
  ru: {
    "rent-a-car": "для аренды авто",
    "sto": "для автосервиса (СТО)",
    "restoran": "для ресторана и кафе",
    "salon": "для салона красоты"
  },
  cnr: {
    "rent-a-car": "za rent a car",
    "sto": "za auto servis (STO)",
    "restoran": "za restoran i kafić",
    "salon": "za salon ljepote"
  },
  srb: {
    "rent-a-car": "za rent a car",
    "sto": "za auto servis (STO)",
    "restoran": "za restoran i kafić",
    "salon": "za salon lepote"
  },
  sq: {
    "rent-a-car": "për makina me qira",
    "sto": "për auto-servis",
    "restoran": "për restorant dhe kafene",
    "salon": "për sallon bukurie"
  }
};

const serviceReplacements: Record<string, Record<string, string>> = {
  en: {
    phrase: "restaurants, auto services, and car rentals",
    "rent-a-car": "car rentals",
    "sto": "auto services",
    "restoran": "restaurants",
    "salon": "beauty salons"
  },
  ru: {
    phrase: "ресторанов, автосервисов и аренды авто",
    "rent-a-car": "аренды авто",
    "sto": "автосервисов",
    "restoran": "ресторанов",
    "salon": "салонов красоты"
  },
  cnr: {
    phrase: "restorane, auto servise i rent a car",
    "rent-a-car": "rent a car",
    "sto": "auto servise",
    "restoran": "restorane",
    "salon": "salone ljepote"
  },
  srb: {
    phrase: "restorane, auto servise i rent a car",
    "rent-a-car": "rent a car",
    "sto": "auto servise",
    "restoran": "restorane",
    "salon": "salone lepote"
  },
  sq: {
    phrase: "restorante, auto-servise dhe makina me qira",
    "rent-a-car": "makina me qira",
    "sto": "auto-servise",
    "restoran": "restorante",
    "salon": "sallone bukurie"
  }
};

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string[] }> = [];

  locales.forEach((locale) => {
    // 1. General city routes
    locations.forEach((city) => {
      params.push({
        locale,
        slug: [city]
      });
    });

    // 2. Niche city routes
    locations.forEach((city) => {
      services.forEach((service) => {
        params.push({
          locale,
          slug: [`${service}-sajt-${city}`]
        });
      });
    });
  });

  return params;
}

export async function generateMetadata({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string[] };
}): Promise<Metadata> {
  const rawDict = await getDictionary(locale as any);
  
  const slugStr = slug[0];
  let city = '';
  let service = '';

  if (slugStr.includes('-sajt-')) {
    const parts = slugStr.split('-sajt-');
    service = parts[0];
    city = parts[1];
  } else {
    city = slugStr;
  }

  const geoDict = (rawDict as any).geo || {};
  const activeGeo = geoDict[city.toLowerCase()] || { name: city, where: city };
  const where = activeGeo.where;

  if (service) {
    const currentServiceNames = serviceNames[locale] || serviceNames.en;
    const serviceName = currentServiceNames[service.toLowerCase()] || service;

    const titles: Record<string, string> = {
      en: `Order website ${serviceName} ${where} under key — Corebit Studio`,
      ru: `Заказать сайт ${serviceName} ${where} под ключ — Corebit Studio`,
      cnr: `Izrada sajta ${serviceName} ${where} ključ u ruke — Corebit Studio`,
      srb: `Izrada sajta ${serviceName} ${where} ključ u ruke — Corebit Studio`,
      sq: `Porosit uebfaqe ${serviceName} ${where} nën çelës — Corebit Studio`
    };

    const descriptions: Record<string, string> = {
      en: `Development of fast websites with online booking ${serviceName} ${where}. Ready business solutions, CRM integration, launch in 7 days. Get price!`,
      ru: `Разработка быстрых сайтов с онлайн-записью ${serviceName} ${where}. Готовые решения для бизнеса, интеграция с CRM, запуск за 7 дней. Узнайте цену!`,
      cnr: `Izrada brzih sajtova sa online rezervacijama ${serviceName} {where}. Gotova rešenja, CRM integracija, pokretanje za 7 dana. Saznajte cenu!`,
      srb: `Izrada brzih sajtova sa online rezervacijama ${serviceName} {where}. Gotova rešenja, CRM integracija, pokretanje za 7 dana. Saznajte cenu!`,
      sq: `Zhvillim i uebfaqeve të shpejta me rezervime online ${serviceName} {where}. Zgjidhje të gatshme, integrim CRM, fillim për 7 ditë. Mëso çmimin!`
    };

    let title = titles[locale] || titles.en;
    let description = descriptions[locale] || descriptions.en;

    title = title.replace('{serviceName}', serviceName).replace('{where}', where);
    description = description.replace('{serviceName}', serviceName).replace('{where}', where);

    const languageAlternates: Record<string, string> = {};
    locales.forEach((l) => {
      languageAlternates[l === 'sq' ? 'sq-AL' : l === 'srb' ? 'sr-RS' : l === 'cnr' ? 'sr-ME' : l] = `${SITE_URL}/${l}/${service}-sajt-${city}`;
    });

    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_URL}/${locale}/${slugStr}`,
        languages: languageAlternates
      }
    };
  } else {
    const titles: Record<string, string> = {
      en: `Corebit Studio | Website development under key ${where}`,
      ru: `Corebit Studio | Создание сайтов под ключ ${where}`,
      cnr: `Corebit Studio | Izrada sajtova ključ u ruke ${where}`,
      srb: `Corebit Studio | Izrada sajtova ključ u ruke ${where}`,
      sq: `Corebit Studio | Zhvillim uebfaqesh nën çelës ${where}`
    };

    const descriptions: Record<string, string> = {
      en: `Professional website development and booking automation systems ${where} for restaurants, auto services, beauty salons, and car rentals. Get price!`,
      ru: `Профессиональная разработка и создание сайтов под ключ ${where} для ресторанов, автосервисов (СТО), салонов красоты и аренды авто. Узнайте цену!`,
      cnr: `Profesionalna izrada sajtova i automatizacija rezervacija {where} za restorane, auto servise, salone i rent a car. Saznajte cenu!`,
      srb: `Profesionalna izrada sajtova i automatizacija rezervacija {where} za restorane, auto servise, salone i rent a car. Saznajte cenu!`,
      sq: `Zhvillim profesional uebfaqesh dhe automatizim rezervimesh {where} për restorante, auto-servise, sallone dhe makina me qira. Mëso çmimin!`
    };

    const title = (titles[locale] || titles.en).replace('{where}', where);
    const description = (descriptions[locale] || descriptions.en).replace('{where}', where);

    const languageAlternates: Record<string, string> = {};
    locales.forEach((l) => {
      languageAlternates[l === 'sq' ? 'sq-AL' : l === 'srb' ? 'sr-RS' : l === 'cnr' ? 'sr-ME' : l] = `${SITE_URL}/${l}/${city}`;
    });

    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_URL}/${locale}/${slugStr}`,
        languages: languageAlternates
      }
    };
  }
}

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
  pricing: any;
  contact_form: any;
  faq: any;
  leak: { title: string; subtitle: string; text: string };
  roi: {
    title: string;
    slider1_label: string;
    slider2_label: string;
    result_desc: string;
    cta_btn: string;
  };
  before_after: {
    title: string;
    subtitle: string;
    before_label: string;
    after_label: string;
    after_badge: string;
    after_title: string;
    after_desc: string;
    after_status: string;
    after_score: string;
    before_badge: string;
    before_title: string;
    before_desc: string;
    before_status: string;
    before_score: string;
    before_site_label: string;
  };
  speed_check: {
    title: string;
    subtitle: string;
    placeholder: string;
    btn_check: string;
    btn_analyzing: string;
    result_text: string;
    cta_btn: string;
    alert_title: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
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
  params: { locale, slug }
}: {
  params: { locale: Locale; slug: string[] };
}) {
  const rawDict = await getDictionary(locale);
  
  const slugStr = slug[0];
  let city = '';
  let service = '';

  if (slugStr.includes('-sajt-')) {
    const parts = slugStr.split('-sajt-');
    service = parts[0];
    city = parts[1];
  } else {
    city = slugStr;
  }

  // Dynamic geo-localization mapping for Balkan region & other locales fallback
  const defaults: Record<string, { name: string; where: string; destination: string }> = {
    en: { name: 'Montenegro', where: 'in Montenegro', destination: 'to Montenegro' },
    ru: { name: 'Черногория', where: 'в Черногории', destination: 'в Черногорию' },
    cnr: { name: 'Crna Gora', where: 'u Crnoj Gori', destination: 'u Crnu Goru' },
    srb: { name: 'Crna Gora', where: 'u Crnoj Gori', destination: 'u Crnu Goru' },
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 flex flex-col gap-24 md:gap-32">
      <HeroSection dict={dict.hero} locale={locale} />
      <BeforeAfterSlider dict={dict.before_after} />
      
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
            visualAlt="Cupertino Roast menu"
            delay={0.1}
          />
          <BentoCard
            href={`/${locale}/portfolio/shift-drive`}
            title={dict.portfolio.items['shift-drive'].title}
            description={dict.portfolio.items['shift-drive'].desc}
            visual={ShiftDriveVisual}
            visualAlt="Shift & Drive STO booking"
            delay={0.2}
          />
          <BentoCard
            href={`/${locale}/portfolio/umami-bistro`}
            title={dict.portfolio.items['umami-bistro'].title}
            description={dict.portfolio.items['umami-bistro'].desc}
            visual={UmamiVisual}
            visualAlt="Umami Bistro reservations"
            delay={0.3}
          />
          <BentoCard
            href={`/${locale}/portfolio/aura-wellness`}
            title={dict.portfolio.items['aura-wellness'].title}
            description={dict.portfolio.items['aura-wellness'].desc}
            visual={AuraVisual}
            visualAlt="Aura Wellness salons"
            delay={0.4}
          />
        </div>
      </section>

      <SpeedCheckWidget dict={dict.speed_check} />
      <RoiCalculator dict={dict.roi} />
      <PricingSection dict={dict.pricing} />

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
