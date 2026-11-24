// File: C:\dev\Corebit-Studio\components\ContactForm.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, ShieldCheck, Loader2, Mail } from 'lucide-react';
import { submitContactForm } from '@/app/actions';
import { trackLeadEvent } from './leadAnalytics';
import { pricingSelectionEvent, type PricingInquiry } from './pricingInquiry';
import { contactDraftEvent, contactMessageLimit, mergeContactDraft, takeContactDraft } from './contactDraft';
import { projectReferences, projectReferenceQuery, type ProjectReferenceId } from './projectReference';

export interface ContactFormDict {
  title: string;
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  success_detail: string;
  new_inquiry: string;
  error_rate: string;
  error_spam: string;
  error_general: string;
  copy_description: string;
  copy_description_hint: string;
  copy_description_success: string;
  copy_description_manual: string;
  gdpr_text: string;
  privacy_policy_link: string;
  selected_plan: string;
  clear_plan: string;
  project_reference: string;
  clear_project_reference: string;
  disclaimer?: string;
  whatsapp_btn?: string;
  prefilled_msg?: string;
  locked_label?: string;
  or_label?: string;
}

interface ContactFormProps {
  dict: ContactFormDict;
  locale: string;
  example?: ProjectReferenceId;
}

const cooldownMs = 60_000;
const cooldownStorageKey = 'last_submit_time';

export default function ContactForm({ dict, locale, example }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorType, setErrorType] = useState<'rate' | 'spam' | 'general' | null>(null);
  const [agreeGDPR, setAgreeGDPR] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingInquiry | null>(null);
  const [removedReference, setRemovedReference] = useState<ProjectReferenceId>();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [copyFeedback, setCopyFeedback] = useState<{ text: string; result: 'success' | 'manual' } | null>(null);
  const reference = example === removedReference ? undefined : example;
  const whatsappMessage = [
    dict.prefilled_msg,
    reference && `${dict.project_reference}: ${projectReferences[reference]}`,
    selectedPlan && `${dict.selected_plan}: ${selectedPlan.title}`,
    selectedPlan?.paymentLabel,
  ].filter(Boolean).join('\n');

  const clearProjectReference = () => {
    setRemovedReference(reference);
    const url = new URL(window.location.href);
    if (url.searchParams.get(projectReferenceQuery) === reference) {
      url.searchParams.delete(projectReferenceQuery);
      window.history.replaceState(null, '', url);
    }
  };

  useEffect(() => {
    const handleSelection = (event: Event) => {
      setSelectedPlan((event as CustomEvent<PricingInquiry>).detail);
      setStatus((current) => current === 'success' ? 'idle' : current);
    };
    window.addEventListener(pricingSelectionEvent, handleSelection);
    return () => window.removeEventListener(pricingSelectionEvent, handleSelection);
  }, []);

  // Controlled input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const showCopy = status === 'error' && errorType !== 'spam' && message.trim().length > 0;
  const copyResult = copyFeedback?.text === message ? copyFeedback.result : 'hint';

  const copyDescription = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopyFeedback({ text: message, result: 'success' });
    } catch {
      setCopyFeedback({ text: message, result: 'manual' });
      messageRef.current?.focus();
      messageRef.current?.select();
    }
  };

  useEffect(() => {
    const applyDraft = () => {
      const draft = takeContactDraft();
      if (draft) {
        setMessage((current) => mergeContactDraft(current, draft));
        setStatus((current) => current === 'success' ? 'idle' : current);
      }
    };
    window.addEventListener(contactDraftEvent, applyDraft);
    applyDraft();
    return () => window.removeEventListener(contactDraftEvent, applyDraft);
  }, []);

  const [countdown, setCountdown] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inquiryStarted = useRef(false);

  useEffect(() => {
    try {
      const lastSubmit = localStorage.getItem(cooldownStorageKey);
      if (lastSubmit) {
        const remaining = cooldownMs - (Date.now() - Number(lastSubmit));
        if (remaining > 0 && remaining <= cooldownMs) startCooldown(remaining);
      }
    } catch {
      // The server still enforces limits if browser storage is unavailable.
    }
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'success') headingRef.current?.focus();
  }, [status]);

  function startCooldown(durationMs: number) {
    const endsAt = Date.now() + durationMs;
    setIsRateLimited(true);
    setCountdown(Math.ceil(durationMs / 1000));
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining === 0 && cooldownRef.current) {
        clearInterval(cooldownRef.current);
        cooldownRef.current = null;
        setIsRateLimited(false);
      }
    }, 1000);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreeGDPR || isRateLimited || status === 'loading' || status === 'success') return;

    setStatus('loading');
    setErrorType(null);
    setCopyFeedback(null);

    const formData = new FormData(e.currentTarget);
    // Always include locale in payload so the server knows which language to reply in
    formData.set('locale', locale);
    if (reference) {
      formData.set('reference', reference);
    }
    if (selectedPlan) {
      formData.set('plan', selectedPlan.plan);
      formData.set('payment', selectedPlan.payment);
    }

    try {
      const response = await submitContactForm(formData);

      if (response.success) {
        if (!formData.get('bot_field') && !formData.get('b_trap')) {
          trackLeadEvent('generate_lead', locale, 'contact_form');
        }
        inquiryStarted.current = false;
        try {
          localStorage.setItem(cooldownStorageKey, Date.now().toString());
        } catch {
          // Storage should never turn a successful delivery into an error.
        }
        startCooldown(cooldownMs);
        setName('');
        setEmail('');
        setMessage((current) => current === message ? '' : current);
        setSelectedPlan((current) => current === selectedPlan ? null : current);
        setAgreeGDPR(false);
        if (reference) clearProjectReference();
        setStatus('success');
      } else {
        if (response.errorType === 'rate') {
          // Server told us we're rate-limited — enforce UI lock regardless of localStorage
          startCooldown(cooldownMs);
          setErrorType('rate');
        } else {
          setErrorType(response.errorType === 'spam' ? 'spam' : 'general');
        }
        setStatus('error');
      }
    } catch {
      // Never expose raw error to client — use generic message only
      setErrorType('general');
      setStatus('error');
    }
  };

  return (
    <div
      id="contact"
      className="w-full max-w-2xl mx-auto p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] bg-white/[0.03] border border-white/10 hover:border-emerald-500/20 backdrop-blur-2xl relative overflow-hidden shadow-2xl hover:shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] focus-within:border-emerald-500/30 focus-within:shadow-[0_0_50px_-6px_rgba(16,185,129,0.25)] transition-all duration-500"
    >
      <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className={status === 'success'
        ? 'relative flex flex-col items-center gap-5 pt-6 text-center sm:pt-8'
        : 'flex items-center gap-3 mb-6 sm:mb-8'}
      >
        {status === 'success' ? (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
            <Check aria-hidden="true" size={28} />
          </span>
        ) : (
          <ShieldCheck aria-hidden="true" className="text-emerald-500 shrink-0" size={24} />
        )}
        <h2
          ref={headingRef}
          tabIndex={-1}
          aria-describedby={status === 'success' ? 'contact-success-detail' : undefined}
          className="scroll-mt-28 rounded text-2xl font-bold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 sm:text-3xl"
        >
          {status === 'success' ? dict.success : dict.title}
        </h2>
      </div>

      {status === 'success' && (
        <div className="relative flex flex-col items-center gap-4 pt-3 pb-3 text-center sm:pb-6">
          <p id="contact-success-detail" className="max-w-sm text-sm leading-relaxed text-neutral-300 sm:text-base">
            {dict.success_detail}
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus('idle');
              requestAnimationFrame(() => headingRef.current?.focus());
            }}
            className="min-h-11 rounded-md px-3 text-sm font-medium text-neutral-300 underline underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            {dict.new_inquiry}
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        onChange={(event) => {
          const field = event.target;
          if (
            !inquiryStarted.current
            && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)
            && (field.name === 'name' || field.name === 'email' || field.name === 'message')
            && field.value.trim()
          ) {
            inquiryStarted.current = trackLeadEvent('inquiry_start', locale, 'contact_form');
          }
        }}
        className={status === 'success' ? 'hidden' : 'relative z-10 flex flex-col gap-4 sm:gap-6'}
      >
        {(reference || selectedPlan) && (
          <div className="divide-y divide-white/10 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4">
            {reference && (
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium text-emerald-300">{dict.project_reference}</p>
                  <p className="text-sm font-semibold text-white">{projectReferences[reference]}</p>
                </div>
                <button
                  type="button"
                  disabled={status === 'loading'}
                  onClick={clearProjectReference}
                  className="min-h-11 shrink-0 rounded-md text-sm text-neutral-300 underline underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:opacity-50"
                >
                  {dict.clear_project_reference}
                </button>
              </div>
            )}
            {selectedPlan && (
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                <div aria-live="polite" className="min-w-0 space-y-1">
                  <p className="text-xs font-medium text-emerald-300">{dict.selected_plan}</p>
                  <p className="break-words text-sm font-semibold text-white">{selectedPlan.title}</p>
                  <p className="text-xs text-neutral-300">{selectedPlan.paymentLabel}</p>
                </div>
                <button
                  type="button"
                  disabled={status === 'loading'}
                  onClick={() => setSelectedPlan(null)}
                  className="min-h-11 shrink-0 rounded-md text-sm text-neutral-300 underline underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:opacity-50"
                >
                  {dict.clear_plan}
                </button>
              </div>
            )}
          </div>
        )}
        {/* Invisible Honeypot */}
        <input type="text" name="bot_field" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
        <input type="text" name="b_trap" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="sr-only">{dict.name}</label>
          <input
            required
            disabled={status === 'loading' || isRateLimited}
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dict.name}
            aria-label={dict.name}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:bg-white/10 transition-all text-base min-h-[52px] disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="sr-only">{dict.email}</label>
          <input
            required
            disabled={status === 'loading' || isRateLimited}
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.email}
            aria-label={dict.email}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:bg-white/10 transition-all text-base min-h-[52px] disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="sr-only">{dict.message}</label>
          <textarea
            ref={messageRef}
            required
            disabled={status === 'loading'}
            readOnly={isRateLimited}
            id="message"
            name="message"
            autoComplete="off"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isRateLimited ? `${dict.error_rate} (${countdown}s)` : dict.message}
            aria-label={dict.message}
            rows={4}
            maxLength={contactMessageLimit}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:bg-white/10 transition-all resize-none text-base disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>

        {/* GDPR Compliance Consent Checkbox */}
        <div className="flex items-start gap-3 mt-2">
          <input
            id="gdpr-consent"
            name="consent"
            value="accepted"
            type="checkbox"
            required
            disabled={status === 'loading' || isRateLimited}
            checked={agreeGDPR}
            onChange={(e) => setAgreeGDPR(e.target.checked)}
            className="mt-1 h-6 w-6 rounded border-white/10 bg-white/5 text-emerald-600 focus:ring-emerald-500 shrink-0 cursor-pointer disabled:opacity-40"
          />
          <label htmlFor="gdpr-consent" className="text-xs sm:text-sm text-neutral-400 leading-normal cursor-pointer select-none">
            {dict.gdpr_text}{' '}
            <a 
              href={`/${locale}/privacy-policy`}
              onClick={(e) => e.stopPropagation()}
              className="text-emerald-400 hover:text-emerald-300 underline font-medium transition-colors p-2 -m-2 inline-block"
            >
              {dict.privacy_policy_link}
            </a>
          </label>
        </div>

        <button
          disabled={status === 'loading' || status === 'success' || !agreeGDPR || isRateLimited}
          type="submit"
          className="w-full py-4 mt-2 rounded-2xl bg-emerald-600 text-white font-bold text-base sm:text-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
        >
          <AnimatePresence mode="wait">
            {isRateLimited ? (
              <motion.span key="limited" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {dict.locked_label || 'Locked'} ({countdown}s)
              </motion.span>
            ) : status === 'loading' ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="animate-spin" size={20} /> {dict.sending}
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {dict.send}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {status === 'error' && errorType && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm text-center font-medium"
          >
            {dict[`error_${errorType}`]}
          </motion.p>
        )}

        {dict.disclaimer && (
          <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed text-center mt-3">
            {dict.disclaimer}
          </p>
        )}
      </form>

      <div className="relative mt-8 grid gap-3 border-t border-white/10 pt-5 md:grid-cols-2">
        {showCopy && (
          <div className="flex flex-col items-start gap-2 pb-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:col-span-2">
            <p role="status" className="text-sm leading-relaxed text-neutral-300">
              {dict[`copy_description_${copyResult}`]}
            </p>
            <button
              type="button"
              onClick={copyDescription}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-left text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
            >
              {copyResult === 'success' ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
              {dict.copy_description}
            </button>
          </div>
        )}
        <a
          href={`https://wa.me/359882905657?text=${encodeURIComponent(whatsappMessage)}`}
          data-whatsapp-source="contact_form"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[48px] items-center justify-center gap-2.5 rounded-xl border border-[#25D366]/20 bg-[#25D366]/[0.07] px-3 py-3 text-center text-sm font-semibold text-[#25D366] transition-colors hover:border-[#25D366]/40 hover:bg-[#25D366]/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          <svg aria-hidden="true" className="h-5 w-5 shrink-0 fill-current" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.988 4.475-9.988 9.981 0 1.762.456 3.481 1.325 5.012L2 22l5.138-1.344a9.92 9.92 0 0 0 4.875 1.275h.005c5.506 0 9.994-4.475 9.994-9.981 0-2.669-1.038-5.175-2.925-7.062C17.188 3.037 14.688 2 12.012 2zm5.787 13.987c-.244.688-1.219 1.25-1.688 1.344-.438.094-.981.169-2.95-.65-2.519-1.044-4.138-3.612-4.262-3.781-.125-.169-.994-1.325-.994-2.525 0-1.2.625-1.787.844-2.031.219-.244.488-.306.65-.306.169 0 .344.006.494.013.156.006.363-.063.569.444.206.506.712 1.731.775 1.862.063.131.106.288.019.462-.088.175-.169.3-.338.5-.169.194-.35.394-.5.562-.169.181-.344.375-.15.712.194.331.862 1.419 1.844 2.294.125.112.231.2.338.281.812.637 1.287.544 1.5-.281.088-.175.4-.813.506-1.031.106-.219.219-.175.331-.131.119.044.75.356 1.538.744.788.388.906.575.981.7.075.125.075.725-.169 1.412z"/>
          </svg>
          <span>{dict.whatsapp_btn || 'WhatsApp Chat'}</span>
        </a>
        <a
          href="mailto:corebitstudio@corebitsystems.io"
          className="flex min-h-[48px] items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center text-sm text-neutral-300 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-neutral-400" />
          <span className="min-w-0 [overflow-wrap:anywhere]">corebitstudio@corebitsystems.io</span>
        </a>
      </div>
    </div>
  );
}
