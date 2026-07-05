// File: C:\dev\Studio\app\[locale]\page.tsx
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
