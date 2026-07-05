import os
import json

BASE_DIR = r"C:\dev\Studio"

# ==========================================
# 1. 100% COMPLETE TRANSLATION MATRIX (5 LANGUAGES)
# ==========================================
DICTIONARIES = {
    "en": {
        "nav": {"services": "Modules", "portfolio": "Assets", "pricing": "Pricing", "contact": "Contact"},
        "hero": {"badge": "Engineering High-Performance Assets", "title": "Corebit Studio", "subtitle": "We architect proprietary business automation modules and ultra-fast web platforms that convert visitors into loyal clients.", "cta": "Initiate Project"},
        "about": {
            "title": "High-Conversion Architecture", 
            "desc": "A client visits your site and instantly desires your service. We achieve this by combining Apple-grade glassmorphism with Next.js Edge networks, delivering sub-100ms load times and seamless user onboarding.",
            "badges": ["Sub-100ms Load", "Flawless Mobile UX", "3s Attention Capture", "Absolute Security"]
        },
        "automation": {
            "title": "Proprietary Automation Modules", "subtitle": "Turn your website into a 24/7 autonomous sales and booking engine.",
            "tables": {"title": "Smart Table Reservations", "desc": "Live interactive layouts and real-time booking engines for premium restaurants and cafes."},
            "booking": {"title": "Dynamic Time-Slot Booking", "desc": "Intelligent scheduling engines for automotive repair centers (STO), detailing hubs, and medical clinics."},
            "schedule": {"title": "Automated Schedulers", "desc": "Seamless appointment flows for beauty salons featuring step-by-step onboarding and SMS/Email webhooks."}
        },
        "portfolio": {
            "title": "Breathtaking Digital Assets", "subtitle": "Recent high-converting platforms engineered by Corebit Studio.",
            "items": {
                "cupertino-roast": {"title": "Cupertino Roast", "desc": "A premium, high-converting digital storefront and interactive menu for an artisan coffee house."},
                "shift-drive": {"title": "Shift & Drive STO", "desc": "A sleek, high-performance automotive service portal with built-in real-time mechanics schedule booking."},
                "umami-bistro": {"title": "Umami Bistro", "desc": "A breathtaking restaurant website featuring an advanced, interactive live table reservation engine."},
                "aura-wellness": {"title": "Aura Wellness", "desc": "An elegant, glassmorphic booking platform for a luxury beauty salon with smooth step-by-step onboarding."}
            }
        },
        "portfolio_page": {
            "tech_stack": "Technology Stack",
            "features": "Advanced Features",
            "back": "Back to Home"
        },
        "pricing": {
            "title": "Commercial Directives", "subtitle": "Transparent, high-conversion engineering packages.",
            "toggle_full": "Full Payment (-10%)", "toggle_split": "Milestone (50/50)",
            "tier1": {"title": "Entry / Kickstart", "price": 400, "desc": "Premium landing pages and business card websites with custom ultra-fast architecture.", "btn": "Start Kickstart"},
            "tier2": {"title": "Growth / Business", "price": 1200, "desc": "Fully interactive commercial platforms featuring custom booking systems and automation workflows.", "btn": "Deploy Platform"},
            "tier3": {"title": "Enterprise Architecture", "price": 3500, "desc": "Deep-dive custom system integrations, extreme performance optimization, and digital system hardening.", "btn": "Build Enterprise"}
        },
        "contact_form": {
            "title": "Establish Secure Connection",
            "name": "Full Name", "email": "Corporate Email", "message": "Project Details",
            "send": "Initialize Sequence", "sending": "Encrypting...",
            "success": "Connection Established. We will contact you shortly.",
            "error_rate": "Rate limit exceeded. Please wait 60 seconds.",
            "error_spam": "Security protocol triggered. Invalid payload.",
            "error_general": "Transmission failed. Please try again."
        },
        "footer": {"cta_btn": "Launch Project", "rights": "© 2026 Corebit Studio. All rights reserved. Tivat, Montenegro."}
    },
    "ru": {
        "nav": {"services": "Модули", "portfolio": "Проекты", "pricing": "Цены", "contact": "Контакты"},
        "hero": {"badge": "Создаем высокопроизводительные активы", "title": "Corebit Studio", "subtitle": "Мы проектируем проприетарные модули автоматизации бизнеса и сверхбыстрые веб-платформы, превращающие посетителей в лояльных клиентов.", "cta": "Начать проект"},
        "about": {
            "title": "Архитектура высокой конверсии", 
            "desc": "Клиент заходит на ваш сайт и мгновенно хочет купить вашу услугу. Мы достигаем этого, объединяя дизайн в стиле Apple со сверхбыстрыми сетями Next.js Edge, обеспечивая бесшовный онбординг.",
            "badges": ["Загрузка < 100мс", "Идеально на смартфонах", "Захват внимания за 3с", "Абсолютная безопасность"]
        },
        "automation": {
            "title": "Собственные модули", "subtitle": "Превратите ваш сайт в автономную машину продаж 24/7.",
            "tables": {"title": "Умное бронирование столов", "desc": "Интерактивные схемы залов и системы бронирования в реальном времени для премиальных ресторанов."},
            "booking": {"title": "Динамическое бронирование", "desc": "Интеллектуальные системы записи для СТО, детейлинг-центров и медицинских клиник."},
            "schedule": {"title": "Автоматизированные расписания", "desc": "Бесшовные системы записи для салонов красоты с пошаговым онбордингом и SMS/Email уведомлениями."}
        },
        "portfolio": {
            "title": "Впечатляющие цифровые активы", "subtitle": "Недавние высококонверсионные платформы, разработанные Corebit Studio.",
            "items": {
                "cupertino-roast": {"title": "Cupertino Roast", "desc": "Премиальная цифровая витрина и интерактивное меню для ремесленной кофейни."},
                "shift-drive": {"title": "Shift & Drive STO", "desc": "Стильный портал автосервиса со встроенной системой записи к механикам в реальном времени."},
                "umami-bistro": {"title": "Umami Bistro", "desc": "Потрясающий сайт ресторана с продвинутой системой бронирования столов."},
                "aura-wellness": {"title": "Aura Wellness", "desc": "Элегантная платформа для люксового салона красоты с плавной пошаговой записью."}
            }
        },
        "portfolio_page": {
            "tech_stack": "Технологический Стек",
            "features": "Продвинутые Функции",
            "back": "На главную"
        },
        "pricing": {
            "title": "Коммерческие пакеты", "subtitle": "Прозрачные, высококонверсионные инженерные решения.",
            "toggle_full": "Полная оплата (-10%)", "toggle_split": "Поэтапно (50/50)",
            "tier1": {"title": "Старт / Визитка", "price": 400, "desc": "Премиальные лендинги и сайты-визитки с кастомной сверхбыстрой архитектурой.", "btn": "Заказать Старт"},
            "tier2": {"title": "Рост / Бизнес", "price": 1200, "desc": "Полностью интерактивные платформы с системами бронирования и автоматизацией бизнес-процессов.", "btn": "Внедрить Платформу"},
            "tier3": {"title": "Enterprise Архитектура", "price": 3500, "desc": "Глубокие интеграции, экстремальная оптимизация производительности и усиление безопасности.", "btn": "Создать Enterprise"}
        },
        "contact_form": {
            "title": "Установить защищенное соединение",
            "name": "Ваше Имя", "email": "Корпоративный Email", "message": "Детали проекта",
            "send": "Инициировать передачу", "sending": "Шифрование...",
            "success": "Соединение установлено. Мы скоро свяжемся с вами.",
            "error_rate": "Слишком много запросов. Подождите 60 секунд.",
            "error_spam": "Сработал протокол безопасности. Неверный payload.",
            "error_general": "Ошибка передачи. Попробуйте еще раз."
        },
        "footer": {"cta_btn": "Запустить проект", "rights": "© 2026 Corebit Studio. Все права защищены. Тиват, Черногория."}
    },
    "cnr": {
        "nav": {"services": "Moduli", "portfolio": "Projekti", "pricing": "Cijene", "contact": "Kontakt"},
        "hero": {"badge": "Inženjering platformi visokih performansi", "title": "Corebit Studio", "subtitle": "Projektujemo sopstvene module za automatizaciju i ultra-brze web platforme koje pretvaraju posjetioce u klijente.", "cta": "Započni Projekat"},
        "about": {
            "title": "Arhitektura Visoke Konverzije", 
            "desc": "Klijent posjeti vaš sajt i odmah želi vašu uslugu. To postižemo kombinovanjem Apple dizajna sa ultra-brzim Next.js Edge mrežama.",
            "badges": ["Učitavanje < 100ms", "Besprekoran Mobilni UX", "Zadržavanje pažnje 3s", "Apsolutna Sigurnost"]
        },
        "automation": {
            "title": "Sopstveni Moduli", "subtitle": "Pretvorite vaš sajt u autonomnu mašinu za prodaju 24/7.",
            "tables": {"title": "Pametne Rezervacije Stolova", "desc": "Interaktivni rasporedi i sistemi za rezervaciju u realnom vremenu za premium restorane."},
            "booking": {"title": "Dinamičko Zakazivanje", "desc": "Inteligentni sistemi za zakazivanje za auto servise (STO) i medicinske klinike."},
            "schedule": {"title": "Automatizovani Rasporedi", "desc": "Besprekorni sistemi zakazivanja za salone ljepote sa SMS/Email obavještenjima."}
        },
        "portfolio": {
            "title": "Fascinantni Digitalni Projekti", "subtitle": "Nedavne platforme visoke konverzije koje je razvio Corebit Studio.",
            "items": {
                "cupertino-roast": {"title": "Cupertino Roast", "desc": "Premium digitalni izlog i interaktivni meni za zanatsku kafeteriju."},
                "shift-drive": {"title": "Shift & Drive STO", "desc": "Moderan portal za auto servise sa ugrađenim sistemom zakazivanja u realnom vremenu."},
                "umami-bistro": {"title": "Umami Bistro", "desc": "Zapanjujući web sajt restorana sa naprednim sistemom za rezervaciju stolova."},
                "aura-wellness": {"title": "Aura Wellness", "desc": "Elegantna platforma za luksuzni salon ljepote sa glatkim procesom zakazivanja."}
            }
        },
        "portfolio_page": {
            "tech_stack": "Tehnološki Stek",
            "features": "Napredne Funkcije",
            "back": "Nazad na Početnu"
        },
        "pricing": {
            "title": "Komercijalni Paketi", "subtitle": "Transparentna, visoko-konverzna inženjerska rješenja.",
            "toggle_full": "Puna Uplata (-10%)", "toggle_split": "Plaćanje na rate (50/50)",
            "tier1": {"title": "Start / Vizitka", "price": 400, "desc": "Premium landing stranice i sajtovi sa prilagođenom ultra-brzom arhitekturom.", "btn": "Započni Start"},
            "tier2": {"title": "Rast / Biznis", "price": 1200, "desc": "Potpuno interaktivne platforme sa sistemima za zakazivanje i automatizacijom.", "btn": "Implementiraj Platformu"},
            "tier3": {"title": "Enterprise Arhitektura", "price": 3500, "desc": "Duboke integracije, ekstremna optimizacija performansi i bezbjednost.", "btn": "Izgradi Enterprise"}
        },
        "contact_form": {
            "title": "Uspostavite Sigurnu Vezu",
            "name": "Puno Ime", "email": "Poslovni Email", "message": "Detalji Projekta",
            "send": "Iniciraj Slanje", "sending": "Šifrovanje...",
            "success": "Veza uspostavljena. Uskoro ćemo vas kontaktirati.",
            "error_rate": "Previše zahtjeva. Sačekajte 60 sekundi.",
            "error_spam": "Sigurnosni protokol aktiviran. Nevažeći podaci.",
            "error_general": "Slanje nije uspjelo. Pokušajte ponovo."
        },
        "footer": {"cta_btn": "Pokreni Projekat", "rights": "© 2026 Corebit Studio. Sva prava zadržana. Tivat, Crna Gora."}
    },
    "sr": {
        "nav": {"services": "Moduli", "portfolio": "Projekti", "pricing": "Cene", "contact": "Kontakt"},
        "hero": {"badge": "Inženjering platformi visokih performansi", "title": "Corebit Studio", "subtitle": "Projektujemo sopstvene module za automatizaciju i ultra-brze web platforme koje pretvaraju posetioce u klijente.", "cta": "Započni Projekat"},
        "about": {
            "title": "Arhitektura Visoke Konverzije", 
            "desc": "Klijent poseti vaš sajt i odmah želi vašu uslugu. To postižemo kombinovanjem Apple dizajna sa ultra-brzim Next.js Edge mrežama.",
            "badges": ["Učitavanje < 100ms", "Besprekoran Mobilni UX", "Zadržavanje pažnje 3s", "Apsolutna Bezbednost"]
        },
        "automation": {
            "title": "Sopstveni Moduli", "subtitle": "Pretvorite vaš sajt u autonomnu mašinu za prodaju 24/7.",
            "tables": {"title": "Pametne Rezervacije Stolova", "desc": "Interaktivni rasporedi i sistemi za rezervaciju u realnom vremenu za premium restorane."},
            "booking": {"title": "Dinamičko Zakazivanje", "desc": "Inteligentni sistemi za zakazivanje za auto servise (STO) i medicinske klinike."},
            "schedule": {"title": "Automatizovani Rasporedi", "desc": "Besprekorni sistemi zakazivanja za salone lepote sa SMS/Email obaveštenjima."}
        },
        "portfolio": {
            "title": "Fascinantni Digitalni Projekti", "subtitle": "Nedavne platforme visoke konverzije koje je razvio Corebit Studio.",
            "items": {
                "cupertino-roast": {"title": "Cupertino Roast", "desc": "Premium digitalni izlog i interaktivni meni za zanatsku kafeteriju."},
                "shift-drive": {"title": "Shift & Drive STO", "desc": "Moderan portal za auto servise sa ugrađenim sistemom zakazivanja u realnom vremenu."},
                "umami-bistro": {"title": "Umami Bistro", "desc": "Zapanjujući web sajt restorana sa naprednim sistemom za rezervaciju stolova."},
                "aura-wellness": {"title": "Aura Wellness", "desc": "Elegantna platforma za luksuzni salon lepote sa glatkim procesom zakazivanja."}
            }
        },
        "portfolio_page": {
            "tech_stack": "Tehnološki Stek",
            "features": "Napredne Funkcije",
            "back": "Nazad na Početnu"
        },
        "pricing": {
            "title": "Komercijalni Paketi", "subtitle": "Transparentna, visoko-konverzna inženjerska rešenja.",
            "toggle_full": "Puna Uplata (-10%)", "toggle_split": "Plaćanje na rate (50/50)",
            "tier1": {"title": "Start / Vizitka", "price": 400, "desc": "Premium landing stranice i sajtovi sa prilagođenom ultra-brzom arhitekturom.", "btn": "Započni Start"},
            "tier2": {"title": "Rast / Biznis", "price": 1200, "desc": "Potpuno interaktivne platforme sa sistemima za zakazivanje i automatizacijom.", "btn": "Implementiraj Platformu"},
            "tier3": {"title": "Enterprise Arhitektura", "price": 3500, "desc": "Duboke integracije, ekstremna optimizacija performansi i bezbednost.", "btn": "Izgradi Enterprise"}
        },
        "contact_form": {
            "title": "Uspostavite Sigurnu Vezu",
            "name": "Puno Ime", "email": "Poslovni Email", "message": "Detalji Projekta",
            "send": "Iniciraj Slanje", "sending": "Šifrovanje...",
            "success": "Veza uspostavljena. Uskoro ćemo vas kontaktirati.",
            "error_rate": "Previše zahteva. Sačekajte 60 sekundi.",
            "error_spam": "Sigurnosni protokol aktiviran. Nevažeći podaci.",
            "error_general": "Slanje nije uspelo. Pokušajte ponovo."
        },
        "footer": {"cta_btn": "Pokreni Projekat", "rights": "© 2026 Corebit Studio. Sva prava zadržana. Tivat, Crna Gora."}
    },
    "sq": {
        "nav": {"services": "Modulet", "portfolio": "Portofoli", "pricing": "Çmimet", "contact": "Kontakti"},
        "hero": {"badge": "Inxhinieri e Aseteve me Performancë të Lartë", "title": "Corebit Studio", "subtitle": "Ne projektojmë module të automatizimit të biznesit dhe platforma uebi ultra të shpejta që kthejnë vizitorët në klientë besnikë.", "cta": "Fillo Projektin"},
        "about": {
            "title": "Arkitekturë me Konvertim të Lartë", 
            "desc": "Një klient viziton faqen tuaj dhe menjëherë dëshiron shërbimin tuaj. Ne e arrijmë këtë duke kombinuar dizajnin Apple me rrjetet e shpejta Next.js Edge.",
            "badges": ["Ngarkim < 100ms", "UX Mobil i Përsosur", "Kapje e Vëmendjes 3s", "Siguri Absolute"]
        },
        "automation": {
            "title": "Module të Automatizimit", "subtitle": "Kthejeni faqen tuaj në një makinë shitjeje autonome 24/7.",
            "tables": {"title": "Rezervime të Zgjuara", "desc": "Sisteme rezervimi në kohë reale dhe plane interaktive për restorante premium."},
            "booking": {"title": "Rezervim Dinamik i Kohës", "desc": "Motorë inteligjentë planifikimi për qendra riparimi auto (STO) dhe klinika mjekësore."},
            "schedule": {"title": "Planifikues të Automatizuar", "desc": "Flukse takimesh pa probleme për sallone bukurie me njoftime SMS/Email."}
        },
        "portfolio": {
            "title": "Asete Dixhitale Lënesh", "subtitle": "Platformat e fundit me konvertim të lartë nga Corebit Studio.",
            "items": {
                "cupertino-roast": {"title": "Cupertino Roast", "desc": "Një vitrinë dixhitale premium dhe menu interaktive për një kafene artizanale."},
                "shift-drive": {"title": "Shift & Drive STO", "desc": "Një portal shërbimi auto me performancë të lartë me rezervim në kohë reale."},
                "umami-bistro": {"title": "Umami Bistro", "desc": "Një faqe restoranti mahnitëse me një motor të avancuar rezervimi tavolinash."},
                "aura-wellness": {"title": "Aura Wellness", "desc": "Një platformë elegante rezervimi për një sallon bukurie luksoz."}
            }
        },
        "portfolio_page": {
            "tech_stack": "Teknologjia",
            "features": "Karakteristika të Avancuara",
            "back": "Kthehu në Fillim"
        },
        "pricing": {
            "title": "Paketat Komerciale", "subtitle": "Paketa inxhinierike transparente me konvertim të lartë.",
            "toggle_full": "Pagesë e Plotë (-10%)", "toggle_split": "Me Këste (50/50)",
            "tier1": {"title": "Hyrje / Kickstart", "price": 400, "desc": "Faqe premium dhe faqe vizitkarta me arkitekturë ultra të shpejtë.", "btn": "Fillo Kickstart"},
            "tier2": {"title": "Rritje / Biznes", "price": 1200, "desc": "Platforma tregtare plotësisht interaktive me sisteme rezervimi me porosi.", "btn": "Zbato Platformën"},
            "tier3": {"title": "Arkitektura Enterprise", "price": 3500, "desc": "Integrime të thella të sistemit, optimizim ekstrem i performancës dhe siguri.", "btn": "Ndërto Enterprise"}
        },
        "contact_form": {
            "title": "Krijo Lidhje të Sigurt",
            "name": "Emri i Plotë", "email": "Email i Korporatës", "message": "Detajet e Projektit",
            "send": "Fillo Dërgimin", "sending": "Duke Kriptuar...",
            "success": "Lidhja u krijua. Ne do t'ju kontaktojmë së shpejti.",
            "error_rate": "Kufiri i normës u tejkalua. Ju lutemi prisni 60 sekonda.",
            "error_spam": "Protokolli i sigurisë u aktivizua. Të dhëna të pavlefshme.",
            "error_general": "Transmetimi dështoi. Ju lutemi provoni përsëri."
        },
        "footer": {"cta_btn": "Fillo Projektin", "rights": "© 2026 Corebit Studio. Të gjitha të drejtat e rezervuara. Tivat, Mali i Zi."}
    }
}

# ==========================================
# 2. CODEBASE FILES
# ==========================================
FILES = {
    # ---------------------------------------------------------
    # MIDDLEWARE (Updated to include 'sr')
    # ---------------------------------------------------------
    "middleware.ts": """// File: C:\\dev\\Studio\\middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ru', 'cnr', 'sr', 'sq'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
""",

    # ---------------------------------------------------------
    # GET DICTIONARY (Updated to include 'sr')
    # ---------------------------------------------------------
    "i18n/getDictionary.ts": """// File: C:\\dev\\Studio\\i18n\\getDictionary.ts
import 'server-only';

export type Locale = 'en' | 'ru' | 'cnr' | 'sr' | 'sq';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ru: () => import('./dictionaries/ru.json').then((module) => module.default),
  cnr: () => import('./dictionaries/cnr.json').then((module) => module.default),
  sr: () => import('./dictionaries/sr.json').then((module) => module.default),
  sq: () => import('./dictionaries/sq.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.en();
};
""",

    # ---------------------------------------------------------
    # HEADER (CROSS-PAGE ROUTING BUG FIX)
    # ---------------------------------------------------------
    "components/Header.tsx": """// File: C:\\dev\\Studio\\components\\Header.tsx
import Link from 'next/link';
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

        {/* Navigation - Fixed cross-page routing by prefixing with /locale */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <Link href={`/${locale}#modules`} className="hover:text-white transition-colors">{dict.nav.services}</Link>
          <Link href={`/${locale}#portfolio`} className="hover:text-white transition-colors">{dict.nav.portfolio}</Link>
          <Link href={`/${locale}#pricing`} className="hover:text-white transition-colors">{dict.nav.pricing}</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <LangSwitcher currentLocale={locale} />
          <Link href={`/${locale}#contact`} className="hidden sm:block px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors">
            {dict.hero.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}
""",

    # ---------------------------------------------------------
    # BENTO CARD (UNIFIED DIMENSIONS & VISUAL PROP)
    # ---------------------------------------------------------
    "components/BentoCard.tsx": """// File: C:\\dev\\Studio\\components\\BentoCard.tsx
'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

interface BentoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  visual?: React.ReactNode;
  className?: string;
  delay?: number;
  href?: string;
}

export default function BentoCard({ title, description, icon, visual, className = '', delay = 0, href }: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const CardContent = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-8 flex flex-col h-full overflow-hidden ${className} ${href ? 'cursor-pointer hover:border-emerald-500/50 transition-colors' : ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div style={{ transform: "translateZ(30px)" }} className="flex flex-col h-full">
        {/* Render High-Fidelity Visual Mockup if provided */}
        {visual && (
          <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden relative border border-white/5">
            {visual}
          </div>
        )}
        
        {icon && !visual && (
          <div className="p-3 bg-white/5 rounded-2xl w-fit border border-white/10 text-neutral-300 mb-4">
            {icon}
          </div>
        )}
        
        {/* flex-grow ensures description pushes any bottom content down, unifying heights */}
        <div className="flex flex-col flex-grow gap-2">
          <h3 className="text-xl font-semibold tracking-tight text-white">{title}</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );

  return href ? <Link href={href} className="block h-full">{CardContent}</Link> : CardContent;
}
""",

    # ---------------------------------------------------------
    # PRICING SECTION (UNIFIED DIMENSIONS)
    # ---------------------------------------------------------
    "components/PricingSection.tsx": """// File: C:\\dev\\Studio\\components\\PricingSection.tsx
'use client';

import { useState } from 'react';

export default function PricingSection({ dict }: { dict: any }) {
  const [isFullPayment, setIsFullPayment] = useState(true);

  const calculatePrice = (basePrice: number) => {
    return isFullPayment ? Math.floor(basePrice * 0.9) : basePrice;
  };

  return (
    <section id="pricing" className="flex flex-col gap-12 items-center w-full">
      <div className="text-center flex flex-col gap-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{dict.title}</h2>
        <p className="text-xl text-neutral-400">{dict.subtitle}</p>
      </div>

      <div className="relative flex items-center p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
        <div 
          className="absolute h-full w-1/2 bg-white/10 rounded-full transition-transform duration-300 ease-in-out border border-white/20 shadow-lg"
          style={{ transform: isFullPayment ? 'translateX(0)' : 'translateX(100%)' }}
        />
        <button onClick={() => setIsFullPayment(true)} className={`relative z-10 px-6 py-3 text-sm font-semibold transition-colors duration-300 ${isFullPayment ? 'text-white' : 'text-neutral-400 hover:text-white'}`}>
          {dict.toggle_full}
        </button>
        <button onClick={() => setIsFullPayment(false)} className={`relative z-10 px-6 py-3 text-sm font-semibold transition-colors duration-300 ${!isFullPayment ? 'text-white' : 'text-neutral-400 hover:text-white'}`}>
          {dict.toggle_split}
        </button>
      </div>
      
      {/* items-stretch ensures all cards in the grid row are equally tall */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-stretch">
        
        {/* Tier 1 */}
        <div className="flex flex-col h-full p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl gap-6 hover:bg-white/[0.04] transition-colors">
          <h3 className="text-2xl font-semibold">{dict.tier1.title}</h3>
          <div className="text-4xl font-bold">€{calculatePrice(dict.tier1.price)}</div>
          <p className="text-neutral-400 text-sm flex-grow">{dict.tier1.desc}</p>
          <a href="#contact" className="w-full py-4 mt-auto rounded-2xl bg-white text-black text-center font-semibold hover:bg-neutral-200 transition-colors">{dict.tier1.btn}</a>
        </div>

        {/* Tier 2 */}
        <div className="flex flex-col h-full p-10 rounded-[2.5rem] border border-emerald-500/30 bg-emerald-500/[0.02] backdrop-blur-xl gap-6 relative overflow-hidden transform lg:-translate-y-4 shadow-2xl shadow-emerald-500/10">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0"></div>
          <h3 className="text-2xl font-semibold text-emerald-400">{dict.tier2.title}</h3>
          <div className="text-4xl font-bold">€{calculatePrice(dict.tier2.price)}</div>
          <p className="text-neutral-400 text-sm flex-grow">{dict.tier2.desc}</p>
          <a href="#contact" className="w-full py-4 mt-auto rounded-2xl bg-emerald-500 text-white text-center font-semibold hover:bg-emerald-600 transition-colors">{dict.tier2.btn}</a>
        </div>

        {/* Tier 3 */}
        <div className="flex flex-col h-full p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl gap-6 hover:bg-white/[0.04] transition-colors">
          <h3 className="text-2xl font-semibold">{dict.tier3.title}</h3>
          <div className="text-4xl font-bold">€{calculatePrice(dict.tier3.price)}</div>
          <p className="text-neutral-400 text-sm flex-grow">{dict.tier3.desc}</p>
          <a href="#contact" className="w-full py-4 mt-auto rounded-2xl border border-white/20 text-white text-center font-semibold hover:bg-white/10 transition-colors">{dict.tier3.btn}</a>
        </div>

      </div>
    </section>
  );
}
""",

    # ---------------------------------------------------------
    # MAIN PAGE (RICH VISUALS & UNIFIED GRIDS)
    # ---------------------------------------------------------
    "app/[locale]/page.tsx": """// File: C:\\dev\\Studio\\app\\[locale]\\page.tsx
import { getDictionary, Locale } from '@/i18n/getDictionary';
import BentoCard from '@/components/BentoCard';
import PricingSection from '@/components/PricingSection';
import ContactForm from '@/components/ContactForm';
import { ArrowRight, CheckCircle2, CalendarClock, Utensils, CalendarHeart } from 'lucide-react';

export default async function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const dict = await getDictionary(locale);

  // High-Fidelity CSS Mockups for Portfolio Cards
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
      <div className="w-20 h-10 border border-lime-400/50 rounded bg-lime-900/20 text-[10px] font-mono text-lime-400 flex items-center justify-center shadow-[0_0_15px_rgba(132,204,22,0.2)]">SLOT_A1</div>
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
    <div className="w-full max-w-7xl mx-auto px-6 pb-24 flex flex-col gap-40">
      
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
          <a href={`/${locale}#contact`} className="px-8 py-4 rounded-2xl bg-white text-black font-semibold text-lg hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            {dict.hero.cta} <ArrowRight size={20}/>
          </a>
        </div>
      </section>

      {/* Localized Badges & Copywriting */}
      <section className="flex flex-col md:flex-row items-center gap-16 p-12 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="flex-1 flex flex-col gap-6 relative z-10">
          <h2 className="text-4xl font-bold tracking-tight">{dict.about.title}</h2>
          <p className="text-lg text-neutral-400 leading-relaxed">{dict.about.desc}</p>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 relative z-10 w-full">
          {dict.about.badges.map((badge: string, i: number) => (
             <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-medium">
               <CheckCircle2 size={16} className="text-emerald-500"/> {badge}
             </div>
          ))}
        </div>
      </section>

      {/* Modules (Unified Grid Heights) */}
      <section id="modules" className="flex flex-col gap-12">
        <div className="text-center flex flex-col gap-4">
          <h2 className="text-4xl font-bold tracking-tight">{dict.automation.title}</h2>
          <p className="text-xl text-neutral-400">{dict.automation.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <BentoCard title={dict.automation.tables.title} description={dict.automation.tables.desc} icon={<Utensils size={24} />} delay={0.1} />
          <BentoCard title={dict.automation.booking.title} description={dict.automation.booking.desc} icon={<CalendarClock size={24} />} delay={0.2} className="md:col-span-2" />
          <BentoCard title={dict.automation.schedule.title} description={dict.automation.schedule.desc} icon={<CalendarHeart size={24} />} delay={0.3} className="md:col-span-3" />
        </div>
      </section>

      {/* Rich Portfolio Grid (Unified Heights & CSS Mockups) */}
      <section id="portfolio" className="flex flex-col gap-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[200px] rounded-full pointer-events-none"></div>
        <div className="text-center flex flex-col gap-4 relative z-10">
          <h2 className="text-4xl font-bold tracking-tight">{dict.portfolio.title}</h2>
          <p className="text-xl text-neutral-400">{dict.portfolio.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 items-stretch">
          <BentoCard href={`/${locale}/portfolio/cupertino-roast`} title={dict.portfolio.items['cupertino-roast'].title} description={dict.portfolio.items['cupertino-roast'].desc} visual={CupertinoVisual} delay={0.1} />
          <BentoCard href={`/${locale}/portfolio/shift-drive`} title={dict.portfolio.items['shift-drive'].title} description={dict.portfolio.items['shift-drive'].desc} visual={ShiftDriveVisual} delay={0.2} />
          <BentoCard href={`/${locale}/portfolio/umami-bistro`} title={dict.portfolio.items['umami-bistro'].title} description={dict.portfolio.items['umami-bistro'].desc} visual={UmamiVisual} delay={0.3} />
          <BentoCard href={`/${locale}/portfolio/aura-wellness`} title={dict.portfolio.items['aura-wellness'].title} description={dict.portfolio.items['aura-wellness'].desc} visual={AuraVisual} delay={0.4} />
        </div>
      </section>

      {/* Dynamic Pricing Client Component */}
      <PricingSection dict={dict.pricing} />

      {/* Ultra-Secure Contact Form */}
      <ContactForm dict={dict.contact_form} />
    </div>
  );
}
""",

    # ---------------------------------------------------------
    # DYNAMIC PORTFOLIO PAGE ROUTING
    # ---------------------------------------------------------
    "app/[locale]/portfolio/[slug]/page.tsx": """// File: C:\\dev\\Studio\\app\\[locale]\\portfolio\\[slug]\\page.tsx
import { getDictionary, Locale } from '@/i18n/getDictionary';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Cpu } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function PortfolioProjectPage({ params: { locale, slug } }: { params: { locale: Locale, slug: string } }) {
  const dict = await getDictionary(locale);
  const project = dict.portfolio.items[slug as keyof typeof dict.portfolio.items];

  if (!project) {
    notFound();
  }

  const techData: Record<string, { stack: string[], features: string[] }> = {
    'cupertino-roast': {
      stack: ['Next.js 14 Edge', 'Tailwind Custom Config', 'Stripe Payments', 'Vercel KV'],
      features: ['Interactive 3D Menu', 'Real-time stock synchronization', 'Apple Pay 1-click checkout']
    },
    'shift-drive': {
      stack: ['React Server Components', 'PostgreSQL', 'WebSockets', 'Framer Motion Engine'],
      features: ['Real-time time-slot calculation', 'Live mechanic bay status tracking', 'Automated SMS Reminders via Twilio']
    },
    'umami-bistro': {
      stack: ['Next.js App Router', 'Redis Caching', 'Custom Webhooks', 'Glassmorphism UI'],
      features: ['Interactive SVG floor plans for table reservations', 'Instant waitlist queue management', 'Manager dashboard sync']
    },
    'aura-wellness': {
      stack: ['Next.js', 'Tailwind CSS', 'Prisma ORM', 'Stripe Connect'],
      features: ['Smooth step-by-step onboarding forms', 'Staff calendar synchronization', 'Deposit payment authorization']
    }
  };

  const details = techData[slug];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-24 flex flex-col gap-16">
      
      <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit">
        <ArrowLeft size={20} /> {dict.portfolio_page.back}
      </Link>

      <div className="flex flex-col gap-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          {project.title}
        </h1>
        <p className="text-xl text-neutral-400 max-w-3xl leading-relaxed">
          {project.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="flex flex-col h-full p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl gap-6">
          <div className="flex items-center gap-3 text-emerald-400">
            <Cpu size={24} />
            <h3 className="text-2xl font-semibold">{dict.portfolio_page.tech_stack}</h3>
          </div>
          <ul className="flex flex-col gap-4 mt-4">
            {details.stack.map((tech, i) => (
              <li key={i} className="flex items-center gap-3 text-neutral-300 font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col h-full p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl gap-6">
          <div className="flex items-center gap-3 text-white">
            <CheckCircle2 size={24} className="text-emerald-500" />
            <h3 className="text-2xl font-semibold">{dict.portfolio_page.features}</h3>
          </div>
          <ul className="flex flex-col gap-4 mt-4">
            {details.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-neutral-300 leading-relaxed">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2 shrink-0" /> {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
"""
}

def generate_update():
    print(f"🚀 Initializing V5 Final Polish Upgrade at: {BASE_DIR}")
    
    if not os.path.exists(BASE_DIR):
        print(f"❌ Error: Path {BASE_DIR} not found.")
        return

    # Write Dictionaries (Full 5-Language Matrix)
    for loc, content in DICTIONARIES.items():
        dict_path = os.path.join(BASE_DIR, "i18n", "dictionaries", f"{loc}.json")
        os.makedirs(os.path.dirname(dict_path), exist_ok=True)
        with open(dict_path, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)
        print(f"✅ Dictionary updated: {loc}.json (100% Coverage)")

    # Write Code Files
    for filepath, content in FILES.items():
        full_path = os.path.join(BASE_DIR, filepath.replace('/', os.sep))
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Code engineered: {filepath}")

    print("\n🎉 V5 Architecture Successfully Deployed!")
    print("=============================================")
    print("New Features Integrated:")
    print("- Unified Pixel-Perfect Heights for all Grids (Bento & Pricing).")
    print("- 100% Complete Translation Matrix (EN, RU, CNR, SR, SQ).")
    print("- Rich CSS-Art High-Fidelity Mockups inside Portfolio Cards.")
    print("- Flawless Cross-Page Header Routing (Bug Fixed).")
    print("=============================================")
    print("Run `npm run dev` to experience the final polish.")

if __name__ == "__main__":
    generate_update()