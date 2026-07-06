import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PolicySection {
  title: string;
  text: string;
}

interface PolicyContent {
  title: string;
  subtitle: string;
  lastUpdated: string;
  backBtn: string;
  sections: PolicySection[];
}

const POLICY_CONTENT: Record<string, PolicyContent> = {
  en: {
    title: "Cookie Policy",
    subtitle: "How Corebit Studio utilizes performance and functional cookies.",
    lastUpdated: "Last updated: July 2026",
    backBtn: "Back to Home",
    sections: [
      {
        title: "1. What Are Cookies",
        text: "Cookies are small text files stored on your browser or device when you load websites. We use them to optimize speed performance, preserve your language preference, and collect telemetry data."
      },
      {
        title: "2. Cookies We Use",
        text: "We leverage essential functional cookies (e.g. storing your language preferences or banner dismissal state) and performance monitoring tools (Vercel Speed Insights and Analytics to measure Core Web Vitals)."
      },
      {
        title: "3. Managing Consent",
        text: "You can revoke or clear local storage elements via your browser settings at any time. Opting out of performance cookies will not restrict your access to Corebit Studio."
      }
    ]
  },
  ru: {
    title: "Политика Cookie",
    subtitle: "Как Corebit Studio использует файлы cookie для оптимизации.",
    lastUpdated: "Последнее обновление: Июль 2026",
    backBtn: "На главную",
    sections: [
      {
        title: "1. Что такое файлы cookie",
        text: "Файлы cookie — это небольшие текстовые файлы, сохраняемые на вашем устройстве при посещении сайтов. Мы используем их для повышения скорости загрузки и запоминания ваших языковых настроек."
      },
      {
        title: "2. Типы используемых файлов cookie",
        text: "Мы используем строго необходимые функциональные cookie (языковые предпочтения, статус согласия с баннером) и аналитические инструменты Vercel для мониторинга Core Web Vitals."
      },
      {
        title: "3. Управление файлами cookie",
        text: "Вы можете в любое время очистить локальное хранилище или изменить настройки браузера для блокировки файлов cookie."
      }
    ]
  },
  cnr: {
    title: "Politika Kolačića",
    subtitle: "Kako Corebit Studio koristi funkcionalne kolačiće za performanse.",
    lastUpdated: "Posljednje ažuriranje: Jul 2026",
    backBtn: "Nazad na Početnu",
    sections: [
      {
        title: "1. Šta su Kolačići",
        text: "Kolačići su male tekstualne datoteke koje se čuvaju na vašem uređaju prilikom posjete veb sajtu. Koristimo ih za poboljšanje brzine učitavanja i očuvanje vaših jezičkih podešavanja."
      },
      {
        title: "2. Kolačići Koje Koristimo",
        text: "Koristimo isključivo neophodne funkcionalne kolačiće (za pamćenje jezika i statusa saglasnosti) i analitiku Vercel Speed Insights za mjerenje Core Web Vitals brzine."
      },
      {
        title: "3. Upravljanje Saglasnošću",
        text: "U svakom trenutku možete obrisati kolačiće ili lokalno skladište kroz podešavanja vašeg pretraživača."
      }
    ]
  },
  srb: {
    title: "Politika Kolačića",
    subtitle: "Kako Corebit Studio koristi funkcionalne kolačiće za performanse.",
    lastUpdated: "Poslednje ažuriranje: Jul 2026",
    backBtn: "Nazad na Početnu",
    sections: [
      {
        title: "1. Šta su Kolačići",
        text: "Kolačići su male tekstualne datoteke koje se čuvaju na vašem uređaju prilikom posete veb sajtu. Koristimo ih za poboljšanje brzine učitavanja i očuvanje vaših jezičkih podešavanja."
      },
      {
        title: "2. Kolačići Koje Koristimo",
        text: "Koristimo isključivo neophodne funkcionalne kolačiće (za pamćenje jezika i statusa saglasnosti) i analitiku Vercel Speed Insights za merenje Core Web Vitals brzine."
      },
      {
        title: "3. Upravljanje Saglasnošću",
        text: "U svakom trenutku možete obrisati kolačiće ili lokalno skladište kroz podešavanja vašeg pretraživača."
      }
    ]
  },
  sq: {
    title: "Politika e Cookies",
    subtitle: "Si i përdor Corebit Studio cookies për performancë dhe funksionim.",
    lastUpdated: "Përditësimi i fundit: Korrik 2026",
    backBtn: "Kthehu në Fillim",
    sections: [
      {
        title: "1. Çfarë janë Cookies",
        text: "Cookies janë skedarë të vegjël teksti që ruhen në pajisjen tuaj kur vizitoni faqe uebi. Ne i përdorim ato për të optimizuar shpejtësinë dhe për të ruajtur gjuhën tuaj të preferuar."
      },
      {
        title: "2. Cookies që ne Përdorim",
        text: "Ne përdorim vetëm cookies thelbësore funksionale (p.sh. për ruajtjen e gjuhës ose pranimin e bannerit) dhe shërbimet e telemetrisë Vercel Speed Insights për matjen e performancës."
      },
      {
        title: "3. Menaxhimi i Cookies",
        text: "Ju mund t'i fshini ose t'i bllokoni cookies në çdo kohë përmes cilësimeve të shfletuesit tuaj."
      }
    ]
  }
};

export default function CookiePolicyPage({ params: { locale } }: { params: { locale: string } }) {
  const content = POLICY_CONTENT[locale] ?? POLICY_CONTENT.en;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-24 flex flex-col gap-8 sm:gap-12">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit min-h-[44px]"
      >
        <ArrowLeft size={20} /> {content.backBtn}
      </Link>

      <div className="flex flex-col gap-3">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-tight">
          {content.title}
        </h1>
        <p className="text-base sm:text-lg text-neutral-400 font-light">
          {content.subtitle}
        </p>
        <span className="text-xs text-neutral-500 font-mono">{content.lastUpdated}</span>
      </div>

      <div className="flex flex-col gap-6 sm:gap-8 p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl">
        {content.sections.map((sec, i) => (
          <div key={i} className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">{sec.title}</h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-light">{sec.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
