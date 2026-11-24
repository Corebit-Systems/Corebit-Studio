import { CalendarClock, CalendarHeart, Utensils } from 'lucide-react';
import BentoCard from './BentoCard';
import { projectWorkflowAnchor, type ProjectReferenceId } from './projectReference';

interface AutomationModule {
  title: string;
  desc: string;
  case_cta: string;
}

export interface AutomationDict {
  title: string;
  subtitle: string;
  seo_tagline?: string;
  tables: AutomationModule;
  booking: AutomationModule;
  schedule: AutomationModule;
}

export default function AutomationModules({ dict, locale }: { dict: AutomationDict; locale: string }) {
  const modules = [
    { ...dict.tables, project: 'umami-bistro', Icon: Utensils, span: '' },
    { ...dict.booking, project: 'shift-drive', Icon: CalendarClock, span: 'md:col-span-2' },
    { ...dict.schedule, project: 'aura-wellness', Icon: CalendarHeart, span: 'md:col-span-3' },
  ] satisfies (AutomationModule & { project: ProjectReferenceId; Icon: typeof Utensils; span: string })[];

  return (
    <section id="modules" aria-labelledby="modules-title" className="flex flex-col gap-8 sm:gap-12">
      <div className="flex flex-col gap-3 px-2 text-center sm:gap-4">
        {dict.seo_tagline && (
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-500 sm:text-sm">{dict.seo_tagline}</p>
        )}
        <h2 id="modules-title" className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{dict.title}</h2>
        <p className="text-base text-neutral-400 sm:text-xl">{dict.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 items-stretch gap-4 sm:gap-6 md:grid-cols-3">
        {modules.map(({ title, desc, case_cta, project, Icon, span }, index) => (
          <div key={project} className={span}>
            <BentoCard
              href={`/${locale}/portfolio/${project}#${projectWorkflowAnchor}`}
              title={title}
              description={desc}
              linkLabel={case_cta}
              icon={<Icon aria-hidden="true" size={24} />}
              delay={0.1 * (index + 1)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
