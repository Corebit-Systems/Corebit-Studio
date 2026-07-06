// File: c:\dev\Corebit-Studio\middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ru', 'cnr', 'srb', 'sq'] as const;
type Locale = typeof locales[number];
const defaultLocale: Locale = 'en';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Normalize path: collapse consecutive slashes to prevent double-slash bypasses like //en
  const normalizedPathname = url.pathname.replace(/\/+/g, '/');

  // Strict first-segment extraction — avoids startsWith() substring matching
  // e.g. "/en/about" → firstSegment = "en", "/enx/page" → firstSegment = "enx" (rejected)
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

  // Redirect bare paths to the default locale using normalized path
  url.pathname = `/${defaultLocale}${normalizedPathname}`;
  return NextResponse.redirect(url, { status: 308 });
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
