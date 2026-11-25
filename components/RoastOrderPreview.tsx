'use client';

import { useState } from 'react';
import { Coffee, GlassWater, Minus, Plus, ReceiptText } from 'lucide-react';
import type { Locale } from '@/i18n/getDictionary';
import effects from './SectionEffects.module.css';
import styles from './RoastOrderPreview.module.css';

const drinks = [
  { name: 'Espresso', Icon: Coffee, variants: [{ ml: 30, price: 190 }, { ml: 60, price: 260 }] },
  { name: 'Cappuccino', Icon: Coffee, variants: [{ ml: 180, price: 290 }, { ml: 250, price: 360 }] },
  { name: 'Cold Brew', Icon: GlassWater, variants: [{ ml: 250, price: 340 }, { ml: 350, price: 420 }] },
] as const;

interface Copy {
  title: string;
  description: string;
  size: string;
  add: string;
  remove: string;
  order: string;
  empty: string;
  total: string;
  clear: string;
}

const copies: Record<Locale, Copy> = {
  ru: {
    title: 'Соберите заказ в кофейне', description: 'Выберите объём напитка и посмотрите, как меняется чек. Меню и цены приведены для примера.',
    size: 'Объём', add: 'Добавить', remove: 'Убрать', order: 'Ваш заказ', empty: 'Добавьте напиток из меню.', total: 'Итого', clear: 'Очистить',
  },
  en: {
    title: 'Build your coffee order', description: 'Choose a drink size and see the receipt update. Menu items and prices are examples.',
    size: 'Size', add: 'Add', remove: 'Remove', order: 'Your order', empty: 'Add a drink from the menu.', total: 'Total', clear: 'Clear',
  },
  cnr: {
    title: 'Sastavite svoju porudžbinu', description: 'Izaberite veličinu napitka i pogledajte kako se račun mijenja. Meni i cijene služe kao primjer.',
    size: 'Veličina', add: 'Dodaj', remove: 'Ukloni', order: 'Vaša porudžbina', empty: 'Dodajte napitak iz menija.', total: 'Ukupno', clear: 'Očisti',
  },
  srb: {
    title: 'Sastavite svoju porudžbinu', description: 'Izaberite veličinu napitka i pogledajte kako se račun menja. Meni i cene služe kao primer.',
    size: 'Veličina', add: 'Dodaj', remove: 'Ukloni', order: 'Vaša porudžbina', empty: 'Dodajte napitak iz menija.', total: 'Ukupno', clear: 'Očisti',
  },
  sq: {
    title: 'Përgatitni porosinë tuaj', description: 'Zgjidhni madhësinë e pijes dhe shihni si përditësohet fatura. Menuja dhe çmimet janë shembuj.',
    size: 'Madhësia', add: 'Shto', remove: 'Hiq', order: 'Porosia juaj', empty: 'Shtoni një pije nga menuja.', total: 'Gjithsej', clear: 'Pastro',
  },
};

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300';
const sizes = [0, 1] as const;
type Size = (typeof sizes)[number];
type Cart = Record<string, number>;

function formatPrice(cents: number, locale: Locale) {
  const value = (cents / 100).toFixed(2);
  return locale === 'en' ? `€${value}` : `${value.replace('.', ',')} €`;
}

export default function RoastOrderPreview({ locale }: { locale: Locale }) {
  const copy = copies[locale];
  const volume = (ml: number) => `${ml} ${locale === 'ru' ? 'мл' : 'ml'}`;
  const [chosenSizes, setChosenSizes] = useState<Size[]>([0, 0, 0]);
  const [cart, setCart] = useState<Cart>({});
  const lines = drinks.flatMap((drink, index) => sizes.flatMap(size => {
    const id = `${index}-${size}`;
    const quantity = cart[id] ?? 0;
    const variant = drink.variants[size];
    return quantity > 0 ? [{ id, name: drink.name, size: volume(variant.ml), quantity, price: variant.price }] : [];
  }));
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  function adjustCart(id: string, amount: number) {
    setCart(current => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + amount) }));
  }

  return (
    <section id="roast-order" aria-labelledby="roast-order-title" className="grid gap-5 sm:gap-7">
      <div className="space-y-2">
        <h2 id="roast-order-title" className="text-balance text-2xl font-semibold tracking-tight sm:text-4xl">{copy.title}</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base">{copy.description}</p>
      </div>

      <div className={`${styles.counter} grid gap-4 rounded-3xl border border-emerald-300/20 p-3 sm:gap-6 sm:p-6 md:grid-cols-[1.15fr_1fr]`}>
        <ul className="min-w-0 divide-y divide-white/10">
          {drinks.map(({ name, Icon, variants }, index) => {
            const size = chosenSizes[index];
            return (
              <li key={name} className="grid min-w-0 grid-cols-[auto_1fr] items-center gap-3 py-4 first:pt-1 sm:gap-4">
                <span className={`${styles.cup} flex size-11 items-center justify-center rounded-xl text-emerald-200 sm:size-14`}>
                  <Icon aria-hidden="true" size={24} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <h3 className="font-semibold tracking-tight text-white sm:text-lg">{name}</h3>
                    <p className="font-mono text-xs tabular-nums text-emerald-200 sm:text-sm">{formatPrice(variants[size].price, locale)}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div role="group" aria-label={`${copy.size} · ${name}`} className="flex gap-1">
                      {sizes.map(value => (
                        <button type="button" key={value} aria-pressed={size === value}
                          onClick={() => setChosenSizes(current => current.map((selected, itemIndex) => itemIndex === index ? value : selected))}
                          className={`min-h-11 rounded-lg border border-white/10 px-2 text-xs text-neutral-300 hover:border-white/30 aria-pressed:border-emerald-300/45 aria-pressed:bg-emerald-300/10 aria-pressed:text-emerald-100 ${focus}`}>
                          {volume(variants[value].ml)}
                        </button>
                      ))}
                    </div>
                    <button type="button" onClick={() => adjustCart(`${index}-${size}`, 1)} aria-label={`${copy.add} · ${name} · ${volume(variants[size].ml)}`}
                      className={`ml-auto inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-emerald-300 text-emerald-950 hover:bg-emerald-200 ${focus}`}>
                      <Plus aria-hidden="true" size={19} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className={`${styles.receipt} relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-emerald-300/20 p-4 sm:p-5`}>
          <div className="flex min-h-11 items-center gap-2">
            <ReceiptText aria-hidden="true" size={19} className="shrink-0 text-emerald-200" />
            <h3 className="text-base font-semibold text-white sm:text-lg">{copy.order}</h3>
            <button type="button" onClick={() => setCart({})} disabled={!lines.length}
              className={`ml-auto min-h-11 rounded-md px-2 text-xs text-neutral-300 underline-offset-4 hover:underline disabled:opacity-40 ${focus}`}>
              {copy.clear}
            </button>
          </div>

          {lines.length ? (
            <ul className="my-3 divide-y divide-white/10">
              {lines.map(line => (
                <li key={line.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">{line.name}</p>
                    <p className="text-xs text-neutral-400">{line.size} · {formatPrice(line.price * line.quantity, locale)}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 font-mono text-sm tabular-nums text-emerald-100">
                    <button type="button" aria-label={`${copy.remove} · ${line.name} · ${line.size}`}
                      className={`grid size-11 place-items-center rounded-lg border border-white/10 hover:border-emerald-300/40 ${focus}`} onClick={() => adjustCart(line.id, -1)}>
                      <Minus aria-hidden="true" size={15} />
                    </button>
                    <span className="min-w-5 text-center">{line.quantity}</span>
                    <button type="button" aria-label={`${copy.add} · ${line.name} · ${line.size}`}
                      className={`grid size-11 place-items-center rounded-lg border border-white/10 hover:border-emerald-300/40 ${focus}`} onClick={() => adjustCart(line.id, 1)}>
                      <Plus aria-hidden="true" size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="my-5 text-sm text-neutral-300">{copy.empty}</p>}

          <div aria-live="polite" aria-atomic="true" className="relative mt-auto flex items-center justify-between gap-3 overflow-hidden border-t border-dashed border-emerald-300/35 pt-4">
            {total > 0 && <span key={total} aria-hidden="true" className={effects.summaryPulse} />}
            <span className="relative text-sm font-semibold text-neutral-200">{copy.total}</span>
            <span className="relative font-mono text-2xl font-bold tabular-nums text-emerald-200">{formatPrice(total, locale)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
