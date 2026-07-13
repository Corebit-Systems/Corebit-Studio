'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroDict {
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
}

interface HeroSectionProps {
  dict: HeroDict;
  locale: string;
}

export default function HeroSection({ dict, locale }: HeroSectionProps) {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

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
        className="flex flex-col items-center text-center gap-6 sm:gap-8 pt-8 sm:pt-16 relative z-10 w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-neutral-300 backdrop-blur-md shadow-2xl"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span className="line-clamp-1">{dict.badge}</span>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 max-w-5xl leading-tight">
          {dict.title}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl leading-relaxed font-light px-2">
          {dict.subtitle}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 mt-4 sm:mt-8 w-full sm:w-auto px-4"
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
              href={`/${locale}#contact`}
              className="group relative z-10 w-full sm:w-auto px-6 sm:px-8 py-4 rounded-2xl bg-white text-black font-semibold text-base sm:text-lg hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 min-h-[52px] shadow-[0_4px_24px_rgba(255,255,255,0.1)] overflow-hidden"
            >
              <motion.div
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -skew-x-12 pointer-events-none"
              />
              <span className="relative z-20 flex items-center gap-2">
                {dict.cta} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
