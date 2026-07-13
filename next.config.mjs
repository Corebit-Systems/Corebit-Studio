/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {

  experimental: {
    outputFileTracingIncludes: {
      '/[locale]/privacy-policy':   ['./content/legal/privacy/**'],
      '/[locale]/cookie-policy':    ['./content/legal/cookie/**'],
      '/[locale]/terms-of-service': ['./content/legal/terms/**'],
      '/[locale]':                  ['./i18n/dictionaries/**'],
      '/[locale]/[...slug]':        ['./i18n/dictionaries/**'],
    },
  },

  async headers() {
    return [
      // ── Sitemap CDN caching ────────────────────────────────────────────────
      // Served from Vercel Edge Network; refreshed every 24h with 12h SWR window.
      {
        source: '/sitemap.xml',
        headers: [
          {
            key:   'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=43200, immutable',
          },
        ],
      },
      // ── Robots.txt caching ────────────────────────────────────────────────
      {
        source: '/robots.txt',
        headers: [
          {
            key:   'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=43200',
          },
        ],
      },
      // ── Global security & CSP headers ─────────────────────────────────────
      {
        source: '/(.*)',
        headers: [
          // Clickjacking protection
          {
            key:   'X-Frame-Options',
            value: 'DENY',
          },
          // Cross-origin isolation (prevents Spectre-class leaks)
          {
            key:   'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          // Sniff-proof content typing
          {
            key:   'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer leak prevention
          {
            key:   'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Device API surface reduction
          {
            key:   'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // HTTPS enforcement (HSTS) — 2-year max-age with preload
          {
            key:   'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // ── Content Security Policy ─────────────────────────────────────
          // GA4 (gtag.js) requires:
          //   script-src  googletagmanager.com
          //   connect-src google-analytics.com, analytics.google.com, googletagmanager.com
          //   img-src     google-analytics.com, googletagmanager.com
          // 'unsafe-inline' required for Next.js inline chunks & JSON-LD blocks.
          // 'unsafe-eval' only in dev (HMR).
          {
            key:   'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: https://www.google-analytics.com https://www.googletagmanager.com",
              [
                "connect-src 'self'",
                "https://*.vercel-insights.com",
                "https://vitals.vercel-insights.com",
                "https://www.google-analytics.com",
                "https://analytics.google.com",
                "https://www.googletagmanager.com",
                "https://region1.google-analytics.com",
              ].join(' '),
              "media-src 'none'",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
