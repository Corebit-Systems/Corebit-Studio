import os
import json

BASE_DIR = r"C:\dev\Studio"

# ==========================================
# 1. ПОЛНЫЕ СЛОВАРИ (ПЕРЕВОДЫ НА 5 ЯЗЫКОВ)
# ==========================================
DICTIONARIES = {
    "en": {
        "nav": {"services": "Services", "pricing": "Pricing", "contact": "Contact"},
        "hero": {
            "badge": "Accepting New Enterprise Clients",
            "title": "Corebit Studio",
            "subtitle": "Elite frontend architecture, extreme Vercel optimizations, and scalable web infrastructure for high-end B2B entities.",
            "cta": "Initiate Project"
        },
        "about": {
            "title": "Engineering Excellence",
            "desc": "We don't just build websites. We architect high-performance digital infrastructures using React, Next.js, and Edge networks. Zero CMS bloat, 100/100 Lighthouse scores, and absolute security."
        },
        "services": {
            "title": "Core Architecture",
            "edge": {"title": "Edge Rendering", "desc": "Ultra-fast Next.js deployments configured for global Vercel Edge Networks, guaranteeing sub-100ms TTFB."},
            "security": {"title": "Security Hardening", "desc": "Strict CSPs, middleware authentication, and advanced DDoS mitigation."},
            "iac": {"title": "Infrastructure as Code", "desc": "Automated CI/CD pipelines and scalable cloud architecture."},
            "frontend": {"title": "Custom Frontend", "desc": "Bespoke React engineering with fluid Framer Motion physics and Apple-grade glassmorphism."}
        },
        "pricing": {
            "title": "Commercial Directives",
            "subtitle": "Transparent, high-end engineering packages.",
            "mvp": {"title": "MVP Production", "price": "From €2,900", "desc": "Rapid deployment of ultra-fast web interfaces using Next.js & Vercel.", "btn": "Start MVP"},
            "enterprise": {"title": "Enterprise Architecture", "price": "From €7,500", "desc": "Deep system auditing, custom load balancing, IaC, and security hardening.", "btn": "Deploy Enterprise"},
            "cto": {"title": "Dedicated CTO", "price": "€4,500/mo", "desc": "Retainer-based immediate access to elite software engineering & scalability consultations.", "btn": "Retain Services"}
        },
        "footer": {
            "contact_title": "Establish Secure Connection",
            "rights": "© 2026 Corebit Studio. All rights reserved. Tivat, Montenegro."
        }
    },
    "ru": {
        "nav": {"services": "Услуги", "pricing": "Цены", "contact": "Контакты"},
        "hero": {
            "badge": "Принимаем новых корпоративных клиентов",
            "title": "Corebit Studio",
            "subtitle": "Элитная фронтенд-архитектура, экстремальная оптимизация Vercel и масштабируемая веб-инфраструктура для B2B.",
            "cta": "Начать проект"
        },
        "about": {
            "title": "Инженерное совершенство",
            "desc": "Мы не просто делаем сайты. Мы проектируем высокопроизводительные цифровые инфраструктуры на React и Next.js. Никаких тяжелых CMS, 100/100 Lighthouse и абсолютная безопасность."
        },
        "services": {
            "title": "Ключевая Архитектура",
            "edge": {"title": "Edge Рендеринг", "desc": "Сверхбыстрые развертывания Next.js для глобальных сетей Vercel Edge, гарантия TTFB < 100мс."},
            "security": {"title": "Усиление безопасности", "desc": "Строгие CSP, аутентификация через middleware и защита от DDoS."},
            "iac": {"title": "Инфраструктура как код", "desc": "Автоматизированные CI/CD пайплайны и масштабируемая облачная архитектура."},
            "frontend": {"title": "Кастомный Фронтенд", "desc": "Индивидуальная разработка на React с плавной физикой Framer Motion и стеклянным дизайном в стиле Apple."}
        },
        "pricing": {
            "title": "Коммерческие пакеты",
            "subtitle": "Прозрачные тарифы на высококлассную инженерию.",
            "mvp": {"title": "MVP Продакшн", "price": "От €2,900", "desc": "Быстрое развертывание сверхбыстрых веб-интерфейсов с использованием Next.js.", "btn": "Заказать MVP"},
            "enterprise": {"title": "Enterprise Архитектура", "price": "От €7,500", "desc": "Глубокий аудит систем, балансировка нагрузки, IaC и усиление безопасности.", "btn": "Внедрить Enterprise"},
            "cto": {"title": "Выделенный CTO", "price": "€4,500/мес", "desc": "Мгновенный доступ к элитной разработке и консультациям по масштабированию.", "btn": "Нанять CTO"}
        },
        "footer": {
            "contact_title": "Установить защищенное соединение",
            "rights": "© 2026 Corebit Studio. Все права защищены. Тиват, Черногория."
        }
    },
    "cnr": {
        "nav": {"services": "Usluge", "pricing": "Cijene", "contact": "Kontakt"},
        "hero": {
            "badge": "Prihvatamo nove korporativne klijente",
            "title": "Corebit Studio",
            "subtitle": "Elitna frontend arhitektura, ekstremne Vercel optimizacije i skalabilna web infrastruktura za B2B.",
            "cta": "Započni projekat"
        },
        "about": {
            "title": "Inženjerska izvrsnost",
            "desc": "Ne pravimo samo sajtove. Projektujemo digitalne infrastrukture visokih performansi koristeći React i Next.js. Bez sporih CMS-ova, 100/100 Lighthouse i apsolutna sigurnost."
        },
        "services": {
            "title": "Osnovna Arhitektura",
            "edge": {"title": "Edge Rendering", "desc": "Ultra-brza Next.js implementacija za globalne Vercel Edge mreže."},
            "security": {"title": "Sigurnost", "desc": "Strogi CSP, middleware autentifikacija i napredna DDoS zaštita."},
            "iac": {"title": "Infrastruktura kao Kod", "desc": "Automatizovani CI/CD procesi i skalabilna cloud arhitektura."},
            "frontend": {"title": "Custom Frontend", "desc": "React inženjering sa Framer Motion fizikom i Apple glassmorphism dizajnom."}
        },
        "pricing": {
            "title": "Komercijalni Paketi",
            "subtitle": "Transparentne cijene za vrhunski inženjering.",
            "mvp": {"title": "MVP Produkcija", "price": "Od €2,900", "desc": "Brza implementacija ultra-brzih web interfejsa.", "btn": "Započni MVP"},
            "enterprise": {"title": "Enterprise Arhitektura", "price": "Od €7,500", "desc": "Duboka revizija sistema, balansiranje opterećenja, IaC i sigurnost.", "btn": "Primijeni Enterprise"},
            "cto": {"title": "Posvećeni CTO", "price": "€4,500/mj", "desc": "Trenutni pristup elitnom softverskom inženjeringu i konsultacijama.", "btn": "Zadrži Usluge"}
        },
        "footer": {
            "contact_title": "Uspostavite Sigurnu Vezu",
            "rights": "© 2026 Corebit Studio. Sva prava zadržana. Tivat, Crna Gora."
        }
    },
    "srb": {
        "nav": {"services": "Usluge", "pricing": "Cene", "contact": "Kontakt"},
        "hero": {
            "badge": "Prihvatamo nove korporativne klijente",
            "title": "Corebit Studio",
            "subtitle": "Elitna frontend arhitektura, ekstremne Vercel optimizacije i skalabilna web infrastruktura za B2B.",
            "cta": "Započni projekat"
        },
        "about": {
            "title": "Inženjerska izvrsnost",
            "desc": "Ne pravimo samo sajtove. Projektujemo digitalne infrastrukture visokih performansi koristeći React i Next.js. Bez sporih CMS-ova, apsolutna bezbednost."
        },
        "services": {
            "title": "Osnovna Arhitektura",
            "edge": {"title": "Edge Rendering", "desc": "Ultra-brza Next.js implementacija za globalne Vercel Edge mreže."},
            "security": {"title": "Bezbednost", "desc": "Strogi CSP, middleware autentifikacija i napredna DDoS zaštita."},
            "iac": {"title": "Infrastruktura kao Kod", "desc": "Automatizovani CI/CD procesi i skalabilna cloud arhitektura."},
            "frontend": {"title": "Custom Frontend", "desc": "React inženjering sa Framer Motion fizikom i Apple glassmorphism dizajnom."}
        },
        "pricing": {
            "title": "Komercijalni Paketi",
            "subtitle": "Transparentne cene za vrhunski inženjering.",
            "mvp": {"title": "MVP Produkcija", "price": "Od €2,900", "desc": "Brza implementacija ultra-brzih web interfejsa.", "btn": "Započni MVP"},
            "enterprise": {"title": "Enterprise Arhitektura", "price": "Od €7,500", "desc": "Duboka revizija sistema, balansiranje opterećenja, IaC i bezbednost.", "btn": "Primeni Enterprise"},
            "cto": {"title": "Posvećeni CTO", "price": "€4,500/mes", "desc": "Trenutni pristup elitnom softverskom inženjeringu i konsultacijama.", "btn": "Zadrži Usluge"}
        },
        "footer": {
            "contact_title": "Uspostavite Sigurnu Vezu",
            "rights": "© 2026 Corebit Studio. Sva prava zadržana. Tivat, Crna Gora."
        }
    },
    "sq": {
        "nav": {"services": "Shërbimet", "pricing": "Çmimet", "contact": "Kontakti"},
        "hero": {
            "badge": "Pranojmë Klientë të Rinj Korporativë",
            "title": "Corebit Studio",
            "subtitle": "Arkitekturë elite e frontend-it, optimizime ekstreme të Vercel dhe infrastrukturë e shkallëzueshme uebi për B2B.",
            "cta": "Fillo Projektin"
        },
        "about": {
            "title": "Ekselencë Inxhinierike",
            "desc": "Ne nuk ndërtojmë thjesht faqe interneti. Ne projektojmë infrastruktura dixhitale me performancë të lartë duke përdorur React dhe Next.js."
        },
        "services": {
            "title": "Arkitektura Baze",
            "edge": {"title": "Edge Rendering", "desc": "Vendosje ultra të shpejta të Next.js të konfiguruara për rrjetet globale Vercel Edge."},
            "security": {"title": "Siguria", "desc": "CSP strikte, vërtetim middleware dhe mbrojtje e avancuar DDoS."},
            "iac": {"title": "Infrastruktura si Kod", "desc": "Procese të automatizuara CI/CD dhe arkitekturë e shkallëzueshme cloud."},
            "frontend": {"title": "Frontend me Porosi", "desc": "Inxhinieri React me fizikë Framer Motion dhe dizajn xhami Apple."}
        },
        "pricing": {
            "title": "Paketat Komerciale",
            "subtitle": "Çmime transparente për inxhinieri të nivelit të lartë.",
            "mvp": {"title": "Prodhimi MVP", "price": "Nga €2,900", "desc": "Vendosje e shpejtë e ndërfaqeve të uebit ultra të shpejta.", "btn": "Fillo MVP"},
            "enterprise": {"title": "Arkitektura Enterprise", "price": "Nga €7,500", "desc": "Auditimi i thellë i sistemit, balancimi i ngarkesës, IaC dhe forcimi i sigurisë.", "btn": "Zbato Enterprise"},
            "cto": {"title": "CTO i Dedikuar", "price": "€4,500/muaj", "desc": "Qasje e menjëhershme në inxhinierinë elitare të softuerit dhe konsultimet.", "btn": "Mbaj Shërbimet"}
        },
        "footer": {
            "contact_title": "Krijo Lidhje të Sigurt",
            "rights": "© 2026 Corebit Studio. Të gjitha të drejtat e rezervuara. Tivat, Mali i Zi."
        }
    }
}

# ==========================================
# 2. КОД КОМПОНЕНТОВ И СТРАНИЦ
# ==========================================
FILES = {
    # ---------------------------------
    # HEADER & LANGUAGE SWITCHER
    # ---------------------------------
    "components/LangSwitcher.tsx": """'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState } from 'react';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'cnr', label: 'CNR' },
  { code: 'srb', label: 'SRB' },
  { code: 'sq', label: 'SQ' }
];

export default function LangSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const switchLang = (newLocale: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium"
      >
        <Globe size={16} className="text-neutral-400" />
        <span className="uppercase">{currentLocale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-24 flex flex-col bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
          {locales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => switchLang(loc.code)}
              className={`px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${currentLocale === loc.code ? 'text-emerald-400 font-bold bg-white/5' : 'text-neutral-300'}`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
""",

    "components/Header.tsx": """import Link from 'next/link';
import LangSwitcher from './LangSwitcher';

export default function Header({ dict, locale }: { dict: any, locale: string }) {
  return (
    <header className="fixed top-4 left-4 right-4 md:left-8 md:right-8 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between rounded-2xl bg-[#050506]/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-bold text-lg leading-none">C</span>
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">Corebit Studio</span>
        </Link>

        {/* Navigation - Hidden on mobile for simplicity, visible on md+ */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <a href="#services" className="hover:text-white transition-colors">{dict.nav.services}</a>
          <a href="#pricing" className="hover:text-white transition-colors">{dict.nav.pricing}</a>
          <a href="#contact" className="hover:text-white transition-colors">{dict.nav.contact}</a>
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

    "components/Footer.tsx": """import { Phone, Mail, MessageCircle } from 'lucide-react';

export default function Footer({ dict }: { dict: any }) {
  return (
    <footer id="contact" className="w-full mt-32 border-t border-white/10 bg-[#050506]/80 backdrop-blur-3xl pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[100px] bg-emerald-500/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        <div className="text-center flex flex-col gap-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{dict.footer.contact_title}</h2>
          <p className="text-neutral-400">Tivat, Montenegro | Worldwide Remote</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full">
          <a href="tel:068914816" className="flex-1 min-w-[250px] max-w-[350px] group flex flex-col items-center gap-3 p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all">
            <div className="p-4 rounded-full bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-all"><Phone size={24} /></div>
            <span className="font-mono text-xl tracking-wider text-white">068914816</span>
          </a>
          <a href="https://wa.me/359882905657" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[250px] max-w-[350px] group flex flex-col items-center gap-3 p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all">
            <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 transition-all"><MessageCircle size={24} /></div>
            <span className="font-mono text-xl tracking-wider text-white">+359 88 290 5657</span>
          </a>
          <a href="mailto:hello@corebitsystems.io" className="flex-1 min-w-[250px] max-w-[350px] group flex flex-col items-center gap-3 p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all">
            <div className="p-4 rounded-full bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-all"><Mail size={24} /></div>
            <span className="font-mono text-xl tracking-wider text-white">hello@corebitsystems.io</span>
          </a>
        </div>

        <div className="w-full h-[1px] bg-white/10 mt-12"></div>
        <div className="flex flex-col md:flex-row justify-between items-center w-full text-sm text-neutral-500">
          <p>{dict.footer.rights}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Next.js 14</span>
            <span>Vercel Edge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
""",

    # ---------------------------------
    # LAYOUT (FIXED IMPORT + HEADER/FOOTER)
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
    title: 'Corebit Studio | Elite Frontend Architecture',
    description: 'Premium software engineering, Next.js architecture, and fractional CTO services.',
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

  return (
    <html lang={locale} className="dark scroll-smooth">
      <body className={`${inter.variable} bg-[#050506] text-white antialiased min-h-screen selection:bg-white/20 selection:text-white flex flex-col`}>
        {/* Apple-style background gradient */}
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
    # PAGE (EXPANDED CONTENT)
    # ---------------------------------
    "app/[locale]/page.tsx": """import { getDictionary, Locale } from '@/i18n/getDictionary';
import BentoCard from '@/components/BentoCard';
import { Code2, Server, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default async function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const dict = await getDictionary(locale);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pb-24 flex flex-col gap-40">
      
      {/* HERO SECTION */}
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

      {/* ABOUT SECTION */}
      <section className="flex flex-col md:flex-row items-center gap-16 p-12 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="flex-1 flex flex-col gap-6 relative z-10">
          <h2 className="text-4xl font-bold tracking-tight">{dict.about.title}</h2>
          <p className="text-lg text-neutral-400 leading-relaxed">{dict.about.desc}</p>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 relative z-10 w-full">
          {['Next.js 14 App Router', 'React Server Components', 'Vercel Edge Network', 'Framer Motion Physics'].map((tech, i) => (
             <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-medium">
               <CheckCircle2 size={16} className="text-emerald-500"/> {tech}
             </div>
          ))}
        </div>
      </section>

      {/* SERVICES / BENTO GRID */}
      <section id="services" className="flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight">{dict.services.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BentoCard title={dict.services.edge.title} description={dict.services.edge.desc} icon={<Zap size={24} />} delay={0.1} className="md:col-span-2" />
          <BentoCard title={dict.services.security.title} description={dict.services.security.desc} icon={<ShieldCheck size={24} />} delay={0.2} />
          <BentoCard title={dict.services.iac.title} description={dict.services.iac.desc} icon={<Server size={24} />} delay={0.3} />
          <BentoCard title={dict.services.frontend.title} description={dict.services.frontend.desc} icon={<Code2 size={24} />} delay={0.4} className="md:col-span-2" />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="flex flex-col gap-16">
        <div className="text-center flex flex-col gap-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{dict.pricing.title}</h2>
          <p className="text-xl text-neutral-400">{dict.pricing.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tier 1 */}
          <div className="flex flex-col p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl gap-6 hover:bg-white/[0.04] transition-colors">
            <h3 className="text-2xl font-semibold">{dict.pricing.mvp.title}</h3>
            <div className="text-4xl font-bold">{dict.pricing.mvp.price}</div>
            <p className="text-neutral-400 text-sm">{dict.pricing.mvp.desc}</p>
            <a href="#contact" className="w-full py-4 mt-auto rounded-2xl bg-white text-black text-center font-semibold hover:bg-neutral-200 transition-colors">{dict.pricing.mvp.btn}</a>
          </div>

          {/* Tier 2 (Highlighted) */}
          <div className="flex flex-col p-10 rounded-[2.5rem] border border-emerald-500/30 bg-emerald-500/[0.02] backdrop-blur-xl gap-6 relative overflow-hidden transform lg:-translate-y-4 shadow-2xl shadow-emerald-500/10">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0"></div>
            <h3 className="text-2xl font-semibold text-emerald-400">{dict.pricing.enterprise.title}</h3>
            <div className="text-4xl font-bold">{dict.pricing.enterprise.price}</div>
            <p className="text-neutral-400 text-sm">{dict.pricing.enterprise.desc}</p>
            <a href="#contact" className="w-full py-4 mt-auto rounded-2xl bg-emerald-500 text-white text-center font-semibold hover:bg-emerald-600 transition-colors">{dict.pricing.enterprise.btn}</a>
          </div>

          {/* Tier 3 */}
          <div className="flex flex-col p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl gap-6 hover:bg-white/[0.04] transition-colors">
            <h3 className="text-2xl font-semibold">{dict.pricing.cto.title}</h3>
            <div className="text-4xl font-bold">{dict.pricing.cto.price}</div>
            <p className="text-neutral-400 text-sm">{dict.pricing.cto.desc}</p>
            <a href="#contact" className="w-full py-4 mt-auto rounded-2xl border border-white/20 text-white text-center font-semibold hover:bg-white/10 transition-colors">{dict.pricing.cto.btn}</a>
          </div>
        </div>
      </section>

    </div>
  );
}
""",

    # ---------------------------------
    # MINOR FIXES FOR EXISTING FILES
    # ---------------------------------
    "middleware.ts": """import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ru', 'cnr', 'srb', 'sq'];
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

    "i18n/getDictionary.ts": """import 'server-only';

export type Locale = 'en' | 'ru' | 'cnr' | 'srb' | 'sq';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ru: () => import('./dictionaries/ru.json').then((module) => module.default),
  cnr: () => import('./dictionaries/cnr.json').then((module) => module.default),
  srb: () => import('./dictionaries/srb.json').then((module) => module.default),
  sq: () => import('./dictionaries/sq.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.en();
};
"""
}

def generate_update():
    print(f"🚀 Обновление архитектуры Corebit Studio в: {BASE_DIR}")
    
    if not os.path.exists(BASE_DIR):
        os.makedirs(BASE_DIR)

    # Запись словарей
    for loc, content in DICTIONARIES.items():
        dict_path = os.path.join(BASE_DIR, "i18n", "dictionaries", f"{loc}.json")
        os.makedirs(os.path.dirname(dict_path), exist_ok=True)
        with open(dict_path, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)
        print(f"✅ Создан словарь: {loc}.json")

    # Запись файлов компонентов и страниц
    for filepath, content in FILES.items():
        full_path = os.path.join(BASE_DIR, filepath.replace('/', os.sep))
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Обновлен файл: {filepath}")

    print("\n🎉 Обновление успешно завершено!")
    print("=============================================")
    print("Теперь сайт имеет:")
    print("- Плавающий стеклянный Header (Apple style)")
    print("- Стеклянный Footer с контактами")
    print("- Рабочий переключатель языков")
    print("- Настоящие переводы на 5 языков")
    print("- Исправленные пути к CSS (@/app/globals.css)")
    print("=============================================")

if __name__ == "__main__":
    generate_update()