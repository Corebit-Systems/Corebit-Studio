// File: C:\dev\Studio\app\[locale]\portfolio\[slug]\page.tsx
import { getDictionary, Locale } from '@/i18n/getDictionary';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Cpu } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function PortfolioProjectPage({ params: { locale, slug } }: { params: { locale: Locale, slug: string } }) {
  const dict = await getDictionary(locale);
  const project = dict.portfolio.items[slug as keyof typeof dict.portfolio.items];

  if (!project) {
    notFound();
  }

  const techData: Record<string, { stack: string[], features: string[] }> = {
    'cupertino-roast': {
      stack: ['Next.js 14 Edge', 'Tailwind Custom Config', 'Stripe Payments', 'Vercel KV'],
      features: ['Interactive 3D Menu', 'Real-time stock synchronization', 'Apple Pay 1-click checkout']
    },
    'shift-drive': {
      stack: ['React Server Components', 'PostgreSQL', 'WebSockets', 'Framer Motion Engine'],
      features: ['Real-time time-slot calculation', 'Live mechanic bay status tracking', 'Automated SMS Reminders via Twilio']
    },
    'umami-bistro': {
      stack: ['Next.js App Router', 'Redis Caching', 'Custom Webhooks', 'Glassmorphism UI'],
      features: ['Interactive SVG floor plans for table reservations', 'Instant waitlist queue management', 'Manager dashboard sync']
    },
    'aura-wellness': {
      stack: ['Next.js', 'Tailwind CSS', 'Prisma ORM', 'Stripe Connect'],
      features: ['Smooth step-by-step onboarding forms', 'Staff calendar synchronization', 'Deposit payment authorization']
    }
  };

  const details = techData[slug];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-24 flex flex-col gap-16">
      
      <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit">
        <ArrowLeft size={20} /> {dict.portfolio_page.back}
      </Link>

      <div className="flex flex-col gap-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          {project.title}
        </h1>
        <p className="text-xl text-neutral-400 max-w-3xl leading-relaxed">
          {project.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="flex flex-col h-full p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl gap-6">
          <div className="flex items-center gap-3 text-emerald-400">
            <Cpu size={24} />
            <h3 className="text-2xl font-semibold">{dict.portfolio_page.tech_stack}</h3>
          </div>
          <ul className="flex flex-col gap-4 mt-4">
            {details.stack.map((tech, i) => (
              <li key={i} className="flex items-center gap-3 text-neutral-300 font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col h-full p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl gap-6">
          <div className="flex items-center gap-3 text-white">
            <CheckCircle2 size={24} className="text-emerald-500" />
            <h3 className="text-2xl font-semibold">{dict.portfolio_page.features}</h3>
          </div>
          <ul className="flex flex-col gap-4 mt-4">
            {details.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-neutral-300 leading-relaxed">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2 shrink-0" /> {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
