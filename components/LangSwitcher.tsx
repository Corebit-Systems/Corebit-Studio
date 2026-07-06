'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const locales = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'cnr', label: 'Црногорски', flag: '🇲🇪' },
  { code: 'srb', label: 'Српски', flag: '🇷🇸' },
  { code: 'sq', label: 'Shqip', flag: '🇦🇱' }
];

export default function LangSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLang = (newLocale: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    const supportedLocales = ['en', 'ru', 'cnr', 'srb', 'sq'];

    // Segments pattern: ['', 'locale', 'subpath_1', ...]
    if (supportedLocales.includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    router.push(segments.join('/') || '/');
    setIsOpen(false);
  };

  const activeLoc = locales.find(l => l.code === currentLocale) || locales[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-semibold backdrop-blur-md"
        aria-label="Change Language"
        aria-expanded={isOpen}
      >
        <Globe size={16} className="text-neutral-400" />
        <span className="uppercase text-neutral-200">{currentLocale}</span>
        <span className="text-sm ml-0.5">{activeLoc.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-44 flex flex-col bg-[#0a0a0a]/65 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.55)] z-50 transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1.5 flex flex-col gap-0.5">
            {locales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => switchLang(loc.code)}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                  currentLocale === loc.code 
                    ? 'text-emerald-400 font-bold bg-white/5' 
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="font-medium">{loc.label}</span>
                <span className="text-base">{loc.flag}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
