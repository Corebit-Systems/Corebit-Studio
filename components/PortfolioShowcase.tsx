import { CalendarClock, Check, Coffee, LayoutGrid, Sparkles } from 'lucide-react';
import BentoCard from './BentoCard';
import PortfolioGallery from './PortfolioGallery';
import FeaturedProject from './FeaturedProject';
import type { Locale } from '@/i18n/getDictionary';
import { projectWorkflowAnchor, type ProjectReferenceId } from './projectReference';

export interface PortfolioShowcaseDict {
  title: string;
  subtitle: string;
  items: Record<ProjectReferenceId, { title: string; desc: string }>;
}

const projects = ['cupertino-roast', 'shift-drive', 'umami-bistro', 'aura-wellness'] as const;
const slots = ['10:00', '11:30', '14:00', '15:30'];
const drinks = ['Espresso', 'Cappuccino', 'Latte'];
const panel = 'flex min-w-0 flex-col justify-center rounded-xl border border-white/10 bg-[#0a100f] p-3 shadow-[0_12px_26px_rgba(0,0,0,.35)]';
const active = 'border-emerald-300/55 bg-emerald-400/20 text-emerald-200 group-hover:bg-emerald-400/30';

function ProjectPreview({ project }: { project: ProjectReferenceId }) {
  switch (project) {
    case 'cupertino-roast':
      return (
        <div className={`${panel} w-full max-w-[18rem] gap-1.5`}>
          {drinks.map((drink, index) => (
            <div key={drink} className={`flex min-h-7 items-center gap-2 rounded-md border px-2 text-[10px] font-medium transition-colors sm:text-xs ${index === 1 ? active : 'border-white/10 bg-white/[0.03] text-neutral-200'}`}>
              <Coffee size={13} className="shrink-0" /> {drink}
              {index === 1 && <Check size={12} className="ml-auto shrink-0" />}
            </div>
          ))}
        </div>
      );
    case 'shift-drive':
      return (
        <div className={`${panel} w-full max-w-[18rem] gap-2.5`}>
          <CalendarClock size={18} className="text-emerald-300" />
          <div className="grid grid-cols-2 gap-1.5">
            {slots.map((slot, index) => (
              <span key={slot} className={`rounded-md border py-1.5 text-center text-[10px] font-semibold tabular-nums transition-colors sm:text-xs ${index === 2 ? active : 'border-white/10 bg-white/[0.03] text-neutral-300'}`}>
                {slot}
              </span>
            ))}
          </div>
        </div>
      );
    case 'umami-bistro':
      return (
        <div className={`${panel} w-full max-w-[18rem] gap-2`}>
          <LayoutGrid size={18} className="text-emerald-300" />
          <div className="grid grid-cols-3 items-center justify-items-center gap-x-3 gap-y-2 rounded-md border border-dashed border-emerald-300/20 p-2">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} className={`h-5 w-7 rounded-[.35rem] border transition-colors sm:w-9 ${index === 4 ? active : 'border-white/15 bg-white/[0.04]'}`}>
                {index === 4 && <Check size={12} className="mx-auto mt-[3px]" />}
              </span>
            ))}
          </div>
        </div>
      );
    case 'aura-wellness':
      return (
        <div className={`${panel} w-full max-w-[18rem] gap-3`}>
          <Sparkles size={18} className="text-emerald-300" />
          <div className="flex items-center">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-emerald-300/55 bg-emerald-400/20 text-emerald-200"><Check size={13} /></span>
            <span className="h-px flex-1 bg-emerald-400/45" />
            <span className="h-6 w-6 shrink-0 rounded-full border border-emerald-300/70 bg-emerald-400/35 shadow-[0_0_18px_rgba(52,211,153,.24)]" />
            <span className="h-px flex-1 bg-white/15" />
            <span className="h-6 w-6 shrink-0 rounded-full border border-white/20 bg-white/5" />
          </div>
          <div className="h-1.5 w-3/4 rounded-full bg-white/10" />
        </div>
      );
  }
}

export default function PortfolioShowcase({ dict, locale, linkLabel, featured = false }: { dict: PortfolioShowcaseDict; locale: Locale; linkLabel: string; featured?: boolean }) {
  const gallery = <PortfolioGallery locale={locale} projects={projects.map(id => ({ id, ...dict.items[id] }))} />;

  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="flex flex-col gap-8 sm:gap-12">
      <div className="flex flex-col gap-3 px-2 text-center sm:gap-4">
        <h2 id="portfolio-title" className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{dict.title}</h2>
        <p className="text-base text-neutral-400 sm:text-xl">{dict.subtitle}</p>
        {!featured && gallery}
      </div>
      {featured && (
        <>
          <FeaturedProject locale={locale} />
          {gallery}
        </>
      )}
      <div className="grid items-stretch gap-4 sm:grid-cols-2 sm:gap-6">
        {projects.map((project, index) => (
          <BentoCard
            key={project}
            href={`/${locale}/portfolio/${project}#${projectWorkflowAnchor}`}
            title={dict.items[project].title}
            description={dict.items[project].desc}
            linkLabel={linkLabel}
            visual={
              <div className="flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_bottom,_rgba(16,185,129,.18),_transparent_72%)] px-4">
                <div className="flex w-full justify-center motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:-translate-y-1.5 motion-safe:group-hover:scale-[1.035]">
                  <ProjectPreview project={project} />
                </div>
              </div>
            }
            delay={0.07 * index}
          />
        ))}
      </div>
    </section>
  );
}
