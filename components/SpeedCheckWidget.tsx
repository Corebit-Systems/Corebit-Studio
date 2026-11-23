'use client';

import { Gauge } from 'lucide-react';

export interface SpeedCheckDict {
  title: string;
  subtitle: string;
  placeholder: string;
  btn_check: string;
  invalid_url: string;
  cta_btn: string;
}

export function normalizeSpeedCheckUrl(input: string) {
  const value = input.trim();
  if (!value) return null;
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) {
      return null;
    }
    url.hash = '';
    return url.href;
  } catch {
    return null;
  }
}

export default function SpeedCheckWidget({ dict }: { dict: SpeedCheckDict }) {
  const handleCheck = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem('url');
    if (!(input instanceof HTMLInputElement)) return;

    const url = normalizeSpeedCheckUrl(input.value);
    if (!url) {
      input.setCustomValidity(dict.invalid_url);
      input.reportValidity();
      return;
    }

    const report = new URL('https://pagespeed.web.dev/analysis');
    report.searchParams.set('url', url);
    window.open(report.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative z-10 mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl sm:rounded-[2.5rem] sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-600/10 blur-[100px] sm:h-64 sm:w-64" />
        <div className="flex items-center gap-3">
          <Gauge aria-hidden="true" className="shrink-0 text-emerald-500" size={24} />
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{dict.title}</h2>
        </div>
        <p className="text-sm leading-relaxed text-neutral-300">{dict.subtitle}</p>

        <form
          onSubmit={handleCheck}
          className="flex w-full flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="speed-check-url" className="sr-only">{dict.placeholder}</label>
          <input
            required
            type="text"
            inputMode="url"
            id="speed-check-url"
            name="url"
            autoComplete="url"
            onInput={(event) => event.currentTarget.setCustomValidity('')}
            placeholder={dict.placeholder}
            className="min-h-[50px] min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-emerald-600/50 focus:outline-none sm:text-base"
          />
          <button
            type="submit"
            className="min-h-[50px] rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            {dict.btn_check}
          </button>
        </form>

        <a href="#contact" className="inline-flex min-h-11 items-center self-start rounded-md text-sm font-medium text-emerald-300 underline underline-offset-4 hover:text-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">
          {dict.cta_btn}
        </a>
      </div>
    </section>
  );
}
