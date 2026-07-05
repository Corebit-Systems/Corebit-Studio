// File: C:\dev\Corebit-Studio\middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ФИКС: синхронизированный список локалей — добавлен 'srb', убран 'sr' (несуществующий)
const locales = ['en', 'ru', 'cnr', 'srb', 'sq'] as const;
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
