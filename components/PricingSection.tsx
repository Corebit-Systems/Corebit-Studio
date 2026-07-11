// File: C:\dev\Corebit-Studio\components\PricingSection.tsx
'use client';

import { useState } from 'react';

// ФИКС: Строгая типизация вместо dict: any
interface PricingTier {
  title: string;
  price: number;
  desc: string;
  btn: string;
}

interface PricingDict {
  title: string;
  subtitle: string;
  toggle_full: string;
  toggle_split: string;
  tier1: PricingTier;
  tier2: PricingTier;
  tier3: PricingTier;
}

interface PricingSectionProps {
  dict: PricingDict;
}

export default function PricingSection({ dict }: PricingSectionProps) {
  const [isFullPayment, setIsFullPayment] = useState(true);

  const calculatePrice = (basePrice: number): number => {
    return isFullPayment ? Math.floor(basePrice * 0.9) : basePrice;
  };

  return (
    <section id="pricing" className="flex flex-col gap-8 sm:gap-12 items-center w-full">
      <div className="text-center flex flex-col gap-3 sm:gap-4 px-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">{dict.title}</h2>
        <p className="text-base sm:text-xl text-neutral-400">{dict.subtitle}</p>
      </div>

      {/* Toggle — ФИКС: добавлен whitespace-nowrap, уменьшены паддинги на мобиле */}
      <div className="relative flex items-center p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md w-full max-w-sm mx-auto">
        <div
          className="absolute top-1 bottom-1 w-1/2 bg-white/10 rounded-full transition-transform duration-300 ease-in-out border border-white/20 shadow-lg"
          style={{ transform: isFullPayment ? 'translateX(0)' : 'translateX(100%)' }}
        />
        <button
          onClick={() => setIsFullPayment(true)}
          className={`relative z-10 flex-1 px-3 sm:px-6 py-3 text-xs sm:text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${isFullPayment ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
        >
          {dict.toggle_full}
        </button>
        <button
          onClick={() => setIsFullPayment(false)}
          className={`relative z-10 flex-1 px-3 sm:px-6 py-3 text-xs sm:text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${!isFullPayment ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
        >
          {dict.toggle_split}
        </button>
      </div>

      {/* Pricing grid */}
      {/* ФИКС: grid-cols-1 на мобиле, убран lg:-translate-y-4 у tier2 (вызывал обрезание) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full items-stretch">

        {/* Tier 1 */}
        <article className="group relative flex flex-col p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl gap-4 sm:gap-6 hover:bg-white/[0.04] hover:scale-[1.02] transition-all duration-300">
          <div className="absolute inset-0 rounded-[inherit] shadow-[0_0_50px_rgba(255,255,255,0.03)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[-1] will-change-opacity" />
          <h3 className="text-xl sm:text-2xl font-semibold">{dict.tier1.title}</h3>
          <div className="text-3xl sm:text-4xl font-bold">€{calculatePrice(dict.tier1.price)}</div>
          <p className="text-neutral-400 text-sm flex-grow">{dict.tier1.desc}</p>
          <a
            href="#contact"
            className="w-full py-4 mt-auto rounded-2xl bg-white text-black text-center font-semibold hover:bg-neutral-200 transition-colors min-h-[52px] flex items-center justify-center"
          >
            {dict.tier1.btn}
          </a>
        </article>

        {/* Tier 2 — Featured */}
        <article className="group relative flex flex-col p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2.5rem] border border-emerald-600/40 bg-emerald-600/[0.03] backdrop-blur-xl gap-4 sm:gap-6 overflow-hidden hover:scale-[1.02] transition-all duration-300 ring-1 ring-emerald-600/20">
          <div className="absolute inset-0 rounded-[inherit] shadow-[0_0_60px_rgba(16,185,129,0.15)] opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[-1] will-change-opacity" />
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600/0 via-emerald-600 to-emerald-600/0" />
          <h3 className="text-xl sm:text-2xl font-semibold text-emerald-400">{dict.tier2.title}</h3>
          <div className="text-3xl sm:text-4xl font-bold">€{calculatePrice(dict.tier2.price)}</div>
          <p className="text-neutral-400 text-sm flex-grow">{dict.tier2.desc}</p>
          <a
            href="#contact"
            className="w-full py-4 mt-auto rounded-2xl bg-emerald-500 text-black text-center font-bold hover:bg-emerald-600 transition-colors min-h-[52px] flex items-center justify-center"
          >
            {dict.tier2.btn}
          </a>
        </article>

        {/* Tier 3 */}
        <article className="group relative flex flex-col p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl gap-4 sm:gap-6 hover:bg-white/[0.04] hover:scale-[1.02] transition-all duration-300">
          <div className="absolute inset-0 rounded-[inherit] shadow-[0_0_50px_rgba(255,255,255,0.03)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[-1] will-change-opacity" />
          <h3 className="text-xl sm:text-2xl font-semibold">{dict.tier3.title}</h3>
          <div className="text-3xl sm:text-4xl font-bold">€{calculatePrice(dict.tier3.price)}</div>
          <p className="text-neutral-400 text-sm flex-grow">{dict.tier3.desc}</p>
          <a
            href="#contact"
            className="w-full py-4 mt-auto rounded-2xl border border-white/20 text-white text-center font-semibold hover:bg-white/10 transition-colors min-h-[52px] flex items-center justify-center"
          >
            {dict.tier3.btn}
          </a>
        </article>

      </div>
    </section>
  );
}
