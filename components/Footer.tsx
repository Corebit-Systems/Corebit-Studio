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

      {/* Glowing CTA Button */}
      <a
        href="#contact"
        className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 mb-10 sm:mb-16 rounded-full bg-white text-black font-bold text-lg sm:text-xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] active:scale-95 whitespace-nowrap"
      >
        {dict.footer.cta_btn}
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </a>

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 sm:gap-12 w-full">
        {/* Contact cards */}
        {/* ФИКС: min-w-[250px] убран — это и было главной причиной горизонтального скролла на 320px экране */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 w-full">

          <a
            href="tel:+38268914816"
            className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all w-full sm:w-auto sm:flex-1"
          >
            <div className="p-3 sm:p-4 rounded-full bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-all">
              <Phone size={22} />
            </div>
            <span className="font-mono text-base sm:text-xl tracking-wider text-white">+382 68 914 816</span>
          </a>

          <a
            href="https://wa.me/359882905657"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all w-full sm:w-auto sm:flex-1"
          >
            <div className="p-3 sm:p-4 rounded-full bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 transition-all">
              <MessageCircle size={22} />
            </div>
            <span className="font-mono text-base sm:text-xl tracking-wider text-white">+359 88 290 5657</span>
          </a>

          <a
            href="mailto:hello@corebitsystems.io"
            className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all w-full sm:w-auto sm:flex-1"
          >
            <div className="p-3 sm:p-4 rounded-full bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-all">
              <Mail size={22} />
            </div>
            {/* ФИКС: длинный email — text-sm sm:text-xl + break-all для предотвращения overflow */}
            <span className="font-mono text-sm sm:text-lg lg:text-xl tracking-wider text-white break-all text-center">hello@corebitsystems.io</span>
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
