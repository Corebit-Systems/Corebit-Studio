'use client';

import { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  dict: {
    title: string;
    subtitle: string;
    before_label: string;
    after_label: string;
    after_badge: string;
    after_title: string;
    after_desc: string;
    after_status: string;
    after_score: string;
    before_badge: string;
    before_title: string;
    before_desc: string;
    before_status: string;
    before_score: string;
    before_site_label: string;
  };
}

export default function BeforeAfterSlider({ dict }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const containerRect = useRef<DOMRect | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined);

  const handleMove = (clientX: number) => {
    if (!containerRect.current) return;
    const rect = containerRect.current;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    requestAnimationFrame(() => setPosition(percentage));
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (containerRef.current) {
      containerRect.current = containerRef.current.getBoundingClientRect();
    }
    isDragging.current = true;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current) {
      containerRect.current = containerRef.current.getBoundingClientRect();
    }
    isDragging.current = true;
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPosition((prev) => Math.min(100, prev + 5));
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver((entries) => {
        requestAnimationFrame(() => setContainerWidth(entries[0].contentRect.width));
      });
      observer.observe(containerRef.current);
      return () => {
        observer.disconnect();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col gap-8 sm:gap-12 relative z-10">
      <div className="flex flex-col items-center text-center gap-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          {dict.title}
        </h2>
        <p className="text-base sm:text-lg text-neutral-350 max-w-2xl font-light">
          {dict.subtitle}
        </p>
      </div>

      <div
        ref={containerRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuenow={position}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Before and after website speed comparison slider"
        className="relative w-full aspect-[16/10] sm:aspect-[21/9] overflow-hidden rounded-3xl border border-white/10 select-none cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold w-fit">
                {dict.after_badge}
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                {dict.after_title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed hidden sm:block">
                {dict.after_desc}
              </p>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-4 text-[10px] sm:text-xs text-neutral-400 font-mono">
              <span>{dict.after_status}</span>
              <span>{dict.after_score}</span>
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
          style={{ width: `${position}%` }}
        >
          <div className="absolute inset-0 w-full h-full p-6 sm:p-10 bg-neutral-950 flex flex-col justify-between" style={{ width: containerWidth }}>
            {/* Mock Legacy Interface */}
            <div className="flex justify-between items-center border-b border-red-900/10 pb-4 opacity-40">
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-red-500 uppercase">{dict.before_site_label}</span>
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-white/10" />
                <div className="h-2 w-2 rounded-full bg-white/10" />
                <div className="h-2 w-2 rounded-full bg-white/10" />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 my-auto text-left max-w-md sm:max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold w-fit animate-pulse">
                {dict.before_badge}
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-500 line-through leading-tight decoration-red-500/50">
                {dict.before_title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed hidden sm:block blur-[1px]">
                {dict.before_desc}
              </p>
            </div>

            <div className="flex justify-between items-center border-t border-red-900/10 pt-4 text-[10px] sm:text-xs text-red-400/60 font-mono">
              <span>{dict.before_status}</span>
              <span>{dict.before_score}</span>
            </div>
          </div>

          {/* Label Tag */}
          <span className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold shadow-lg whitespace-nowrap">
            {dict.before_label}
          </span>
        </div>

        {/* SLIDER HANDLEBAR */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/50 cursor-ew-resize z-30"
          style={{ left: `${position}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center text-xs font-bold border border-neutral-300">
            ↔
          </div>
        </div>
      </div>
    </section>
  );
}
