'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { describePricingSelection, pricingPlans, pricingSelectionEvent, pricingTierKeys, type PricingInquiry } from './pricingInquiry';
import { projectReferences, type ProjectReferenceId } from './projectReference';
import effects from './SectionEffects.module.css';

interface PricingTier {
  title: string;
  price: number;
  audience: string;
  includes: string[];
  btn: string;
}

export interface PricingDict {
  title: string;
  subtitle: string;
  toggle_full: string;
  toggle_split: string;
  audience_label: string;
  includes_label: string;
  first_payment: string;
  second_payment: string;
  case_label: string;
  project_terms: {
    title: string;
    agreement: string;
    items: { question: string; answer: string }[];
    contact: string;
  };
  tier1: PricingTier;
  tier2: PricingTier;
  tier3: PricingTier;
}

interface PricingSectionProps {
  dict: PricingDict;
  locale: string;
  initialPayment?: PricingInquiry['payment'];
}

const relatedProjects = {
  starter: 'cupertino-roast',
  business: 'shift-drive',
  enterprise: 'umami-bistro',
} satisfies Record<PricingInquiry['plan'], ProjectReferenceId>;

const planButtons = {
  starter: 'bg-white text-black hover:bg-neutral-200',
  business: 'bg-emerald-500 text-black hover:bg-emerald-400',
  enterprise: 'border border-white/20 text-white hover:bg-white/10',
} satisfies Record<PricingInquiry['plan'], string>;

const approximateRsd: Partial<Record<number, string>> = {
  360: '~42.000 RSD',
  324: '~38.000 RSD',
  1080: '~126.000 RSD',
  972: '~113.000 RSD',
  3150: '~368.000 RSD',
  2835: '~331.000 RSD',
};

const focusOutline = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400';

export default function PricingSection({ dict, locale, initialPayment }: PricingSectionProps) {
  const [isFullPayment, setIsFullPayment] = useState(initialPayment === 'full');
  const euro = new Intl.NumberFormat(locale === 'cnr' ? 'sr-Latn-ME' : locale === 'srb' ? 'sr-Latn-RS' : locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const payment = isFullPayment ? 'full' : 'split';

  function selectPlan(event: React.MouseEvent<HTMLAnchorElement>, plan: PricingInquiry['plan']) {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;

    window.dispatchEvent(new CustomEvent<PricingInquiry>(pricingSelectionEvent, {
      detail: describePricingSelection({ plan, payment }, dict),
    }));
  }

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="flex w-full flex-col items-center gap-7 sm:gap-10">
      <div className="flex flex-col gap-3 px-2 text-center sm:gap-4">
        <h2 id="pricing-title" className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">{dict.title}</h2>
        <p className="text-base text-neutral-400 sm:text-lg">{dict.subtitle}</p>
      </div>

      <div className="relative flex w-full max-w-sm rounded-full border border-white/10 bg-white/5 p-1">
        <div
          aria-hidden="true"
          className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full border border-white/20 bg-white/10 motion-safe:transition-transform motion-safe:duration-300 ${isFullPayment ? '' : 'translate-x-full'}`}
        />
        <button
          type="button"
          onClick={() => setIsFullPayment(true)}
          aria-pressed={isFullPayment}
          className={`relative flex min-h-12 flex-1 items-center justify-center rounded-full px-2 py-2 text-xs font-semibold transition-colors sm:text-sm ${isFullPayment ? 'text-white' : 'text-neutral-400 hover:text-white'} ${focusOutline}`}
        >
          {dict.toggle_full}
        </button>
        <button
          type="button"
          onClick={() => setIsFullPayment(false)}
          aria-pressed={!isFullPayment}
          className={`relative flex min-h-12 flex-1 items-center justify-center rounded-full px-2 py-2 text-xs font-semibold transition-colors sm:text-sm ${isFullPayment ? 'text-neutral-400 hover:text-white' : 'text-white'} ${focusOutline}`}
        >
          {dict.toggle_split}
        </button>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        {pricingPlans.map((plan) => {
          const tier = dict[pricingTierKeys[plan]];
          const featured = plan === 'business';
          const example = relatedProjects[plan];
          const price = isFullPayment ? Math.floor(tier.price * 0.9) : tier.price;
          const cents = Math.round(price * 100);
          const first = Math.floor(cents / 2);
          const rsd = locale === 'srb' && (approximateRsd[price] ?? `~${Math.round(price * 117).toLocaleString('sr-RS')} RSD`);

          return (
            <article
              key={plan}
              className={`flex min-w-0 flex-col gap-5 rounded-3xl border p-5 transition-colors sm:p-7 ${featured ? 'border-emerald-500/40 bg-emerald-500/[0.05] hover:border-emerald-500/60' : 'border-white/10 bg-white/[0.03] hover:border-white/20'}`}
            >
              <div className="space-y-2">
                <h3 className={`text-xl font-semibold tracking-tight ${featured ? 'text-emerald-300' : 'text-white'}`}>{tier.title}</h3>
                <p
                  key={price}
                  className={`${effects.price} text-3xl font-bold tabular-nums tracking-tight text-white sm:text-4xl`}
                >
                  {euro.format(price)}
                </p>
                {rsd && <p className="text-xs text-neutral-400">{rsd}</p>}
                {!isFullPayment && (
                  <dl className="grid grid-cols-2 divide-x divide-white/10 overflow-hidden rounded-xl bg-black/20 text-sm">
                    <div className="px-3 py-2">
                      <dt className="text-xs text-neutral-400">{dict.first_payment}</dt>
                      <dd className="mt-0.5 font-semibold tabular-nums text-neutral-100">{euro.format(first / 100)}</dd>
                    </div>
                    <div className="px-3 py-2">
                      <dt className="text-xs text-neutral-400">{dict.second_payment}</dt>
                      <dd className="mt-0.5 font-semibold tabular-nums text-neutral-100">{euro.format((cents - first) / 100)}</dd>
                    </div>
                  </dl>
                )}
              </div>

              <div className="space-y-1 border-t border-white/10 pt-4">
                <p className="text-sm font-semibold text-white">{dict.audience_label}</p>
                <p className="text-sm leading-relaxed text-neutral-300">{tier.audience}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">{dict.includes_label}</p>
                <ul className="space-y-2 text-sm leading-relaxed text-neutral-300">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check aria-hidden="true" size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex flex-col gap-2">
                <a
                  href="#contact"
                  onClick={(event) => selectPlan(event, plan)}
                  className={`flex min-h-[52px] items-center justify-center rounded-2xl px-3 py-3 text-center text-sm font-bold transition-colors ${planButtons[plan]} ${focusOutline}`}
                >
                  {tier.btn}
                </a>
                <Link
                  href={`/${locale}/portfolio/${example}?${new URLSearchParams({ plan, payment })}`}
                  prefetch={false}
                  className={`group inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-center text-sm text-neutral-300 transition-colors hover:text-emerald-300 ${focusOutline}`}
                >
                  <span>{dict.case_label} · {projectReferences[example]}</span>
                  <ArrowUpRight aria-hidden="true" size={16} className="shrink-0 motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <section id="pricing-terms" aria-labelledby="pricing-terms-title" className="w-full scroll-mt-28 border-y border-white/10 py-6 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="max-w-2xl space-y-2">
            <h3 id="pricing-terms-title" className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{dict.project_terms.title}</h3>
            <p className="text-sm leading-relaxed text-neutral-400">{dict.project_terms.agreement}</p>
          </div>
          <a href="#contact" className={`inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded text-sm font-medium text-emerald-300 transition-colors hover:text-emerald-200 ${focusOutline}`}>
            {dict.project_terms.contact}
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        </div>
        <dl className="mt-3 grid divide-y divide-white/10 sm:mt-6 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {dict.project_terms.items.map(({ question, answer }) => (
            <div key={question} className="min-w-0 py-4 first:pt-0 last:pb-0 lg:px-6 lg:py-0 lg:first:pl-0 lg:last:pr-0">
              <dt className="text-sm font-semibold text-white">{question}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-neutral-300">{answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </section>
  );
}
