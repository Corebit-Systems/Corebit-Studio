// File: C:\dev\Corebit-Studio\app\[locale]\portfolio\[slug]\page.tsx
import { getDictionary, Locale } from '@/i18n/getDictionary';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Cpu } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PortfolioItem {
  title: string;
  desc: string;
}

interface TechData {
  stack: string[];
  features: string[];
}

interface PortfolioPageDict {
  tech_stack: string;
  features: string;
  back: string;
}

interface PageDict {
  portfolio: {
    items: Record<string, PortfolioItem | undefined>;
  };
  portfolio_page: PortfolioPageDict;
  portfolio_tech: Record<string, TechData | undefined>;
}

export default async function PortfolioProjectPage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}) {
  const rawDict = await getDictionary(locale);
  const dict = rawDict as unknown as PageDict;
  const project = dict.portfolio.items[slug];

  // ФИКС: notFound() не прерывает TypeScript-выполнение — нужен явный return
  if (!project) {
    notFound();
    // notFound() бросает исключение, но TS без return видит возможный undefined ниже
    return null;
  }

  // ФИКС: безопасное обращение — details может быть undefined если slug нестандартный
  const details = dict.portfolio_tech[slug];

  return (
    // ФИКС: px-6 → px-4 sm:px-6, py-24 → py-8 sm:py-16 md:py-24, gap-16 → gap-8 sm:gap-12 md:gap-16
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-24 flex flex-col gap-8 sm:gap-12 md:gap-16">

      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit min-h-[44px]"
      >
        <ArrowLeft size={20} /> {dict.portfolio_page.back}
      </Link>

      <div className="flex flex-col gap-4 sm:gap-6">
        {/* ФИКС: text-5xl md:text-7xl → text-3xl sm:text-5xl md:text-7xl */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-tight">
          {project.title}
        </h1>
        <p className="text-base sm:text-xl text-neutral-400 max-w-3xl leading-relaxed">
          {project.desc}
        </p>
      </div>

      {/* ФИКС: p-10 → p-5 sm:p-8 md:p-10 */}
      {details ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 sm:gap-8 items-stretch">
          <div className="flex flex-col h-full p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl gap-4 sm:gap-6">
            <div className="flex items-center gap-3 text-emerald-400">
              <Cpu size={22} />
              <h3 className="text-xl sm:text-2xl font-semibold">{dict.portfolio_page.tech_stack}</h3>
            </div>
            <ul className="flex flex-col gap-3 sm:gap-4 mt-2 sm:mt-4">
              {details.stack.map((tech, i) => (
                <li key={i} className="flex items-center gap-3 text-neutral-300 font-medium text-sm sm:text-base">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" /> {tech}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col h-full p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl gap-4 sm:gap-6">
            <div className="flex items-center gap-3 text-white">
              <CheckCircle2 size={22} className="text-emerald-600" />
              <h3 className="text-xl sm:text-2xl font-semibold">{dict.portfolio_page.features}</h3>
            </div>
            <ul className="flex flex-col gap-3 sm:gap-4 mt-2 sm:mt-4">
              {details.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-neutral-300 leading-relaxed text-sm sm:text-base">
                  <div className="w-2 h-2 rounded-full bg-white/20 mt-[6px] shrink-0" /> {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        // ФИКС: Graceful fallback если slug есть в dict но нет в techData
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-neutral-400 text-center">
          Technical details coming soon.
        </div>
      )}

    </div>
  );
}
