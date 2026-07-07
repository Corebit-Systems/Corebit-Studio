// File: c:\dev\Corebit-Studio\middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ru', 'cnr', 'srb', 'sq'] as const;
type Locale = typeof locales[number];
const defaultLocale: Locale = 'en';

// Custom zero-dependency parser for Accept-Language headers to optimize Edge runtime
function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  // Split and parse languages by quality/priority values
  // e.g. "ru-RU,ru;q=0.9,en-US;q=0.8" -> [{locale: "ru-ru", baseLang: "ru"}, ...]
  const parsedLocales = acceptLanguage
    .split(',')
    .map((pref) => {
      const parts = pref.split(';');
      const locale = parts[0].trim().toLowerCase();
      const baseLang = locale.split('-')[0];
      return { locale, baseLang };
    });

  // 1. Try exact matches (e.g. 'ru-RU' matching our 'ru')
  for (const { locale } of parsedLocales) {
    if ((locales as readonly string[]).includes(locale)) {
      return locale;
    }
  }

  // 2. Try base language family matches (e.g. 'ru' from 'ru-RU')
  for (const { baseLang } of parsedLocales) {
    if ((locales as readonly string[]).includes(baseLang)) {
      return baseLang;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Normalize path: collapse consecutive slashes to prevent double-slash bypasses like //en
  const normalizedPathname = url.pathname.replace(/\/+/g, '/');

  // Strict first-segment extraction — avoids startsWith() substring matching
  const segments = normalizedPathname.split('/');
  const firstSegment = segments[1] as string;

  const pathnameHasLocale = (locales as readonly string[]).includes(firstSegment);

  if (pathnameHasLocale) {
    // Rewrite with the normalized path if it differs (collapsed double slashes)
    if (normalizedPathname !== url.pathname) {
      url.pathname = normalizedPathname;
      return NextResponse.redirect(url, { status: 308 });
    }
    return NextResponse.next();
  }

  // Detect user locale dynamically from request headers
  const locale = getLocale(request);
  url.pathname = `/${locale}${normalizedPathname}`;
  
  // Use 307 Temporary Redirect so browsers don't cache locale preferences permanently
  return NextResponse.redirect(url, { status: 307 });
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *  - api/*             — API routes
     *  - _next/static/*    — Static build assets
     *  - _next/image/*     — Next.js image optimizer
     *  - _vercel/*         — Vercel platform internals
     *  - .well-known/*     — Domain verification (ACME, Apple, etc.)
     *  - favicon.ico       — Browser favicon
     *  - robots.txt        — Search crawler config
     *  - sitemap.xml       — SEO sitemap
     *  - google*.html      — Google Search Console verification files
     *  - *.{ext}           — All static file extensions
     */
    '/((?!api|_next/static|_next/image|_vercel|\\.well-known|favicon\\.ico|robots\\.txt|sitemap\\.xml|google[a-z0-9]+\\.html|.*\\.(?:png|jpg|jpeg|webp|svg|ico|css|js|woff2?|map|json)).*)',
  ],
};
