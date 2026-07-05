/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          // ── Clickjacking protection ───────────────────────────────────
          {
            key:   'X-Frame-Options',
            value: 'DENY',
          },
          // ── Cross-origin isolation (prevents Spectre-class leaks) ─────
          {
            key:   'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          // ── Sniff-proof content typing ────────────────────────────────
          {
            key:   'X-Content-Type-Options',
            value: 'nosniff',
          },
          // ── Referrer leak prevention ──────────────────────────────────
          {
            key:   'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // ── Device API surface reduction ──────────────────────────────
          {
            key:   'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // ── Content Security Policy ───────────────────────────────────
          // unsafe-inline is required for:
          //   • Next.js App Router inline <script> chunks
          //   • Schema.org JSON-LD blocks (dangerouslySetInnerHTML)
          //   • Tailwind inline styles
          // frame-ancestors 'none' supersedes X-Frame-Options in modern browsers
          {
            key:   'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self'",
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
