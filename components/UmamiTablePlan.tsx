'use client';

import { useState } from 'react';
import { CalendarCheck, Check, Clock, Users } from 'lucide-react';
import type { Locale } from '@/i18n/getDictionary';
import styles from './UmamiTablePlan.module.css';

const tables = [2, 4, 2, 4, 6, 6] as const;
const parties = [2, 4, 6] as const;
const sessions = [
  { time: '18:00', booked: [1, 4, 5] },
  { time: '19:30', booked: [0, 3, 4] },
  { time: '21:00', booked: [2] },
];

const copies = {
  ru: ['Выберите столик на плане зала', 'Попробуйте выбрать столик для своей компании. План зала и доступность приведены для примера.', 'Время', 'Гостей', 'Столик', 'мест', 'Свободен', 'Занят', 'Мало мест', 'Ваш выбор', 'Выберите свободный столик.', 'На это время нет подходящих столиков. Попробуйте другой час.'],
  en: ['Choose a table on the floor plan', 'Try choosing a table for your party. The floor plan and availability are examples.', 'Time', 'Guests', 'Table', 'seats', 'Available', 'Booked', 'Too small', 'Your selection', 'Choose an available table.', 'No matching tables at this time. Try a different time.'],
  cnr: ['Izaberite sto na planu sale', 'Isprobajte izbor stola za svoje društvo. Plan sale i dostupnost termina služe kao primjer.', 'Vrijeme', 'Gosti', 'Sto', 'mjesta', 'Slobodan', 'Zauzet', 'Premalo mjesta', 'Vaš izbor', 'Izaberite slobodan sto.', 'Nema odgovarajućih stolova u ovom terminu. Izaberite drugo vrijeme.'],
  srb: ['Izaberite sto na planu sale', 'Isprobajte izbor stola za svoje društvo. Plan sale i dostupnost termina služe kao primer.', 'Vreme', 'Gosti', 'Sto', 'mesta', 'Slobodan', 'Zauzet', 'Premalo mesta', 'Vaš izbor', 'Izaberite slobodan sto.', 'Nema odgovarajućih stolova u ovom terminu. Izaberite drugo vreme.'],
  sq: ['Zgjidhni tavolinën në planin e sallës', 'Provoni të zgjidhni një tavolinë për grupin tuaj. Plani i sallës dhe oraret janë shembuj.', 'Orari', 'Mysafirë', 'Tavolina', 'vende', 'E lirë', 'E zënë', 'Pak vende', 'Zgjedhja juaj', 'Zgjidhni një tavolinë të lirë.', 'Nuk ka tavolina të përshtatshme në këtë orar. Provoni një orar tjetër.'],
} satisfies Record<Locale, readonly [string, string, string, string, string, string, string, string, string, string, string, string]>;

function canSelect(index: number, time: number, guests: number) {
  return tables[index] >= guests && !sessions[time].booked.includes(index);
}

const choiceStyle = 'flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-2 py-1 text-sm font-semibold tabular-nums text-neutral-200 transition-colors hover:border-emerald-300/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 aria-pressed:border-emerald-300/50 aria-pressed:bg-emerald-300/15 aria-pressed:text-emerald-200';

export default function UmamiTablePlan({ locale }: { locale: Locale }) {
  const [title, intro, timeLabel, guestLabel, tableLabel, seatsLabel, available, booked, tooSmall, selectedLabel, prompt, empty] = copies[locale];
  const [time, setTime] = useState(0);
  const [guests, setGuests] = useState<number>(parties[0]);
  const [table, setTable] = useState<number>();

  function updateCriteria(nextTime: number, nextGuests: number) {
    setTime(nextTime);
    setGuests(nextGuests);
    setTable(current => current !== undefined && canSelect(current, nextTime, nextGuests) ? current : undefined);
  }

  const hasAvailability = tables.some((_, index) => canSelect(index, time, guests));

  return (
    <section id="umami-table-plan" aria-labelledby="umami-table-plan-title" className="grid gap-5 sm:gap-7">
      <div className="space-y-2">
        <h2 id="umami-table-plan-title" className="text-balance text-2xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base">{intro}</p>
      </div>

      <div className={`${styles.layout} grid gap-5 rounded-3xl border border-emerald-300/20 bg-[#080f0d] p-3 sm:p-5 md:grid-cols-[1.5fr_1fr] md:items-stretch`}>
        <div className={`${styles.floor} relative isolate grid grid-cols-3 gap-2 overflow-hidden rounded-2xl border border-emerald-300/20 px-2 py-8 sm:gap-4 sm:px-4`}>
          {tables.map((seats, index) => {
            const isBooked = sessions[time].booked.includes(index);
            const fits = canSelect(index, time, guests);
            const selected = table === index;
            const status = isBooked ? booked : fits ? available : tooSmall;
            const capacity = `${seats} ${locale === 'ru' && seats < 5 ? 'места' : seatsLabel}`;

            return (
              <button
                key={index}
                type="button"
                aria-label={`${tableLabel} ${index + 1} · ${capacity} · ${status}`}
                aria-pressed={selected}
                disabled={!fits}
                onClick={() => setTable(index)}
                className={`${styles.table} relative mx-auto flex h-20 w-full max-w-[7rem] flex-col items-center justify-center rounded-xl border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 sm:h-24`}
              >
                <span className="font-mono text-base font-semibold leading-none tabular-nums sm:text-xl">{String(index + 1).padStart(2, '0')}</span>
                <span className="mt-1 text-[11px] text-neutral-300 sm:text-xs">{capacity}</span>
                {!fits && <span className="mt-1 text-[10px] leading-tight text-neutral-400">{status}</span>}
                {selected && <Check aria-hidden="true" size={15} className="absolute right-1 top-1 text-emerald-200 sm:right-2 sm:top-2" />}
              </button>
            );
          })}
        </div>

        <div className="grid content-start gap-4 px-1 pb-1 sm:gap-5 sm:px-0 md:px-1">
          <fieldset className="min-w-0">
            <legend className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200"><Clock aria-hidden="true" size={16} />{timeLabel}</legend>
            <div className="grid grid-cols-3 gap-2">
              {sessions.map((session, index) => (
                <button key={session.time} type="button" aria-pressed={time === index} className={choiceStyle} onClick={() => updateCriteria(index, guests)}>
                  {session.time}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="min-w-0">
            <legend className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200"><Users aria-hidden="true" size={16} />{guestLabel}</legend>
            <div className="grid grid-cols-3 gap-2">
              {parties.map(party => (
                <button key={party} type="button" aria-pressed={guests === party} className={choiceStyle} onClick={() => updateCriteria(time, party)}>
                  {party}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="min-h-20 border-t border-white/10 pt-3" aria-live="polite" aria-atomic="true">
            <p className="flex items-center gap-2 text-xs font-semibold text-emerald-200"><CalendarCheck aria-hidden="true" size={16} />{selectedLabel}</p>
            <p className={`mt-1.5 text-sm leading-relaxed ${table === undefined ? 'text-neutral-300' : `${styles.selection} font-semibold text-white`}`} key={`${table}-${time}-${guests}`}>
              {table === undefined ? (hasAvailability ? prompt : empty) : `${tableLabel} ${table + 1} · ${sessions[time].time} · ${guestLabel.toLowerCase()} ${guests}`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
