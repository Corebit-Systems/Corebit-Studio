'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star, MessageSquare, ShieldCheck, Loader2 } from 'lucide-react';

interface ReviewItem {
  author: string;
  company: string;
  text: string;
}

interface ReviewsDict {
  title: string;
  subtitle: string;
  leave_btn: string;
  close_btn: string;
  form_title: string;
  form_name: string;
  form_company: string;
  form_rating: string;
  form_text: string;
  form_send: string;
  form_sending: string;
  form_success: string;
  form_error?: string;
  form_rating_aria?: string;
  items: ReviewItem[];
}

interface ReviewsAccordionProps {
  dict: ReviewsDict;
}

export default function ReviewsAccordion({ dict }: ReviewsAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Feedback Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [bTrap, setBTrap] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const toggleReview = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleReview(index);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !text) return;

    setStatus('loading');
    setErrorMessage('');

    // Detect current locale from the URL path
    const locale = typeof window !== 'undefined'
      ? (window.location.pathname.split('/')[1] || 'en')
      : 'en';

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company, rating, text, b_trap: bTrap, locale }),
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setCompany('');
        setRating(5);
        setText('');
        setBTrap('');
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(data.error || (dict.form_error || 'Something went wrong. Please try again.'));
        setStatus('error');
      }
    } catch {
      setErrorMessage(dict.form_error || 'Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section id="reviews" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col gap-10 sm:gap-14 relative z-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          {dict.title}
        </h2>
        <p className="text-base sm:text-lg text-neutral-350 max-w-2xl font-light">
          {dict.subtitle}
        </p>
      </div>

      {/* Accordion List */}
      <div className="flex flex-col gap-4">
        {dict.items.map((item, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors overflow-hidden"
            >
              {/* Header / Toggle Button */}
              <div
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => toggleReview(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="flex justify-between items-center p-5 sm:p-6 cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-emerald-500/30 rounded-2xl"
              >
                <div className="flex flex-col gap-1 text-left pr-4">
                  <span className="font-semibold text-white text-base sm:text-lg">{item.author}</span>
                  <span className="text-xs sm:text-sm text-neutral-400 font-light">{item.company}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-0.5 text-emerald-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <ChevronDown
                    className={`text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
                    size={20}
                  />
                </div>
              </div>

              {/* Collapsible Content */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] border-t border-white/5' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-5 sm:p-6 text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
                    {item.text}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Trigger & Feedback Form */}
      <div className="flex flex-col items-center mt-4">
        {!isFormOpen && status !== 'success' && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-white font-medium transition-all text-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 active:scale-95"
          >
            {dict.leave_btn}
          </button>
        )}

        {/* Success Message */}
        {status === 'success' && (
          <div className="flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 max-w-xl text-center">
            <MessageSquare className="text-emerald-500" size={32} />
            <p className="text-sm sm:text-base text-neutral-200 font-medium">{dict.form_success}</p>
          </div>
        )}

        {/* Collapsible Submission Form */}
        <div
          className={`w-full max-w-2xl grid transition-all duration-500 ease-in-out ${
            isFormOpen && status !== 'success' ? 'grid-rows-[1fr] mt-6' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 relative"
            >
              <input type="text" name="b_trap" value={bTrap} onChange={(e) => setBTrap(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="font-semibold text-white text-base sm:text-lg flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  {dict.form_title}
                </span>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  {dict.close_btn}
                </button>
              </div>

              {/* Name & Title */}
              <div className="flex flex-col gap-2">
                <input
                  required
                  disabled={status === 'loading'}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={dict.form_name}
                  aria-label={dict.form_name}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:bg-white/10 transition-all text-sm"
                />
              </div>

              {/* Company & Industry */}
              <div className="flex flex-col gap-2">
                <input
                  required
                  disabled={status === 'loading'}
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={dict.form_company}
                  aria-label={dict.form_company}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:bg-white/10 transition-all text-sm"
                />
              </div>

              {/* Rating Selector */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {dict.form_rating}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isSelected = starValue <= rating;
                    return (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setRating(starValue)}
                        disabled={status === 'loading'}
                        className="text-neutral-500 hover:text-emerald-500 transition-colors focus:outline-none"
                        aria-label={dict.form_rating_aria ? dict.form_rating_aria.replace('{stars}', String(starValue)) : `Rate ${starValue} Stars`}
                      >
                        <Star
                          size={24}
                          className={isSelected ? 'text-emerald-500' : 'text-neutral-600'}
                          fill={isSelected ? 'currentColor' : 'none'}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Text */}
              <div className="flex flex-col gap-2">
                <textarea
                  required
                  disabled={status === 'loading'}
                  rows={4}
                  maxLength={1000}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={dict.form_text}
                  aria-label={dict.form_text}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:bg-white/10 transition-all resize-none text-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[46px]"
              >
                <AnimatePresence mode="wait">
                  {status === 'loading' ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      {dict.form_sending}
                    </motion.div>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {dict.form_send}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Error Message */}
              {status === 'error' && errorMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center font-medium"
                >
                  {errorMessage}
                </motion.p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
