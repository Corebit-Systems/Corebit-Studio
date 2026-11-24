// File: c:\dev\Corebit-Studio\app\[locale]\portfolio\[slug]\page.tsx
import type { Metadata } from 'next';
import { getDictionary, Locale } from '@/i18n/getDictionary';
import { getProjectServiceLink } from '@/i18n/serviceSearchContent';
import { searchAlternates, searchLanguageTags, searchOrganizationId, searchSiteUrl as SITE_URL, searchWebsiteId } from '@/i18n/searchUrls';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, ClipboardList, Cpu, Table2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import ProjectFlowPreview, { type ProjectPreviewCopy } from '@/components/ProjectFlowPreview';
import { readPricingSelection, type PricingSearchParams } from '@/components/pricingInquiry';
import { isProjectReference, projectReferenceQuery, projectWorkflowAnchor, type ProjectReferenceId } from '@/components/projectReference';

const PORTFOLIO_DETAILS: Record<ProjectReferenceId, {
  ratingValue:   number;
  industry:      string;
  reviews:       Array<{ author: string; rating: number; body: string; date: string }>;
}> = {
  'cupertino-roast': {
    ratingValue: 4.9,
    industry:    'Coffee Shop & Café',
    reviews: [
      { author: 'Marco Ferretti', rating: 5, body: 'Online orders increased 3× within the first month. Stunning design and blazing speed.', date: '2024-11-15' },
      { author: 'Lena Kovač',     rating: 5, body: 'The reservation calendar alone saved us 4 hours per week. Zero complaints from guests.', date: '2024-12-02' },
    ],
  },
  'shift-drive': {
    ratingValue: 4.8,
    industry:    'Automotive Service Center',
    reviews: [
      { author: 'Ivan Petrović',   rating: 5, body: 'All service bookings now come through the site. Zero phone calls for appointments.', date: '2024-10-20' },
      { author: 'Dragan Milosav', rating: 5, body: 'SMS notifications for car pickups — clients love it. ROI in 6 weeks.', date: '2024-11-10' },
    ],
  },
  'umami-bistro': {
    ratingValue: 5.0,
    industry:    'Restaurant & Bistro',
    reviews: [
      { author: 'Sofia Đurić',   rating: 5, body: 'Live table map with SVG is brilliant. Tourists book directly without calling.', date: '2025-01-08' },
      { author: 'Alen Bešić',    rating: 5, body: 'Revenue from online reservations grew by 40% in the first quarter. Exceptional work.', date: '2025-02-14' },
    ],
  },
  'aura-wellness': {
    ratingValue: 4.9,
    industry:    'Beauty Salon & Wellness Center',
    reviews: [
      { author: 'Milena Stanić',  rating: 5, body: 'Step-by-step booking reduced no-shows by 80%. Clients actually complete the form.', date: '2025-03-05' },
      { author: 'Ana Jovanović',  rating: 5, body: 'Premium feel, zero bugs. Our clients think we hired a Silicon Valley team.', date: '2025-03-20' },
    ],
  },
};

const REVIEWS_LABEL: Record<string, string> = {
  en: 'Reviews',
  ru: 'Отзывов',
  cnr: 'Recenzije',
  srb: 'Recenzije',
  sq: 'Rishikime',
};

const CLIENT_REVIEWS_TITLE: Record<string, string> = {
  en: 'Client Reviews',
  ru: 'Отзывы клиентов',
  cnr: 'Recenzije klijenata',
  srb: 'Recenzije klijenata',
  sq: 'Rishikimet e klientëve',
};

export async function generateStaticParams() {
  const locales = ['en', 'ru', 'cnr', 'srb', 'sq'];
  const slugs   = Object.keys(PORTFOLIO_DETAILS);
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const rawDict = await getDictionary(locale as any);
  const dict    = rawDict as unknown as PageDict;
  const project = isProjectReference(slug) ? dict.portfolio?.items?.[slug] : undefined;
  if (!project) return {};

  const title = `${project.title} | Corebit Studio`;
  const description = project.desc;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/portfolio/${slug}`,
      languages: searchAlternates(language => `/${language}/portfolio/${slug}`),
    },
    openGraph: {
      type:        'website',
      url:         `${SITE_URL}/${locale}/portfolio/${slug}`,
      title,
      description,
      siteName:    'Corebit Studio',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

interface PortfolioItem { title: string; desc: string }
interface TechData      { stack: string[]; features: string[] }
interface PortfolioPageDict {
  tech_stack: string;
  features: string;
  back: string;
  similar_project: string;
  preview_label: string;
  previews: Partial<Record<ProjectReferenceId, ProjectPreviewCopy>>;
  umami_booking: {
    title: string;
    steps: { title: string; description: string }[];
    cta: string;
  };
}

const bookingIcons = [Table2, CalendarCheck, ClipboardList];
interface PageDict {
  portfolio:      { items: Record<string, PortfolioItem | undefined> };
  portfolio_page: PortfolioPageDict;
  portfolio_tech: Record<string, TechData | undefined>;
}

export default async function PortfolioProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
  searchParams?: Promise<PricingSearchParams>;
}) {
  const { locale, slug } = await params;
  if (!isProjectReference(slug)) notFound();
  const rawDict = await getDictionary(locale);
  const dict    = rawDict as unknown as PageDict;
  const project = dict.portfolio?.items?.[slug];

  if (!project) { notFound(); return null; }

  const details     = dict.portfolio_tech?.[slug];
  const schema      = PORTFOLIO_DETAILS[slug];
  const booking = slug === 'umami-bistro' ? dict.portfolio_page.umami_booking : undefined;
  const reference = slug;
  const preview = reference && !booking ? dict.portfolio_page.previews[reference] : undefined;
  const relatedService = getProjectServiceLink(locale, slug);
  const pricingSelection = readPricingSelection(await searchParams);
  const contactQuery = new URLSearchParams(pricingSelection);
  if (reference) contactQuery.set(projectReferenceQuery, reference);
  const contactHref = `/${locale}${contactQuery.size ? `?${contactQuery}` : ''}#contact`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: `${SITE_URL}/${locale}/portfolio/${slug}`,
    name: project.title,
    description: project.desc,
    inLanguage: searchLanguageTags[locale],
    isPartOf: { '@id': searchWebsiteId },
    mainEntity: {
      '@type': 'CreativeWork',
      name: project.title,
      description: project.desc,
      creator: { '@id': searchOrganizationId },
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-24 flex flex-col gap-8 sm:gap-12 md:gap-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit min-h-[44px]"
      >
        <ArrowLeft size={20} /> {dict.portfolio_page.back}
      </Link>

      <div className="flex flex-col gap-4 sm:gap-6">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-tight">
          {project.title}
        </h1>
        <p className="text-base sm:text-xl text-neutral-400 max-w-3xl leading-relaxed">
          {project.desc}
        </p>
        {relatedService && (
          <Link
            href={relatedService.href}
            className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-medium text-emerald-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
          >
            {relatedService.title}<ArrowRight aria-hidden="true" size={15} className="shrink-0" />
          </Link>
        )}
        {schema && (
          <div className="flex items-center gap-3 text-sm text-neutral-400">
            <span className="text-amber-400">{'★'.repeat(Math.round(schema.ratingValue))}</span>
            <span>{schema.ratingValue}/5</span>
            <span>·</span>
            <span>{REVIEWS_LABEL[locale] || 'Reviews'}: {schema.reviews.length}</span>
            <span>·</span>
            <span className="text-emerald-400">{schema.industry}</span>
          </div>
        )}
      </div>

      {booking && (
        <section id={projectWorkflowAnchor} aria-labelledby="umami-booking-title" className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/[0.07] to-white/[0.02] p-5 sm:rounded-3xl sm:p-8">
          <h2 id="umami-booking-title" className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {booking.title}
          </h2>
          <ol className="mt-5 grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {booking.steps.map((step, index) => {
              const Icon = bookingIcons[index];
              return (
                <li key={step.title} className="min-w-0 py-4 md:px-5 md:first:pl-0 md:last:pr-0">
                  <Icon aria-hidden="true" size={22} className="mb-3 text-emerald-300" />
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">{step.description}</p>
                </li>
              );
            })}
          </ol>
          <Link
            href={contactHref}
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-5 py-2.5 text-center text-sm font-semibold text-black transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 sm:w-auto"
          >
            {booking.cta}
          </Link>
        </section>
      )}

      {preview && (
        <section
          id={projectWorkflowAnchor}
          aria-labelledby="project-preview-title"
          className="grid gap-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.04] p-5 sm:gap-6 sm:rounded-3xl sm:p-8 md:grid-cols-2 md:gap-x-10"
        >
          <div className="self-center">
            <h2 id="project-preview-title" className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{preview.title}</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-300 sm:text-base">{preview.description}</p>
          </div>
          <div className="w-full md:col-start-2 md:row-start-1 md:row-span-2">
            <ProjectFlowPreview copy={preview} label={dict.portfolio_page.preview_label} />
          </div>
          <Link
            href={contactHref}
            className="inline-flex min-h-12 items-center justify-center self-start rounded-xl bg-white px-5 py-2.5 text-center text-sm font-semibold text-black transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 sm:justify-self-start"
          >
            {dict.portfolio_page.similar_project}
          </Link>
        </section>
      )}

      {details ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
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
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-neutral-400 text-center">
          Technical details coming soon.
        </div>
      )}

      {/* Client testimonials from schema (visible + structured) */}
      {schema && schema.reviews.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            {CLIENT_REVIEWS_TITLE[locale] || 'Client Reviews'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {schema.reviews.map((r, i) => (
              <div key={i} className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-sm">{'★'.repeat(r.rating)}</span>
                  <span className="text-sm text-neutral-500">{r.date}</span>
                </div>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed italic">"{r.body}"</p>
                <span className="text-xs text-neutral-500 font-medium">— {r.author}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {!booking && !preview && (
        <Link
          href={contactHref}
          className="inline-flex min-h-12 items-center justify-center self-start rounded-xl bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
        >
          {dict.portfolio_page.similar_project}
        </Link>
      )}
    </div>
  );
}
