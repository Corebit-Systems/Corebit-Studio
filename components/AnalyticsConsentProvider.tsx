'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { flushLeadEvents, trackLeadEvent } from './leadAnalytics';

const GA_ID = 'G-X7BTGCB82W';
const CONSENT_DEFAULT = `
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });
  try {
    if (localStorage.getItem('cookie_consent_accepted') === 'true') {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  } catch {}
  window.gtag('js', new Date());
  window.gtag('config', '${GA_ID}', { anonymize_ip: true, send_page_view: true });
`;

export default function AnalyticsConsentProvider({ locale }: { locale: string }) {
  useEffect(() => {
    const handleConsentChange = (event: Event) => {
      const { accepted } = (event as CustomEvent<{ accepted: boolean }>).detail;
      window.gtag?.('consent', 'update', { analytics_storage: accepted ? 'granted' : 'denied' });
      if (window.gtag) flushLeadEvents();
    };
    const handleWhatsAppClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[data-whatsapp-source]');
      const source = link?.dataset.whatsappSource;
      if (source === 'contact_form' || source === 'footer' || source === 'floating_widget') {
        trackLeadEvent('whatsapp_click', locale, source);
      }
    };

    window.addEventListener('cookie_consent_change', handleConsentChange);
    document.addEventListener('click', handleWhatsAppClick);
    return () => {
      window.removeEventListener('cookie_consent_change', handleConsentChange);
      document.removeEventListener('click', handleWhatsAppClick);
    };
  }, [locale]);

  return (
    <>
      <Script id="ga4-consent-init" strategy="lazyOnload" onReady={flushLeadEvents}>
        {CONSENT_DEFAULT}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
