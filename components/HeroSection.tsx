'use client';

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export interface HeroDict {
  title: string;
  subtitle: string;
  cta: string;
  starter: string;
  cases_cta: string;
  case_label: string;
  case_cta: string;
  industry_title: string;
  module_cta: string;
}

interface HeroSectionProps {
  dict: HeroDict;
  starterPrice: number;
  featured?: {
    title: string;
    desc: string;
    href: string;
    label?: string;
    cta?: string;
  };
}

export default function HeroSection({ dict, starterPrice, featured }: HeroSectionProps) {
  const ctaRef = useRef<HTMLDivElement>(null);
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const buttonX = useSpring(mX, springConfig);
  const buttonY = useSpring(mY, springConfig);

  const handleCTAButtonMouseMove = (e: React.MouseEvent) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mX.set(x * 0.25);
    mY.set(y * 0.25);
  };

  const handleCTAButtonMouseLeave = () => {
    mX.set(0);
    mY.set(0);
  };

  const bgX = useMotionValue(0);
  const bgY = useMotionValue(0);
  const bgSpringConfig = { damping: 40, stiffness: 80, mass: 1 };
  const springBgX = useSpring(bgX, bgSpringConfig);
  const springBgY = useSpring(bgY, bgSpringConfig);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (typeof window === 'undefined') return;
      const xVal = (e.clientX - window.innerWidth / 2);
      const yVal = (e.clientY - window.innerHeight / 2);
      bgX.set(xVal * 0.12);
      bgY.set(yVal * 0.12);
    };
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [bgX, bgY]);

  return (
    <div className="relative w-full flex flex-col items-center">
      <motion.div
        style={{
          x: springBgX,
          y: springBgY,
        }}
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none z-0 will-change-transform"
      />

      <section
        className="relative z-10 flex w-full flex-col items-center gap-5 pt-9 text-center sm:gap-6 sm:pt-16"
      >
        <h1 
          className="max-w-5xl text-balance bg-gradient-to-b from-white to-neutral-300 bg-clip-text text-4xl font-bold leading-[1.08] tracking-tight text-transparent sm:text-5xl lg:text-7xl"
        >
          {dict.title}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl leading-relaxed font-light px-2">
          {dict.subtitle}
        </p>
        <p className="text-sm font-medium text-emerald-300">
          {dict.starter.replace('{price}', `€${starterPrice}`)}
        </p>

        <motion.div
          initial={{ y: 12 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-2 flex w-full flex-col items-center gap-3 px-4 sm:w-auto sm:flex-row sm:gap-4"
        >
          <motion.div
            ref={ctaRef}
            onMouseMove={handleCTAButtonMouseMove}
            onMouseLeave={handleCTAButtonMouseLeave}
            style={{ x: buttonX, y: buttonY }}
            className="w-full sm:w-auto relative z-20"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-white/20 blur-[30px] rounded-2xl pointer-events-none z-0" />
            
            <a
              href="#contact"
              className="group relative z-10 w-full sm:w-auto px-6 sm:px-8 py-4 rounded-2xl bg-white text-black font-semibold text-base sm:text-lg hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 min-h-[52px] shadow-[0_4px_24px_rgba(255,255,255,0.1)] overflow-hidden"
            >
              {/* Shimmer reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.08] to-transparent pointer-events-none animate-shimmer" />
              <span className="relative z-20 flex items-center gap-2">
                {dict.cta} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </motion.div>
          <a
            href="#portfolio"
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-white/15 px-6 py-3 text-base font-semibold text-neutral-200 transition-colors hover:border-white/30 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 sm:w-auto"
          >
            {dict.cases_cta}
          </a>
        </motion.div>
      </section>

      {featured && (
        <section className="relative z-10 mt-10 flex w-full max-w-4xl flex-col gap-4 border-y border-white/10 py-5 sm:mt-14 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-6">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-emerald-300">{featured.label || dict.case_label}</p>
            <h2 className="text-xl font-semibold tracking-tight text-white">{featured.title}</h2>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-400">{featured.desc}</p>
          </div>
          <a
            href={featured.href}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-md text-sm font-semibold text-white transition-colors hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 sm:self-center"
          >
            {featured.cta || dict.case_cta}
            <ArrowRight aria-hidden="true" size={16} />
          </a>
        </section>
      )}
    </div>
  );
}
