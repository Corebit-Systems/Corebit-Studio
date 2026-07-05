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

interface ContactFormProps {
  dict: ContactFormDict;
}

export default function ContactForm({ dict }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    // ФИКС: p-8 md:p-12 → p-6 sm:p-8 md:p-12, rounded-[3rem] → rounded-2xl sm:rounded-[3rem]
    <div
      id="contact"
      className="w-full max-w-2xl mx-auto p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-2xl relative overflow-hidden shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

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
            // ФИКС: px-6 py-4 → px-4 sm:px-6 py-3 sm:py-4, минимальная высота 52px
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all text-base min-h-[52px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <input
            required
            type="email"
            name="email"
            placeholder={dict.email}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all text-base min-h-[52px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <textarea
            required
            name="message"
            placeholder={dict.message}
            rows={4}
            maxLength={1000}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all resize-none text-base"
          />
        </div>

        <button
          disabled={status === 'loading' || status === 'success'}
          type="submit"
          className="w-full py-4 mt-2 rounded-2xl bg-emerald-500 text-white font-bold text-base sm:text-lg hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 min-h-[56px]"
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
      </form>
    </div>
  );
}
