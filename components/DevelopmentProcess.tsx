// File: C:\dev\Corebit-Studio\components\DevelopmentProcess.tsx
'use client';

import { useState } from 'react';
import { Shield, Sparkles, Terminal, Activity, Rocket } from 'lucide-react';
import { Locale } from '@/i18n/getDictionary';

interface Step {
  id: string;
  icon: React.ReactNode;
  active: boolean;
}

interface DevelopmentProcessProps {
  locale: Locale;
}

const PROCESS_TEXTS: Record<Locale, {
  sectionTitle: string;
  sectionSubtitle: string;
  currentLabel: string;
  steps: Record<string, {
    title: string;
    desc: string;
  }>;
}> = {
  en: {
    sectionTitle: 'Transparent Development Process',
    sectionSubtitle: 'How we engineer high-performance systems from idea to production deployment.',
    currentLabel: 'Active Stage',
    steps: {
      analytics: { title: 'Analytics', desc: 'In-depth market research, conversion funnel mapping, and user flow analysis.' },
      design: { title: 'Design', desc: 'Premium glassmorphic layouts, high-fidelity UI design, and responsive prototyping.' },
      development: { title: 'Development', desc: 'Production-ready Next.js SSR engineering, serverless optimization, and API isolation.' },
      testing: { title: 'Testing', desc: 'Rigorous load testing, security audits, and type-safety verification.' },
      release: { title: 'Release', desc: 'Zero-downtime deployment, Vercel Edge CDN setup, and real-time analytics monitoring.' }
    }
  },
  ru: {
    sectionTitle: 'Прозрачный процесс разработки',
    sectionSubtitle: 'Как мы создаем высокопроизводительные системы от идеи до продакшена.',
    currentLabel: 'Текущий этап',
    steps: {
      analytics: { title: 'Аналитика', desc: 'Исследование рынка, проектирование воронки конверсий и сценариев пользователей.' },
      design: { title: 'Проектирование', desc: 'Создание премиального дизайна интерфейсов, прототипов и адаптивной верстки.' },
      development: { title: 'Разработка', desc: 'Написание чистого кода на Next.js SSR, оптимизация serverless и изоляция API.' },
      testing: { title: 'Тестирование', desc: 'Тщательное нагрузочное тестирование, аудит безопасности и проверка типов.' },
      release: { title: 'Релиз', desc: 'Развертывание без простоев, настройка Vercel Edge CDN и подключение аналитики.' }
    }
  },
  cnr: {
    sectionTitle: 'Transparentan proces razvoja',
    sectionSubtitle: 'Kako kreiramo sisteme visokih performansi od ideje do konačne produkcije.',
    currentLabel: 'Aktivan korak',
    steps: {
      analytics: { title: 'Analitika', desc: 'Istraživanje tržišta, mapiranje toka konverzije i analiza korisničkog iskustva.' },
      design: { title: 'Projektovanje', desc: 'Premium dizajn interfejsa, prototipovi i adaptivni raspored elemenata.' },
      development: { title: 'Razvoj', desc: 'Next.js SSR programiranje spremno za produkciju, serverless i API izolacija.' },
      testing: { title: 'Testiranje', desc: 'Detaljno testiranje opterećenja, bezbjednosni auditi i verifikacija tipova.' },
      release: { title: 'Lansiranje', desc: 'Deployment bez prekida rada, podešavanje Edge CDN-a i integracija analitike.' }
    }
  },
  srb: {
    sectionTitle: 'Transparentan proces razvoja',
    sectionSubtitle: 'Kako kreiramo sisteme visokih performansi od ideje do konačne produkcije.',
    currentLabel: 'Aktivan korak',
    steps: {
      analytics: { title: 'Analitika', desc: 'Istraživanje tržišta, mapiranje toka konverzije i analiza korisničkog iskustva.' },
      design: { title: 'Projektovanje', desc: 'Premium dizajn interfejsa, prototipovi i adaptivni raspored elemenata.' },
      development: { title: 'Razvoj', desc: 'Next.js SSR programiranje spremno za produkciju, serverless i API izolacija.' },
      testing: { title: 'Testiranje', desc: 'Detaljno testiranje opterećenja, bezbednosni auditi i verifikacija tipova.' },
      release: { title: 'Lansiranje', desc: 'Deployment bez prekida rada, podešavanje Edge CDN-a i integracija analitike.' }
    }
  },
  sq: {
    sectionTitle: 'Procesi Transparent i Zhvillimit',
    sectionSubtitle: 'Si ne krijojmë sisteme me performancë të lartë nga ideja deri në vendosjen në prodhim.',
    currentLabel: 'Faza Aktive',
    steps: {
      analytics: { title: 'Analitika', desc: 'Hulumtim i thelluar i tregut, hartëzimi i konvertimit dhe rrjedha e përdoruesit.' },
      design: { title: 'Projektimi', desc: 'Dizajne premium glassmorphic, ndërfaqe UI me rezolucion të lartë dhe prototipe.' },
      development: { title: 'Zhvillimi', desc: 'Inxhinieri Next.js SSR, optimizim serverless dhe izolim i API-ve.' },
      testing: { title: 'Testimi', desc: 'Testim i rreptë i ngarkesës, audite sigurie dhe verifikim i sigurisë së tipit.' },
      release: { title: 'Lansimi', desc: 'Vendosje pa ndërprerje, konfigurim i Edge CDN dhe monitorim i analitikës.' }
    }
  }
};

export default function DevelopmentProcess({ locale }: DevelopmentProcessProps) {
  const texts = PROCESS_TEXTS[locale] || PROCESS_TEXTS.en;
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [activeStepId, setActiveStepId] = useState<string>('analytics');

  const stepsList = [
    { id: 'analytics', icon: <Shield size={20} /> },
    { id: 'design', icon: <Sparkles size={20} /> },
    { id: 'development', icon: <Terminal size={20} /> },
    { id: 'testing', icon: <Activity size={20} /> },
    { id: 'release', icon: <Rocket size={20} /> }
  ];

  return (
    <section className="flex flex-col gap-8 sm:gap-12 relative w-full overflow-visible">
      <div className="text-center flex flex-col gap-3 sm:gap-4 px-2">
        <span className="text-xs sm:text-sm font-bold tracking-wider text-emerald-500 uppercase">
          OUR METHODOLOGY
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          {texts.sectionTitle}
        </h2>
        <p className="text-base sm:text-xl text-neutral-400 max-w-3xl mx-auto font-light">
          {texts.sectionSubtitle}
        </p>
      </div>

      {/* Interactive Timeline Layout */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 max-w-5xl w-full mx-auto px-4 py-8 overflow-visible">
        
        {/* Horizontal Connector Line for Desktop */}
        <div className="absolute top-[52px] left-[5%] right-[5%] h-[2px] bg-white/10 hidden md:block z-0" />

        {stepsList.map((step, idx) => {
          const stepInfo = texts.steps[step.id];
          const isHovered = hoveredStep === step.id;
          const isCurrentActive = step.id === activeStepId;
          
          return (
            <div 
              key={step.id} 
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
              className="relative flex flex-col items-center flex-1 w-full md:w-auto z-10 group"
            >
              {/* Connector for Mobile */}
              {idx > 0 && (
                <div className="w-[2px] h-6 bg-white/10 md:hidden mb-2" />
              )}

              {/* Step Circle */}
              <div 
                onClick={() => setActiveStepId(step.id)}
                className={`relative w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                  isCurrentActive 
                    ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)] animate-pulse'
                    : 'bg-black/60 border-white/15 text-neutral-400 hover:border-white/40 hover:text-white'
                }`}
              >
                {step.icon}
                
                {/* Active Indicator Pulse Ring */}
                {isCurrentActive && (
                  <span className="absolute inset-0 rounded-full border border-emerald-400/50 animate-ping opacity-75 pointer-events-none" />
                )}
              </div>

              {/* Step Title */}
              <span 
                onClick={() => setActiveStepId(step.id)}
                className={`text-sm sm:text-base font-bold mt-3 transition-colors flex items-center gap-1.5 cursor-pointer select-none ${
                  isCurrentActive ? 'text-emerald-400' : 'text-neutral-300 group-hover:text-white'
                }`}
              >
                {stepInfo.title}
                {isCurrentActive && (
                  <span className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase inline-block">
                    {texts.currentLabel}
                  </span>
                )}
              </span>

              {/* Description Box */}
              <div 
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                className={`mt-2 md:absolute md:top-24 text-center max-w-[200px] transition-all duration-500 md:z-50 ${
                  isHovered || isCurrentActive 
                    ? 'opacity-100 scale-100 pointer-events-auto translate-y-0 block' 
                    : 'opacity-0 scale-95 pointer-events-none md:translate-y-1 hidden md:block'
                }`}
              >
                <p className="text-xs text-neutral-400 bg-white/[0.02] border border-white/5 md:bg-neutral-900/90 md:border-white/10 md:backdrop-blur-md px-3 py-2 rounded-lg shadow-xl leading-relaxed font-light">
                  {stepInfo.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
