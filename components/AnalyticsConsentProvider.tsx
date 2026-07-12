'use client';

/**
 * AnalyticsConsentProvider
 *
 * Defers Vercel Analytics, SpeedInsights, and Google Analytics (GA4)
 * until the user explicitly grants consent via the CookieBanner.
 * Listens for the `cookie_consent_change` custom event dispatched by
 * CookieBanner and reads the initial state from localStorage on first mount.
 *
 * GDPR / ePrivacy compliance:
 *  - No telemetry scripts are loaded before affirmative consent.
 *  - If the user previously accepted (localStorage key `cookie_consent_accepted`),
 *    telemetry is loaded immediately on mount (repeat visitor fast-path).
 *  - If the user rejects or has not yet decided, telemetry remains unloaded.
 *
 * GA4 integration:
 *  - Uses next/script with strategy="afterInteractive" so the gtag.js
 *    payload is fetched after the page becomes interactive, never during SSR.
 *  - The inline init script is inserted immediately after the loader so
 *    dataLayer is ready before any events fire.
 */

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const GA_ID = 'G-X7BTGCB82W';

export default function AnalyticsConsentProvider() {
  const [consented, setConsented] = useState<boolean>(false);

  useEffect(() => {
    // Fast-path: repeat visitor who already accepted
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cookie_consent_accepted') === 'true') {
        setConsented(true);
      }
    }

    // Listen for runtime consent changes dispatched by CookieBanner
    const handleConsentChange = (e: Event) => {
      const { accepted } = (e as CustomEvent<{ accepted: boolean }>).detail;
      setConsented(accepted);
    };

    window.addEventListener('cookie_consent_change', handleConsentChange);
    return () => {
      window.removeEventListener('cookie_consent_change', handleConsentChange);
    };
  }, []);

  if (!consented) return null;

  return (
    <>
      {/* ── Google Analytics 4 ──────────────────────────────────────────── */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>

      {/* ── Vercel telemetry ────────────────────────────────────────────── */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
