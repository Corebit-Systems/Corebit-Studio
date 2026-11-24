'use client';

import { useRef, useState, type PointerEvent } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Layers3 } from 'lucide-react';
import type { Locale } from '@/i18n/getDictionary';
import heroArtwork from '@/public/hero-emerald-core.webp';

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
  interactiveLocale?: Locale;
  featured?: {
    title: string;
    desc: string;
    href: string;
    label?: string;
    cta?: string;
  };
}

const pointerSpring = { stiffness: 75, damping: 24 };
const focusStyle = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400';
const HeroCore = dynamic(() => import('./HeroCore'), { ssr: false });
const coreLabels: Record<Locale, string> = {
  en: 'Separate the layers',
  ru: 'Раздвинуть слои',
  cnr: 'Razdvoji slojeve',
  srb: 'Razdvoji slojeve',
  sq: 'Ndaji shtresat',
};

export default function HeroSection({ dict, starterPrice, featured, interactiveLocale }: HeroSectionProps) {
  const sceneRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [coreReady, setCoreReady] = useState(false);
  const [coreExpanded, setCoreExpanded] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const artworkX = useSpring(pointerX, pointerSpring);
  const artworkY = useSpring(pointerY, pointerSpring);
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start start', 'end start'],
  });
  const scrollOffset = useTransform(scrollYProgress, [0, 1], [0, 72]);

  function moveArtwork(event: PointerEvent<HTMLElement>) {
    if (coreReady || reduceMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 32);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 22);
  }

  function resetArtwork() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div className="relative w-screen self-center">
      <section
        ref={sceneRef}
        data-interactive-core={Boolean(interactiveLocale)}
        onPointerMove={moveArtwork}
        onPointerLeave={resetArtwork}
        className="relative isolate overflow-hidden"
      >
        <div aria-hidden="true" data-core-ready={coreReady} className="hero-artwork pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-[1800px] overflow-hidden">
          <motion.div style={{ y: reduceMotion ? 0 : scrollOffset }} className="hero-artwork-scroll absolute inset-0">
            <motion.div
              style={{ x: reduceMotion ? 0 : artworkX, y: reduceMotion ? 0 : artworkY }}
              className="hero-artwork-image absolute inset-0"
            >
              <Image
                src={heroArtwork}
                alt=""
                fill
                preload
                sizes="(min-width: 1800px) 1800px, 100vw"
                className="object-cover object-right"
              />
            </motion.div>
          </motion.div>
          {interactiveLocale && (
            <div className="hero-core absolute inset-y-0 right-0 w-full motion-reduce:hidden lg:w-[60%]">
              <HeroCore expanded={coreExpanded} onReady={setCoreReady} />
            </div>
          )}
        </div>
        {interactiveLocale && coreReady && !reduceMotion && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:justify-end">
            <button
              type="button"
              aria-pressed={coreExpanded}
              onClick={() => setCoreExpanded(previous => !previous)}
              className={`pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-full border border-emerald-300/35 bg-[#080f0e]/95 px-4 text-sm font-medium text-emerald-200 transition-colors hover:border-emerald-300/70 hover:bg-[#10261f] aria-pressed:bg-emerald-300 aria-pressed:text-[#06100c] ${focusStyle}`}
            >
              <Layers3 aria-hidden="true" size={17} />
              {coreLabels[interactiveLocale]}
            </button>
          </div>
        )}

        <div className="hero-content relative mx-auto flex min-h-[34rem] w-full max-w-7xl items-center px-4 pb-44 pt-10 sm:px-6 sm:pb-52 sm:pt-12 lg:py-16">
          <div className="flex w-full max-w-[45rem] flex-col items-start gap-5 sm:gap-6 lg:w-[59%]">
            <h1 className="hero-enter text-balance text-4xl font-bold leading-[1.07] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              {dict.title}
            </h1>
            <p className="hero-enter hero-enter-detail max-w-xl text-pretty text-base leading-relaxed text-neutral-300 sm:text-lg md:text-xl">
              {dict.subtitle}
            </p>
            <div className="hero-enter hero-enter-actions flex w-full flex-col gap-4">
              <p className="text-sm font-medium text-emerald-300">
                {dict.starter.replace('{price}', `€${starterPrice}`)}
              </p>
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#contact"
                  className={`group relative inline-flex min-h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-white px-5 py-3 text-center text-base font-semibold text-black transition-colors hover:bg-emerald-50 sm:px-6 ${focusStyle}`}
                >
                  <span>{dict.cta}</span>
                  <ArrowRight aria-hidden="true" size={20} className="shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
                </a>
                <a
                  href="#portfolio"
                  className={`inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/20 bg-[#050506]/50 px-5 py-3 text-center text-base font-semibold text-neutral-200 transition-colors hover:border-emerald-400/50 hover:text-white sm:px-6 ${focusStyle}`}
                >
                  {dict.cases_cta}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {featured && (
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
          <section className="flex w-full flex-col gap-4 border-y border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-6">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-emerald-300">{featured.label || dict.case_label}</p>
              <h2 className="text-xl font-semibold tracking-tight text-white">{featured.title}</h2>
              <p className="max-w-xl text-sm leading-relaxed text-neutral-400">{featured.desc}</p>
            </div>
            <a
              href={featured.href}
              className={`group inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-md text-sm font-semibold text-white transition-colors hover:text-emerald-300 sm:self-center ${focusStyle}`}
            >
              {featured.cta || dict.case_cta}
              <ArrowUpRight aria-hidden="true" size={16} className="motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
            </a>
          </section>
        </div>
      )}
    </div>
  );
}
