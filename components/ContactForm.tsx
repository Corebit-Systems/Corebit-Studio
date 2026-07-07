// File: C:\dev\Corebit-Studio\components\ContactForm.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { submitContactForm } from '@/app/actions';

interface ContactFormDict {
  title: string;
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  error_rate: string;
  error_spam: string;
  error_general: string;
  gdpr_text: string;
  privacy_policy_link: string;
  disclaimer?: string;
  whatsapp_btn?: string;
  telegram_btn?: string;
  prefilled_msg?: string;
  locked_label?: string;
  or_label?: string;
  or_email_label?: string;
}

interface ContactFormProps {
  dict: ContactFormDict;
  locale: string;
}

export default function ContactForm({ dict, locale }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [agreeGDPR, setAgreeGDPR] = useState(false);

  // Controlled input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Rate Limiting States — driven by useRef timer; NOT localStorage
  // Using a ref for the interval means DevTools cannot bypass by deleting localStorage keys.
  const [countdown, setCountdown] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // On mount: check if server cookie signal is present (httpOnly prevents JS read,
  // but document.cookie lets us detect presence to sync UI with server-side block).
  // Also hydrate from localStorage as a secondary hint (not security-critical).
  useEffect(() => {
    const lastSubmit = localStorage.getItem('last_submit_time');
    if (lastSubmit) {
      const elapsed = Date.now() - parseInt(lastSubmit, 10);
      const remaining = 60000 - elapsed;
      if (remaining > 0) {
        startCooldown(Math.ceil(remaining / 1000));
      }
    }
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCooldown = (seconds: number) => {
    setIsRateLimited(true);
    setCountdown(seconds);
    // Clear any existing interval before starting a new one
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          cooldownRef.current = null;
          setIsRateLimited(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreeGDPR || isRateLimited || status === 'loading') return;

    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    // Always include locale in payload so the server knows which language to reply in
    formData.set('locale', locale);

    try {
      const response = await submitContactForm(formData);

      if (response.success) {
        // Write localStorage hint (secondary only — actual security is server-side cookie)
        localStorage.setItem('last_submit_time', Date.now().toString());
        setStatus('success');

        // UX Clean reset
        setName('');
        setEmail('');
        setMessage('');

        // Delay the rate limit lock in the UI by 3 seconds so the user can read the success message.
        // After 3 seconds, we start the cooldown with the remaining time (~57s).
        setTimeout(() => {
          const lastSubmit = localStorage.getItem('last_submit_time');
          if (lastSubmit) {
            const elapsed = Date.now() - parseInt(lastSubmit, 10);
            const remaining = 60000 - elapsed;
            if (remaining > 0) {
              startCooldown(Math.ceil(remaining / 1000));
            }
          }
          setStatus('idle');
        }, 3000);
      } else {
        if (response.errorType === 'rate') {
          setErrorMessage(dict.error_rate);
          // Server told us we're rate-limited — enforce UI lock regardless of localStorage
          startCooldown(60);
        } else if (response.errorType === 'spam') {
          setErrorMessage(dict.error_spam);
        } else {
          setErrorMessage(dict.error_general);
        }
        setStatus('error');
      }
    } catch {
      // Never expose raw error to client — use generic message only
      setErrorMessage(dict.error_general);
      setStatus('error');
    }
  };

  return (
    <div
      id="contact"
      className="w-full max-w-2xl mx-auto p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-2xl relative overflow-hidden shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{dict.title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 relative z-10">
        {/* Invisible Honeypot */}
        <input type="text" name="bot_field" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
        <input type="text" name="b_trap" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="flex flex-col gap-2">
          <input
            required
            disabled={status === 'loading' || isRateLimited}
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dict.name}
            aria-label={dict.name}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:bg-white/10 transition-all text-base min-h-[52px] disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <input
            required
            disabled={status === 'loading' || isRateLimited}
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.email}
            aria-label={dict.email}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:bg-white/10 transition-all text-base min-h-[52px] disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <textarea
            required
            disabled={status === 'loading' || isRateLimited}
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isRateLimited ? `${dict.error_rate} (${countdown}s)` : dict.message}
            aria-label={dict.message}
            rows={4}
            maxLength={1000}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:bg-white/10 transition-all resize-none text-base disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>

        {/* GDPR Compliance Consent Checkbox */}
        <div className="flex items-start gap-3 mt-2">
          <input
            id="gdpr-consent"
            type="checkbox"
            required
            disabled={status === 'loading' || isRateLimited}
            checked={agreeGDPR}
            onChange={(e) => setAgreeGDPR(e.target.checked)}
            className="mt-1 h-4.5 w-4.5 rounded border-white/10 bg-white/5 text-emerald-600 focus:ring-emerald-500 shrink-0 cursor-pointer disabled:opacity-40"
          />
          <label htmlFor="gdpr-consent" className="text-xs sm:text-sm text-neutral-400 leading-normal cursor-pointer select-none">
            {dict.gdpr_text}{' '}
            <a href={`/${agreeGDPR ? '#' : 'en'}/privacy-policy`} className="text-emerald-400 hover:text-emerald-300 underline font-medium transition-colors">
              {dict.privacy_policy_link}
            </a>
          </label>
        </div>

        <button
          disabled={status === 'loading' || !agreeGDPR || isRateLimited}
          type="submit"
          className="w-full py-4 mt-2 rounded-2xl bg-emerald-600 text-white font-bold text-base sm:text-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
        >
          <AnimatePresence mode="wait">
            {isRateLimited ? (
              <motion.span key="limited" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {dict.locked_label || 'Locked'} ({countdown}s)
              </motion.span>
            ) : status === 'idle' || status === 'error' ? (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {dict.send}
              </motion.span>
            ) : status === 'loading' ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="animate-spin" size={20} /> {dict.sending}
              </motion.div>
            ) : (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-white text-center px-2"
              >
                ✓ {dict.success}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {dict.disclaimer && (
          <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed text-center mt-3">
            {dict.disclaimer}
          </p>
        )}

        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm text-center font-medium"
          >
            {errorMessage}
          </motion.p>
        )}

        {/* Quick Contact links */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <a
              href={`https://wa.me/359882905657?text=${encodeURIComponent(dict.prefilled_msg || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 hover:border-[#25D366]/40 text-[#25D366] transition-all text-sm font-semibold active:scale-95 shadow-lg"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.988 4.475-9.988 9.981 0 1.762.456 3.481 1.325 5.012L2 22l5.138-1.344a9.92 9.92 0 0 0 4.875 1.275h.005c5.506 0 9.994-4.475 9.994-9.981 0-2.669-1.038-5.175-2.925-7.062C17.188 3.037 14.688 2 12.012 2zm5.787 13.987c-.244.688-1.219 1.25-1.688 1.344-.438.094-.981.169-2.95-.65-2.519-1.044-4.138-3.612-4.262-3.781-.125-.169-.994-1.325-.994-2.525 0-1.2.625-1.787.844-2.031.219-.244.488-.306.65-.306.169 0 .344.006.494.013.156.006.363-.063.569.444.206.506.712 1.731.775 1.862.063.131.106.288.019.462-.088.175-.169.3-.338.5-.169.194-.35.394-.5.562-.169.181-.344.375-.15.712.194.331.862 1.419 1.844 2.294.125.112.231.2.338.281.812.637 1.287.544 1.5-.281.088-.175.4-.813.506-1.031.106-.219.219-.175.331-.131.119.044.75.356 1.538.744.788.388.906.575.981.7.075.125.075.725-.169 1.412z"/>
              </svg>
              <span>{dict.whatsapp_btn || 'WhatsApp Chat'}</span>
            </a>
            <a
              href={`https://t.me/corebitsystems?text=${encodeURIComponent(dict.prefilled_msg || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/20 hover:border-[#0088cc]/40 text-[#0088cc] transition-all text-sm font-semibold active:scale-95 shadow-lg"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 fill-current text-[#38bdf8]" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.36-.49.99-.74 3.89-1.69 6.48-2.8 7.78-3.33 3.69-1.54 4.46-1.81 4.96-1.82.11 0 .36.03.52.16.14.11.18.26.19.37 0 .07.01.22 0 .24z"/>
              </svg>
              <span>{dict.telegram_btn || 'Telegram Support'}</span>
            </a>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
            <span>{dict.or_email_label || 'Or:'}</span>
            <a
              href="mailto:corebitstudio@corebitsystems.io"
              className="hover:text-emerald-400 transition-colors underline"
            >
              corebitstudio@corebitsystems.io
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
