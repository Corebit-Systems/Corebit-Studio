// File: c:\dev\Corebit-Studio\components\AiSalesWidget.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { Send, X, Share2, Sparkles, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getMessageText = (message: UIMessage) => message.parts
  .filter((part) => part.type === 'text')
  .map((part) => part.text)
  .join('');

const transport = new DefaultChatTransport<UIMessage>({
  prepareSendMessagesRequest: ({ messages }) => ({
    body: {
      messages: messages.slice(-8).map((message) => ({
        role: message.role,
        parts: [{ type: 'text', text: getMessageText(message).slice(0, 1000) }],
      })),
    },
  }),
});
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
  contact: string;
  shareTitle: string;
  shareText: string;
}> = {
  en: {
    welcome: "Ask Corebit Studio’s AI assistant about website development, online booking or automation.",
    headerTitle: "Corebit Sales Assistant",
    placeholder: "Type your message...",
    quickReplies: ["How much does it cost?", "Timeline?"],
    online: "Online",
    offline: "Offline",
    fallbackTitle: "AI Assistant is Busy",
    fallbackDesc: "Use our contact form to discuss your project with the team.",
    contact: "Contact the team",
    shareTitle: "Corebit Studio Proposal",
    shareText: "Check out this web development proposal from Corebit Studio!"
  },
  ru: {
    welcome: "Я ИИ-помощник Corebit Studio. Спросите меня о разработке сайтов, онлайн-бронировании или автоматизации.",
    headerTitle: "ИИ-ассистент Corebit",
    placeholder: "Напишите сообщение...",
    quickReplies: ["Сколько стоит?", "Какие сроки?"],
    online: "В сети",
    offline: "Не в сети",
    fallbackTitle: "Ассистент занят",
    fallbackDesc: "Оставьте заявку через форму, чтобы обсудить проект с командой.",
    contact: "Связаться с командой",
    shareTitle: "Предложение от Corebit Studio",
    shareText: "Посмотрите предложение по веб-разработке от Corebit Studio!"
  },
  cnr: {
    welcome: "Pitajte AI asistenta Corebit Studija o izradi sajtova, onlajn rezervacijama ili automatizaciji.",
    headerTitle: "Corebit AI Asistent",
    placeholder: "Napišite poruku...",
    quickReplies: ["Koliko košta?", "Koji su rokovi?"],
    online: "Na mreži",
    offline: "Van mreže",
    fallbackTitle: "Asistent je zauzet",
    fallbackDesc: "Pošaljite upit putem kontakt forme.",
    contact: "Kontaktirajte tim",
    shareTitle: "Ponuda Corebit Studio",
    shareText: "Pogledajte ovu ponudu za razvoj veb sajta od Corebit Studio!"
  },
  srb: {
    welcome: "Pitajte AI asistenta Corebit Studija o izradi sajtova, onlajn rezervacijama ili automatizaciji.",
    headerTitle: "Corebit AI Asistent",
    placeholder: "Napišite poruku...",
    quickReplies: ["Koliko košta?", "Koji su rokovi?"],
    online: "Na mreži",
    offline: "Van mreže",
    fallbackTitle: "Asistent je zauzet",
    fallbackDesc: "Pošaljite upit putem kontakt forme.",
    contact: "Kontaktirajte tim",
    shareTitle: "Ponuda Corebit Studio",
    shareText: "Pogledajte ovu ponudu za razvoj veb sajta od Corebit Studio!"
  },
  sq: {
    welcome: "Pyetni asistentin e Corebit Studio për zhvillimin e faqeve, rezervimet në internet ose automatizimin.",
    headerTitle: "Corebit Asistent AI",
    placeholder: "Shkruani mesazhin tuaj...",
    quickReplies: ["Sa kushton?", "Sa kohë merr?"],
    online: "Në linjë",
    offline: "Jashtë linje",
    fallbackTitle: "Asistenti është i zënë",
    fallbackDesc: "Përdorni formularin e kontaktit për të diskutuar projektin me ekipin.",
    contact: "Kontaktoni ekipin",
    shareTitle: "Propozim nga Corebit Studio",
    shareText: "Shikoni këtë propozim për zhvillim uebi nga Corebit Studio!"
  }
};

export default function AiSalesWidget({ locale }: AiSalesWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const texts = WIDGET_TEXTS[locale] || WIDGET_TEXTS.en;

  // Initialize useChat hook
  const { messages, sendMessage, status, error } = useChat<UIMessage>({
    messages: [
      { id: 'welcome', role: 'assistant', parts: [{ type: 'text', text: texts.welcome }] }
    ],
    transport,
  });

  const [input, setInput] = useState('');
  const isLoading = status === 'submitted' || status === 'streaming';
  const isOnline = !error;
  const contactHref = `/${locale}#contact`;

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleQuickReply = (reply: string) => {
    if (isLoading) return;
    setShowQuickReplies(false);
    sendMessage({ text: reply });
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
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput('');
  };

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-50 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-[330px] sm:w-[380px] max-w-[calc(100vw_-_2rem)] h-[480px] sm:h-[520px] max-h-[calc(100dvh_-_6rem)] rounded-3xl border border-white/10 bg-zinc-950/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden mb-4"
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
              {isOnline ? (
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
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-2 text-center">
                  <AlertCircle aria-hidden="true" className="text-emerald-500" size={32} />
                  <h5 className="text-sm font-semibold text-white">{texts.fallbackTitle}</h5>
                  <p className="text-sm text-zinc-400">{texts.fallbackDesc}</p>
                </div>
              )}
            </div>

            {/* Input & Quick Replies Footer */}
            {isOnline && (
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
                    onChange={(event) => setInput(event.target.value)}
                    maxLength={1000}
                    placeholder={texts.placeholder}
                    className="flex-1 bg-zinc-900 border border-white/5 focus:border-emerald-500/30 text-white rounded-xl px-3 py-2.5 text-xs sm:text-sm font-light outline-none transition-colors pr-16 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-white disabled:text-zinc-500 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            )}
            <a
              href={contactHref}
              onClick={() => setIsOpen(false)}
              className="flex min-h-11 items-center justify-center border-t border-white/10 px-4 text-sm font-medium text-emerald-300 transition-colors hover:text-emerald-200"
            >
              {texts.contact}
            </a>
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
