'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface CookieDict {
  text: string;
  accept: string;
  link: string;
}

interface CookieBannerProps {
  dict: CookieDict;
  locale: string;
}

export default function CookieBanner({ dict, locale }: CookieBannerProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent_accepted');
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent_accepted', 'true');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#050506]/85 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-4 pointer-events-auto"
        >
          <div className="flex flex-col gap-2">
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              {dict.text}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Link
              href={`/${locale}/cookie-policy`}
              className="text-xs text-neutral-400 hover:text-white underline font-medium transition-colors"
            >
              {dict.link}
            </Link>
            <button
              onClick={handleAccept}
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              {dict.accept}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
