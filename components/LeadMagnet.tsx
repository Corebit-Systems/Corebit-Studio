// File: C:\dev\Corebit-Studio\components\LeadMagnet.tsx
'use client';

import { useState } from 'react';
import { Check, Download, Mail, Loader2, ArrowRight } from 'lucide-react';
import { Locale } from '@/i18n/getDictionary';

interface LeadMagnetProps {
  locale: Locale;
}

const LEAD_TEXTS: Record<Locale, {
  title: string;
  subtitle: string;
  checklistItems: string[];
  emailPlaceholder: string;
  ctaBtn: string;
  successTitle: string;
  successDesc: string;
  errorEmail: string;
  submitting: string;
}> = {
  en: {
    title: 'Architectural Checklist 2026',
    subtitle: 'Evaluate your system readiness for the next generation of web engineering.',
    checklistItems: [
      'Next.js 14+ App Router & SSR Optimization',
      'AI Integration & Conversational Agents Ready',
      'Sub-100ms LCP & Edge CDN Distribution',
      'EU GDPR Compliance & Encrypted PII Proxy'
    ],
    emailPlaceholder: 'Enter your business email',
    ctaBtn: 'Get Checklist',
    successTitle: 'Checklist Sent!',
    successDesc: 'We have dispatched the PDF architectural blueprint to your email address.',
    errorEmail: 'Please enter a valid email address.',
    submitting: 'Processing...'
  },
  ru: {
    title: 'Архитектурный чек-лист 2026',
    subtitle: 'Оцените готовность вашей системы к следующему поколению веб-разработки.',
    checklistItems: [
      'Оптимизация Next.js 14+ App Router и SSR',
      'Интеграция ИИ и диалоговых агентов',
      'Загрузка Sub-100ms LCP на Edge CDN сетях',
      'Соответствие EU GDPR и шифрование PII данных'
    ],
    emailPlaceholder: 'Введите корпоративный email',
    ctaBtn: 'Получить чек-лист',
    successTitle: 'Чек-лист отправлен!',
    successDesc: 'Мы отправили архитектурный PDF-гайд на указанную почту.',
    errorEmail: 'Пожалуйста, введите корректный адрес почты.',
    submitting: 'Отправка...'
  },
  cnr: {
    title: 'Arhitektonski ček-list 2026',
    subtitle: 'Procijenite spremnost vašeg sistema za sljedeću generaciju veb inženjeringa.',
    checklistItems: [
      'Next.js 14+ App Router i SSR optimizacija',
      'Integracija AI-a i konverzacionih agenata',
      'Učitavanje ispod 100ms LCP na Edge CDN mreži',
      'Usklađenost sa EU GDPR i enkripcija PII podataka'
    ],
    emailPlaceholder: 'Unesite Vaš poslovni e-mail',
    ctaBtn: 'Preuzmi ček-list',
    successTitle: 'Ček-list je poslat!',
    successDesc: 'Poslali smo arhitektonski PDF vodič na Vašu e-mail adresu.',
    errorEmail: 'Molimo unesite ispravnu e-mail adresu.',
    submitting: 'Slanje...'
  },
  srb: {
    title: 'Arhitektonski ček-list 2026',
    subtitle: 'Procenite spremnost vašeg sistema za sledeću generaciju veb inženjeringa.',
    checklistItems: [
      'Next.js 14+ App Router i SSR optimizacija',
      'Integracija AI-a i konverzacionih agenata',
      'Učitavanje ispod 100ms LCP na Edge CDN mreži',
      'Usklađenost sa EU GDPR i enkripcija PII podataka'
    ],
    emailPlaceholder: 'Unesite Vaš poslovni e-mail',
    ctaBtn: 'Preuzmi ček-list',
    successTitle: 'Ček-list je poslat!',
    successDesc: 'Poslali smo arhitektonski PDF vodič na Vašu e-mail adresu.',
    errorEmail: 'Molimo unesite ispravnu e-mail adresu.',
    submitting: 'Slanje...'
  },
  sq: {
    title: 'Lista e Kontrollit Arkitekturor 2026',
    subtitle: 'Vlerësoni gatishmërinë e sistemit tuaj për gjeneratën e ardhshme të inxhinierisë ueb.',
    checklistItems: [
      'Next.js 14+ App Router & Optimizimi SSR',
      'Integrimi i AI-t & Agjentëve të Bisedës',
      'Ngarkimi nën 100ms LCP në Rrjetet Edge CDN',
      'Përputhshmëria me EU GDPR & Enkriptimi i PII'
    ],
    emailPlaceholder: 'Shkruani emailin tuaj të biznesit',
    ctaBtn: 'Merrni Listën',
    successTitle: 'Lista u Dërgua!',
    successDesc: 'Ne kemi dërguar udhëzuesin arkitekturor PDF në adresën tuaj të emailit.',
    errorEmail: 'Ju lutem shkruani një adresë emaili të vlefshme.',
    submitting: 'Duke u dërguar...'
  }
};

export default function LeadMagnet({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState('');
  const [checkedItems, setCheckedItems] = useState<boolean[]>([true, true, false, false]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  const texts = LEAD_TEXTS[locale] || LEAD_TEXTS.en;

  const handleToggle = (index: number) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorText(texts.errorEmail);
      return;
    }

    setStatus('loading');
    
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Checklist Lead',
          email: email,
          message: `Requested Architectural Checklist 2026. Selection: ${texts.checklistItems.filter((_, idx) => checkedItems[idx]).join(', ')}`,
          service_type: 'lead_magnet_checklist',
          source: 'checklist_lead_form',
          locale: locale,
          b_trap: ''
        })
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setErrorText(data.error || 'Failed to process. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorText('Network error. Please try again.');
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-[3rem] border border-white/10 bg-white/[0.01] backdrop-blur-xl p-6 sm:p-8 md:p-12">
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10">
        {/* Checklist */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-wider text-emerald-500 uppercase">
              Free Technical Resource
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mt-1">
              {texts.title}
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 mt-2 font-light">
              {texts.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {texts.checklistItems.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => handleToggle(idx)}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer select-none transition-all group"
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                  checkedItems[idx] 
                    ? 'bg-emerald-500 border-emerald-400 text-black' 
                    : 'border-white/20 group-hover:border-white/40'
                }`}>
                  {checkedItems[idx] && <Check size={14} className="stroke-[3]" />}
                </div>
                <span className={`text-xs sm:text-sm font-medium transition-all ${
                  checkedItems[idx] ? 'text-white' : 'text-neutral-400 group-hover:text-white'
                }`}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Form Box */}
        <div className="flex-1 flex flex-col justify-center bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8">
          {status === 'success' ? (
            <div className="text-center flex flex-col items-center gap-4 py-8 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Download size={28} className="animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white">{texts.successTitle}</h3>
              <p className="text-sm text-neutral-400 max-w-md font-light">{texts.successDesc}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Download Free Blueprint
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={texts.emailPlaceholder}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {status === 'error' && (
                <p className="text-xs font-medium text-red-500">{errorText}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="group relative w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{texts.submitting}</span>
                  </>
                ) : (
                  <>
                    <span>{texts.ctaBtn}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
