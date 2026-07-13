'use client';

/**
 * AnalyticsConsentProvider — Consent Mode v2 Architecture
 *
 * ПРОБЛЕМА предыдущей реализации:
 *   Скрипты не монтировались до клика по баннеру → GA4 не гидратирован →
 *   INP/TBT замеряются в окне без трекера → данные Core Web Vitals в Vercel
 *   искажены, GA4 не видит сессию вообще.
 *
 * РЕШЕНИЕ — Google Consent Mode v2:
 *   1. Скрипты GA4 загружаются СРАЗУ с strategy="afterInteractive"
 *      (не блокируют рендер, не влияют на TBT/FCP).
 *   2. gtag('consent', 'default', ...) устанавливает denied для всех
 *      до согласия → GA4 пишет только анонимные ping-события (modelled data).
 *   3. После клика "Принять" → gtag('consent', 'update', granted) →
 *      GA4 начинает отправлять полные события с PII.
 *   4. После клика "Отклонить" → consent остаётся denied, GA4 продолжает
 *      писать анонимные события (без cookies, без PII) — это легально.
 *
 * Vercel Analytics/SpeedInsights: не содержат PII по дизайну,
 * используют edge-функцию, грузятся сразу.
 *
 * GDPR / ePrivacy:
 *   - Без согласия: GA4 работает в anonymized-mode (Consent Mode v2 modelled)
 *   - С согласием: полный трекинг включается через gtag consent update
 *   - anonymize_ip: true во всех режимах
 */

import { useEffect } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const GA_ID = 'G-X7BTGCB82W';

// Consent Mode v2 — default state (denied until user grants)
const CONSENT_DEFAULT = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    analytics_storage:   'denied',
    ad_storage:          'denied',
    ad_user_data:        'denied',
    ad_personalization:  'denied',
    wait_for_update:     500
  });
  gtag('js', new Date());
  gtag('config', '${GA_ID}', { anonymize_ip: true, send_page_view: true });
`;

export default function AnalyticsConsentProvider() {

  useEffect(() => {
    /**
     * On mount: if the user already accepted in a previous session,
     * immediately grant consent so GA4 switches to full mode.
     */
    const update = (accepted: boolean) => {
      if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
      if (accepted) {
        window.gtag('consent', 'update', {
          analytics_storage:  'granted',
          ad_storage:         'denied', // We don't run ads — keep denied
          ad_user_data:       'denied',
          ad_personalization: 'denied',
        });
      }
      // On reject: do nothing — default denied state remains
    };

    // Fast-path: repeat visitor who already accepted
    if (localStorage.getItem('cookie_consent_accepted') === 'true') {
      // Small delay to ensure gtag() is initialized from the Script tag
      setTimeout(() => update(true), 100);
    }

    // Listen for runtime consent changes dispatched by CookieBanner
    const handleConsentChange = (e: Event) => {
      const { accepted } = (e as CustomEvent<{ accepted: boolean }>).detail;
      update(accepted);
    };

    window.addEventListener('cookie_consent_change', handleConsentChange);
    return () => window.removeEventListener('cookie_consent_change', handleConsentChange);
  }, []);

  return (
    <>
      {/* ── GA4 Consent Mode v2 init (inline, lazy loader) ───────────── */}
      <Script id="ga4-consent-init" strategy="lazyOnload">
        {CONSENT_DEFAULT}
      </Script>
 
      {/* ── GA4 gtag.js loader ──────────────────────────────────────────── */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
 
      {/* ── Vercel telemetry (no PII by design, always active) ─────────── */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}

// Extend Window for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
