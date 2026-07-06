// File: C:\dev\Corebit-Studio\components\ContactForm.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';

// ФИКС: Строгая типизация вместо dict: any
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
}

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
}

interface ContactFormProps {
  dict: ContactFormDict;
}

export default function ContactForm({ dict }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [agreeGDPR, setAgreeGDPR] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreeGDPR) return;
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const honeypot = formData.get('bot_field');
    const message = formData.get('message') as string;

    // 1. Invisible Honeypot check (Anti-Bot)
    if (honeypot) {
      setErrorMessage(dict.error_spam);
      setStatus('error');
      return;
    }

    // 2. Client-side Rate Limiting
    const lastSubmit = localStorage.getItem('last_submit_time');
    const now = Date.now();
    if (lastSubmit && now - parseInt(lastSubmit) < 60000) {
      setErrorMessage(dict.error_rate);
      setStatus('error');
      return;
    }

    // 3. Anti-XSS payload check
    const sanitizedMessage = message.replace(/[<>]/g, '');
    if (message !== sanitizedMessage) {
      setErrorMessage(dict.error_spam);
      setStatus('error');
      return;
    }

    // Simulate Secure Network Request
    setTimeout(() => {
      localStorage.setItem('last_submit_time', now.toString());
      setStatus('success');
    }, 1500);
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

        <div className="flex flex-col gap-2">
          <input
            required
            type="text"
            name="name"
            placeholder={dict.name}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:bg-white/10 transition-all text-base min-h-[52px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <input
            required
            type="email"
            name="email"
            placeholder={dict.email}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:bg-white/10 transition-all text-base min-h-[52px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <textarea
            required
            name="message"
            placeholder={dict.message}
            rows={4}
            maxLength={1000}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:bg-white/10 transition-all resize-none text-base"
          />
        </div>

        {/* GDPR Compliance Consent Checkbox */}
        <div className="flex items-start gap-3 mt-2">
          <input
            id="gdpr-consent"
            type="checkbox"
            required
            checked={agreeGDPR}
            onChange={(e) => setAgreeGDPR(e.target.checked)}
            className="mt-1 h-4.5 w-4.5 rounded border-white/10 bg-white/5 text-emerald-600 focus:ring-emerald-500 shrink-0 cursor-pointer"
          />
          <label htmlFor="gdpr-consent" className="text-xs sm:text-sm text-neutral-400 leading-normal cursor-pointer select-none">
            {dict.gdpr_text}{' '}
            <a href={`/${agreeGDPR ? '#' : 'en'}/privacy-policy`} className="text-emerald-400 hover:text-emerald-300 underline font-medium transition-colors">
              {dict.privacy_policy_link}
            </a>
          </label>
        </div>

        <button
          disabled={status === 'loading' || status === 'success' || !agreeGDPR}
          type="submit"
          className="w-full py-4 mt-2 rounded-2xl bg-emerald-600 text-white font-bold text-base sm:text-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
        >
          <AnimatePresence mode="wait">
            {status === 'idle' || status === 'error' ? (
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
        <div className="mt-4 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm text-neutral-400">
          <span>Or connect via:</span>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/359882905657"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <svg className="w-4.5 h-4.5 fill-current text-emerald-500" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.988 4.475-9.988 9.981 0 1.762.456 3.481 1.325 5.012L2 22l5.138-1.344a9.92 9.92 0 0 0 4.875 1.275h.005c5.506 0 9.994-4.475 9.994-9.981 0-2.669-1.038-5.175-2.925-7.062C17.188 3.037 14.688 2 12.012 2zm5.787 13.987c-.244.688-1.219 1.25-1.688 1.344-.438.094-.981.169-2.95-.65-2.519-1.044-4.138-3.612-4.262-3.781-.125-.169-.994-1.325-.994-2.525 0-1.2.625-1.787.844-2.031.219-.244.488-.306.65-.306.169 0 .344.006.494.013.156.006.363-.063.569.444.206.506.712 1.731.775 1.862.063.131.106.288.019.462-.088.175-.169.3-.338.5-.169.194-.35.394-.5.562-.169.181-.344.375-.15.712.194.331.862 1.419 1.844 2.294.125.112.231.2.338.281.812.637 1.287.544 1.5-.281.088-.175.4-.813.506-1.031.106-.219.219-.175.331-.131.119.044.75.356 1.538.744.788.388.906.575.981.7.075.125.075.725-.169 1.412z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
            <span className="text-white/10">|</span>
            <a
              href="https://t.me/corebitsystems"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <svg className="w-4.5 h-4.5 fill-current text-sky-500" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15.9-2.5 10.6-2.77 11.8-.12.5-.34.8-.71.9-.78.2-1.37-.2-2.09-.7-.56-.3-2.03-1.6-2.59-2.1-.15-.1-.31-.3-.03-.6.09-.09 1.56-1.4 2.87-2.6.59-.5 1.18-1.2-.09-1.2-.28 0-.75.1-.93.3-5.18 3.3-5.18 3.3-5.18 3.3-.46.2-.9.4-1.28.4-.4 0-1.21-.2-1.81-.4-.71-.2-1.28-.3-1.21-.8.03-.2.34-.4.93-.6 3.65-1.5 6.09-2.6 7.31-3.1 3.5-1.4 4.21-1.7 4.68-1.7.12 0 .37 0 .53.1.12.09.21.2.25.4.03.1.03.5-.03.8z"/>
              </svg>
              <span>Telegram</span>
            </a>
            <span className="text-white/10">|</span>
            <a
              href="mailto:hello@corebitsystems.io"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <svg className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
              <span>Email</span>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
