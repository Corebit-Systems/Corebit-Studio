'use client';

import { useId, useState } from 'react';
import { ArrowRight, Cpu, CreditCard, MessageSquare, RefreshCw, Search } from 'lucide-react';
import effects from './SectionEffects.module.css';

interface ModuleData {
  title: string;
  desc: string;
}

const nodes = [
  { id: 'pms', Icon: RefreshCw, x: 50, y: 14 },
  { id: 'pay', Icon: CreditCard, x: 86, y: 50 },
  { id: 'notify', Icon: MessageSquare, x: 50, y: 86 },
  { id: 'seo', Icon: Search, x: 14, y: 50 },
] as const;

type ModuleId = (typeof nodes)[number]['id'];

interface EcosystemDict {
  title: string;
  subtitle: string;
  core_label: string;
  ready_label: string;
  modules: Record<ModuleId, ModuleData>;
}

export default function TechEcosystem({ dict }: { dict: EcosystemDict }) {
  const headingId = useId();
  const detailsId = useId();
  const [selection, setSelection] = useState<{ id: ModuleId; count: number }>({ id: 'pms', count: 0 });
  const activeNode = nodes.find(node => node.id === selection.id) ?? nodes[0];
  const ActiveIcon = activeNode.Icon;
  const activeModule = dict.modules[activeNode.id];

  return (
    <section id="ecosystem" aria-labelledby={headingId} className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 px-2 py-16 sm:gap-14 sm:px-6 sm:py-24">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 id={headingId} className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {dict.title}
        </h2>
        <p className="max-w-2xl text-base text-neutral-400 sm:text-lg">{dict.subtitle}</p>
      </div>

      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div className="relative isolate mx-auto flex aspect-square w-full max-w-[24rem] items-center justify-center">
          <div aria-hidden="true" className={effects.nodeField} />
          <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full">
            {nodes.map(({ id, x, y }) => (
              <line
                key={id}
                x1="50" y1="50" x2={x} y2={y}
                stroke={selection.id === id ? '#6ee7b7' : '#2f5c50'}
                strokeWidth={selection.id === id ? '.48' : '.3'}
                strokeDasharray={selection.id === id ? undefined : '1.3 1.3'}
              />
            ))}
            {selection.count > 0 && (
              <line
                key={selection.count}
                x1="50" y1="50" x2={activeNode.x} y2={activeNode.y}
                pathLength="100" stroke="#c3ffe7" strokeWidth=".9" strokeLinecap="round"
                className={effects.signal}
              />
            )}
          </svg>

          <div className="relative flex size-24 flex-col items-center justify-center gap-1 rounded-full border border-emerald-300/40 bg-[#0a1915] p-2 text-center text-emerald-300 shadow-[0_0_50px_rgba(16,185,129,.22)] sm:size-28">
            <Cpu aria-hidden="true" size={24} />
            <span className="max-w-full break-words text-[10px] font-bold uppercase tracking-tight text-white sm:text-xs">{dict.core_label}</span>
          </div>

          {nodes.map(({ id, Icon, x, y }) => {
            const selected = id === activeNode.id;
            return (
              <button
                key={id}
                type="button"
                aria-label={dict.modules[id].title}
                aria-controls={detailsId}
                aria-pressed={selected}
                onClick={() => setSelection(current => ({ id, count: current.count + 1 }))}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={`absolute flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 sm:size-16 ${selected ? 'border-emerald-200 bg-emerald-300 text-emerald-950 shadow-[0_0_28px_rgba(16,185,129,.44)]' : 'border-white/15 bg-[#0b1411] text-neutral-300 hover:border-emerald-300/65 hover:text-emerald-200'}`}
              >
                <Icon aria-hidden="true" size={22} />
                {selected && selection.count > 0 && <span key={selection.count} aria-hidden="true" className={effects.stepPulse} />}
              </button>
            );
          })}
        </div>

        <div id={detailsId} aria-live="polite" className="relative flex min-h-[220px] min-w-0 flex-col gap-6 overflow-hidden rounded-2xl border border-emerald-400/20 bg-white/[0.02] p-6 sm:p-8">
          {selection.count > 0 && <span key={selection.count} aria-hidden="true" className={effects.summaryPulse} />}
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <span className="shrink-0 rounded-xl bg-emerald-500/10 p-2 text-emerald-300"><ActiveIcon aria-hidden="true" size={20} /></span>
            <h3 className="text-lg font-bold text-white sm:text-xl">{activeModule.title}</h3>
          </div>
          <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">{activeModule.desc}</p>
          <div className="mt-auto flex items-center gap-2 font-mono text-xs text-emerald-300">
            <span>{dict.ready_label}</span>
            <ArrowRight aria-hidden="true" size={14} />
          </div>
        </div>
      </div>
    </section>
  );
}
