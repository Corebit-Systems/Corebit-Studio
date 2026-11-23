// File: C:\dev\Corebit-Studio\components\TechStackWidget.tsx
import { Gauge, Layers, Brush, Cloud } from 'lucide-react';
import type { Locale } from '@/i18n/getDictionary';
import { dependencies } from '@/package.json';

const nextMajor = dependencies.next.split('.')[0];

interface TechStackWidgetProps {
  locale: Locale;
}

const WIDGET_TEXTS: Record<Locale, {
  title: string;
  speedLabel: string;
  archLabel: string;
  styleLabel: string;
  hostLabel: string;
  styleDesc: string;
  hostDesc: string;
}> = {
  en: {
    title: 'Corebit Tech Stack: How This Site is Engineered',
    speedLabel: 'Loading Speed',
    archLabel: 'Architecture',
    styleLabel: 'Styling Framework',
    hostLabel: 'Hosting & CDN',
    styleDesc: 'Tailwind CSS',
    hostDesc: 'Edge Network / Vercel Cloud'
  },
  ru: {
    title: 'Corebit Tech Stack: как устроен этот сайт',
    speedLabel: 'Скорость загрузки',
    archLabel: 'Архитектура',
    styleLabel: 'Стилизация',
    hostLabel: 'Хостинг и CDN',
    styleDesc: 'Tailwind CSS',
    hostDesc: 'Edge Network / Vercel Cloud'
  },
  cnr: {
    title: 'Corebit Tech Stack: Kako je ovaj sajt dizajniran',
    speedLabel: 'Brzina učitavanja',
    archLabel: 'Arhitektura',
    styleLabel: 'Stilizacija',
    hostLabel: 'Hosting i CDN',
    styleDesc: 'Tailwind CSS',
    hostDesc: 'Edge Network / Vercel Cloud'
  },
  srb: {
    title: 'Corebit Tech Stack: Kako je ovaj sajt dizajniran',
    speedLabel: 'Brzina učitavanja',
    archLabel: 'Arhitektura',
    styleLabel: 'Stilizacija',
    hostLabel: 'Hosting i CDN',
    styleDesc: 'Tailwind CSS',
    hostDesc: 'Edge Network / Vercel Cloud'
  },
  sq: {
    title: 'Corebit Tech Stack: Si është inxhinieruar kjo faqe',
    speedLabel: 'Shpejtësia e Ngarkimit',
    archLabel: 'Arkitektura',
    styleLabel: 'Stilizimi',
    hostLabel: 'Hosting & CDN',
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
          <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">{texts.title}</h3>
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
              <p className="text-sm font-bold text-white mt-1">99/100 PageSpeed</p>
            </div>
          </div>

          {/* Card 2: Next.js */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5 shadow-md">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neutral-300 shrink-0">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{texts.archLabel}</p>
              <p className="text-sm font-bold text-white mt-1">Next.js {nextMajor} (App Router)</p>
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
