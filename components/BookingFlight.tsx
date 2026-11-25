'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { CalendarCheck, CalendarClock, MessageSquare, Pause, Play } from 'lucide-react';
import type { Locale } from '@/i18n/getDictionary';
import styles from './BookingFlight.module.css';

const Canvas = dynamic(() => import('./BookingFlightCanvas'), { ssr: false });
const icons = [CalendarClock, CalendarCheck, MessageSquare] as const;
const finalStage = icons.length - 1;

interface Copy {
  title: string;
  description: string;
  play: string;
  pause: string;
  stages: [readonly [string, string], readonly [string, string], readonly [string, string]];
}

const copies: Record<Locale, Copy> = {
  ru: {
    title: 'Что происходит после клика',
    description: 'Проследите путь онлайн-записи от выбора времени до уведомления команды.',
    play: 'Запустить сценарий',
    pause: 'Пауза',
    stages: [
      ['Выбор времени', 'Клиент видит свободные часы и выбирает подходящий.'],
      ['Подтверждение', 'Система фиксирует запись и закрывает выбранное время в календаре.'],
      ['Уведомление', 'Команда получает детали записи и может подготовиться к визиту.'],
    ],
  },
  en: {
    title: 'What happens after the click',
    description: 'Follow an online booking from the time selection to the team notification.',
    play: 'Run the scenario',
    pause: 'Pause',
    stages: [
      ['Choose a time', 'The customer sees available times and picks one.'],
      ['Confirm the booking', 'The system records the appointment and blocks the selected time in the calendar.'],
      ['Notify the team', 'The team receives the booking details and can prepare for the visit.'],
    ],
  },
  cnr: {
    title: 'Šta se događa poslije klika',
    description: 'Pratite onlajn rezervaciju od izbora termina do obavještenja timu.',
    play: 'Pokreni scenario',
    pause: 'Pauza',
    stages: [
      ['Izbor termina', 'Klijent vidi slobodne termine i bira onaj koji mu odgovara.'],
      ['Potvrda rezervacije', 'Sistem bilježi rezervaciju i zauzima izabrani termin u kalendaru.'],
      ['Obavještenje timu', 'Tim dobija detalje rezervacije i može da se pripremi za posjetu.'],
    ],
  },
  srb: {
    title: 'Šta se događa posle klika',
    description: 'Pratite onlajn rezervaciju od izbora termina do obaveštenja timu.',
    play: 'Pokreni scenario',
    pause: 'Pauza',
    stages: [
      ['Izbor termina', 'Klijent vidi slobodne termine i bira onaj koji mu odgovara.'],
      ['Potvrda rezervacije', 'Sistem beleži rezervaciju i zauzima izabrani termin u kalendaru.'],
      ['Obaveštenje timu', 'Tim dobija detalje rezervacije i može da se pripremi za posetu.'],
    ],
  },
  sq: {
    title: 'Çfarë ndodh pas klikimit',
    description: 'Ndiqni një rezervim online nga zgjedhja e orarit deri te njoftimi i ekipit.',
    play: 'Nis skenarin',
    pause: 'Pauzë',
    stages: [
      ['Zgjedhja e orarit', 'Klienti sheh oraret e lira dhe zgjedh atë që i përshtatet.'],
      ['Konfirmimi', 'Sistemi regjistron rezervimin dhe bllokon orarin e zgjedhur në kalendar.'],
      ['Njoftimi i ekipit', 'Ekipi merr hollësitë e rezervimit dhe mund të përgatitet për vizitën.'],
    ],
  },
};

export default function BookingFlight({ locale }: { locale: Locale }) {
  const copy = copies[locale];
  const stageRef = useRef<HTMLDivElement>(null);
  const [loadCanvas, setLoadCanvas] = useState(false);
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = stageRef.current;
    if (!element || !window.IntersectionObserver) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      if (!reduced.matches) setLoadCanvas(true);
    }, { rootMargin: '250px' });
    const onMotionChange = () => {
      if (!reduced.matches) setLoadCanvas(true);
    };
    observer.observe(element);
    reduced.addEventListener('change', onMotionChange);
    return () => {
      observer.disconnect();
      reduced.removeEventListener('change', onMotionChange);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (stage === finalStage) setPlaying(false);
      else setStage(stage + 1);
    }, 2100);
    return () => window.clearTimeout(timer);
  }, [playing, stage]);

  function togglePlayback() {
    if (playing) {
      setPlaying(false);
    } else {
      setStage(0);
      setPlaying(true);
    }
  }

  function selectStage(index: number) {
    setPlaying(false);
    setStage(index);
  }

  return (
    <section id="booking-flight" aria-labelledby="booking-flight-title" className="flex w-full flex-col gap-7 sm:gap-9">
      <div className="space-y-3">
        <h2 id="booking-flight-title" className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">{copy.title}</h2>
        <p className="max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">{copy.description}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-emerald-300/20 bg-[#07110e] sm:rounded-[2rem]">
        <div ref={stageRef} className={`${styles.stage} relative isolate h-[19rem] overflow-hidden sm:h-[29rem]`}>
          <div aria-hidden="true" className={styles.staticTunnel}>
            <div /><div /><div /><div />
          </div>
          {loadCanvas && <Canvas stage={stage} />}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050b09] via-[#050b09]/90 to-transparent px-4 pb-5 pt-16 sm:px-8 sm:pb-7">
            <div className="max-w-lg" aria-live="polite" aria-atomic="true">
              <h3 className="text-xl font-bold tracking-tight text-white sm:text-3xl">{copy.stages[stage][0]}</h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-200 sm:text-base">{copy.stages[stage][1]}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-emerald-300/15 bg-[#070d0b] p-3 sm:gap-4 sm:p-4 lg:flex-row">
          <div className="grid flex-1 gap-1.5 min-[500px]:grid-cols-3">
            {copy.stages.map(([label], index) => {
              const Icon = icons[index];
              return (
                <button
                  type="button"
                  key={label}
                  aria-pressed={index === stage}
                  onClick={() => selectStage(index)}
                  className="flex min-h-12 items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-left text-sm font-medium text-neutral-300 transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 aria-pressed:border-emerald-400/30 aria-pressed:bg-emerald-400/10 aria-pressed:text-emerald-200"
                >
                  <Icon aria-hidden="true" size={18} className="shrink-0" />
                  {label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={togglePlayback}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-2 text-sm font-semibold text-[#06100d] transition-colors hover:bg-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          >
            {playing ? <Pause aria-hidden="true" size={16} /> : <Play aria-hidden="true" size={16} />}
            {playing ? copy.pause : copy.play}
          </button>
        </div>
      </div>
    </section>
  );
}
