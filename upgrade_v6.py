import os

BASE_DIR = r"C:\dev\Studio"

# ==========================================
# КОД ОБНОВЛЕННЫХ КОМПОНЕНТОВ (v.6)
# ==========================================
FILES = {
    "components/Header.tsx": """// File: C:\\dev\\Studio\\components\\Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LangSwitcher from './LangSwitcher';

// Строгая типизация пропсов (никаких any)
interface HeaderProps {
  locale: string;
  dict: {
    nav: {
      services: string;
      portfolio: string;
      pricing: string;
      contact?: string;
    };
    hero: {
      cta: string;
    };
    [key: string]: any; // Позволяет безопасно прокидывать полный словарь из layout
  };
}

export default function Header({ dict, locale }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Блокировка скролла при открытом мобильном меню (Apple UX)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  // Apple-grade easing function
  const customEase = [0.22, 1, 0.36, 1];

  // Варианты анимаций для Stagger-эффекта ссылок
  const containerVars = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
    open: { transition: { delayChildren: 0.1, staggerChildren: 0.09, staggerDirection: 1 } },
  };

  const linkVars = {
    initial: { opacity: 0, y: 30, transition: { duration: 0.5, ease: customEase } },
    open: { opacity: 1, y: 0, transition: { duration: 0.7, ease: customEase } },
  };

  return (
    <header className="fixed top-4 left-4 right-4 md:left-8 md:right-8 z-50">
      {/* Главная стеклянная панель (Pill) */}
      <div 
        className={`max-w-7xl mx-auto px-6 py-4 flex items-center justify-between rounded-2xl transition-all duration-500 relative z-[60] ${
          isOpen 
            ? 'bg-transparent border-transparent shadow-none' 
            : 'bg-[#050506]/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* Минималистичный логотип */}
        <Link href={`/${locale}`} onClick={closeMenu} className="flex items-center gap-2 group relative z-[60]">
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-300">
            Corebit Studio
          </span>
        </Link>

        {/* Десктопная навигация */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <Link href={`/${locale}#modules`} className="hover:text-white transition-colors">{dict.nav.services}</Link>
          <Link href={`/${locale}#portfolio`} className="hover:text-white transition-colors">{dict.nav.portfolio}</Link>
          <Link href={`/${locale}#pricing`} className="hover:text-white transition-colors">{dict.nav.pricing}</Link>
        </nav>

        {/* Экшены (LangSwitcher + CTA + Burger) */}
        <div className="flex items-center gap-4 relative z-[60]">
          <LangSwitcher currentLocale={locale} />
          
          <Link href={`/${locale}#contact`} className="hidden sm:block px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors">
            {dict.hero.cta}
          </Link>

          {/* Мобильный бургер-крестик (Математически точная анимация) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center focus:outline-none"
            aria-label="Toggle Mobile Menu"
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

      {/* Полноэкранное мобильное меню (Apple iOS Style) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.3 } }}
            className="fixed top-0 left-0 w-screen h-screen bg-[#050506]/95 backdrop-blur-3xl z-[55] flex flex-col px-8 pt-32 pb-12 overflow-y-auto"
          >
            <motion.nav
              variants={containerVars}
              initial="initial"
              animate="open"
              exit="initial"
              className="flex flex-col gap-8 text-4xl font-semibold tracking-tight mt-12"
            >
              {[
                { name: dict.nav.services, href: `/${locale}#modules` },
                { name: dict.nav.portfolio, href: `/${locale}#portfolio` },
                { name: dict.nav.pricing, href: `/${locale}#pricing` },
              ].map((link, index) => (
                <div key={index} className="overflow-hidden">
                  <motion.div variants={linkVars}>
                    <Link 
                      href={link.href} 
                      onClick={closeMenu} 
                      className="text-white hover:text-emerald-400 transition-colors block"
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
              className="mt-auto flex flex-col gap-8 pt-12"
            >
              <Link 
                href={`/${locale}#contact`} 
                onClick={closeMenu} 
                className="w-full py-5 rounded-2xl bg-white text-black text-center font-bold text-xl hover:bg-neutral-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                {dict.hero.cta}
              </Link>
              <div className="flex items-center justify-center border-t border-white/10 pt-6">
                <span className="text-sm font-medium text-neutral-500 tracking-widest uppercase">Corebit Systems</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
"""
}

def apply_v6_upgrade():
    print(f"🚀 Инициализация апгрейда v.6 (Apple Mobile Menu) в: {BASE_DIR}")
    
    if not os.path.exists(BASE_DIR):
        print(f"❌ Ошибка: Папка {BASE_DIR} не найдена.")
        return

    # Запись файлов
    for filepath, content in FILES.items():
        full_path = os.path.join(BASE_DIR, filepath.replace('/', os.sep))
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Успешно обновлен: {filepath}")

    print("\n🎉 Апгрейд v.6 успешно применен!")
    print("=============================================")
    print("Что добавлено:")
    print("- Клиентский компонент Header ('use client')")
    print("- Строгая типизация TypeScript (HeaderProps)")
    print("- Полноэкранное мобильное меню (Framer Motion Stagger)")
    print("- Микроанимация иконки бургера (превращение в крестик)")
    print("- Блокировка скролла body при открытом меню")
    print("=============================================")

if __name__ == "__main__":
    apply_v6_upgrade()