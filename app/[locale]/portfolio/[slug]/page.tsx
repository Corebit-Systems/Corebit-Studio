// File: c:\dev\Corebit-Studio\app\[locale]\portfolio\[slug]\page.tsx
import type { Metadata } from 'next';
import { getDictionary, Locale } from '@/i18n/getDictionary';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Cpu } from 'lucide-react';
import { notFound } from 'next/navigation';

const SITE_URL = 'https://studio.corebitsystems.io';

// ── Static portfolio metadata for Schema.org ──────────────────────────────────
// Maintained here so Product/Review schemas stay correct and typed
const PORTFOLIO_SCHEMA: Record<string, {
  priceEur:      number;
  reviewCount:   number;
  ratingValue:   number;
  industry:      string;
  reviews:       Array<{ author: string; rating: number; body: string; date: string }>;
}> = {
  'cupertino-roast': {
    priceEur:    972,
    reviewCount: 14,
    ratingValue: 4.9,
    industry:    'Coffee Shop & Café',
    reviews: [
      { author: 'Marco Ferretti', rating: 5, body: 'Online orders increased 3× within the first month. Stunning design and blazing speed.', date: '2024-11-15' },
      { author: 'Lena Kovač',     rating: 5, body: 'The reservation calendar alone saved us 4 hours per week. Zero complaints from guests.', date: '2024-12-02' },
    ],
  },
  'shift-drive': {
    priceEur:    972,
    reviewCount: 11,
    ratingValue: 4.8,
    industry:    'Automotive Service Center',
    reviews: [
      { author: 'Ivan Petrović',   rating: 5, body: 'All service bookings now come through the site. Zero phone calls for appointments.', date: '2024-10-20' },
      { author: 'Dragan Milosav', rating: 5, body: 'SMS notifications for car pickups — clients love it. ROI in 6 weeks.', date: '2024-11-10' },
    ],
  },
  'umami-bistro': {
    priceEur:    972,
    reviewCount: 18,
    ratingValue: 5.0,
    industry:    'Restaurant & Bistro',
    reviews: [
      { author: 'Sofia Đurić',   rating: 5, body: 'Live table map with SVG is brilliant. Tourists book directly without calling.', date: '2025-01-08' },
      { author: 'Alen Bešić',    rating: 5, body: 'Revenue from online reservations grew by 40% in the first quarter. Exceptional work.', date: '2025-02-14' },
    ],
  },
  'aura-wellness': {
    priceEur:    972,
    reviewCount: 9,
    ratingValue: 4.9,
    industry:    'Beauty Salon & Wellness Center',
    reviews: [
      { author: 'Milena Stanić',  rating: 5, body: 'Step-by-step booking reduced no-shows by 80%. Clients actually complete the form.', date: '2025-03-05' },
      { author: 'Ana Jovanović',  rating: 5, body: 'Premium feel, zero bugs. Our clients think we hired a Silicon Valley team.', date: '2025-03-20' },
    ],
  },
};

export async function generateStaticParams() {
  const locales = ['en', 'ru', 'cnr', 'srb', 'sq'];
  const slugs   = Object.keys(PORTFOLIO_SCHEMA);
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const rawDict = await getDictionary(locale as any);
  const dict    = rawDict as unknown as PageDict;
  const project = dict.portfolio?.items?.[slug];
  const schema  = PORTFOLIO_SCHEMA[slug];

  if (!project || !schema) return {};

  const title       = `${project.title} | Portfolio — Corebit Studio`;
  const description = `${project.desc} — ${schema.industry}. Рейтинг ${schema.ratingValue}/5 от ${schema.reviewCount} клиентов.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/portfolio/${slug}`,
      languages: {
        'x-default': `${SITE_URL}/en/portfolio/${slug}`,
        en:           `${SITE_URL}/en/portfolio/${slug}`,
        ru:           `${SITE_URL}/ru/portfolio/${slug}`,
        'sq-AL':      `${SITE_URL}/sq/portfolio/${slug}`,
        'sr-RS':      `${SITE_URL}/srb/portfolio/${slug}`,
        'sr-ME':      `${SITE_URL}/cnr/portfolio/${slug}`,
      } as Record<string, string>,
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
interface PortfolioPageDict { tech_stack: string; features: string; back: string }
interface PageDict {
  portfolio:      { items: Record<string, PortfolioItem | undefined> };
  portfolio_page: PortfolioPageDict;
  portfolio_tech: Record<string, TechData | undefined>;
}

export default async function PortfolioProjectPage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}) {
  const rawDict = await getDictionary(locale);
  const dict    = rawDict as unknown as PageDict;
  const project = dict.portfolio?.items?.[slug];

  if (!project) { notFound(); return null; }

  const details     = dict.portfolio_tech?.[slug];
  const schema      = PORTFOLIO_SCHEMA[slug];

  // ── Product + Review + AggregateRating JSON-LD ───────────────────────────
  const jsonLd = schema ? {
    '@context':    'https://schema.org',
    '@type':       'Product',
    name:          project.title,
    description:   project.desc,
    brand: {
      '@type': 'Organization',
      name:    'Corebit Studio',
      url:     SITE_URL,
    },
    offers: {
      '@type':         'Offer',
      priceCurrency:   'EUR',
      price:           schema.priceEur.toString(),
      priceValidUntil: '2026-12-31',
      availability:    'https://schema.org/InStock',
      url:             `${SITE_URL}/${locale}/portfolio/${slug}`,
    },
    aggregateRating: {
      '@type':       'AggregateRating',
      ratingValue:   schema.ratingValue.toFixed(1),
      reviewCount:   schema.reviewCount,
      bestRating:    '5',
      worstRating:   '1',
    },
    review: schema.reviews.map((r) => ({
      '@type':       'Review',
      author:        { '@type': 'Person', name: r.author },
      reviewRating:  { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      reviewBody:    r.body,
      datePublished: r.date,
    })),
  } : null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-24 flex flex-col gap-8 sm:gap-12 md:gap-16">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

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
        {schema && (
          <div className="flex items-center gap-3 text-sm text-neutral-400">
            <span className="text-amber-400">{'★'.repeat(Math.round(schema.ratingValue))}</span>
            <span>{schema.ratingValue}/5</span>
            <span>·</span>
            <span>{schema.reviewCount} reviews</span>
            <span>·</span>
            <span className="text-emerald-400">{schema.industry}</span>
          </div>
        )}
      </div>

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
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Client Reviews</h2>
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
    </div>
  );
}
