// File: C:\dev\Corebit-Studio\components\Footer.tsx
import { Phone, Mail, MessageCircle, ArrowRight } from 'lucide-react';

// ФИКС: Строгая типизация вместо dict: any
interface FooterDict {
  footer: {
    cta_btn: string;
    rights: string;
  };
}

interface FooterProps {
  dict: FooterDict;
}

export default function Footer({ dict }: FooterProps) {
  return (
    // ФИКС: mt-32 → mt-16 sm:mt-32, убраны px-6 → px-4 sm:px-6
    <footer className="w-full mt-16 sm:mt-32 border-t border-white/10 bg-[#050506]/80 backdrop-blur-3xl pt-12 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[100px] bg-emerald-500/10 blur-[100px] pointer-events-none" />

      {/* Glowing CTA Button — glow via before: pseudo-element (GPU-composited opacity, not box-shadow) */}
      <a
        href="#contact"
        className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 mb-10 sm:mb-16 rounded-full bg-white text-black font-bold text-lg sm:text-xl hover:scale-105 transition-transform active:scale-95 whitespace-nowrap before:content-[''] before:absolute before:inset-0 before:rounded-full before:shadow-[0_0_60px_rgba(255,255,255,0.5)] before:opacity-50 before:transition-opacity before:duration-300 hover:before:opacity-100"
      >
        {dict.footer.cta_btn}
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </a>

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 sm:gap-12 w-full">
        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">

          <a
            href="tel:+38268914816"
            className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all"
          >
            <div className="p-3 sm:p-4 rounded-full bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-all">
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
            <div className="p-3 sm:p-4 rounded-full bg-emerald-600/10 text-emerald-400 group-hover:bg-emerald-600/20 transition-all">
              <MessageCircle size={22} />
            </div>
            <span className="font-mono text-base sm:text-lg tracking-wider text-white text-center leading-none">+359 88 290 5657</span>
            <span className="text-xs text-neutral-400 font-light text-center leading-tight -mt-1">(International Sales & WhatsApp)</span>
          </a>

          <a
            href="https://t.me/corebitsystems"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/10 hover:border-emerald-600/50 hover:bg-emerald-600/5 transition-all"
          >
            <div className="p-3 sm:p-4 rounded-full bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20 transition-all">
              <svg className="w-[22px] h-[22px] fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15.9-2.5 10.6-2.77 11.8-.12.5-.34.8-.71.9-.78.2-1.37-.2-2.09-.7-.56-.3-2.03-1.6-2.59-2.1-.15-.1-.31-.3-.03-.6.09-.09 1.56-1.4 2.87-2.6.59-.5 1.18-1.2-.09-1.2-.28 0-.75.1-.93.3-5.18 3.3-5.18 3.3-5.18 3.3-.46.2-.9.4-1.28.4-.4 0-1.21-.2-1.81-.4-.71-.2-1.28-.3-1.21-.8.03-.2.34-.4.93-.6 3.65-1.5 6.09-2.6 7.31-3.1 3.5-1.4 4.21-1.7 4.68-1.7.12 0 .37 0 .53.1.12.09.21.2.25.4.03.1.03.5-.03.8z"/>
              </svg>
            </div>
            <span className="font-mono text-base sm:text-lg tracking-wider text-white">@corebitsystems</span>
          </a>

          <a
            href="mailto:corebitstudio@corebitsystems.io"
            className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all"
          >
            <div className="p-3 sm:p-4 rounded-full bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-all">
              <Mail size={22} />
            </div>
            <span className="font-mono text-sm sm:text-base tracking-wider text-white break-all text-center">corebitstudio@corebitsystems.io</span>
          </a>

        </div>

        <div className="w-full h-[1px] bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full text-xs sm:text-sm text-neutral-500 gap-3 md:gap-0 text-center md:text-left">
          <p>{dict.footer.rights}</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors font-mono"
              title="XML Sitemap"
            >
              sitemap.xml
            </a>
            <span className="text-white/10">|</span>
            <span>Next.js 14</span>
            <span>Vercel Edge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
