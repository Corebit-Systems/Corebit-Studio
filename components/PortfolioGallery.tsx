'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, Images, X } from 'lucide-react';
import type { Locale } from '@/i18n/getDictionary';
import type { ProjectReferenceId } from './projectReference';
import styles from './PortfolioGallery.module.css';

const scenes = {
  'cupertino-roast': { artwork: 'cupertino', anchor: 'roast-order' },
  'shift-drive': { artwork: 'shift', anchor: 'workshop-schedule' },
  'umami-bistro': { artwork: 'umami', anchor: 'umami-table-plan' },
  'aura-wellness': { artwork: 'aura', anchor: 'aura-visit' },
} satisfies Record<ProjectReferenceId, { artwork: string; anchor: string }>;

const copy: Record<Locale, readonly [open: string, close: string, prev: string, next: string, tryProject: string]> = {
  ru: ['Смотреть галерею', 'Закрыть галерею', 'Предыдущий проект', 'Следующий проект', 'Попробовать интерактив'],
  en: ['View gallery', 'Close gallery', 'Previous project', 'Next project', 'Try the interactive demo'],
  cnr: ['Pogledaj galeriju', 'Zatvori galeriju', 'Prethodni projekat', 'Sljedeći projekat', 'Isprobaj interaktivni prikaz'],
  srb: ['Pogledaj galeriju', 'Zatvori galeriju', 'Prethodni projekat', 'Sledeći projekat', 'Isprobaj interaktivni prikaz'],
  sq: ['Shiko galerinë', 'Mbyll galerinë', 'Projekti i mëparshëm', 'Projekti tjetër', 'Provo versionin interaktiv'],
};

interface Project {
  id: ProjectReferenceId;
  title: string;
  desc: string;
}

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300';

export default function PortfolioGallery({ locale, projects }: { locale: Locale; projects: Project[] }) {
  const [openLabel, closeLabel, previousLabel, nextLabel, tryLabel] = copy[locale];
  const headingId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number } | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{
    current: number; previous?: number; direction: 'forward' | 'backward';
  }>({ current: 0, direction: 'forward' });

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    element.showModal();
    closeButton.current?.focus();
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
      if (element.open) element.close();
    };
  }, [open]);

  function setProject(index: number, direction?: 'forward' | 'backward') {
    setPosition(current => {
      const next = (index + projects.length) % projects.length;
      return next === current.current ? current : {
        current: next,
        previous: current.current,
        direction: direction ?? (next > current.current ? 'forward' : 'backward'),
      };
    });
  }

  function step(delta: number) {
    setProject(position.current + delta, delta > 0 ? 'forward' : 'backward');
  }

  function navigate(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    step(event.key === 'ArrowRight' ? 1 : -1);
  }

  function beginTouch(event: TouchEvent<HTMLElement>) {
    const first = event.touches[0];
    touch.current = event.touches.length === 1 ? { x: first.clientX, y: first.clientY } : undefined;
  }

  function finishDemoTap(event: TouchEvent<HTMLAnchorElement>) {
    const initial = touch.current;
    touch.current = undefined;
    if (!initial || !event.cancelable) return;
    const end = event.changedTouches[0];
    if (Math.hypot(end.clientX - initial.x, end.clientY - initial.y) > 10) return;

    event.preventDefault();
    window.location.assign(event.currentTarget.href);
  }

  const current = projects[position.current];

  return (
    <>
      <button ref={trigger} type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}
        className={`mx-auto mt-1 inline-flex min-h-12 items-center gap-2 rounded-xl border border-emerald-300/25 bg-emerald-400/[0.07] px-4 text-sm font-semibold text-emerald-200 transition-colors hover:border-emerald-300/60 hover:bg-emerald-400/15 ${focus}`}>
        <Images aria-hidden="true" size={18} />{openLabel}
      </button>

      <dialog
        ref={dialog}
        aria-labelledby={headingId}
        className={`${styles.dialog} m-auto w-[calc(100%-1.5rem)] max-w-[74rem] rounded-2xl border border-emerald-200/20 bg-[#07100e] p-0 text-white sm:rounded-3xl`}
        onKeyDown={navigate}
        onClose={() => { setOpen(false); trigger.current?.focus(); }}
        onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}
      >
        {open && (
          <div>
            <div className={`${styles.stage} relative isolate overflow-hidden bg-[#07100e]`}>
              {projects.map(({ id }, index) => (
                <div key={id} aria-hidden="true"
                  className={`${styles.frame} absolute inset-0`}
                  data-frame={position.current === index ? 'current' : position.previous === index ? 'previous' : 'waiting'}
                  data-direction={position.previous === undefined ? undefined : position.direction}>
                  <Image
                    fill
                    unoptimized
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, 1184px"
                    src={`/portfolio-scenes/${scenes[id].artwork}.webp`}
                    alt=""
                    className="object-cover object-[65%_center]"
                  />
                </div>
              ))}
              <div aria-hidden="true" className={`${styles.shade} pointer-events-none absolute inset-0 z-[3]`} />
              <div
                aria-hidden="true"
                className="absolute inset-0 z-[3] touch-pan-y"
                onTouchStart={beginTouch}
                onTouchCancel={() => { touch.current = undefined; }}
                onTouchEnd={event => {
                  const initial = touch.current;
                  touch.current = undefined;
                  if (!initial) return;
                  const end = event.changedTouches[0];
                  const dx = end.clientX - initial.x;
                  const dy = end.clientY - initial.y;
                  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.35) step(dx < 0 ? 1 : -1);
                }}
              />
              <div className="absolute inset-x-0 top-0 z-[4] flex justify-end p-3 sm:p-5">
                <button ref={closeButton} type="button" onClick={() => dialog.current?.close()} aria-label={closeLabel}
                  className={`grid size-11 place-items-center rounded-full border border-white/20 bg-black/65 text-white hover:bg-black ${focus}`}>
                  <X aria-hidden="true" size={20} />
                </button>
              </div>
              <div key={current.id} className={`${styles.caption} pointer-events-none relative z-[4] flex max-w-xl flex-col items-start gap-3 px-4 pb-6 pt-32 text-left sm:gap-4 sm:px-9 sm:pb-10`} aria-live="polite">
                <h2 id={headingId} className="text-balance text-3xl font-semibold tracking-tight sm:text-6xl">{current.title}</h2>
                <p className="max-w-md text-sm leading-relaxed text-neutral-100 sm:text-base">{current.desc}</p>
                <a
                  href={`/${locale}/portfolio/${current.id}#${scenes[current.id].anchor}`}
                  onTouchStart={beginTouch}
                  onTouchCancel={() => { touch.current = undefined; }}
                  onTouchEnd={finishDemoTap}
                  className={`pointer-events-auto mt-1 inline-flex min-h-12 max-w-full items-center gap-2 rounded-xl bg-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-200 ${focus}`}>
                  {tryLabel}<ArrowUpRight aria-hidden="true" size={16} className="shrink-0" />
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-emerald-200/15 bg-[#070e0c] p-3 sm:p-4">
              <div className="grid flex-1 grid-cols-2 gap-1.5 min-[620px]:grid-cols-4">
                {projects.map((project, index) => (
                  <button type="button" key={project.id} aria-pressed={index === position.current} onClick={() => setProject(index)}
                    className={`min-h-11 min-w-0 rounded-lg border border-transparent px-2 py-1.5 text-left text-xs font-medium text-neutral-300 hover:bg-white/5 aria-pressed:border-emerald-300/30 aria-pressed:bg-emerald-300/10 aria-pressed:text-emerald-200 sm:px-3 sm:text-sm ${focus}`}>
                    {project.title}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                <button type="button" aria-label={previousLabel} onClick={() => step(-1)} className={`grid size-11 place-items-center rounded-lg border border-white/15 text-emerald-200 hover:border-emerald-300/50 ${focus}`}><ArrowLeft aria-hidden="true" size={19} /></button>
                <button type="button" aria-label={nextLabel} onClick={() => step(1)} className={`grid size-11 place-items-center rounded-lg border border-white/15 text-emerald-200 hover:border-emerald-300/50 ${focus}`}><ArrowRight aria-hidden="true" size={19} /></button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
