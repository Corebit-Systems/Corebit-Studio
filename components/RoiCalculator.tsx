'use client';

import { useState } from 'react';
import { ArrowRight, TrendingDown } from 'lucide-react';
import styles from './RoiCalculator.module.css';

const maxClients = 50;
const cells = Array.from({ length: maxClients }, (_, index) => index + 1);

export interface RoiCalculatorDict {
  title: string;
  slider1_label: string;
  slider2_label: string;
  result_label: string;
  grid_label: string;
  result_desc: string;
  cta_btn: string;
}

const rangeClass = 'min-h-11 w-full min-w-0 cursor-ew-resize accent-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300';
const valueClass = 'shrink-0 font-mono text-xl font-semibold tabular-nums text-emerald-200';

export default function RoiCalculator({ dict }: { dict: RoiCalculatorDict }) {
  const [lostClients, setLostClients] = useState(15);
  const [avgTicket, setAvgTicket] = useState(80);
  const monthlyLoss = (lostClients * avgTicket).toLocaleString('de-DE');

  return (
    <section id="loss-calculator" aria-labelledby="loss-calculator-title" className={`${styles.shell} scroll-mt-28 p-4 sm:p-8 lg:p-12`}>
      <div className="flex items-center gap-3">
        <TrendingDown aria-hidden="true" className="shrink-0 text-rose-300" size={24} />
        <h2 id="loss-calculator-title" className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{dict.title}</h2>
      </div>

      <div className="mt-7 grid min-w-0 gap-6 sm:mt-9 lg:grid-cols-[1fr_1.16fr] lg:items-center lg:gap-12">
        <div className="grid min-w-0 gap-4 sm:gap-6">
          <label className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-x-4 text-sm leading-relaxed text-neutral-300">
            <span>{dict.slider1_label}</span>
            <span aria-hidden="true" className={valueClass}>{lostClients}</span>
            <input type="range" id="roi-lost-clients" name="lost_clients" autoComplete="off"
              min={1} max={maxClients} step={1} value={lostClients} onChange={event => setLostClients(Number(event.currentTarget.value))}
              className={`col-span-2 ${rangeClass}`} />
          </label>
          <label className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-x-4 border-t border-emerald-200/10 pt-4 text-sm leading-relaxed text-neutral-300 sm:pt-6">
            <span>{dict.slider2_label}</span>
            <span aria-hidden="true" className={valueClass}>{avgTicket} €</span>
            <input type="range" id="roi-avg-ticket" name="avg_ticket" autoComplete="off"
              min={20} max={500} step={10} value={avgTicket} aria-valuetext={`${avgTicket} €`} onChange={event => setAvgTicket(Number(event.currentTarget.value))}
              className={`col-span-2 ${rangeClass}`} />
          </label>
        </div>

        <div className={`${styles.result} grid min-w-0 gap-5 p-4 sm:p-7`}>
          <div>
            <p className="text-sm font-medium text-neutral-300">{dict.result_label}</p>
            <output htmlFor="roi-lost-clients roi-avg-ticket" aria-label={dict.result_label} className="mt-1 block text-4xl font-semibold tracking-tight text-rose-200 tabular-nums sm:text-6xl">
              −{monthlyLoss} €
            </output>
          </div>

          <div className="grid gap-3">
            <div aria-hidden="true" className={styles.matrix}>
              {cells.map(cell => <span key={cell} data-filled={cell <= lostClients} data-edge={cell === lostClients} />)}
            </div>
            <p className="text-xs text-neutral-400">{dict.grid_label}</p>
          </div>

          <p className="text-sm leading-relaxed text-neutral-300">{dict.result_desc.replace('{amount}', monthlyLoss)}</p>
          <a href="#contact" className="group inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-center text-sm font-bold text-black transition-colors hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300 sm:justify-self-start">
            {dict.cta_btn}
            <ArrowRight aria-hidden="true" size={17} className="shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
