'use client';

import { useState, type PointerEvent } from 'react';

export interface BeforeAfterDict {
  title: string;
  subtitle: string;
  before_label: string;
  after_label: string;
  after_title: string;
  after_desc: string;
  before_title: string;
  before_desc: string;
}

export default function BeforeAfterSlider({ dict }: { dict: BeforeAfterDict }) {
  const [position, setPosition] = useState(50);

  function moveDivider(event: PointerEvent<HTMLDivElement>) {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const percentage = ((event.clientX - left) / width) * 100;
    setPosition(Math.round(Math.max(0, Math.min(100, percentage))));
  }

  return (
    <section aria-labelledby="site-comparison-title" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col gap-8 sm:gap-12 relative z-10">
      <div className="flex flex-col items-center text-center gap-4">
        <h2 id="site-comparison-title" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          {dict.title}
        </h2>
        <p id="site-comparison-instructions" className="text-base sm:text-lg text-neutral-300 max-w-2xl font-light">
          {dict.subtitle}
        </p>
      </div>

      <div
        onPointerDown={(event) => {
          if (event.button !== 0 || !event.isPrimary) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          if (event.pointerType === 'mouse') moveDivider(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) moveDivider(event);
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) moveDivider(event);
        }}
        onKeyDown={(event) => {
          const next: Partial<Record<string, number>> = {
            ArrowLeft: position - 5,
            ArrowDown: position - 5,
            ArrowRight: position + 5,
            ArrowUp: position + 5,
            Home: 0,
            End: 100,
          };
          const value = Object.hasOwn(next, event.key) ? next[event.key] : undefined;
          if (value === undefined) return;
          event.preventDefault();
          setPosition(Math.max(0, Math.min(100, value)));
        }}
        tabIndex={0}
        role="slider"
        aria-valuenow={position}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={dict.title}
        aria-describedby="site-comparison-instructions"
        aria-valuetext={`${dict.before_label} ${position}%, ${dict.after_label} ${100 - position}%`}
        className="relative w-full aspect-[16/10] sm:aspect-[21/9] overflow-hidden rounded-3xl border border-white/10 touch-pan-y select-none cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      >
        {/* RIGHT LAYER (AFTER): Corebit Premium Speed Setup */}
        <div className="absolute inset-0 w-full h-full bg-[#050506]">
          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-tr from-emerald-950/20 via-neutral-950 to-neutral-950">
            {/* Mock Premium Interface */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-emerald-400 uppercase">Corebit Studio</span>
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-white/20" />
                <div className="h-2 w-2 rounded-full bg-white/20" />
                <div className="h-2 w-2 rounded-full bg-white/20" />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 my-auto text-left max-w-md sm:max-w-xl">
              <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                {dict.after_title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed hidden sm:block">
                {dict.after_desc}
              </p>
            </div>

          </div>

          {/* Label Tag */}
          <span className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-bold shadow-lg">
            {dict.after_label}
          </span>
        </div>

        {/* LEFT LAYER (BEFORE): Slow Legacy Website Mock */}
        <div
          className="absolute inset-0 h-full overflow-hidden bg-neutral-900"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <div className="absolute inset-0 w-full h-full p-6 sm:p-10 bg-neutral-950 flex flex-col justify-between">
            {/* Mock Legacy Interface */}
            <div className="flex justify-between items-center border-b border-red-900/20 pb-4">
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-red-500 uppercase">{dict.before_label}</span>
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-white/10" />
                <div className="h-2 w-2 rounded-full bg-white/10" />
                <div className="h-2 w-2 rounded-full bg-white/10" />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 my-auto text-left max-w-md sm:max-w-xl">
              <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-300 line-through leading-tight decoration-red-500/50">
                {dict.before_title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed hidden sm:block">
                {dict.before_desc}
              </p>
            </div>

          </div>

          {/* Label Tag */}
          <span className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold shadow-lg whitespace-nowrap">
            {dict.before_label}
          </span>
        </div>

        {/* SLIDER HANDLEBAR */}
        <div
          className="absolute top-0 bottom-0 w-12 -ml-6 cursor-ew-resize z-30 flex items-center justify-center"
          style={{ left: `${position}%` }}
        >
          {/* Sleek visual white dividing line */}
          <div className="w-0.5 h-full bg-white/50" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center text-xs font-bold border border-neutral-300">
            ↔
          </div>
        </div>
      </div>
    </section>
  );
}
