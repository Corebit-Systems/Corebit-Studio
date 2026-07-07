'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, ArrowRight } from 'lucide-react';

interface RoiCalculatorDict {
  title: string;
  slider1_label: string;
  slider2_label: string;
  result_desc: string;
  cta_btn: string;
}

interface RoiCalculatorProps {
  dict: RoiCalculatorDict;
}

export default function RoiCalculator({ dict }: RoiCalculatorProps) {
  const [lostClients, setLostClients] = useState(15);
  const [avgTicket, setAvgTicket] = useState(80);

  const monthlyLoss = lostClients * avgTicket;

  const handleScrollToContact = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Replace placeholder in translations securely
  const formatResult = (template: string, amount: number) => {
    const formattedAmount = amount.toLocaleString('de-DE'); // Use dot separators for Euro currency formats
    return template.replace('{amount}', formattedAmount);
  };

  return (
    <section className="w-full p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden flex flex-col gap-8 md:gap-12">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-0 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-emerald-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10">
        <TrendingDown className="text-red-500 shrink-0" size={24} />
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{dict.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
        {/* Sliders Block */}
        <div className="flex flex-col gap-6 sm:gap-8 justify-center">
          {/* Slider 1 */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm text-neutral-400">
              <span className="max-w-[80%] leading-relaxed font-light">{dict.slider1_label}</span>
              <span className="font-mono text-xl font-bold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10 shrink-0">
                {lostClients}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={lostClients}
              onChange={(e) => setLostClients(Number(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Slider 2 */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm text-neutral-400">
              <span className="max-w-[80%] leading-relaxed font-light">{dict.slider2_label}</span>
              <span className="font-mono text-xl font-bold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10 shrink-0">
                {avgTicket}€
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={avgTicket}
              onChange={(e) => setAvgTicket(Number(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>

        {/* Results Block */}
        <div className="flex flex-col justify-between items-center md:items-start p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-neutral-400 uppercase">
              Monthly Loss Estimation
            </span>
            <motion.div
              key={monthlyLoss}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-4xl sm:text-5xl font-extrabold text-red-500 tracking-tight"
            >
              -{monthlyLoss.toLocaleString('de-DE')} €
            </motion.div>
            <p className="text-sm sm:text-base text-neutral-400 mt-2 leading-relaxed font-light">
              {formatResult(dict.result_desc, monthlyLoss)}
            </p>
          </div>

          <button
            onClick={handleScrollToContact}
            className="group w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white text-black font-bold text-base hover:bg-neutral-200 transition-colors active:scale-95"
          >
            {dict.cta_btn}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
