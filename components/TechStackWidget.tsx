// File: C:\dev\Corebit-Studio\components\TechStackWidget.tsx
'use client';

import { Gauge, Layers, Brush, Cloud } from 'lucide-react';
import { Locale } from '@/i18n/getDictionary';

interface TechStackWidgetProps {
  locale: Locale;
}

const WIDGET_TEXTS: Record<Locale, {
  title: string;
  uptime: string;
  speedLabel: string;
  archLabel: string;
  styleLabel: string;
  hostLabel: string;
  speedDesc: string;
  archDesc: string;
  styleDesc: string;
  hostDesc: string;
}> = {
  en: {
    title: 'Corebit Tech Stack: How This Site is Engineered',
    uptime: 'System autonomous · Uptime: 99.99%',
    speedLabel: 'Loading Speed',
    archLabel: 'Architecture',
    styleLabel: 'Styling Framework',
    hostLabel: 'Hosting & CDN',
    speedDesc: '99/100 PageSpeed / 0.4s load',
    archDesc: 'Next.js 14 (SSR / ISR)',
    styleDesc: 'Tailwind CSS',
    hostDesc: 'Edge Network / Vercel Cloud'
  },
  ru: {
    title: 'Corebit Tech Stack: как устроен этот сайт',
    uptime: 'Система автономна · Аптайм: 99.99%',
    speedLabel: 'Скорость загрузки',
    archLabel: 'Архитектура',
    styleLabel: 'Стилизация',
    hostLabel: 'Хостинг и CDN',
    speedDesc: '99/100 PageSpeed / 0.4s load',
    archDesc: 'Next.js 14 (SSR / ISR)',
    styleDesc: 'Tailwind CSS',
    hostDesc: 'Edge Network / Vercel Cloud'
  },
  cnr: {
    title: 'Corebit Tech Stack: Kako je ovaj sajt dizajniran',
    uptime: 'Sistem je autonoman · Uptime: 99.99%',
    speedLabel: 'Brzina učitavanja',
    archLabel: 'Arhitektura',
    styleLabel: 'Stilizacija',
    hostLabel: 'Hosting i CDN',
    speedDesc: '99/100 PageSpeed / 0.4s load',
    archDesc: 'Next.js 14 (SSR / ISR)',
    styleDesc: 'Tailwind CSS',
    hostDesc: 'Edge Network / Vercel Cloud'
  },
  srb: {
    title: 'Corebit Tech Stack: Kako je ovaj sajt dizajniran',
    uptime: 'Sistem je autonoman · Uptime: 99.99%',
    speedLabel: 'Brzina učitavanja',
    archLabel: 'Arhitektura',
    styleLabel: 'Stilizacija',
    hostLabel: 'Hosting i CDN',
    speedDesc: '99/100 PageSpeed / 0.4s load',
    archDesc: 'Next.js 14 (SSR / ISR)',
    styleDesc: 'Tailwind CSS',
    hostDesc: 'Edge Network / Vercel Cloud'
  },
  sq: {
    title: 'Corebit Tech Stack: Si është inxhinieruar kjo faqe',
    uptime: 'Sistemi autonom · Uptime: 99.99%',
    speedLabel: 'Shpejtësia e Ngarkimit',
    archLabel: 'Arkitektura',
    styleLabel: 'Stilizimi',
    hostLabel: 'Hosting & CDN',
    speedDesc: '99/100 PageSpeed / 0.4s ngarkim',
    archDesc: 'Next.js 14 (SSR / ISR)',
    styleDesc: 'Tailwind CSS',
    hostDesc: 'Edge Network / Vercel Cloud'
  }
};

export default function TechStackWidget({ locale }: TechStackWidgetProps) {
  const texts = WIDGET_TEXTS[locale] || WIDGET_TEXTS.en;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-[#050506]/80 border border-white/10 backdrop-blur-md p-6 sm:p-10 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Widget Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6 mb-8 relative z-10">
          <div>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
              Live Infrastructure
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
              {texts.title}
            </h3>
          </div>
          
          <div className="flex flex-col gap-2 shrink-0">
            {/* Autonomous Uptime Indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-emerald-400 font-medium">
                {texts.uptime}
              </span>
            </div>
          </div>
        </div>

        {/* Tech Stack Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {/* Card 1: Speed */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5 shadow-md">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] shrink-0">
              <Gauge size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{texts.speedLabel}</p>
              <p className="text-sm font-bold text-white mt-1">{texts.speedDesc}</p>
            </div>
          </div>

          {/* Card 2: Next.js */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5 shadow-md">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neutral-300 shrink-0">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{texts.archLabel}</p>
              <p className="text-sm font-bold text-white mt-1">{texts.archDesc}</p>
            </div>
          </div>

          {/* Card 3: Tailwind */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5 shadow-md">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0">
              <Brush size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{texts.styleLabel}</p>
              <p className="text-sm font-bold text-white mt-1">{texts.styleDesc}</p>
            </div>
          </div>

          {/* Card 4: Edge Networks */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5 shadow-md">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-400 shrink-0">
              <Cloud size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{texts.hostLabel}</p>
              <p className="text-sm font-bold text-white mt-1">{texts.hostDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
