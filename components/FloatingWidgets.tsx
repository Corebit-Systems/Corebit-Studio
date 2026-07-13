// File: C:\dev\Corebit-Studio\components\FloatingWidgets.tsx
'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle, Send, MessageSquare } from 'lucide-react';
import { Locale } from '@/i18n/getDictionary';

interface FloatingWidgetsProps {
  locale: Locale;
}

const WIDGET_TEXTS: Record<Locale, {
  contactTooltip: string;
  tgMessage: string;
  waMessage: string;
}> = {
  en: {
    contactTooltip: 'Contact us',
    tgMessage: 'Hello! I want to discuss a project with Corebit Systems.',
    waMessage: 'Hello! I want to discuss a project with Corebit Systems.'
  },
  ru: {
    contactTooltip: 'Связаться с нами',
    tgMessage: 'Привет! Хочу обсудить проект для Corebit Systems.',
    waMessage: 'Привет! Хочу обсудить проект для Corebit Systems.'
  },
  cnr: {
    contactTooltip: 'Kontaktirajte nas',
    tgMessage: 'Zdravo! Želim da razgovaram o projektu za Corebit Systems.',
    waMessage: 'Zdravo! Želim da razgovaram o projektu za Corebit Systems.'
  },
  srb: {
    contactTooltip: 'Kontaktirajte nas',
    tgMessage: 'Zdravo! Želim da razgovaram o projektu za Corebit Systems.',
    waMessage: 'Zdravo! Želim da razgovaram o projektu za Corebit Systems.'
  },
  sq: {
    contactTooltip: 'Na kontaktoni',
    tgMessage: 'Përshëndetje! Dua të diskutoj një projekt për Corebit Systems.',
    waMessage: 'Përshëndetje! Dua të diskutoj një projekt për Corebit Systems.'
  }
};

export default function FloatingWidgets({ locale }: FloatingWidgetsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Console Easter Egg for developers/geeks
    console.log(
      "%c[Corebit Systems] Antigravity unlocked! Вы нашли секретную пасхалку. Используйте промокод SECRET2026 для скидки.", 
      "color: #00ff00; font-size: 14px; font-weight: bold;"
    );

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const texts = WIDGET_TEXTS[locale] || WIDGET_TEXTS.en;
  const tgLink = "https://t.me/corebitsystems?text=Привет!%20Хочу%20обсудить%20проект%20для%20Corebit%20Studio";
  const waLink = `https://wa.me/359882905657?text=${encodeURIComponent(texts.waMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* Floating Action Button with hover mini-menu */}
      <div 
        className="relative flex flex-col items-center"
        onMouseLeave={() => setMenuOpen(false)}
      >
        {menuOpen && (
          <div className="flex flex-col gap-2 mb-2 transition-all duration-300">
            {/* Telegram Button */}
            <a
              href={tgLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-400 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title="Telegram"
            >
              <Send size={20} className="ml-[-2px] mt-[1px]" />
            </a>
            {/* WhatsApp Button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title="WhatsApp"
            >
              <MessageSquare size={20} />
            </a>
          </div>
        )}

        {/* Main Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          onMouseEnter={() => setMenuOpen(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all hover:scale-105 active:scale-95 relative group cursor-pointer"
          aria-label={texts.contactTooltip}
        >
          <MessageCircle size={24} className={`transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`} />
          {/* Pulsing Outer Ring */}
          <span className="absolute inset-0 rounded-full border border-emerald-500/50 animate-ping opacity-75 pointer-events-none" />
        </button>
      </div>

      {/* Scroll To Top Button with levitation effect */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md shadow-lg transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 cursor-pointer group hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(255,255,255,0.15)] animate-pulse"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
