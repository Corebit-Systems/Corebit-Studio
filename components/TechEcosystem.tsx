'use client';

import { useState } from 'react';
import { Cpu, RefreshCw, CreditCard, MessageSquare, Search, ArrowRight } from 'lucide-react';

interface ModuleData {
  title: string;
  desc: string;
}

interface EcosystemDict {
  title: string;
  subtitle: string;
  core_label: string;
  modules: {
    pms: ModuleData;
    pay: ModuleData;
    notify: ModuleData;
    seo: ModuleData;
  };
}

interface TechEcosystemProps {
  dict: EcosystemDict;
}

export default function TechEcosystem({ dict }: TechEcosystemProps) {
  const [activeTab, setActiveTab] = useState<'pms' | 'pay' | 'notify' | 'seo'>('pms');

  const tabs = [
    {
      id: 'pms' as const,
      icon: <RefreshCw size={20} />,
      data: dict.modules.pms
    },
    {
      id: 'pay' as const,
      icon: <CreditCard size={20} />,
      data: dict.modules.pay
    },
    {
      id: 'notify' as const,
      icon: <MessageSquare size={20} />,
      data: dict.modules.notify
    },
    {
      id: 'seo' as const,
      icon: <Search size={20} />,
      data: dict.modules.seo
    }
  ];

  const handleKeyDown = (e: React.KeyboardEvent, id: 'pms' | 'pay' | 'notify' | 'seo') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(id);
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col gap-10 sm:gap-14 relative z-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          {dict.title}
        </h2>
        <p className="text-base sm:text-lg text-neutral-350 max-w-2xl font-light">
          {dict.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Interactive Diagram Schema (SVG + Tailwind) */}
        <div className="lg:col-span-6 flex items-center justify-center p-4">
          <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] flex items-center justify-center select-none">
            {/* SVG Connecting Dotted Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {/* Lines from Center to Nodes */}
              <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="url(#gradient-line)" strokeWidth="2" strokeDasharray="6,4" />
              <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="url(#gradient-line)" strokeWidth="2" strokeDasharray="6,4" />
              <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="url(#gradient-line)" strokeWidth="2" strokeDasharray="6,4" />
              <line x1="50%" y1="50%" x2="15%" y2="50%" stroke="url(#gradient-line)" strokeWidth="2" strokeDasharray="6,4" />
            </svg>

            {/* Core Node: Center */}
            <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center text-center p-2 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
              <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping opacity-20 pointer-events-none" />
              <Cpu size={24} className="text-emerald-400 mb-1" />
              <span className="text-[10px] sm:text-xs font-bold text-white tracking-tight uppercase leading-none">
                {dict.core_label.split(' ').slice(0,2).join(' ')}<br />
                <span className="text-[8px] text-neutral-400">{dict.core_label.split(' ').slice(2).join(' ')}</span>
              </span>
            </div>

            {/* PMS Node (Top) */}
            <button
              onClick={() => setActiveTab('pms')}
              onKeyDown={(e) => handleKeyDown(e, 'pms')}
              className={`absolute top-[5%] left-[50%] -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'pms'
                  ? 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-110 border-white'
                  : 'bg-white/5 text-neutral-400 border border-white/10 hover:border-white/20'
              }`}
              aria-label="Toggle PMS sync details"
            >
              <RefreshCw size={22} className={activeTab === 'pms' ? 'animate-spin-slow' : ''} />
            </button>

            {/* Payment Node (Right) */}
            <button
              onClick={() => setActiveTab('pay')}
              onKeyDown={(e) => handleKeyDown(e, 'pay')}
              className={`absolute right-[5%] top-[50%] -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'pay'
                  ? 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-110 border-white'
                  : 'bg-white/5 text-neutral-400 border border-white/10 hover:border-white/20'
              }`}
              aria-label="Toggle payment gateways details"
            >
              <CreditCard size={22} />
            </button>

            {/* Notification Node (Bottom) */}
            <button
              onClick={() => setActiveTab('notify')}
              onKeyDown={(e) => handleKeyDown(e, 'notify')}
              className={`absolute bottom-[5%] left-[50%] -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'notify'
                  ? 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-110 border-white'
                  : 'bg-white/5 text-neutral-400 border border-white/10 hover:border-white/20'
              }`}
              aria-label="Toggle customer alerts details"
            >
              <MessageSquare size={22} />
            </button>

            {/* SEO/AEO Node (Left) */}
            <button
              onClick={() => setActiveTab('seo')}
              onKeyDown={(e) => handleKeyDown(e, 'seo')}
              className={`absolute left-[5%] top-[50%] -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'seo'
                  ? 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-110 border-white'
                  : 'bg-white/5 text-neutral-400 border border-white/10 hover:border-white/20'
              }`}
              aria-label="Toggle SEO/AEO search details"
            >
              <Search size={22} />
            </button>
          </div>
        </div>

        {/* Info Card Block */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl relative min-h-[220px]">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                {tabs.find((t) => t.id === activeTab)?.icon}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {tabs.find((t) => t.id === activeTab)?.data.title}
              </h3>
            </div>
            
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
              {tabs.find((t) => t.id === activeTab)?.data.desc}
            </p>

            {/* Quick indicators */}
            <div className="flex gap-2 items-center text-xs text-emerald-400 font-mono mt-auto">
              <span>Ready for integration</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
