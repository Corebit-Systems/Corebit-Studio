import { CalendarClock, CalendarHeart, Utensils } from 'lucide-react';
import Image from 'next/image';
import BentoCard from './BentoCard';
import { projectWorkflowAnchor, type ProjectReferenceId } from './projectReference';
import styles from './AutomationModules.module.css';

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

const rentalDates = [14, 15, 16, 17, 18];
const visitTimes = ['09:00', '11:30', '14:00'];

export default function AutomationModules({ dict, locale }: { dict: AutomationDict; locale: string }) {
  const modules = [
    {
      ...dict.tables, project: 'umami-bistro', Icon: Utensils, artwork: 'umami', span: '',
      visual: <div className={styles.floor}><i /><i /><i /><i /></div>,
    },
    {
      ...dict.booking, project: 'shift-drive', Icon: CalendarClock, artwork: 'shift', span: 'md:col-span-2',
      visual: <div className={styles.calendar}>{rentalDates.map(date => <span key={date}>{date}</span>)}</div>,
    },
    {
      ...dict.schedule, project: 'aura-wellness', Icon: CalendarHeart, artwork: 'aura', span: 'md:col-span-3',
      visual: <div className={styles.schedule}>{visitTimes.map(time => <span key={time}>{time}<i /></span>)}</div>,
    },
  ] satisfies (AutomationModule & {
    project: ProjectReferenceId;
    Icon: typeof Utensils;
    artwork: string;
    span: string;
    visual: React.JSX.Element;
  })[];

  return (
    <section id="modules" aria-labelledby="modules-title" className="flex scroll-mt-28 flex-col gap-8 sm:gap-12">
      <div className="flex flex-col gap-3 px-2 text-center sm:gap-4">
        {dict.seo_tagline && (
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-500 sm:text-sm">{dict.seo_tagline}</p>
        )}
        <h2 id="modules-title" className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{dict.title}</h2>
        <p className="text-base text-neutral-400 sm:text-xl">{dict.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 items-stretch gap-4 sm:gap-6 md:grid-cols-3">
        {modules.map(({ title, desc, case_cta, project, Icon, artwork, span, visual }, index) => (
          <div key={project} className={span}>
            <BentoCard
              href={`/${locale}/portfolio/${project}#${projectWorkflowAnchor}`}
              title={title}
              description={desc}
              linkLabel={case_cta}
              visual={
                <div className={`${styles.scene} ${styles[artwork]}`}>
                  <Image src={`/portfolio-scenes/${artwork}.webp`} alt="" fill unoptimized className={styles.artwork} />
                  <div className={styles.marker}><Icon size={19} /></div>
                  <div className={styles.panel}>
                    <div className={styles.panelBar}><i /><i /><i /></div>
                    {visual}
                  </div>
                </div>
              }
              delay={0.1 * (index + 1)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
