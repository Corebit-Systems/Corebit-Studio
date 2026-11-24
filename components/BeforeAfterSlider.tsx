'use client';

import { useState, type PointerEvent } from 'react';
import { CalendarCheck, ChevronsLeftRight, Clock3, MessageCircle } from 'lucide-react';

export interface BeforeAfterDict {
  title: string;
  subtitle: string;
  before_label: string;
  after_label: string;
  before_title: string;
  before_desc: string;
  after_title: string;
  after_desc: string;
}

const slots = ['10:00', '11:30', '14:00', '15:30'];
const endpointStyle = 'min-h-11 rounded-lg px-2 text-left text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 sm:px-3 sm:text-sm';

export default function BeforeAfterSlider({ dict }: { dict: BeforeAfterDict }) {
  const [position, setPosition] = useState(50);
  const [animate, setAnimate] = useState(false);

  function moveDivider(event: PointerEvent<HTMLDivElement>) {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    setPosition(Math.round(Math.max(0, Math.min(100, (event.clientX - left) / width * 100))));
  }

  return (
    <section aria-labelledby="site-comparison-title" className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 py-12 sm:gap-8 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl space-y-3 px-2 text-center">
        <h2 id="site-comparison-title" className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {dict.title}
        </h2>
        <p className="text-sm leading-relaxed text-neutral-300 sm:text-lg">{dict.subtitle}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-2 sm:rounded-3xl sm:p-3">
        <div aria-hidden="true" className="flex h-9 items-center gap-1.5 px-3 sm:h-10">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/40" />
        </div>
        <div
          aria-hidden="true"
          className="relative h-52 touch-pan-y select-none overflow-hidden rounded-xl border border-white/10 bg-[#070c0b] cursor-ew-resize sm:h-72 sm:rounded-2xl"
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            setAnimate(false);
            if (event.pointerType === 'mouse') moveDivider(event);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) moveDivider(event);
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) moveDivider(event);
          }}
        >
          <div className="absolute inset-0 flex items-center justify-end bg-[radial-gradient(ellipse_at_right,_rgba(16,185,129,0.19),_transparent_72%)] p-3 sm:p-9">
            <div className="w-[43%] max-w-xs rounded-xl border border-emerald-400/25 bg-[#0b1512] p-2.5 shadow-lg sm:p-5">
              <div className="mb-3 flex items-center justify-between text-emerald-300">
                <CalendarCheck size={21} />
                <span className="hidden h-px w-8 bg-emerald-400/40 sm:block" />
              </div>
              <div className="grid grid-cols-2 gap-1 sm:gap-2">
                {slots.map((slot) => (
                  <span key={slot} className={`rounded-md border px-0.5 py-2 text-center text-[9px] font-semibold tabular-nums sm:px-2 sm:text-xs ${slot === '14:00' ? 'border-emerald-300/70 bg-emerald-300 text-emerald-950' : 'border-white/10 bg-white/5 text-neutral-200'}`}>
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div
            className={`absolute inset-0 flex items-center bg-[radial-gradient(ellipse_at_left,_#202123,_#101112_72%)] p-3 sm:p-9 ${animate ? 'motion-safe:transition-[clip-path] motion-safe:duration-500 motion-safe:ease-out' : ''}`}
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <div className="w-[43%] max-w-xs space-y-2 rounded-xl border border-white/10 bg-[#18191b] p-2.5 shadow-lg sm:space-y-3 sm:p-5">
              <MessageCircle size={21} className="mb-3 text-neutral-300" />
              <div className="flex h-6 w-4/5 items-center rounded-lg rounded-bl-sm bg-white/10 px-2 sm:h-8">
                <div className="h-px w-full bg-neutral-500" />
              </div>
              <div className="ml-auto flex h-6 w-3/4 items-center justify-end rounded-lg rounded-br-sm bg-white/[0.06] px-2 text-neutral-300 sm:h-8">
                <Clock3 size={13} />
              </div>
              <div className="flex h-6 w-2/3 items-center rounded-lg rounded-bl-sm bg-white/10 px-2 sm:h-8">
                <div className="h-px w-full bg-neutral-500" />
              </div>
            </div>
          </div>
          <div
            className={`pointer-events-none absolute inset-y-0 w-px bg-emerald-200/65 ${animate ? 'motion-safe:transition-[left] motion-safe:duration-500 motion-safe:ease-out' : ''}`}
            style={{ left: `${position}%` }}
          >
            <span className="absolute left-0 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-emerald-200/60 bg-[#091510] text-emerald-100 shadow-[0_0_28px_rgba(16,185,129,0.34)]">
              <ChevronsLeftRight size={19} />
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-1 pt-1 sm:gap-4">
          <button type="button" className={`${endpointStyle} text-neutral-300 hover:bg-white/5 hover:text-white`} onClick={() => { setAnimate(true); setPosition(100); }}>
            {dict.before_label}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={position}
            aria-label={dict.title}
            aria-valuetext={`${dict.before_label} ${position}%, ${dict.after_label} ${100 - position}%`}
            className="h-11 min-w-8 flex-1 cursor-ew-resize rounded-full accent-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
            onChange={(event) => { setAnimate(false); setPosition(Number(event.target.value)); }}
          />
          <button type="button" className={`${endpointStyle} text-right text-emerald-300 hover:bg-emerald-400/10 hover:text-emerald-200`} onClick={() => { setAnimate(true); setPosition(0); }}>
            {dict.after_label}
          </button>
        </div>
      </div>

      <div className="grid gap-4 divide-y divide-white/10 px-2 sm:grid-cols-2 sm:gap-8 sm:divide-x sm:divide-y-0">
        <div>
          <h3 className="text-base font-semibold text-white">{dict.before_title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-neutral-400">{dict.before_desc}</p>
        </div>
        <div className="pt-4 sm:pl-8 sm:pt-0">
          <h3 className="text-base font-semibold text-white">{dict.after_title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-neutral-400">{dict.after_desc}</p>
        </div>
      </div>
    </section>
  );
}
