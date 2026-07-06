'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQDict {
  title: string;
  subtitle: string;
  items: FAQItem[];
}

interface FAQSectionProps {
  dict: FAQDict;
}

export default function FAQSection({ dict }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto flex flex-col gap-8 sm:gap-12 relative z-10 px-2 py-8 sm:py-12">
      <div className="text-center flex flex-col gap-3 sm:gap-4">
        <div className="flex justify-center">
          <div className="p-3 bg-emerald-600/10 rounded-2xl w-fit border border-emerald-600/20 text-emerald-500">
            <HelpCircle size={24} />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">{dict.title}</h2>
        <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto">{dict.subtitle}</p>
      </div>

      <div className="flex flex-col gap-4">
        {dict.items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20"
            >
              <button
                onClick={() => toggleFAQ(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-base sm:text-lg font-semibold tracking-tight text-white">
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-neutral-400 shrink-0"
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-neutral-400 leading-relaxed font-light border-t border-white/5 pt-4">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
