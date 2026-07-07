'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Loader2, Gauge } from 'lucide-react';

interface SpeedCheckDict {
  title: string;
  subtitle: string;
  placeholder: string;
  btn_check: string;
  btn_analyzing: string;
  result_text: string;
  cta_btn: string;
}

interface SpeedCheckWidgetProps {
  dict: SpeedCheckDict;
}

export default function SpeedCheckWidget({ dict }: SpeedCheckWidgetProps) {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [scanStep, setScanStep] = useState(0);

  const steps = [
    'Initializing HTTP handshake...',
    'Analyzing Largest Contentful Paint (LCP)...',
    'Checking layout shift triggers (CLS)...',
    'Evaluating JS package thread blockades...'
  ];

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setStatus('scanning');
    setScanStep(0);
  };

  useEffect(() => {
    if (status !== 'scanning') return;

    const timer = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(timer);
          setStatus('done');
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [status]);

  const handleScrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
      <div className="flex flex-col gap-6 p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex items-center gap-3">
          <Gauge className="text-emerald-500 shrink-0 animate-pulse" size={24} />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{dict.title}</h2>
        </div>

        <p className="text-xs sm:text-sm text-neutral-350 leading-relaxed font-light -mt-2">
          {dict.subtitle}
        </p>

        {status === 'idle' && (
          <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <input
              required
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={dict.placeholder}
              aria-label="Website URL for speed test"
              className="flex-grow px-4 py-3 sm:py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:bg-white/10 transition-all text-sm sm:text-base min-h-[50px]"
            />
            <button
              type="submit"
              className="px-6 py-3 sm:py-4 rounded-xl bg-white text-black font-semibold hover:bg-neutral-100 transition-colors text-sm sm:text-base whitespace-nowrap min-h-[50px] active:scale-95"
            >
              {dict.btn_check}
            </button>
          </form>
        )}

        {status === 'scanning' && (
          <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
            <Loader2 className="animate-spin text-emerald-500" size={36} />
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-white tracking-wide">{dict.btn_analyzing}</span>
              <span className="text-xs text-neutral-400 font-mono transition-all duration-300">{steps[scanStep]}</span>
            </div>
            {/* Progress bar mock */}
            <div className="w-full max-w-md h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 mt-2">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                style={{ width: `${((scanStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {status === 'done' && (
          <div className="flex flex-col gap-6 py-2">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-xl bg-red-500/10 border border-red-500/20 text-center sm:text-left">
              <ShieldAlert className="text-red-400 shrink-0" size={28} />
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-red-400 uppercase tracking-widest">Performance Alert</span>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-light">
                  {dict.result_text}
                </p>
              </div>
            </div>

            <button
              onClick={handleScrollToContact}
              className="w-full py-3.5 sm:py-4 rounded-xl bg-emerald-600 text-white font-bold text-sm sm:text-base hover:bg-emerald-700 active:scale-95 transition-all text-center"
            >
              {dict.cta_btn}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
