// File: c:\dev\Corebit-Studio\middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Locale } from '@/i18n/getDictionary';
import { searchLocales } from '@/i18n/searchUrls';

const defaultLocale: Locale = 'en';
const languagePreference = /^\s*([a-z]{1,8}(?:-[a-z0-9]{1,8})*|\*)\s*(?:;\s*q\s*=\s*(0(?:\.\d{0,3})?|1(?:\.0{0,3})?)\s*)?$/i;

function matchLocale(tag: string): Locale | undefined {
  const [language, scriptOrRegion, regionAfterScript] = tag.toLowerCase().split('-');
  if (language === 'sr') {
    const region = scriptOrRegion?.length === 4 ? regionAfterScript : scriptOrRegion;
    return region === 'me' ? 'cnr' : 'srb';
  }
  return searchLocales.find(locale => locale === language);
}

function getLocale(acceptLanguage: string | null): Locale {
  const preferences = acceptLanguage?.split(',').flatMap(value => {
    const match = languagePreference.exec(value);
    if (!match) return [];
    const locale = matchLocale(match[1]);
    const weight = Number(match[2] ?? 1);
    return locale && weight > 0 ? [{ locale, weight }] : [];
  }) ?? [];

  preferences.sort((first, second) => second.weight - first.weight);
  return preferences[0]?.locale ?? defaultLocale;
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Normalize path: collapse consecutive slashes to prevent double-slash bypasses like //en
  const normalizedPathname = url.pathname.replace(/\/+/g, '/');

  // Strict first-segment extraction — avoids startsWith() substring matching
  const segments = normalizedPathname.split('/');
  const firstSegment = segments[1];

  const pathnameHasLocale = searchLocales.some(locale => locale === firstSegment);

  if (pathnameHasLocale) {
    // Rewrite with the normalized path if it differs (collapsed double slashes)
    if (normalizedPathname !== url.pathname) {
      url.pathname = normalizedPathname;
      return NextResponse.redirect(url, { status: 308 });
    }
    return NextResponse.next();
  }

  const locale = getLocale(request.headers.get('accept-language'));
  url.pathname = normalizedPathname === '/' ? `/${locale}` : `/${locale}${normalizedPathname}`;

  const redirect = NextResponse.redirect(url, { status: 307 });
  redirect.headers.append('vary', 'Accept-Language');
  redirect.headers.set('cache-control', 'private, no-store');
  return redirect;
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
    '/((?!api|_next/static|_next/image|_vercel|\\.well-known|favicon\\.ico|robots\\.txt|sitemap\\.xml|llms\\.txt|google[a-z0-9]+\\.html|.*\\.(?:pdf|png|jpg|jpeg|webp|svg|ico|css|js|woff2?|map|json)).*)',
  ],
};
