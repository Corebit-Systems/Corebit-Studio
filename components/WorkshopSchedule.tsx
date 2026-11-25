'use client';

import { useState } from 'react';
import { CalendarCheck, CarFront, Timer } from 'lucide-react';
import type { Locale } from '@/i18n/getDictionary';
import effects from './SectionEffects.module.css';
import styles from './WorkshopSchedule.module.css';

const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'] as const;
const starts = timeSlots.slice(0, -1);
const bays = [[2, 3], [0, 4, 5]];
const durations = [1, 2, 3] as const;

type Duration = (typeof durations)[number];
interface Selection { bay: number; start: number }
interface Copy {
  title: string;
  description: string;
  job: string;
  jobs: readonly [string, string, string];
  minutes: string;
  bay: string;
  statuses: readonly [string, string, string];
  result: string;
  prompt: string;
}

const copyByLocale: Record<Locale, Copy> = {
  ru: {
    title: 'Расписание автосервиса в действии',
    description: 'Выберите работу и найдите свободное окно на одном из двух постов. Расписание и длительность работ приведены для примера.',
    job: 'Вид работ', jobs: ['Замена масла', 'Диагностика', 'Техобслуживание'], minutes: 'мин', bay: 'Пост',
    statuses: ['Доступно начало', 'Занято', 'Не хватает времени'], result: 'Ваш выбор', prompt: 'Выберите свободное время начала на одном из постов.',
  },
  en: {
    title: 'Workshop scheduling in action',
    description: 'Choose a service and find an opening in one of two workshop bays. Times and service durations are examples.',
    job: 'Service', jobs: ['Oil change', 'Diagnostics', 'Maintenance'], minutes: 'min', bay: 'Bay',
    statuses: ['Available start', 'Booked', 'Too little time'], result: 'Your selection', prompt: 'Choose an available start time in either bay.',
  },
  cnr: {
    title: 'Kako radi raspored auto-servisa',
    description: 'Izaberite uslugu i pronađite slobodan termin na jednom od dva servisna mjesta. Raspored i trajanja služe kao primjer.',
    job: 'Vrsta usluge', jobs: ['Zamjena ulja', 'Dijagnostika', 'Održavanje'], minutes: 'min', bay: 'Servisno mjesto',
    statuses: ['Slobodan početak', 'Zauzeto', 'Nema dovoljno vremena'], result: 'Vaš izbor', prompt: 'Izaberite slobodan termin na jednom od dva mjesta.',
  },
  srb: {
    title: 'Kako radi raspored auto-servisa',
    description: 'Izaberite uslugu i pronađite slobodan termin na jednom od dva servisna mesta. Raspored i trajanja služe kao primer.',
    job: 'Vrsta usluge', jobs: ['Zamena ulja', 'Dijagnostika', 'Održavanje'], minutes: 'min', bay: 'Servisno mesto',
    statuses: ['Slobodan početak', 'Zauzeto', 'Nema dovoljno vremena'], result: 'Vaš izbor', prompt: 'Izaberite slobodan termin na jednom od dva mesta.',
  },
  sq: {
    title: 'Si funksionon orari i autoservisit',
    description: 'Zgjidhni një shërbim dhe gjeni një orar të lirë në njërën nga dy hapësirat e servisit. Oraret dhe kohëzgjatjet janë shembuj.',
    job: 'Shërbimi', jobs: ['Ndërrim vaji', 'Diagnostikim', 'Mirëmbajtje'], minutes: 'min', bay: 'Hapësira',
    statuses: ['Fillim i lirë', 'E zënë', 'Kohë e pamjaftueshme'], result: 'Zgjedhja juaj', prompt: 'Zgjidhni një orar të lirë në njërën nga dy hapësirat.',
  },
};

function fits(bay: number, start: number, duration: Duration) {
  const end = start + duration;
  return end <= starts.length && bays[bay].every(slot => slot < start || slot >= end);
}

export default function WorkshopSchedule({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale];
  const [duration, setDuration] = useState<Duration>(durations[0]);
  const [selection, setSelection] = useState<Selection>();

  function selectDuration(value: Duration) {
    setDuration(value);
    setSelection(current => current && fits(current.bay, current.start, value) ? current : undefined);
  }

  const focused = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400';

  return (
    <section id="workshop-schedule" aria-labelledby="workshop-schedule-title" className="grid gap-5 sm:gap-7">
      <div className="space-y-2">
        <h2 id="workshop-schedule-title" className="text-balance text-2xl font-semibold tracking-tight sm:text-4xl">{copy.title}</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base">{copy.description}</p>
      </div>

      <div className={`${styles.console} grid gap-5 rounded-3xl border border-emerald-300/20 p-4 sm:gap-6 sm:p-6`}>
        <fieldset className="min-w-0">
          <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-200"><Timer aria-hidden="true" size={16} />{copy.job}</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {durations.map((value, index) => (
              <button type="button" key={value} aria-pressed={duration === value} onClick={() => selectDuration(value)}
                className={`flex min-h-11 flex-wrap items-center justify-between gap-x-2 rounded-xl border border-white/10 px-3 py-2 text-left text-sm font-medium text-neutral-200 hover:border-emerald-300/40 aria-pressed:border-emerald-300/50 aria-pressed:bg-emerald-300/10 aria-pressed:text-emerald-200 ${focused}`}>
                {copy.jobs[index]}<span className="font-mono text-xs tabular-nums text-neutral-300">{value * 30} {copy.minutes}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className={`${styles.grid} grid gap-4 rounded-2xl border border-emerald-200/15 p-2.5 sm:p-4`}>
          <div aria-hidden="true" className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] tabular-nums text-neutral-400 sm:gap-2 sm:text-xs">
            {starts.map(time => <span key={time}>{time}</span>)}
          </div>
          {bays.map((booked, bay) => (
            <fieldset key={bay} className="min-w-0">
              <legend className="mb-2 flex items-center gap-2 text-xs font-semibold text-neutral-200 sm:text-sm"><CarFront aria-hidden="true" size={16} />{copy.bay} {bay + 1}</legend>
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {starts.map((time, start) => {
                  const disabled = !fits(bay, start, duration);
                  const isStart = selection?.bay === bay && selection.start === start;
                  const lit = selection?.bay === bay && start >= selection.start && start < selection.start + duration;
                  const status = booked.includes(start) ? 1 : disabled ? 2 : 0;
                  return (
                    <button
                      type="button"
                      key={time}
                      disabled={disabled}
                      aria-label={`${copy.bay} ${bay + 1} · ${time} · ${copy.statuses[status]}`}
                      aria-pressed={isStart}
                      data-slot={lit ? 'selection' : status}
                      onClick={() => setSelection({ bay, start })}
                      className={`${styles.slot} flex min-h-12 min-w-0 items-center justify-center rounded-md border ${focused}`}
                    >
                      <span aria-hidden="true" className={styles.marker} />
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-300">
            {copy.statuses.map((status, index) => (
              <span key={status} className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" data-slot={index} className={`${styles.slot} size-3 rounded border`} />{status}
              </span>
            ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true" className="relative min-h-[4.25rem] overflow-hidden rounded-xl border border-white/10 px-3 py-2.5 sm:px-4">
          {selection && <span aria-hidden="true" key={`${selection.bay}-${selection.start}-${duration}`} className={effects.summaryPulse} />}
          <p className="relative flex items-center gap-2 text-xs font-semibold text-emerald-200"><CalendarCheck aria-hidden="true" size={16} />{copy.result}</p>
          <p className="relative mt-1 text-sm text-neutral-200">
            {selection ? `${copy.bay} ${selection.bay + 1} · ${timeSlots[selection.start]}–${timeSlots[selection.start + duration]} · ${duration * 30} ${copy.minutes}` : copy.prompt}
          </p>
        </div>
      </div>
    </section>
  );
}
