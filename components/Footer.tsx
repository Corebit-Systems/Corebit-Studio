import { Mail, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import { studioContact } from '@/content/studioContact';

interface FooterDict {
  nav: {
    services: string;
    portfolio: string;
    pricing: string;
    contact?: string;
  };
  hero: {
    cta: string;
  };
  footer: {
    rights: string;
  };
  policies?: {
    privacy_title: string;
    cookie_title: string;
    terms_title: string;
  };
}

interface FooterProps {
  dict: FooterDict;
  locale: string;
}

const linkFocus = 'rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400';
const contactLink = `${linkFocus} inline-flex min-h-11 max-w-full items-center gap-3 text-sm text-neutral-300 transition-colors hover:text-emerald-300`;

export default function Footer({ dict, locale }: FooterProps) {
  const home = `/${locale}`;
  const siteLinks = [
    { href: `${home}#modules`, label: dict.nav.services },
    { href: `${home}#portfolio`, label: dict.nav.portfolio },
    { href: `${home}#pricing`, label: dict.nav.pricing },
  ];
  const policyLinks = [
    { href: `${home}/privacy-policy`, label: dict.policies?.privacy_title || 'Privacy Policy' },
    { href: `${home}/cookie-policy`, label: dict.policies?.cookie_title || 'Cookie Policy' },
    { href: `${home}/terms-of-service`, label: dict.policies?.terms_title || 'Terms of Service' },
  ];

  return (
    <footer className="relative mt-16 w-full border-t border-white/10 bg-[#08090a] px-4 pb-36 pt-10 sm:mt-24 sm:px-6 sm:pt-14 md:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.10),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 pb-8 sm:pb-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,1.15fr)] md:gap-8">
          <div className="flex flex-col items-start gap-4">
            <Link
              href={home}
              className={`${linkFocus} inline-flex min-h-11 items-center text-2xl font-bold tracking-tight text-white transition-colors hover:text-emerald-300 sm:text-3xl`}
            >
              Corebit Studio
            </Link>
            <Link
              href={`${home}#contact`}
              className="inline-flex min-h-11 items-center rounded-xl border border-emerald-500/25 bg-emerald-500/[0.07] px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:border-emerald-400/40 hover:bg-emerald-500/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
            >
              {dict.hero.cta}
            </Link>
          </div>

          <ul className="flex flex-wrap gap-x-5 md:flex-col md:items-start">
            {siteLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${linkFocus} inline-flex min-h-11 items-center text-sm font-medium text-neutral-300 transition-colors hover:text-emerald-300`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="min-w-0">
            <h2 className="mb-1 text-sm font-semibold text-white">{dict.nav.contact || 'Contact'}</h2>
            <ul>
              <li>
                <a href={`tel:${studioContact.telephone}`} className={contactLink}>
                  <Phone aria-hidden="true" size={16} className="shrink-0 text-emerald-400" />
                  <span>{studioContact.phoneLabel}</span>
                </a>
              </li>
              <li>
                <a
                  href={studioContact.whatsappUrl}
                  data-whatsapp-source="footer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={contactLink}
                >
                  <MessageCircle aria-hidden="true" size={16} className="shrink-0 text-emerald-400" />
                  <span>WhatsApp <span className="text-neutral-400">·</span> {studioContact.whatsappLabel}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${studioContact.email}`} className={contactLink}>
                  <Mail aria-hidden="true" size={16} className="shrink-0 text-emerald-400" />
                  <span className="min-w-0 [overflow-wrap:anywhere]">{studioContact.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex flex-wrap items-start justify-between gap-x-6">
            <ul className="flex flex-wrap gap-x-6">
              {policyLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`${linkFocus} inline-flex min-h-11 items-center py-2 text-sm text-neutral-300 transition-colors hover:text-emerald-300`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkFocus} inline-flex min-h-11 items-center font-mono text-xs text-neutral-400 transition-colors hover:text-emerald-300`}
            >
              sitemap.xml
            </a>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-neutral-400 sm:text-sm">{dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
