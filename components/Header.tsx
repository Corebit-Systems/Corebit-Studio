// File: C:\dev\Corebit-Studio\components\Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LangSwitcher from './LangSwitcher';

// ФИКС: Строгая типизация — убран [key: string]: any
interface NavDict {
  services: string;
  portfolio: string;
  pricing: string;
  contact?: string;
}

interface HeroDict {
  cta: string;
}

interface HeaderProps {
  locale: string;
  dict: {
    nav: NavDict;
    hero: HeroDict;
  };
}

export default function Header({ dict, locale }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Блокировка скролла при открытом мобильном меню (Apple UX)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Определяем скролл для усиления blur при прокрутке
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  // Apple-grade easing function
  const customEase = [0.22, 1, 0.36, 1] as const;

  const containerVars = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 as const } },
    open: { transition: { delayChildren: 0.1, staggerChildren: 0.09, staggerDirection: 1 as const } },
  };

  const linkVars = {
    initial: { opacity: 0, y: 30, transition: { duration: 0.5, ease: customEase } },
    open: { opacity: 1, y: 0, transition: { duration: 0.7, ease: customEase } },
  };

  const navLinks = [
    { name: dict.nav.services, href: `/${locale}#modules` },
    { name: dict.nav.portfolio, href: `/${locale}#portfolio` },
    { name: dict.nav.pricing, href: `/${locale}#pricing` },
  ];

  return (
    // ФИКС: убран left-4 right-4 — заменён на px с max-w чтобы не вызывать overflow
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 md:px-8">
      {/* Главная стеклянная панель (Pill) */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-2xl transition-all duration-500 relative z-[60] ${
          isOpen
            ? 'bg-transparent border-transparent shadow-none'
            : scrolled
              ? 'bg-[#050506]/80 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
              : 'bg-[#050506]/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* Логотип */}
        <Link href={`/${locale}`} onClick={closeMenu} className="flex items-center gap-2 group relative z-[60] shrink-0">
          <span className="font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-300">
            Corebit Studio
          </span>
        </Link>

        {/* Десктопная навигация */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Экшены (LangSwitcher + CTA + Burger) */}
        <div className="flex items-center gap-2 sm:gap-4 relative z-[60]">
          <LangSwitcher currentLocale={locale} />

          <Link
            href={`/${locale}#contact`}
            className="hidden sm:block px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors whitespace-nowrap"
          >
            {dict.hero.cta}
          </Link>

          {/* Мобильный бургер — минимум 44x44px для пальца */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-11 h-11 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
            aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isOpen}
          >
            <div className="relative w-6 h-4 flex flex-col justify-between">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: customEase }}
                className="w-full h-[2px] bg-white rounded-full origin-center block"
              />
              <motion.span
                animate={isOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: customEase }}
                className="w-full h-[2px] bg-white rounded-full block"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: customEase }}
                className="w-full h-[2px] bg-white rounded-full origin-center block"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Полноэкранное мобильное меню */}
      {/* ФИКС: w-screen → w-full, добавлен safe-area для notch */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.3 } }}
            className="fixed top-0 left-0 w-full h-[100dvh] bg-[#050506]/97 backdrop-blur-3xl z-[55] flex flex-col px-6 pt-28 pb-8 overflow-y-auto overflow-x-hidden"
          >
            <motion.nav
              variants={containerVars}
              initial="initial"
              animate="open"
              exit="initial"
              className="flex flex-col gap-6 mt-4"
            >
              {navLinks.map((link, index) => (
                <div key={index} className="overflow-hidden border-b border-white/5 pb-6">
                  <motion.div variants={linkVars}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="text-white hover:text-emerald-400 transition-colors block text-4xl font-semibold tracking-tight"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </motion.nav>

            <motion.div
              variants={linkVars}
              initial="initial"
              animate="open"
              exit="initial"
              className="mt-auto flex flex-col gap-6 pt-8"
            >
              <Link
                href={`/${locale}#contact`}
                onClick={closeMenu}
                className="w-full py-5 rounded-2xl bg-white text-black text-center font-bold text-xl hover:bg-neutral-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95"
              >
                {dict.hero.cta}
              </Link>
              <div className="flex items-center justify-center border-t border-white/10 pt-6">
                <span className="text-sm font-medium text-neutral-500 tracking-widest uppercase">Corebit Studio</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
