// File: C:\dev\Corebit-Studio\components\Footer.tsx
import { Phone, Mail, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FooterDict {
  footer: {
    cta_btn: string;
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

export default function Footer({ dict, locale }: FooterProps) {
  return (
    // ФИКС: mt-32 → mt-16 sm:mt-32, убраны px-6 → px-4 sm:px-6
    <footer className="w-full mt-16 sm:mt-32 border-t border-white/10 bg-[#050506]/80 backdrop-blur-3xl pt-12 sm:pt-24 pb-20 sm:pb-12 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[100px] bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 sm:gap-12 w-full">
        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">

          <a
            href="tel:+38268914816"
            className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-all shrink-0">
              <Phone size={22} />
            </div>
            <span className="font-mono text-base sm:text-lg tracking-wider text-white">+382 68 914 816</span>
          </a>

          <a
            href="https://wa.me/359882905657"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/10 hover:border-emerald-600/50 hover:bg-emerald-600/5 transition-all"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-emerald-600/10 text-emerald-400 group-hover:bg-emerald-600/20 transition-all shrink-0">
              <MessageCircle size={22} />
            </div>
            <span className="font-mono text-base sm:text-lg tracking-wider text-white text-center leading-none">+359 88 290 5657</span>
            <span className="text-xs text-neutral-400 font-light text-center leading-tight -mt-1">(International Sales & WhatsApp)</span>
          </a>

          <a
            href="mailto:corebitstudio@corebitsystems.io"
            className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all w-full"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-all shrink-0">
              <Mail size={22} />
            </div>
            <span className="font-mono text-[min(3.8vw,16px)] sm:text-sm md:text-base tracking-wider text-white whitespace-nowrap block text-center">corebitstudio@corebitsystems.io</span>
          </a>

        </div>

        <div className="w-full h-[1px] bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full text-xs sm:text-sm gap-6 text-center md:text-left pb-12 sm:pb-4">
          {/* Block 1: Copyright + Subsidiary */}
          <div className="flex flex-col gap-1 items-center md:items-start text-neutral-400">
            <p className="font-light">{dict.footer.rights}</p>
          </div>

          {/* Block 2: Policy Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs text-neutral-300 font-medium my-2 sm:my-0">
            <Link href={`/${locale}/privacy-policy`} className="hover:text-emerald-400 transition-colors inline-flex items-center min-h-[48px] py-3 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
              {dict.policies?.privacy_title || 'Privacy Policy'}
            </Link>
            <div className="mb-2 sm:mb-0 inline-flex items-center">
              <Link href={`/${locale}/cookie-policy`} className="hover:text-emerald-400 transition-colors inline-flex items-center min-h-[48px] py-3 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white/[0.02] sm:bg-transparent border border-white/5 sm:border-none">
                {dict.policies?.cookie_title || 'Cookie Policy'}
              </Link>
            </div>
            <Link href={`/${locale}/terms-of-service`} className="hover:text-emerald-400 transition-colors inline-flex items-center min-h-[48px] py-3 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
              {dict.policies?.terms_title || 'Terms of Service'}
            </Link>
          </div>

          {/* Block 3: Tech Metadata */}
          <div className="flex items-center justify-center md:justify-end gap-4 text-neutral-400">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors font-mono text-xs inline-flex items-center min-h-[48px] py-3 px-3"
              title="XML Sitemap"
            >
              sitemap.xml
            </a>
            <span className="text-white/5">|</span>
            <span className="text-[11px] font-mono">Next.js 14</span>
            <span className="text-[11px] font-mono">Vercel Edge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
