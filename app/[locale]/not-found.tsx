// File: c:\dev\Corebit-Studio\app\[locale]\not-found.tsx
// Next.js App Router: this file renders when notFound() is called within the [locale] segment.
// It has access to params via the parent layout, which sets lang={locale} on <html>.
import { getDictionary, Locale } from '@/i18n/getDictionary';
import Link from 'next/link';

// notFound() pages in App Router cannot receive params directly,
// so we read the locale from the pathname via a workaround using headers.
import { headers } from 'next/headers';

export default async function NotFound() {
  // Extract locale from the x-pathname header (set by middleware or Next internals)
  // Fallback gracefully to 'en' if absent
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || headersList.get('referer') || '/en';
  const segments = pathname.split('/').filter(Boolean);
  const rawLocale = segments[0] as Locale;
  const validLocales: Locale[] = ['en', 'ru', 'cnr', 'srb', 'sq'];
  const locale: Locale = validLocales.includes(rawLocale) ? rawLocale : 'en';

  const dict = await getDictionary(locale) as {
    not_found: { title: string; subtitle: string; back: string };
  };

  const nf = dict.not_found;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-8 px-4 py-16 relative">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-600/8 blur-[120px] rounded-full pointer-events-none" />

      {/* 404 code */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <span className="text-[120px] sm:text-[180px] font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white/20 to-white/5 select-none">
          404
        </span>

        <div className="flex flex-col gap-3 max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {nf.title}
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-light">
            {nf.subtitle}
          </p>
        </div>

        <Link
          href={`/${locale}`}
          className="mt-4 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-semibold text-base hover:bg-neutral-100 transition-all shadow-[0_4px_24px_rgba(255,255,255,0.1)] active:scale-95"
        >
          ← {nf.back}
        </Link>
      </div>
    </div>
  );
}
