'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface CookieDict {
  text: string;
  accept: string;
  link: string;
  reject?: string; // Optional since it might not be in existing dictionaries
}

interface CookieBannerProps {
  dict: CookieDict;
  locale: string;
}

export default function CookieBanner({ dict, locale }: CookieBannerProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consentAccepted = localStorage.getItem('cookie_consent_accepted');
    const consentRejected = localStorage.getItem('cookie_consent_rejected');
    if (!consentAccepted && !consentRejected) {
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent_accepted', 'true');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie_consent_rejected', 'true');
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
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 lg:right-8 md:max-w-[480px] z-50 p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#050506]/70 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col gap-4 pointer-events-auto overflow-hidden"
        >
          {/* Subtle glow effect behind */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />

          <div className="flex flex-col gap-2 relative z-10">
            <h3 className="text-sm font-semibold tracking-tight text-white">Privacy & Cookies</h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              {dict.text}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 mt-2 relative z-10">
            <Link
              href={`/${locale}/cookie-policy`}
              className="text-xs text-neutral-400 hover:text-white underline font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded px-1 -ml-1"
            >
              {dict.link}
            </Link>
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                className="px-4 py-2 rounded-xl border border-white/10 text-neutral-300 font-medium text-xs sm:text-sm hover:bg-white/5 active:scale-95 transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {dict.reject || 'Reject Non-Essential'}
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                {dict.accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
