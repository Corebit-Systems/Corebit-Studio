import os
import json

BASE_DIR = r"C:\dev\Studio"

# ==========================================
# 1. ОБНОВЛЕННЫЕ СЛОВАРИ (5 ЯЗЫКОВ)
# ==========================================
DICTIONARIES = {
    "en": {
        "nav": {"services": "Modules", "portfolio": "Assets", "pricing": "Pricing", "contact": "Contact"},
        "hero": {
            "badge": "Engineering High-Performance Assets",
            "title": "Corebit Studio",
            "subtitle": "We architect proprietary business automation modules and ultra-fast web platforms that convert visitors into loyal clients.",
            "cta": "Initiate Project"
        },
        "about": {
            "title": "Psychological Bait meets Engineering",
            "desc": "A client visits your site and instantly desires your service. We achieve this by combining Apple-grade glassmorphism with Next.js Edge networks, delivering sub-100ms load times and seamless user onboarding."
        },
        "automation": {
            "title": "Proprietary Automation Modules",
            "subtitle": "Turn your website into a 24/7 autonomous sales and booking engine.",
            "tables": {"title": "Smart Table Reservations", "desc": "Live interactive layouts and real-time booking engines for premium restaurants and cafes."},
            "booking": {"title": "Dynamic Time-Slot Booking", "desc": "Intelligent scheduling engines for automotive repair centers (STO), detailing hubs, and medical clinics."},
            "schedule": {"title": "Automated Schedulers", "desc": "Seamless appointment flows for beauty salons featuring step-by-step onboarding and SMS/Email webhooks."}
        },
        "portfolio": {
            "title": "Breathtaking Digital Assets",
            "subtitle": "Recent high-converting platforms engineered by Corebit Studio.",
            "p1": {"title": "Cupertino Roast", "desc": "A premium, high-converting digital storefront and interactive menu for an artisan coffee house."},
            "p2": {"title": "Shift & Drive STO", "desc": "A sleek, high-performance automotive service portal with built-in real-time mechanics schedule booking."},
            "p3": {"title": "Umami Bistro", "desc": "A breathtaking restaurant website featuring an advanced, interactive live table reservation engine."},
            "p4": {"title": "Aura Wellness", "desc": "An elegant, glassmorphic booking platform for a luxury beauty salon with smooth step-by-step onboarding."}
        },
        "pricing": {
            "title": "Commercial Directives",
            "subtitle": "Transparent, high-conversion engineering packages.",
            "tier1": {"title": "Entry / Kickstart", "price": "From €400", "desc": "Premium landing pages and business card websites with custom ultra-fast architecture.", "btn": "Start Kickstart"},
            "tier2": {"title": "Growth / Business", "price": "From €1,200", "desc": "Fully interactive commercial platforms featuring custom booking systems and automation workflows.", "btn": "Deploy Platform"},
            "tier3": {"title": "Enterprise Architecture", "price": "From €3,500", "desc": "Deep-dive custom system integrations, extreme performance optimization, and digital system hardening.", "btn": "Build Enterprise"}
        },
        "footer": {"contact_title": "Establish Secure Connection", "rights": "© 2026 Corebit Studio. All rights reserved. Tivat, Montenegro."}
    },
    "ru": {
        "nav": {"services": "Модули", "portfolio": "Проекты", "pricing": "Цены", "contact": "Контакты"},
        "hero": {
            "badge": "Создаем высокопроизводительные активы",
            "title": "Corebit Studio",
            "subtitle": "Мы проектируем проприетарные модули автоматизации бизнеса и сверхбыстрые веб-платформы, превращающие посетителей в лояльных клиентов.",
            "cta": "Начать проект"
        },
        "about": {
            "title": "Психологический крючок и инженерия",
            "desc": "Клиент заходит на ваш сайт и мгновенно хочет купить вашу услугу. Мы достигаем этого, объединяя дизайн в стиле Apple со сверхбыстрыми сетями Next.js Edge, обеспечивая загрузку менее 100 мс."
        },
        "automation": {
            "title": "Собственные модули автоматизации",
            "subtitle": "Превратите ваш сайт в автономную машину продаж 24/7.",
            "tables": {"title": "Умное бронирование столов", "desc": "Интерактивные схемы залов и системы бронирования в реальном времени для премиальных ресторанов."},
            "booking": {"title": "Динамическое бронирование времени", "desc": "Интеллектуальные системы записи для СТО, детейлинг-центров и медицинских клиник."},
            "schedule": {"title": "Автоматизированные расписания", "desc": "Бесшовные системы записи для салонов красоты с пошаговым онбордингом и SMS/Email уведомлениями."}
        },
        "portfolio": {
            "title": "Впечатляющие цифровые активы",
            "subtitle": "Недавние высококонверсионные платформы, разработанные Corebit Studio.",
            "p1": {"title": "Cupertino Roast", "desc": "Премиальная цифровая витрина и интерактивное меню для ремесленной кофейни."},
            "p2": {"title": "Shift & Drive STO", "desc": "Стильный портал автосервиса со встроенной системой записи к механикам в реальном времени."},
            "p3": {"title": "Umami Bistro", "desc": "Потрясающий сайт ресторана с продвинутой системой бронирования столов."},
            "p4": {"title": "Aura Wellness", "desc": "Элегантная платформа для люксового салона красоты с плавной пошаговой записью."}
        },
        "pricing": {
            "title": "Коммерческие пакеты",
            "subtitle": "Прозрачные, высококонверсионные инженерные решения.",
            "tier1": {"title": "Старт / Визитка", "price": "От €400", "desc": "Премиальные лендинги и сайты-визитки с кастомной сверхбыстрой архитектурой.", "btn": "Заказать Старт"},
            "tier2": {"title": "Рост / Бизнес", "price": "От €1,200", "desc": "Полностью интерактивные платформы с системами бронирования и автоматизацией бизнес-процессов.", "btn": "Внедрить Платформу"},
            "tier3": {"title": "Enterprise Архитектура", "price": "От €3,500", "desc": "Глубокие интеграции, экстремальная оптимизация производительности и усиление безопасности.", "btn": "Создать Enterprise"}
        },
        "footer": {"contact_title": "Установить защищенное соединение", "rights": "© 2026 Corebit Studio. Все права защищены. Тиват, Черногория."}
    },
    "cnr": {
        "nav": {"services": "Moduli", "portfolio": "Projekti", "pricing": "Cijene", "contact": "Kontakt"},
        "hero": {
            "badge": "Projektovanje platformi visokih performansi",
            "title": "Corebit Studio",
            "subtitle": "Projektujemo sopstvene module za automatizaciju poslovanja i ultra-brze web platforme koje pretvaraju posjetioce u lojalne klijente.",
            "cta": "Započni projekat"
        },
        "about": {
            "title": "Psihološki mamac i inženjering",
            "desc": "Klijent posjeti vaš sajt i odmah želi vašu uslugu. To postižemo kombinovanjem Apple dizajna sa ultra-brzim Next.js Edge mrežama."
        },
        "automation": {
            "title": "Sopstveni moduli za automatizaciju",
            "subtitle": "Pretvorite vaš sajt u autonomnu mašinu za prodaju 24/7.",
            "tables": {"title": "Pametne rezervacije stolova", "desc": "Interaktivni rasporedi i sistemi za rezervaciju u realnom vremenu za premium restorane."},
            "booking": {"title": "Dinamičko zakazivanje", "desc": "Inteligentni sistemi za zakazivanje za auto servise (STO) i medicinske klinike."},
            "schedule": {"title": "Automatizovani rasporedi", "desc": "Besprekorni sistemi zakazivanja za salone ljepote sa SMS/Email obavještenjima."}
        },
        "portfolio": {
            "title": "Fascinantni digitalni projekti",
            "subtitle": "Nedavne platforme visoke konverzije koje je razvio Corebit Studio.",
            "p1": {"title": "Cupertino Roast", "desc": "Premium digitalni izlog i interaktivni meni za zanatsku kafeteriju."},
            "p2": {"title": "Shift & Drive STO", "desc": "Moderan portal za auto servise sa ugrađenim sistemom zakazivanja u realnom vremenu."},
            "p3": {"title": "Umami Bistro", "desc": "Zapanjujući web sajt restorana sa naprednim sistemom za rezervaciju stolova."},
            "p4": {"title": "Aura Wellness", "desc": "Elegantna platforma za luksuzni salon ljepote sa glatkim procesom zakazivanja."}
        },
        "pricing": {
            "title": "Komercijalni paketi",
            "subtitle": "Transparentna, visoko-konverzna inženjerska rješenja.",
            "tier1": {"title": "Start / Vizitka", "price": "Od €400", "desc": "Premium landing stranice i sajtovi sa prilagođenom ultra-brzom arhitekturom.", "btn": "Započni Start"},
            "tier2": {"title": "Rast / Biznis", "price": "Od €1,200", "desc": "Potpuno interaktivne platforme sa sistemima za zakazivanje i automatizacijom.", "btn": "Implementiraj Platformu"},
            "tier3": {"title": "Enterprise Arhitektura", "price": "Od €3,500", "desc": "Duboke integracije, ekstremna optimizacija performansi i bezbjednost.", "btn": "Izgradi Enterprise"}
        },
        "footer": {"contact_title": "Uspostavite sigurnu vezu", "rights": "© 2026 Corebit Studio. Sva prava zadržana. Tivat, Crna Gora."}
    },
    "srb": {
        "nav": {"services": "Moduli", "portfolio": "Projekti", "pricing": "Cene", "contact": "Kontakt"},
        "hero": {
            "badge": "Projektovanje platformi visokih performansi",
            "title": "Corebit Studio",
            "subtitle": "Projektujemo sopstvene module za automatizaciju poslovanja i ultra-brze web platforme koje pretvaraju posetioce u lojalne klijente.",
            "cta": "Započni projekat"
        },
        "about": {
            "title": "Psihološki mamac i inženjering",
            "desc": "Klijent poseti vaš sajt i odmah želi vašu uslugu. To postižemo kombinovanjem Apple dizajna sa ultra-brzim Next.js Edge mrežama."
        },
        "automation": {
            "title": "Sopstveni moduli za automatizaciju",
            "subtitle": "Pretvorite vaš sajt u autonomnu mašinu za prodaju 24/7.",
            "tables": {"title": "Pametne rezervacije stolova", "desc": "Interaktivni rasporedi i sistemi za rezervaciju u realnom vremenu za premium restorane."},
            "booking": {"title": "Dinamičko zakazivanje", "desc": "Inteligentni sistemi za zakazivanje za auto servise (STO) i medicinske klinike."},
            "schedule": {"title": "Automatizovani rasporedi", "desc": "Besprekorni sistemi zakazivanja za salone lepote sa SMS/Email obaveštenjima."}
        },
        "portfolio": {
            "title": "Fascinantni digitalni projekti",
            "subtitle": "Nedavne platforme visoke konverzije koje je razvio Corebit Studio.",
            "p1": {"title": "Cupertino Roast", "desc": "Premium digitalni izlog i interaktivni meni za zanatsku kafeteriju."},
            "p2": {"title": "Shift & Drive STO", "desc": "Moderan portal za auto servise sa ugrađenim sistemom zakazivanja u realnom vremenu."},
            "p3": {"title": "Umami Bistro", "desc": "Zapanjujući web sajt restorana sa naprednim sistemom za rezervaciju stolova."},
            "p4": {"title": "Aura Wellness", "desc": "Elegantna platforma za luksuzni salon lepote sa glatkim procesom zakazivanja."}
        },
        "pricing": {
            "title": "Komercijalni paketi",
            "subtitle": "Transparentna, visoko-konverzna inženjerska rešenja.",
            "tier1": {"title": "Start / Vizitka", "price": "Od €400", "desc": "Premium landing stranice i sajtovi sa prilagođenom ultra-brzom arhitekturom.", "btn": "Započni Start"},
            "tier2": {"title": "Rast / Biznis", "price": "Od €1,200", "desc": "Potpuno interaktivne platforme sa sistemima za zakazivanje i automatizacijom.", "btn": "Implementiraj Platformu"},
            "tier3": {"title": "Enterprise Arhitektura", "price": "Od €3,500", "desc": "Duboke integracije, ekstremna optimizacija performansi i bezbednost.", "btn": "Izgradi Enterprise"}
        },
        "footer": {"contact_title": "Uspostavite sigurnu vezu", "rights": "© 2026 Corebit Studio. Sva prava zadržana. Tivat, Crna Gora."}
    },
    "sq": {
        "nav": {"services": "Modulet", "portfolio": "Portofoli", "pricing": "Çmimet", "contact": "Kontakti"},
        "hero": {
            "badge": "Inxhinieri e Aseteve me Performancë të Lartë",
            "title": "Corebit Studio",
            "subtitle": "Ne projektojmë module të automatizimit të biznesit dhe platforma uebi ultra të shpejta që kthejnë vizitorët në klientë besnikë.",
            "cta": "Fillo Projektin"
        },
        "about": {
            "title": "Karrem Psikologjik dhe Inxhinieri",
            "desc": "Një klient viziton faqen tuaj dhe menjëherë dëshiron shërbimin tuaj. Ne e arrijmë këtë duke kombinuar dizajnin Apple me rrjetet Next.js Edge."
        },
        "automation": {
            "title": "Module të Automatizimit të Pronësisë",
            "subtitle": "Kthejeni faqen tuaj në një makinë shitjeje autonome 24/7.",
            "tables": {"title": "Rezervime të Zgjuara", "desc": "Sisteme rezervimi në kohë reale për restorante dhe kafene premium."},
            "booking": {"title": "Rezervim Dinamik i Kohës", "desc": "Motorë inteligjentë planifikimi për qendra riparimi auto (STO) dhe klinika mjekësore."},
            "schedule": {"title": "Planifikues të Automatizuar", "desc": "Flukse takimesh pa probleme për sallone bukurie me njoftime SMS/Email."}
        },
        "portfolio": {
            "title": "Asete Dixhitale Lënesh",
            "subtitle": "Platformat e fundit me konvertim të lartë nga Corebit Studio.",
            "p1": {"title": "Cupertino Roast", "desc": "Një vitrinë dixhitale premium dhe menu interaktive për një kafene artizanale."},
            "p2": {"title": "Shift & Drive STO", "desc": "Një portal shërbimi auto me performancë të lartë me rezervim në kohë reale."},
            "p3": {"title": "Umami Bistro", "desc": "Një faqe restoranti mahnitëse me një motor të avancuar rezervimi tavolinash."},
            "p4": {"title": "Aura Wellness", "desc": "Një platformë elegante rezervimi për një sallon bukurie luksoz."}
        },
        "pricing": {
            "title": "Paketat Komerciale",
            "subtitle": "Paketa inxhinierike transparente me konvertim të lartë.",
            "tier1": {"title": "Hyrje / Kickstart", "price": "Nga €400", "desc": "Faqe premium dhe faqe vizitkarta me arkitekturë ultra të shpejtë.", "btn": "Fillo Kickstart"},
            "tier2": {"title": "Rritje / Biznes", "price": "Nga €1,200", "desc": "Platforma tregtare plotësisht interaktive me sisteme rezervimi me porosi.", "btn": "Zbato Platformën"},
            "tier3": {"title": "Arkitektura Enterprise", "price": "Nga €3,500", "desc": "Integrime të thella të sistemit, optimizim ekstrem i performancës dhe siguri.", "btn": "Ndërto Enterprise"}
        },
        "footer": {"contact_title": "Krijo Lidhje të Sigurt", "rights": "© 2026 Corebit Studio. Të gjitha të drejtat e rezervuara. Tivat, Mali i Zi."}
    }
}

# ==========================================
# 2. ОБНОВЛЕННЫЕ КОМПОНЕНТЫ И СТРАНИЦЫ
# ==========================================
FILES = {
    # ---------------------------------
    # МИНИМАЛИСТИЧНЫЙ HEADER (БЕЗ ИКОНКИ "C")
    # ---------------------------------
    "components/Header.tsx": """import Link from 'next/link';
import LangSwitcher from './LangSwitcher';

export default function Header({ dict, locale }: { dict: any, locale: string }) {
  return (
    <header className="fixed top-4 left-4 right-4 md:left-8 md:right-8 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between rounded-2xl bg-[#050506]/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        
        {/* Minimalist Typographic Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-300">
            Corebit Studio
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <a href="#modules" className="hover:text-white transition-colors">{dict.nav.services}</a>
          <a href="#portfolio" className="hover:text-white transition-colors">{dict.nav.portfolio}</a>
          <a href="#pricing" className="hover:text-white transition-colors">{dict.nav.pricing}</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <LangSwitcher currentLocale={locale} />
          <a href="#contact" className="hidden sm:block px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors">
            {dict.hero.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
""",

    # ---------------------------------
    # LAYOUT (С РАСШИРЕННЫМ SEO И КАТАЛОГОМ ЦЕН)
    # ---------------------------------
    "app/[locale]/layout.tsx": """import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getDictionary, Locale } from '@/i18n/getDictionary';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const SITE_URL = 'https://studio.corebitsystems.io';

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
""",

    # ---------------------------------
    # ГЛАВНАЯ СТРАНИЦА (ПОРТФОЛИО, МОДУЛИ, НОВЫЕ ЦЕНЫ)
    # ---------------------------------
    "app/[locale]/page.tsx": """import { getDictionary, Locale } from '@/i18n/getDictionary';
import BentoCard from '@/components/BentoCard';
import { 
  ArrowRight, CheckCircle2, 
  CalendarClock, Utensils, CalendarHeart, 
  Coffee, Car, Sparkles 
} from 'lucide-react';

export default async function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const dict = await getDictionary(locale);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pb-24 flex flex-col gap-40">
      
      {/* 1. HERO SECTION */}
      <section className="flex flex-col items-center text-center gap-8 pt-20 md:pt-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-neutral-300 backdrop-blur-md shadow-2xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {dict.hero.badge}
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 max-w-5xl">
          {dict.hero.title}
        </h1>
        <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl leading-relaxed font-light">
          {dict.hero.subtitle}
        </p>
        <div className="flex items-center gap-6 mt-8">
          <a href="#contact" className="px-8 py-4 rounded-2xl bg-white text-black font-semibold text-lg hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            {dict.hero.cta} <ArrowRight size={20}/>
          </a>
        </div>
      </section>

      {/* 2. PSYCHOLOGICAL BAIT / ABOUT */}
      <section className="flex flex-col md:flex-row items-center gap-16 p-12 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="flex-1 flex flex-col gap-6 relative z-10">
          <h2 className="text-4xl font-bold tracking-tight">{dict.about.title}</h2>
          <p className="text-lg text-neutral-400 leading-relaxed">{dict.about.desc}</p>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 relative z-10 w-full">
          {['Instant Visual Appeal', 'Frictionless Onboarding', 'Sub-100ms Load Times', 'Autonomous Sales Engine'].map((tech, i) => (
             <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-medium">
               <CheckCircle2 size={16} className="text-emerald-500"/> {tech}
             </div>
          ))}
        </div>
      </section>

      {/* 3. AUTOMATION MODULES */}
      <section id="modules" className="flex flex-col gap-12">
        <div className="text-center flex flex-col gap-4">
          <h2 className="text-4xl font-bold tracking-tight">{dict.automation.title}</h2>
          <p className="text-xl text-neutral-400">{dict.automation.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BentoCard title={dict.automation.tables.title} description={dict.automation.tables.desc} icon={<Utensils size={24} />} delay={0.1} />
          <BentoCard title={dict.automation.booking.title} description={dict.automation.booking.desc} icon={<CalendarClock size={24} />} delay={0.2} className="md:col-span-2" />
          <BentoCard title={dict.automation.schedule.title} description={dict.automation.schedule.desc} icon={<CalendarHeart size={24} />} delay={0.3} className="md:col-span-3" />
        </div>
      </section>

      {/* 4. BREATHTAKING PORTFOLIO */}
      <section id="portfolio" className="flex flex-col gap-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[200px] rounded-full pointer-events-none"></div>
        <div className="text-center flex flex-col gap-4 relative z-10">
          <h2 className="text-4xl font-bold tracking-tight">{dict.portfolio.title}</h2>
          <p className="text-xl text-neutral-400">{dict.portfolio.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <BentoCard title={dict.portfolio.p1.title} description={dict.portfolio.p1.desc} icon={<Coffee size={24} />} delay={0.1} />
          <BentoCard title={dict.portfolio.p2.title} description={dict.portfolio.p2.desc} icon={<Car size={24} />} delay={0.2} />
          <BentoCard title={dict.portfolio.p3.title} description={dict.portfolio.p3.desc} icon={<Utensils size={24} />} delay={0.3} />
          <BentoCard title={dict.portfolio.p4.title} description={dict.portfolio.p4.desc} icon={<Sparkles size={24} />} delay={0.4} />
        </div>
      </section>

      {/* 5. PRICING TIERS */}
      <section id="pricing" className="flex flex-col gap-16">
        <div className="text-center flex flex-col gap-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{dict.pricing.title}</h2>
          <p className="text-xl text-neutral-400">{dict.pricing.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tier 1: €400 */}
          <div className="flex flex-col p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl gap-6 hover:bg-white/[0.04] transition-colors">
            <h3 className="text-2xl font-semibold">{dict.pricing.tier1.title}</h3>
            <div className="text-4xl font-bold">{dict.pricing.tier1.price}</div>
            <p className="text-neutral-400 text-sm">{dict.pricing.tier1.desc}</p>
            <a href="#contact" className="w-full py-4 mt-auto rounded-2xl bg-white text-black text-center font-semibold hover:bg-neutral-200 transition-colors">{dict.pricing.tier1.btn}</a>
          </div>

          {/* Tier 2: €1200 */}
          <div className="flex flex-col p-10 rounded-[2.5rem] border border-emerald-500/30 bg-emerald-500/[0.02] backdrop-blur-xl gap-6 relative overflow-hidden transform lg:-translate-y-4 shadow-2xl shadow-emerald-500/10">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0"></div>
            <h3 className="text-2xl font-semibold text-emerald-400">{dict.pricing.tier2.title}</h3>
            <div className="text-4xl font-bold">{dict.pricing.tier2.price}</div>
            <p className="text-neutral-400 text-sm">{dict.pricing.tier2.desc}</p>
            <a href="#contact" className="w-full py-4 mt-auto rounded-2xl bg-emerald-500 text-white text-center font-semibold hover:bg-emerald-600 transition-colors">{dict.pricing.tier2.btn}</a>
          </div>

          {/* Tier 3: €3500 */}
          <div className="flex flex-col p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl gap-6 hover:bg-white/[0.04] transition-colors">
            <h3 className="text-2xl font-semibold">{dict.pricing.tier3.title}</h3>
            <div className="text-4xl font-bold">{dict.pricing.tier3.price}</div>
            <p className="text-neutral-400 text-sm">{dict.pricing.tier3.desc}</p>
            <a href="#contact" className="w-full py-4 mt-auto rounded-2xl border border-white/20 text-white text-center font-semibold hover:bg-white/10 transition-colors">{dict.pricing.tier3.btn}</a>
          </div>
        </div>
      </section>

    </div>
  );
}
"""
}

def generate_update():
    print(f"🚀 Установка обновления Corebit Studio (Цены, Модули, Портфолио) в: {BASE_DIR}")
    
    if not os.path.exists(BASE_DIR):
        print(f"❌ Ошибка: Папка {BASE_DIR} не найдена. Убедитесь, что вы создали проект.")
        return

    # Запись словарей
    for loc, content in DICTIONARIES.items():
        dict_path = os.path.join(BASE_DIR, "i18n", "dictionaries", f"{loc}.json")
        os.makedirs(os.path.dirname(dict_path), exist_ok=True)
        with open(dict_path, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)
        print(f"✅ Обновлен словарь (Тексты/Цены/Портфолио): {loc}.json")

    # Запись файлов компонентов и страниц
    for filepath, content in FILES.items():
        full_path = os.path.join(BASE_DIR, filepath.replace('/', os.sep))
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Обновлен файл кода: {filepath}")

    print("\n🎉 Апгрейд успешно завершен!")
    print("=============================================")
    print("Изменения:")
    print("- Убран логотип 'C', оставлен строгий типографический логотип.")
    print("- Добавлены модули автоматизации (Бронирование, Расписания).")
    print("- Добавлен блок Портфолио (4 проекта).")
    print("- Обновлены цены на €400 / €1200 / €3500.")
    print("- Обновлены JSON-LD схемы для SEO.")
    print("=============================================")
    print("Не забудьте перезапустить сервер: npm run dev")

if __name__ == "__main__":
    generate_update()