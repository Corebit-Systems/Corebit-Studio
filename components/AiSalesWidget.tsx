// File: c:\dev\Corebit-Studio\components\AiSalesWidget.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat, UIMessage } from '@ai-sdk/react';
import { useSearchParams } from 'next/navigation';

const getMessageText = (m: UIMessage | any): string => {
  if (m.content) return m.content;
  if (!m.parts) return '';
  return m.parts
    .filter((p: any) => p.type === 'text')
    .map((p: any) => p.text)
    .join('');
};
import { Send, X, MessageSquare, Share2, Sparkles, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AiSalesWidgetProps {
  locale: string;
}

const WIDGET_TEXTS: Record<string, {
  welcome: string;
  headerTitle: string;
  placeholder: string;
  quickReplies: string[];
  online: string;
  offline: string;
  fallbackTitle: string;
  fallbackDesc: string;
  formName: string;
  formContact: string;
  formSubmit: string;
  formSuccess: string;
  shareTitle: string;
  shareText: string;
}> = {
  en: {
    welcome: "Hello! I am Corebit's AI assistant. I can calculate your ROI, guide you through our Next.js web solutions, and coordinate with our team. How can I help you today?",
    headerTitle: "Corebit Sales Assistant",
    placeholder: "Type your message...",
    quickReplies: ["How much does it cost?", "Timeline?", "Connect with human"],
    online: "Online",
    offline: "Offline",
    fallbackTitle: "AI Assistant is Busy",
    fallbackDesc: "Please leave your contact details, and our manager will contact you within 15 minutes with a custom proposal.",
    formName: "Your Name",
    formContact: "Phone or Email",
    formSubmit: "Send to Manager",
    formSuccess: "Thank you! We will contact you shortly.",
    shareTitle: "Corebit Studio Proposal",
    shareText: "Check out this web development proposal from Corebit Studio!"
  },
  ru: {
    welcome: "Здравствуйте! Я ИИ-помощник Corebit Studio. Помогу рассчитать окупаемость (ROI), расскажу про наши Next.js решения и запишу на консультацию. Какой проект вы хотите обсудить?",
    headerTitle: "ИИ-ассистент Corebit",
    placeholder: "Напишите сообщение...",
    quickReplies: ["Сколько стоит?", "Какие сроки?", "Позвать человека"],
    online: "В сети",
    offline: "Не в сети",
    fallbackTitle: "Ассистент занят",
    fallbackDesc: "Пожалуйста, оставьте ваши контакты, и наш менеджер свяжется с вами в течение 15 минут с индивидуальным предложением.",
    formName: "Ваше имя",
    formContact: "Телефон или Email",
    formSubmit: "Отправить менеджеру",
    formSuccess: "Спасибо! Мы свяжемся с вами в ближайшее время.",
    shareTitle: "Предложение от Corebit Studio",
    shareText: "Посмотрите предложение по веб-разработке от Corebit Studio!"
  },
  cnr: {
    welcome: "Zdravo! Ja sam Corebit-ov AI asistent. Mogu vam pomoći da izračunate ROI, pokazaću vam naša Next.js rešenja i povezati vas sa timom. Kako vam mogu pomoći?",
    headerTitle: "Corebit AI Asistent",
    placeholder: "Napišite poruku...",
    quickReplies: ["Koliko košta?", "Koji su rokovi?", "Poveži me sa agentom"],
    online: "Na mreži",
    offline: "Van mreže",
    fallbackTitle: "Asistent je zauzet",
    fallbackDesc: "Molimo ostavite vaše kontakt podatke i naš menadžer će vas kontaktirati u roku od 15 minuta sa prilagođenom ponudom.",
    formName: "Vaše ime",
    formContact: "Telefon ili Email",
    formSubmit: "Pošalji menadžeru",
    formSuccess: "Hvala vam! Kontaktiraćemo vas uskoro.",
    shareTitle: "Ponuda Corebit Studio",
    shareText: "Pogledajte ovu ponudu za razvoj veb sajta od Corebit Studio!"
  },
  srb: {
    welcome: "Zdravo! Ja sam Corebit-ov AI asistent. Mogu vam pomoći da izračunate ROI, pokazaću vam naša Next.js rešenja i povezati vas sa timom. Kako vam mogu pomoći?",
    headerTitle: "Corebit AI Asistent",
    placeholder: "Napišite poruku...",
    quickReplies: ["Koliko košta?", "Koji su rokovi?", "Poveži me sa agentom"],
    online: "Na mreži",
    offline: "Van mreže",
    fallbackTitle: "Asistent je zauzet",
    fallbackDesc: "Molimo ostavite vaše kontakt podatke i naš menadžer će vas kontaktirati u roku od 15 minuta sa prilagođenom ponudom.",
    formName: "Vaše ime",
    formContact: "Telefon ili Email",
    formSubmit: "Pošalji menadžeru",
    formSuccess: "Hvala vam! Kontaktiraćemo vas uskoro.",
    shareTitle: "Ponuda Corebit Studio",
    shareText: "Pogledajte ovu ponudu za razvoj veb sajta od Corebit Studio!"
  },
  sq: {
    welcome: "Përshëndetje! Unë jam asistenti AI i Corebit. Mund t'ju ndihmoj të llogaritni ROI-në, t'ju udhëzoj në zgjidhjet tona Next.js dhe të lidheni me ekipin. Si mund t'ju ndihmoj?",
    headerTitle: "Corebit Asistent AI",
    placeholder: "Shkruani mesazhin tuaj...",
    quickReplies: ["Sa kushton?", "Sa kohë merr?", "Lidhu me një menaxher"],
    online: "Në linjë",
    offline: "Jashtë linje",
    fallbackTitle: "Asistenti është i zënë",
    fallbackDesc: "Ju lutemi lini të dhënat tuaja të kontaktit dhe menaxheri ynë do t'ju kontaktojë brenda 15 minutave me një propozim të personalizuar.",
    formName: "Emri Juaj",
    formContact: "Telefon ose Email",
    formSubmit: "Dërgo menaxherit",
    formSuccess: "Ju faleminderit! Ne do t'ju kontaktojmë së shpejti.",
    shareTitle: "Propozim nga Corebit Studio",
    shareText: "Shikoni këtë propozim për zhvillim uebi nga Corebit Studio!"
  }
};

export default function AiSalesWidget({ locale }: AiSalesWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [fallbackSent, setFallbackSent] = useState(false);
  const [leadSent, setLeadSent] = useState(false);

  // Form states for fallback mode
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const searchParams = useSearchParams();
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const texts = WIDGET_TEXTS[locale] || WIDGET_TEXTS.en;

  // Initialize useChat hook
  const { messages, sendMessage, status, error } = useChat<UIMessage>({
    messages: [
      { id: 'welcome', role: 'assistant', parts: [{ type: 'text', text: texts.welcome }] }
    ],
    onError: (err) => {
      console.error('Gemini API execution error:', err);
      setIsFallback(true);
    }
  });

  const [input, setInput] = useState('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const isLoading = status === 'submitted' || status === 'streaming';
  const isOnline = !error;
  const isLeadSent = messages.some(m =>
    m.parts?.some(p => p.type === 'tool-sendLeadToManager')
  );

  // Parse UTM tags
  useEffect(() => {
    const keys = ['utm_source', 'utm_medium', 'utm_campaign'];
    const params: Record<string, string> = {};
    keys.forEach(k => {
      const val = searchParams.get(k);
      if (val) params[k] = val;
    });
    if (Object.keys(params).length > 0) {
      setUtmParams(params);
      localStorage.setItem('corebit_utm', JSON.stringify(params));
    } else {
      const stored = localStorage.getItem('corebit_utm');
      if (stored) {
        setUtmParams(JSON.parse(stored));
      }
    }
  }, [searchParams]);

  // Load and save draft input
  useEffect(() => {
    const draft = localStorage.getItem('ai_sales_draft');
    if (draft) setInput(draft);
  }, [setInput]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    localStorage.setItem('ai_sales_draft', e.target.value);
  };

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Proactive trigger (15 seconds delay)
  useEffect(() => {
    const shownBefore = localStorage.getItem('ai_sales_proactive_shown');
    if (shownBefore) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      localStorage.setItem('ai_sales_proactive_shown', 'true');
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  // Exit-Intent trigger
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 0) {
        const exitTriggered = localStorage.getItem('ai_sales_exit_intent');
        if (!exitTriggered) {
          setIsOpen(true);
          localStorage.setItem('ai_sales_exit_intent', 'true');
        }
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  // Scan dialogue history for leads/contacts
  useEffect(() => {
    if (leadSent) return;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') return;

    const text = getMessageText(lastMessage);
    const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const PHONE_REGEX = /(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;

    const foundEmail = text.match(EMAIL_REGEX);
    const foundPhone = text.match(PHONE_REGEX);

    if (foundEmail || foundPhone) {
      const contact = (foundEmail ? foundEmail[0] : '') + ' ' + (foundPhone ? foundPhone[0] : '');
      sendLeadToTelegram(contact.trim(), text);
    }
  }, [messages, leadSent]);

  const sendLeadToTelegram = async (contact: string, lastMsg: string) => {
    try {
      setLeadSent(true);
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact,
          message: lastMsg,
          utmParams,
          history: messages.map(m => ({ role: m.role, content: getMessageText(m) }))
        })
      });
    } catch (e) {
      console.error('Failed to send lead to Telegram:', e);
    }
  };

  const handleQuickReply = (reply: string) => {
    setShowQuickReplies(false);
    sendMessage({ text: reply });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContact) return;
    setFormLoading(true);

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: `${formName} (${formContact})`,
          message: '[FALLBACK FORM SUBMISSION]',
          utmParams,
          history: messages
        })
      });
      setFallbackSent(true);
    } catch (e) {
      console.error('Fallback submit failed:', e);
    } finally {
      setFormLoading(false);
    }
  };

  const handleShare = async (content: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: texts.shareTitle,
          text: `${texts.shareText}\n\n"${content}"`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing offer:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(content);
      alert('Copied to clipboard!');
    }
  };

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
    localStorage.removeItem('ai_sales_draft');
  };

  return (
    <div ref={widgetRef} className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-[330px] sm:w-[380px] h-[480px] sm:h-[520px] rounded-3xl border border-white/10 bg-zinc-950/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Sparkles size={18} />
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-950 ${isOnline ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-tight">{texts.headerTitle}</h4>
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-light">
                    {isOnline ? texts.online : texts.offline}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 rounded-full border border-white/5 hover:border-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
              {!isFallback ? (
                <>
                  {messages.map((m) => (
                    <div 
                      key={m.id} 
                      className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${m.role === 'user' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                        {m.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className={`p-3 rounded-2xl text-xs sm:text-sm font-light leading-relaxed ${m.role === 'user' ? 'bg-zinc-900 border border-white/5 text-white rounded-tr-none' : 'bg-zinc-900/40 border border-white/5 text-zinc-300 rounded-tl-none'}`}>
                          {getMessageText(m)}
                        </div>
                        {/* Share Button (AI answers only) */}
                        {m.role === 'assistant' && m.id !== 'welcome' && (
                          <button
                            onClick={() => handleShare(getMessageText(m))}
                            className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 self-start transition-colors px-3 py-3.5 -my-3.5 -mx-2 cursor-pointer min-h-[48px]"
                          >
                            <Share2 size={10} /> Поделиться расчетом
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 self-start max-w-[85%]">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                        <Sparkles size={14} />
                      </div>
                      <div className="p-3 rounded-2xl bg-zinc-900/40 border border-white/5 flex items-center justify-center rounded-tl-none">
                        {/* CSS Typing indicator */}
                        <div className="flex items-center gap-1.5 py-1 px-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </>
              ) : (
                /* Fallback Offline Form */
                <div className="h-full flex flex-col justify-center gap-4 px-2">
                  {!fallbackSent ? (
                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1 items-center text-center mb-2">
                        <AlertCircle className="text-emerald-500" size={32} />
                        <h5 className="text-sm font-semibold mt-1 text-white">{texts.fallbackTitle}</h5>
                        <p className="text-xs text-zinc-400 font-light mt-1">{texts.fallbackDesc}</p>
                      </div>
                      <label htmlFor="chat-offline-name" className="sr-only">{texts.formName}</label>
                      <input
                        id="chat-offline-name"
                        type="text"
                        required
                        placeholder={texts.formName}
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 focus:border-emerald-500/30 text-white rounded-xl px-3 py-2 text-xs sm:text-sm font-light outline-none transition-colors"
                      />
                      <label htmlFor="chat-offline-contact" className="sr-only">{texts.formContact}</label>
                      <input
                        id="chat-offline-contact"
                        type="text"
                        required
                        placeholder={texts.formContact}
                        value={formContact}
                        onChange={(e) => setFormContact(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 focus:border-emerald-500/30 text-white rounded-xl px-3 py-2 text-xs sm:text-sm font-light outline-none transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="w-full py-2.5 min-h-[48px] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 cursor-pointer"
                      >
                        {formLoading ? '...' : texts.formSubmit}
                      </button>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center gap-2 py-8 animate-fadeIn">
                      <CheckCircle2 className="text-emerald-500" size={40} />
                      <p className="text-sm text-zinc-200 font-medium">{texts.formSuccess}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input & Quick Replies Footer */}
            {!isFallback && (
              <div className="p-3 border-t border-white/10 flex flex-col gap-2.5 bg-zinc-900/20">
                {/* Quick Replies */}
                {showQuickReplies && messages.length === 1 && (
                  <div className="flex flex-wrap gap-2">
                    {texts.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(reply)}
                        className="px-4 py-2.5 min-h-[48px] border border-white/5 bg-zinc-900/50 hover:bg-zinc-800 text-[10px] sm:text-xs text-zinc-400 hover:text-white rounded-full transition-colors cursor-pointer flex items-center justify-center"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input form */}
                <form onSubmit={handleChatSubmit} className="flex gap-2 relative">
                  <label htmlFor="chat-message-input" className="sr-only">{texts.placeholder}</label>
                  <input
                    id="chat-message-input"
                    type="text"
                    value={input}
                    onChange={onInputChange}
                    disabled={isLeadSent}
                    placeholder={isLeadSent ? "Заявка отправлена, чат закрыт" : texts.placeholder}
                    className="flex-1 bg-zinc-900 border border-white/5 focus:border-emerald-500/30 text-white rounded-xl px-3 py-2.5 text-xs sm:text-sm font-light outline-none transition-colors pr-16 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading || isLeadSent}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-white disabled:text-zinc-500 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-zinc-950 border border-white/10 text-emerald-400 hover:text-white hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 relative group cursor-pointer"
          aria-label="Open AI Sales Assistant"
        >
          <Sparkles size={24} className="group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-50 pointer-events-none" />
        </button>
      )}
    </div>
  );
}
