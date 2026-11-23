type LeadEvent = 'inquiry_start' | 'generate_lead' | 'whatsapp_click';
type InquirySource = 'contact_form' | 'footer' | 'floating_widget';

interface EventParams {
  site_locale: string;
  page_location: string;
  inquiry_source: InquirySource;
}

const pending: { event: LeadEvent; params: EventParams }[] = [];

export function trackLeadEvent(event: LeadEvent, locale: string, source: InquirySource) {
  try {
    if (localStorage.getItem('cookie_consent_accepted') !== 'true') return false;

    const params: EventParams = {
      site_locale: locale,
      page_location: window.location.origin + window.location.pathname,
      inquiry_source: source,
    };
    if (window.gtag) {
      window.gtag('event', event, params);
    } else if (pending.length < 20) {
      pending.push({ event, params });
    } else {
      return false;
    }
    return true;
  } catch {
    // Analytics must not affect links or lead delivery.
    return false;
  }
}

export function flushLeadEvents() {
  const events = pending.splice(0);
  try {
    if (localStorage.getItem('cookie_consent_accepted') !== 'true') return;
    for (const { event, params } of events) {
      window.gtag?.('event', event, params);
    }
  } catch {
    // Ignore unavailable storage or telemetry.
  }
}
