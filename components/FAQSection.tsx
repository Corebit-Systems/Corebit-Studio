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
        {dict.items.map((item, index) => (
          <details
            key={index}
            className="group rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20"
          >
            <summary className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden focus:outline-none select-none">
              <span className="text-base sm:text-lg font-semibold tracking-tight text-white">
                {item.q}
              </span>
              <span className="text-neutral-400 shrink-0 transition-transform duration-300 group-open:rotate-180">
                <ChevronDown size={20} />
              </span>
            </summary>
            <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-neutral-400 leading-relaxed font-light border-t border-white/5 pt-4">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
