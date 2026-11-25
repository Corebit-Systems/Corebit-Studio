'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CalendarCheck, Check, Monitor, Smartphone, Tablet, Users } from 'lucide-react';
import type { Locale } from '@/i18n/getDictionary';
import styles from './ResponsivePreview.module.css';

const devices = [
  { width: 360, Icon: Smartphone },
  { width: 768, Icon: Tablet },
  { width: 1040, Icon: Monitor },
] as const;
const slots = ['18:00', '19:30', '21:00'];
const parties = [2, 4, 6];

interface Copy {
  title: string;
  intro: string;
  devices: readonly [string, string, string];
  width: string;
  booking: string;
  guests: string;
  time: string;
  choose: string;
  selection: string;
}

const copyByLocale: Record<Locale, Copy> = {
  ru: {
    title: 'Один сайт. Любой экран.',
    intro: 'Переключайте устройства или потяните ползунок. Попробуйте выбрать время до и после смены ширины.',
    devices: ['Телефон', 'Планшет', 'Компьютер'], width: 'Ширина экрана', booking: 'Столик на вечер',
    guests: 'Гостей', time: 'Время', choose: 'Выберите время', selection: 'Ваш выбор',
  },
  en: {
    title: 'One website. Any screen.',
    intro: 'Switch devices or drag the slider. Try choosing a time before and after changing the width.',
    devices: ['Phone', 'Tablet', 'Desktop'], width: 'Viewport width', booking: 'A table for tonight',
    guests: 'Guests', time: 'Time', choose: 'Choose a time', selection: 'Your selection',
  },
  cnr: {
    title: 'Jedan sajt. Svaki ekran.',
    intro: 'Promijenite uređaj ili pomjerite klizač. Izaberite termin i pogledajte šta se dešava kad promijenite širinu.',
    devices: ['Telefon', 'Tablet', 'Računar'], width: 'Širina ekrana', booking: 'Sto za večeras',
    guests: 'Gosti', time: 'Vrijeme', choose: 'Izaberite termin', selection: 'Vaš izbor',
  },
  srb: {
    title: 'Jedan sajt. Svaki ekran.',
    intro: 'Promenite uređaj ili pomerite klizač. Izaberite termin i pogledajte šta se dešava kad promenite širinu.',
    devices: ['Telefon', 'Tablet', 'Računar'], width: 'Širina ekrana', booking: 'Sto za večeras',
    guests: 'Gosti', time: 'Vreme', choose: 'Izaberite termin', selection: 'Vaš izbor',
  },
  sq: {
    title: 'Një faqe. Çdo ekran.',
    intro: 'Ndërroni pajisjen ose tërhiqni rrëshqitësin. Zgjidhni orarin dhe shihni çfarë ndodh kur ndryshon gjerësia.',
    devices: ['Telefon', 'Tablet', 'Kompjuter'], width: 'Gjerësia e ekranit', booking: 'Një tavolinë për sonte',
    guests: 'Mysafirë', time: 'Orari', choose: 'Zgjidhni orarin', selection: 'Zgjedhja juaj',
  },
};

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300';
const option = `min-h-11 min-w-0 rounded-lg border border-white/10 px-1 text-center text-sm font-medium tabular-nums text-neutral-200 hover:border-emerald-300/40 aria-pressed:border-emerald-300/50 aria-pressed:bg-emerald-300/15 aria-pressed:text-emerald-100 ${focus}`;

export default function ResponsivePreview({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale];
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(devices[2].width);
  const [stageWidth, setStageWidth] = useState(0);
  const [frameHeight, setFrameHeight] = useState(0);
  const [guests, setGuests] = useState(parties[0]);
  const [time, setTime] = useState<string>();

  useEffect(() => {
    if (window.matchMedia('(max-width: 639px)').matches) setWidth(devices[0].width);
    const outer = stage.current;
    const inner = frame.current;
    if (!outer || !inner || !window.ResizeObserver) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === outer) setStageWidth(entry.contentRect.width);
        if (entry.target === inner) setFrameHeight(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height);
      }
    });
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  const scaled = stageWidth > 0 && frameHeight > 0;
  const scale = scaled ? Math.min(1, stageWidth / width) : 1;

  return (
    <section id="responsive-preview" aria-labelledby="responsive-preview-title" className={`${styles.lab} grid gap-5 sm:gap-7`}>
      <div className="space-y-2">
        <h2 id="responsive-preview-title" className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">{copy.title}</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base">{copy.intro}</p>
      </div>

      <div className={`${styles.shell} overflow-hidden rounded-3xl border border-emerald-300/20`}>
        <div className="grid items-center gap-4 border-b border-emerald-300/15 px-3 py-3 sm:px-5 lg:grid-cols-[auto_minmax(14rem,20rem)] lg:justify-between">
          <div role="group" aria-label={copy.width} className="grid grid-cols-3 gap-1 sm:flex sm:gap-2">
            {devices.map(({ width: preset, Icon }, index) => (
              <button type="button" key={preset} aria-pressed={width === preset} onClick={() => setWidth(preset)}
                className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-transparent px-1 text-[11px] font-medium text-neutral-300 hover:text-white aria-pressed:border-emerald-300/30 aria-pressed:bg-emerald-300/10 aria-pressed:text-emerald-200 sm:px-3 sm:text-sm ${focus}`}>
                <Icon aria-hidden="true" size={16} className="shrink-0" />
                <span className="min-w-0 break-words">{copy.devices[index]}</span>
              </button>
            ))}
          </div>
          <label className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 text-xs font-medium text-neutral-300">
            <span>{copy.width}</span>
            <span aria-hidden="true" className="font-mono tabular-nums text-emerald-200">{width} px</span>
            <input aria-valuetext={`${width} px`} type="range" min={320} max={1080} step={1} value={width}
              onChange={event => setWidth(Number(event.currentTarget.value))}
              className={`col-span-2 h-6 w-full min-w-0 cursor-ew-resize accent-emerald-300 ${focus}`} />
          </label>
        </div>

        <div className={`${styles.workspace} px-2 py-5 sm:px-5 sm:py-8`}>
          <div ref={stage} className="mx-auto flex min-w-0 justify-center">
            <div className={`${styles.viewport} relative max-w-full`}
              style={scaled ? { width: width * scale, height: frameHeight * scale } : undefined}>
              <div ref={frame}
                className={`${styles.frame} overflow-hidden rounded-xl border border-emerald-200/25 bg-[#0a120e] shadow-[0_18px_70px_rgba(0,0,0,.55)] sm:rounded-2xl`}
                style={scaled ? { position: 'absolute', width, transform: `scale(${scale})` } : undefined}>
                <div className="relative flex min-h-10 items-center justify-center border-b border-white/10 bg-[#101a14] px-12 py-2 text-center text-xs font-semibold text-neutral-300">
                  <span aria-hidden="true" className="absolute left-3 flex gap-1">
                    <i className="size-1.5 rounded-full bg-emerald-200/30" /><i className="size-1.5 rounded-full bg-emerald-200/45" /><i className="size-1.5 rounded-full bg-emerald-200/60" />
                  </span>
                  Umami Bistro
                </div>
                <div className={styles.preview}>
                  <div className={styles.content}>
                    <div className={`${styles.photo} relative isolate overflow-hidden`}>
                      <Image src="/portfolio-scenes/umami.webp" unoptimized fill sizes="(max-width: 640px) 100vw, 800px" alt="" className="object-cover object-[70%_center]" />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070c09] via-[#070c09]/15 to-transparent" />
                      <p className={`${styles.booking} absolute inset-x-0 bottom-0 p-4 font-semibold leading-tight tracking-tight text-white`}>{copy.booking}</p>
                    </div>
                    <div className={`${styles.fields} grid content-center gap-4 p-3`}>
                      <fieldset className="min-w-0">
                        <legend className="mb-2 flex items-center gap-2 text-xs font-semibold text-emerald-200"><Users aria-hidden="true" size={15} />{copy.guests}</legend>
                        <div className="grid grid-cols-3 gap-1.5">
                          {parties.map(party => <button key={party} type="button" aria-pressed={party === guests} className={option} onClick={() => setGuests(party)}>{party}</button>)}
                        </div>
                      </fieldset>
                      <fieldset className="min-w-0">
                        <legend className="mb-2 flex items-center gap-2 text-xs font-semibold text-emerald-200"><CalendarCheck aria-hidden="true" size={15} />{copy.time}</legend>
                        <div className="grid grid-cols-3 gap-1.5">
                          {slots.map(slot => <button key={slot} type="button" aria-pressed={slot === time} className={option} onClick={() => setTime(slot)}>{slot}</button>)}
                        </div>
                      </fieldset>
                      <p aria-live="polite" className="flex min-h-11 items-center gap-2 rounded-lg border border-emerald-300/25 bg-emerald-300/[0.07] px-2 py-2 text-xs font-medium text-emerald-100">
                        {time ? <><Check aria-hidden="true" size={14} className="shrink-0" />{copy.selection} · {time} · {copy.guests} {guests}</> : copy.choose}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
