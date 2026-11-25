'use client';

import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Check, Users } from 'lucide-react';
import type { Locale } from '@/i18n/getDictionary';
import { stageContactDraft } from './contactDraft';
import { projectReferenceQuery } from './projectReference';
import styles from './FeaturedProject.module.css';

const copyByLocale = {
  ru: {
    title: 'От первого взгляда до брони столика.',
    description: 'Гость видит свободные столики, выбирает время и бронирует прямо на сайте ресторана.',
    booking: 'Бронь столика', guests: '2 гостя', table: 'Столик 04', selected: 'Выбран', demo: 'Попробовать бронь', cta: 'Хочу такой сайт',
    draft: 'Хочу обсудить сайт для моего бизнеса. В качестве примера понравился Umami Bistro с онлайн-бронированием.',
  },
  en: {
    title: 'From finding the restaurant to booking a table.',
    description: 'Guests can see which tables are available, choose a time and book directly on the restaurant’s website.',
    booking: 'Table reservation', guests: '2 guests', table: 'Table 04', selected: 'Selected', demo: 'Try the booking', cta: 'I want a site like this',
    draft: 'I’d like to discuss a website for my business. I liked the Umami Bistro example with online reservations.',
  },
  cnr: {
    title: 'Od prvog pogleda na restoran do rezervacije stola.',
    description: 'Gosti vide slobodne stolove, biraju termin i rezervišu direktno na sajtu restorana.',
    booking: 'Rezervacija stola', guests: '2 gosta', table: 'Sto 04', selected: 'Izabran', demo: 'Isprobaj rezervaciju', cta: 'Želim ovakav sajt',
    draft: 'Želim da razgovaramo o sajtu za moje poslovanje. Dopao mi se primjer Umami Bistro sa onlajn rezervacijom.',
  },
  srb: {
    title: 'Od prvog pogleda na restoran do rezervacije stola.',
    description: 'Gosti vide slobodne stolove, biraju termin i rezervišu direktno na sajtu restorana.',
    booking: 'Rezervacija stola', guests: '2 gosta', table: 'Sto 04', selected: 'Izabran', demo: 'Isprobaj rezervaciju', cta: 'Želim ovakav sajt',
    draft: 'Želim da razgovaramo o sajtu za moje poslovanje. Dopao mi se primer Umami Bistro sa onlajn rezervacijom.',
  },
  sq: {
    title: 'Nga zbulimi i restorantit te rezervimi i tavolinës.',
    description: 'Mysafirët shohin tavolinat e lira, zgjedhin orarin dhe rezervojnë direkt në faqen e restorantit.',
    booking: 'Rezervimi i tavolinës', guests: '2 mysafirë', table: 'Tavolina 04', selected: 'E zgjedhur', demo: 'Provo rezervimin', cta: 'Dua një faqe si kjo',
    draft: 'Dua të diskutojmë për një faqe për biznesin tim. Më pëlqeu shembulli i Umami Bistro me rezervime online.',
  },
} satisfies Record<Locale, Record<string, string>>;

export default function FeaturedProject({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale];

  return (
    <article id="featured-project" aria-labelledby="featured-project-title" className={`${styles.feature} scroll-mt-28`}>
      <div aria-hidden="true" className={styles.scene}>
        <Image src="/portfolio-scenes/umami.webp" alt="" fill unoptimized className={styles.photo} />
        <div className={styles.device}>
          <div className={styles.camera} />
          <span className="text-xs font-semibold text-emerald-200">Umami Bistro</span>
          <p className="text-lg font-semibold leading-tight text-white sm:text-xl">{copy.booking}</p>
          <div className="flex items-center justify-between gap-2 text-xs text-neutral-300">
            <span className="inline-flex items-center gap-1.5"><Users size={13} />{copy.guests}</span>
            <span className="font-mono text-emerald-200">19:30</span>
          </div>
          <div className={styles.tables}><i /><i /><i /><i><Check size={14} /></i><i /><i /></div>
          <div className={styles.choice}>
            <span>{copy.table}</span><span>{copy.selected}</span>
          </div>
        </div>
      </div>
      <div className={styles.copy}>
        <p className="text-sm font-semibold text-emerald-200">Umami Bistro</p>
        <h3 id="featured-project-title" className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl xl:text-5xl">{copy.title}</h3>
        <p className="max-w-md text-sm leading-relaxed text-neutral-300 sm:text-base">{copy.description}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a href={`?${projectReferenceQuery}=umami-bistro#contact`} onClick={event => {
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
            event.preventDefault();
            if (window.location.hash !== '#contact') window.history.pushState(null, '', '#contact');
            stageContactDraft([copy.draft], 'umami-bistro');
          }} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-200 px-4 py-2 text-sm font-bold text-emerald-950 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300">
            {copy.cta}<ArrowRight aria-hidden="true" className="shrink-0" size={17} />
          </a>
          <a href={`/${locale}/portfolio/umami-bistro#umami-table-plan`} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-emerald-300/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300">
            {copy.demo}<ArrowUpRight aria-hidden="true" className="shrink-0" size={17} />
          </a>
        </div>
      </div>
    </article>
  );
}
