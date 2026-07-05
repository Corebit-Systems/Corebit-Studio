'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState } from 'react';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'cnr', label: 'CNR' },
  { code: 'srb', label: 'SRB' },
  { code: 'sq', label: 'SQ' }
];

export default function LangSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const switchLang = (newLocale: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium"
      >
        <Globe size={16} className="text-neutral-400" />
        <span className="uppercase">{currentLocale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-24 flex flex-col bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
          {locales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => switchLang(loc.code)}
              className={`px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${currentLocale === loc.code ? 'text-emerald-400 font-bold bg-white/5' : 'text-neutral-300'}`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
