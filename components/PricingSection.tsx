// File: C:\dev\Studio\components\PricingSection.tsx
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
