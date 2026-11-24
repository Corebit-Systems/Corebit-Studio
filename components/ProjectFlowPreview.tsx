'use client';

import { useId, useState } from 'react';
import { Check, Clock3 } from 'lucide-react';

export interface ProjectPreviewCopy {
  title: string;
  description: string;
  choice: string;
  options: string[];
  summary: string;
  time?: string;
}

const times = ['10:00', '14:30', '16:00'];
const optionStyle = 'flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2 text-sm text-neutral-200 transition-colors hover:bg-white/[0.08] peer-checked:border-emerald-400/40 peer-checked:bg-emerald-400/10 peer-checked:text-emerald-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-400';

export default function ProjectFlowPreview({ copy, label }: { copy: ProjectPreviewCopy; label: string }) {
  const id = useId();
  const [option, setOption] = useState(0);
  const [time, setTime] = useState(times[0]);

  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-neutral-950 p-4 sm:p-5">
      <p className="mb-4 text-xs font-semibold text-emerald-300">{label}</p>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-white">{copy.choice}</legend>
        <div className="grid gap-2">
          {copy.options.map((item, index) => (
            <label key={item} className="relative">
              <input
                type="radio"
                name={`${id}-option`}
                value={item}
                checked={option === index}
                onChange={() => setOption(index)}
                className="peer sr-only"
              />
              <span className={`${optionStyle} justify-between px-3`}>
                {item}
                {option === index && <Check aria-hidden="true" size={16} className="shrink-0" />}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {copy.time && (
        <fieldset className="mt-4">
          <legend className="mb-2 text-sm font-semibold text-white">
            <span className="inline-flex items-center gap-2"><Clock3 aria-hidden="true" size={15} />{copy.time}</span>
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {times.map((slot) => (
              <label key={slot} className="relative">
                <input
                  type="radio"
                  name={`${id}-time`}
                  value={slot}
                  checked={time === slot}
                  onChange={() => setTime(slot)}
                  className="peer sr-only"
                />
                <span className={`${optionStyle} justify-center px-1 tabular-nums`}>{slot}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-4 border-t border-white/10 pt-3">
        <p className="text-xs text-neutral-400">{copy.summary}</p>
        <output className="mt-1 block break-words text-sm font-semibold text-white">
          {copy.options[option]}{copy.time && ` · ${time}`}
        </output>
      </div>
    </div>
  );
}
