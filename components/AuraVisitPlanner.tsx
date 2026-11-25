'use client';

import { useState } from 'react';
import { CalendarCheck, Check, Clock, Scissors, Sparkles, UserRound } from 'lucide-react';
import type { Locale } from '@/i18n/getDictionary';
import effects from './SectionEffects.module.css';
import styles from './AuraVisitPlanner.module.css';

const procedures = [45, 60, 75] as const;
const times = ['10:00', '11:30', '14:00', '15:30'] as const;
const specialists = [
  { name: 'Mila', procedures: [0, 1], windows: [60, 45, 0, 60] },
  { name: 'Nina', procedures: [1, 2], windows: [0, 90, 60, 45] },
  { name: 'Lena', procedures: [0, 2], windows: [45, 0, 90, 0] },
];

interface Copy {
  title: string;
  description: string;
  procedure: string;
  procedures: readonly [string, string, string];
  specialist: string;
  any: string;
  time: string;
  minutes: string;
  confirm: string;
  prompt: string;
}

const copies: Record<Locale, Copy> = {
  ru: {
    title: 'Соберите свой визит в салон', description: 'Выберите процедуру, специалиста и время. Имена мастеров и расписание приведены для примера.',
    procedure: 'Процедура', procedures: ['Укладка', 'Маникюр', 'Уход за лицом'], specialist: 'Специалист', any: 'Любой специалист', time: 'Время', minutes: 'мин', confirm: 'Ваш выбор', prompt: 'Выберите время, чтобы увидеть детали визита.',
  },
  en: {
    title: 'Plan your salon visit', description: 'Choose a treatment, a specialist and a time. The names and schedule are examples.',
    procedure: 'Treatment', procedures: ['Hair styling', 'Manicure', 'Facial'], specialist: 'Specialist', any: 'Any specialist', time: 'Time', minutes: 'min', confirm: 'Your selection', prompt: 'Choose a time to see your visit details.',
  },
  cnr: {
    title: 'Isplanirajte posjetu salonu', description: 'Izaberite tretman, stručnjaka i termin. Imena i raspored služe kao primjer.',
    procedure: 'Tretman', procedures: ['Stilizovanje kose', 'Manikir', 'Njega lica'], specialist: 'Stručnjak', any: 'Bilo koji stručnjak', time: 'Vrijeme', minutes: 'min', confirm: 'Vaš izbor', prompt: 'Izaberite termin da vidite detalje posjete.',
  },
  srb: {
    title: 'Isplanirajte posetu salonu', description: 'Izaberite tretman, stručnjaka i termin. Imena i raspored služe kao primer.',
    procedure: 'Tretman', procedures: ['Stilizovanje kose', 'Manikir', 'Nega lica'], specialist: 'Stručnjak', any: 'Bilo koji stručnjak', time: 'Vreme', minutes: 'min', confirm: 'Vaš izbor', prompt: 'Izaberite termin da vidite detalje posete.',
  },
  sq: {
    title: 'Planifikoni vizitën në sallon', description: 'Zgjidhni trajtimin, specialistin dhe orarin. Emrat dhe oraret janë shembuj.',
    procedure: 'Trajtimi', procedures: ['Stilim flokësh', 'Manikyr', 'Trajtim fytyre'], specialist: 'Specialisti', any: 'Çdo specialist', time: 'Orari', minutes: 'min', confirm: 'Zgjedhja juaj', prompt: 'Zgjidhni një orar për të parë hollësitë e vizitës.',
  },
};

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300';
const option = `flex min-h-12 min-w-0 items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-left text-sm font-medium text-neutral-200 transition-colors hover:border-emerald-300/45 aria-pressed:border-emerald-300/55 aria-pressed:bg-emerald-300/10 aria-pressed:text-emerald-100 disabled:cursor-not-allowed disabled:border-white/[0.08] disabled:text-neutral-500 ${focus}`;

export default function AuraVisitPlanner({ locale }: { locale: Locale }) {
  const copy = copies[locale];
  const [procedure, setProcedure] = useState(0);
  const [specialist, setSpecialist] = useState('');
  const [time, setTime] = useState<number>();
  const eligible = specialists.filter(person => person.procedures.includes(procedure));
  const options = times.map((_, index) =>
    eligible.find(person => (!specialist || person.name === specialist) && person.windows[index] >= procedures[procedure]));
  const assigned = time === undefined ? undefined : options[time];

  function chooseProcedure(index: number) {
    if (index === procedure) return;
    setProcedure(index);
    setSpecialist('');
    setTime(undefined);
  }

  function chooseSpecialist(name: string) {
    if (name === specialist) return;
    setSpecialist(name);
    setTime(undefined);
  }

  return (
    <section id="aura-visit" aria-labelledby="aura-visit-title" className="grid gap-5 sm:gap-7">
      <div className="space-y-2">
        <h2 id="aura-visit-title" className="text-balance text-2xl font-semibold tracking-tight sm:text-4xl">{copy.title}</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base">{copy.description}</p>
      </div>

      <div className={`${styles.panel} grid gap-4 rounded-3xl border border-emerald-300/20 p-4 sm:gap-6 sm:p-6`}>
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_.85fr] lg:gap-3">
          <fieldset className="min-w-0">
            <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-200"><Scissors aria-hidden="true" size={17} />{copy.procedure}</legend>
            <div className="grid gap-2">
              {copy.procedures.map((label, index) => (
                <button key={label} type="button" aria-pressed={index === procedure} className={option} onClick={() => chooseProcedure(index)}>
                  <span>{label}</span>
                  <span className="ml-auto shrink-0 font-mono text-xs tabular-nums">{procedures[index]} {copy.minutes}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-200"><UserRound aria-hidden="true" size={17} />{copy.specialist}</legend>
            <div className="grid gap-2">
              <button type="button" aria-pressed={!specialist} className={option} onClick={() => chooseSpecialist('')}>
                <Sparkles aria-hidden="true" size={16} className="shrink-0 text-emerald-200" />{copy.any}
              </button>
              {eligible.map(person => (
                <button key={person.name} type="button" aria-pressed={person.name === specialist} className={option} onClick={() => chooseSpecialist(person.name)}>
                  <span aria-hidden="true" className={`${styles.initial} grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold text-emerald-200`}>{person.name[0]}</span>
                  {person.name}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-200"><Clock aria-hidden="true" size={17} />{copy.time}</legend>
            <div className="grid grid-cols-2 gap-2">
              {times.map((value, index) => {
                const available = options[index];
                return (
                  <button key={value} type="button" disabled={!available} aria-pressed={time === index}
                    aria-label={available ? `${value} · ${available.name}` : value}
                    className={`${option} justify-center font-mono tabular-nums disabled:line-through`} onClick={() => setTime(index)}>
                    <span className="text-center">
                      {value}
                      {!specialist && available && <span className="block text-[10px] font-normal text-emerald-200">{available.name}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div aria-live="polite" aria-atomic="true" className={`${styles.summary} relative grid min-h-[6rem] content-center gap-1 overflow-hidden rounded-2xl border px-4 py-3`} data-visit-selected={Boolean(assigned)}>
          {assigned && <span key={`${assigned.name}-${time}`} aria-hidden="true" className={effects.summaryPulse} />}
          <p className="relative flex items-center gap-2 text-xs font-semibold text-emerald-200">
            {assigned ? <Check aria-hidden="true" size={17} /> : <CalendarCheck aria-hidden="true" size={17} />}{copy.confirm}
          </p>
          <p className="relative text-sm font-medium text-neutral-200 sm:text-base">
            {assigned && time !== undefined
              ? `${copy.procedures[procedure]} · ${assigned.name} · ${times[time]} · ${procedures[procedure]} ${copy.minutes}`
              : copy.prompt}
          </p>
        </div>
      </div>
    </section>
  );
}
