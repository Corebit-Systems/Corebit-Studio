'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

// Inline vector flags for absolute operating-system compatibility (Windows emoji-rendering fallback fix)
const EnFlag = () => (
  <svg className="w-5 h-3.5 rounded-sm object-cover shrink-0" viewBox="0 0 50 30" xmlns="http://www.w3.org/2000/svg">
    <rect width="50" height="30" fill="#012169" />
    <path d="M0,0 L50,30 M0,30 L50,0" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 L50,30 M0,30 L50,0" stroke="#C8102E" strokeWidth="2" />
    <path d="M25,0 v30 M0,15 h50" stroke="#fff" strokeWidth="10" />
    <path d="M25,0 v30 M0,15 h50" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

const RuFlag = () => (
  <svg className="w-5 h-3.5 rounded-sm object-cover shrink-0" viewBox="0 0 9 6" xmlns="http://www.w3.org/2000/svg">
    <rect width="9" height="2" fill="#fff" />
    <rect y="2" width="9" height="2" fill="#0039a6" />
    <rect y="4" width="9" height="2" fill="#d52b1e" />
  </svg>
);

const SqFlag = () => (
  <svg className="w-5 h-3.5 rounded-sm object-cover shrink-0" viewBox="0 0 16 10" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="10" fill="#e41e26" />
    <path d="M8,1.5 l-0.4,0.6 h-0.4 l0.2,0.5 l-0.6,-0.1 l0.4,0.5 l-0.6,0.3 l0.6,0.1 l-0.4,0.6 l0.5,0.1 l-0.2,0.7 l0.5,-0.4 l0.1,0.8 l0.3,-0.7 l0.4,0.4 l0.1,-0.8 l0.4,-0.4 v-1 l0.2,-0.5 L8,1.5 Z M8,1.5 l0.4,0.6 h0.4 l-0.2,0.5 l0.6,-0.1 l-0.4,0.5 l0.6,0.3 l-0.6,0.1 l0.4,0.6 l-0.5,0.1 l0.2,0.7 l-0.5,-0.4 l-0.1,0.8 l-0.3,-0.7 l-0.4,0.4 l-0.1,-0.8 l-0.4,-0.4 v-1 l-0.2,-0.5 L8,1.5 Z" fill="#000" />
  </svg>
);

const SrbFlag = () => (
  <svg className="w-5 h-3.5 rounded-sm object-cover shrink-0" viewBox="0 0 9 6" xmlns="http://www.w3.org/2000/svg">
    <rect width="9" height="2" fill="#c11b17" />
    <rect y="2" width="9" height="2" fill="#0c2340" />
    <rect y="4" width="9" height="2" fill="#ffffff" />
    <rect x="2.5" y="1.5" width="1.2" height="2.5" fill="#c11b17" rx="0.2" />
    <path d="M3.1,1.5 L3.1,4.0 M2.5,2.5 L3.7,2.5" stroke="#d4af37" strokeWidth="0.3" />
  </svg>
);

const CnrFlag = () => (
  <svg className="w-5 h-3.5 rounded-sm object-cover shrink-0" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
    <rect width="10" height="6" fill="#d4af37" />
    <rect x="0.5" y="0.5" width="9" height="5" fill="#c11b17" />
    <circle cx="5" cy="3" r="1" fill="#d4af37" />
    <path d="M4.5,2.5 L5.5,2.5 L5.8,3.5 L4.2,3.5 Z" fill="#d4af37" />
    <circle cx="5" cy="3" r="0.4" fill="#4682b4" />
  </svg>
);

const locales = [
  { code: 'en', label: 'English', flag: EnFlag },
  { code: 'ru', label: 'Русский', flag: RuFlag },
  { code: 'sq', label: 'Shqip', flag: SqFlag },
  { code: 'srb', label: 'Српски', flag: SrbFlag },
  { code: 'cnr', label: 'Црногорски', flag: CnrFlag }
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
  const ActiveFlag = activeLoc.flag;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-semibold backdrop-blur-md"
        aria-label="Change Language"
        aria-expanded={isOpen}
      >
        <ActiveFlag />
        <span className="uppercase text-neutral-200 leading-none">{activeLoc.code}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-44 flex flex-col bg-[#0a0a0a]/65 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.55)] z-50 transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1.5 flex flex-col gap-0.5">
            {locales.map((loc) => {
              const Flag = loc.flag;
              return (
                <button
                  key={loc.code}
                  onClick={() => switchLang(loc.code)}
                  className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm transition-all text-left ${
                    currentLocale === loc.code 
                      ? 'text-emerald-400 font-bold bg-white/5' 
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Flag />
                  <span className="font-medium leading-none">{loc.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
