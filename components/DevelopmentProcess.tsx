'use client';

import { useState, type KeyboardEvent } from 'react';
import { ClipboardList, Code2, Layers3, ListChecks, Rocket } from 'lucide-react';
import type { Locale } from '@/i18n/getDictionary';

const stepIcons = [ClipboardList, Layers3, Code2, ListChecks, Rocket] as const;
const lastStep = stepIcons.length - 1;

interface Step {
  title: string;
  description: string;
  result: string;
}

interface ProcessCopy {
  title: string;
  subtitle: string;
  resultLabel: string;
  steps: [Step, Step, Step, Step, Step];
}

const processCopy: Record<Locale, ProcessCopy> = {
  en: {
    title: 'How we build your website',
    subtitle: 'Five steps from the first discussion to launch.',
    resultLabel: 'What you get',
    steps: [
      { title: 'Discovery', description: 'We discuss your business, what customers need to do on the site, and which tasks should be automated.', result: 'A list of pages, features and priorities for the project.' },
      { title: 'Design', description: 'We plan the customer journey and design the key screens for phones and computers.', result: 'A layout to review before development begins.' },
      { title: 'Development', description: 'We build the approved pages and connect the features the project needs, such as booking or notifications.', result: 'A working site ready for review.' },
      { title: 'Testing', description: 'We go through the main customer journeys and check forms and layouts at different screen sizes.', result: 'A site checked and ready for launch.' },
      { title: 'Launch', description: 'We publish the site on the agreed domain and connect analytics and the other services in scope.', result: 'A live website at the agreed address.' },
    ],
  },
  ru: {
    title: 'Как мы разрабатываем сайты',
    subtitle: 'Пять этапов от первого разговора до запуска.',
    resultLabel: 'Результат этапа',
    steps: [
      { title: 'Анализ задачи', description: 'Обсуждаем ваш бизнес, что клиентам нужно делать на сайте и какие задачи стоит автоматизировать.', result: 'Список страниц, функций и приоритетов проекта.' },
      { title: 'Проектирование', description: 'Продумываем путь клиента и рисуем ключевые экраны для телефона и компьютера.', result: 'Макеты, которые можно согласовать до разработки.' },
      { title: 'Разработка', description: 'Собираем согласованные страницы и подключаем нужные функции, например бронирование или уведомления.', result: 'Рабочая версия сайта для проверки.' },
      { title: 'Тестирование', description: 'Проходим основные сценарии клиента, проверяем формы и вёрстку на экранах разного размера.', result: 'Проверенный сайт, готовый к запуску.' },
      { title: 'Запуск', description: 'Публикуем сайт на согласованном домене и подключаем аналитику и другие сервисы, предусмотренные проектом.', result: 'Сайт доступен по согласованному адресу.' },
    ],
  },
  cnr: {
    title: 'Kako izrađujemo vaš sajt',
    subtitle: 'Pet koraka od prvog razgovora do objave sajta.',
    resultLabel: 'Rezultat ovog koraka',
    steps: [
      { title: 'Analiza', description: 'Razgovaramo o vašem poslovanju, o tome šta klijenti treba da urade na sajtu i koje zadatke vrijedi automatizovati.', result: 'Spisak stranica, funkcija i prioriteta projekta.' },
      { title: 'Projektovanje', description: 'Planiramo kako će klijenti koristiti sajt i izrađujemo dizajn ključnih ekrana za telefon i računar.', result: 'Dizajn koji možete pregledati prije početka razvoja.' },
      { title: 'Razvoj', description: 'Izrađujemo dogovorene stranice i povezujemo potrebne funkcije, poput rezervacija ili obavještenja.', result: 'Radna verzija sajta spremna za pregled.' },
      { title: 'Testiranje', description: 'Provjeravamo glavne radnje klijenata, obrasce i prikaz na ekranima različitih veličina.', result: 'Provjeren sajt spreman za objavu.' },
      { title: 'Objava sajta', description: 'Objavljujemo sajt na dogovorenom domenu i povezujemo analitiku i ostale usluge predviđene projektom.', result: 'Sajt je dostupan na dogovorenoj adresi.' },
    ],
  },
  srb: {
    title: 'Kako izrađujemo vaš sajt',
    subtitle: 'Pet koraka od prvog razgovora do objave sajta.',
    resultLabel: 'Rezultat ovog koraka',
    steps: [
      { title: 'Analiza', description: 'Razgovaramo o vašem poslovanju, o tome šta klijenti treba da urade na sajtu i koje zadatke vredi automatizovati.', result: 'Spisak stranica, funkcija i prioriteta projekta.' },
      { title: 'Projektovanje', description: 'Planiramo kako će klijenti koristiti sajt i izrađujemo dizajn ključnih ekrana za telefon i računar.', result: 'Dizajn koji možete pregledati pre početka razvoja.' },
      { title: 'Razvoj', description: 'Izrađujemo dogovorene stranice i povezujemo potrebne funkcije, poput rezervacija ili obaveštenja.', result: 'Radna verzija sajta spremna za pregled.' },
      { title: 'Testiranje', description: 'Proveravamo glavne radnje klijenata, obrasce i prikaz na ekranima različitih veličina.', result: 'Proveren sajt spreman za objavu.' },
      { title: 'Objava sajta', description: 'Objavljujemo sajt na dogovorenom domenu i povezujemo analitiku i ostale usluge predviđene projektom.', result: 'Sajt je dostupan na dogovorenoj adresi.' },
    ],
  },
  sq: {
    title: 'Si e ndërtojmë faqen tuaj',
    subtitle: 'Pesë hapa nga biseda e parë deri te publikimi.',
    resultLabel: 'Rezultati i këtij hapi',
    steps: [
      { title: 'Analiza', description: 'Diskutojmë për biznesin tuaj, çfarë duhet të bëjnë klientët në faqe dhe cilat detyra mund të automatizohen.', result: 'Lista e faqeve, funksioneve dhe përparësive të projektit.' },
      { title: 'Dizajni', description: 'Planifikojmë si do ta përdorin klientët faqen dhe projektojmë ekranet kryesore për celular dhe kompjuter.', result: 'Një dizajn që mund ta shqyrtoni para zhvillimit.' },
      { title: 'Zhvillimi', description: 'Ndërtojmë faqet e miratuara dhe lidhim funksionet e nevojshme, si rezervimet ose njoftimet.', result: 'Një version funksional i faqes për shqyrtim.' },
      { title: 'Testimi', description: 'Provojmë veprimet kryesore të klientëve, formularët dhe pamjen në ekrane me madhësi të ndryshme.', result: 'Një faqe e kontrolluar dhe gati për publikim.' },
      { title: 'Publikimi', description: 'Publikojmë faqen në domenin e dakorduar dhe lidhim analitikën e shërbimet e parashikuara në projekt.', result: 'Faqja është e disponueshme në adresën e dakorduar.' },
    ],
  },
};

export default function DevelopmentProcess({ locale }: { locale: Locale }) {
  const copy = processCopy[locale] ?? processCopy.en;
  const [activeStep, setActiveStep] = useState(0);

  function navigateSteps(event: KeyboardEvent<HTMLDivElement>) {
    const positions: Partial<Record<string, number>> = {
      ArrowRight: activeStep + 1,
      ArrowDown: activeStep + 1,
      ArrowLeft: activeStep - 1,
      ArrowUp: activeStep - 1,
      Home: 0,
      End: lastStep,
    };
    const value = Object.hasOwn(positions, event.key) ? positions[event.key] : undefined;
    if (value === undefined) return;

    event.preventDefault();
    const index = (value + stepIcons.length) % stepIcons.length;
    setActiveStep(index);
    event.currentTarget.querySelectorAll('button')[index]?.focus();
  }

  return (
    <section id="development-process" aria-labelledby="development-process-title" className="mx-auto flex w-full max-w-5xl flex-col gap-7 sm:gap-9">
      <div className="space-y-3 text-center">
        <h2 id="development-process-title" className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{copy.title}</h2>
        <p className="text-base text-neutral-400 sm:text-lg">{copy.subtitle}</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.025] p-3 sm:gap-5 sm:p-5 md:grid-cols-[minmax(14rem,1fr)_2fr]">
        <div role="tablist" aria-labelledby="development-process-title" onKeyDown={navigateSteps} className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 md:grid-cols-1">
          {copy.steps.map((step, index) => {
            const Icon = stepIcons[index];
            const selected = index === activeStep;

            return (
              <button
                key={step.title}
                id={`process-tab-${index}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`process-panel-${index}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveStep(index)}
                className={`flex min-h-12 min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 min-[380px]:max-md:last:col-span-2 sm:gap-3 sm:px-3 sm:text-sm ${selected ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-200' : 'border-transparent text-neutral-300 hover:bg-white/[0.06] hover:text-white'}`}
              >
                <Icon aria-hidden="true" size={17} className="shrink-0" />
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>

        <div className="min-w-0 rounded-2xl border border-emerald-400/15 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,.15),_transparent_72%)] p-4 sm:p-6">
          <div aria-hidden="true" className="mb-4 h-0.5 overflow-hidden rounded-full bg-white/10 sm:mb-5">
            <div className="h-full rounded-full bg-emerald-300 motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out" style={{ width: `${((activeStep + 1) / stepIcons.length) * 100}%` }} />
          </div>
          {copy.steps.map((step, index) => (
            <div
              key={step.title}
              id={`process-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`process-tab-${index}`}
              hidden={index !== activeStep}
              tabIndex={0}
              className="min-h-[12.5rem] rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 motion-safe:[animation:section-enter_.35s_ease-out] sm:min-h-[11rem]"
            >
              <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{step.title}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-300 sm:text-base">{step.description}</p>
              <div className="mt-4 border-t border-white/10 pt-3 sm:mt-5">
                <p className="text-xs font-semibold text-emerald-300">{copy.resultLabel}</p>
                <p className="mt-1 text-sm leading-relaxed text-white">{step.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
