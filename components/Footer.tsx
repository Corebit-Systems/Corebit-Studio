// File: C:\dev\Studio\components\Footer.tsx
import { Phone, Mail, MessageCircle, ArrowRight } from 'lucide-react';

export default function Footer({ dict }: { dict: any }) {
  return (
    <footer className="w-full mt-32 border-t border-white/10 bg-[#050506]/80 backdrop-blur-3xl pt-24 pb-12 px-6 relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[100px] bg-emerald-500/10 blur-[100px] pointer-events-none"></div>

      {/* Glowing CTA Button */}
      <a href="#contact" className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 mb-16 rounded-full bg-white text-black font-bold text-xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
        {dict.footer.cta_btn}
        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
      </a>

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12 w-full">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full">
          <a href="tel:068914816" className="flex-1 min-w-[250px] max-w-[350px] group flex flex-col items-center gap-3 p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all">
            <div className="p-4 rounded-full bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-all"><Phone size={24} /></div>
            <span className="font-mono text-xl tracking-wider text-white">068914816</span>
          </a>
          <a href="https://wa.me/359882905657" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[250px] max-w-[350px] group flex flex-col items-center gap-3 p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all">
            <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 transition-all"><MessageCircle size={24} /></div>
            <span className="font-mono text-xl tracking-wider text-white">+359 88 290 5657</span>
          </a>
          <a href="mailto:hello@corebitsystems.io" className="flex-1 min-w-[250px] max-w-[350px] group flex flex-col items-center gap-3 p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all">
            <div className="p-4 rounded-full bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-all"><Mail size={24} /></div>
            <span className="font-mono text-xl tracking-wider text-white">hello@corebitsystems.io</span>
          </a>
        </div>

        <div className="w-full h-[1px] bg-white/10 mt-12"></div>
        <div className="flex flex-col md:flex-row justify-between items-center w-full text-sm text-neutral-500">
          <p>{dict.footer.rights}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Next.js 14</span>
            <span>Vercel Edge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
