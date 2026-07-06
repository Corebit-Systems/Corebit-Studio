import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const SITE_URL = 'https://corebit-studio.vercel.app';
  return {
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy-policy`,
      languages: {
        'x-default': `${SITE_URL}/en/privacy-policy`,
        en:  `${SITE_URL}/en/privacy-policy`,
        ru:  `${SITE_URL}/ru/privacy-policy`,
        'sq-AL': `${SITE_URL}/sq/privacy-policy`,
        'sr-RS': `${SITE_URL}/srb/privacy-policy`,
        'sr-ME': `${SITE_URL}/cnr/privacy-policy`,
      } as Record<string, string>,
    },
  };
}

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
    title: "Privacy Policy",
    subtitle: "Your privacy rights and data security compliance at Corebit Studio.",
    lastUpdated: "Last updated: July 2026",
    backBtn: "Back to Home",
    sections: [
      {
        title: "1. Data Collection",
        text: "When you contact us using the Secure Connection form, we request your Full Name and Corporate Email to handle your service requests. No unsolicited tracking is performed."
      },
      {
        title: "2. Montenegro GDPR Status",
        text: "Although Montenegro is not an EU member state, our practices strictly comply with Montenegro's Law on Personal Data Protection and EU GDPR guidelines. We do not sell or share your contact details."
      },
      {
        title: "3. Your Rights",
        text: "Under legal regulations, you have full rights to inspect, update, or completely delete any secure message logs. Write to corebitstudio@corebitsystems.io for data requests."
      }
    ]
  },
  ru: {
    title: "Политика Конфиденциальности",
    subtitle: "Ваши права на конфиденциальность и безопасность данных в Corebit Studio.",
    lastUpdated: "Последнее обновление: Июль 2026",
    backBtn: "На главную",
    sections: [
      {
        title: "1. Сбор данных",
        text: "При заполнении формы безопасного соединения мы запрашиваем ваше Имя и Корпоративную электронную почту для обработки запросов."
      },
      {
        title: "2. Соблюдение правил GDPR",
        text: "Наши бизнес-процессы соответствуют Закону о защите персональных данных Черногории и европейскому стандарту GDPR. Мы никогда не передаем ваши данные третьим лицам."
      },
      {
        title: "3. Ваши права",
        text: "Вы имеете право запросить просмотр, изменение или полное удаление ваших контактных логов. Для этого свяжитесь с нами по адресу corebitstudio@corebitsystems.io."
      }
    ]
  },
  cnr: {
    title: "Politika Privatnosti",
    subtitle: "Vaša prava na privatnost i sigurnost podataka u Corebit Studio.",
    lastUpdated: "Posljednje ažuriranje: Jul 2026",
    backBtn: "Nazad na Početnu",
    sections: [
      {
        title: "1. Prikupljanje Podataka",
        text: "Kada koristite formu 'Uspostavite Sigurnu Vezu', tražimo vaše Puno Ime i Poslovni Email kako bismo odgovorili na vaš upit."
      },
      {
        title: "2. Pravni Okvir i GDPR",
        text: "Naša pravila su u potpunosti usklađena sa Zakonom o zaštiti podataka o ličnosti Crne Gore, kao i sa opštim smjernicama EU GDPR-a. Vaši podaci se ne prodaju niti dijele sa trećim stranama."
      },
      {
        title: "3. Vaša Prava",
        text: "Imate pravo da u svakom trenutku zatražite uvid, izmjenu ili potpuno brisanje vaših kontakt podataka slanjem upita na corebitstudio@corebitsystems.io."
      }
    ]
  },
  srb: {
    title: "Politika Privatnosti",
    subtitle: "Vaša prava na privatnost i sigurnost podataka u Corebit Studio.",
    lastUpdated: "Poslednje ažuriranje: Jul 2026",
    backBtn: "Nazad na Početnu",
    sections: [
      {
        title: "1. Prikupljanje Podataka",
        text: "Kada koristite formu 'Uspostavite Sigurnu Vezu', tražimo vaše Puno Ime i Poslovni Email kako bismo odgovorili na vaš upit."
      },
      {
        title: "2. Pravni Okvir i GDPR",
        text: "Naša pravila su u potpunosti usklađena sa Zakonom o zaštiti podataka o ličnosti Republike Srbije i Crne Gore, kao i sa opštim smernicama EU GDPR-a. Vaši podaci se ne prodaju niti dele sa trećim stranama."
      },
      {
        title: "3. Vaša Prava",
        text: "Imate pravo da u svakom trenutku zatražite uvid, izmenu ili potpuno brisanje vaših kontakt podataka slanjem upita na corebitstudio@corebitsystems.io."
      }
    ]
  },
  sq: {
    title: "Politika e Privatësisë",
    subtitle: "Të drejtat tuaja të privatësisë dhe siguria e të dhënave në Corebit Studio.",
    lastUpdated: "Përditësimi i fundit: Korrik 2026",
    backBtn: "Kthehu në Fillim",
    sections: [
      {
        title: "1. Mbledhja e të Dhënave",
        text: "Kur përdorni formularin tonë për të na kontaktuar, ne kërkojmë Emrin tuaj të Plotë dhe Email-in e Korporatës për të trajtuar kërkesat tuaja."
      },
      {
        title: "2. Udhëzimet e GDPR",
        text: "Praktikat tona janë në përputhje me ligjin e Malit të Zi për Mbrojtjen e të Dhënave Personale dhe rregullat e GDPR-së të Bashkimit Evropian. Ne nuk i shesim të dhënat tuaja."
      },
      {
        title: "3. Të Drejtat Tuaja",
        text: "Ju keni të drejtë të plotë të kërkoni inspektimin, përditësimin ose fshirjen e plotë të të dhënave tuaja duke na shkruar në corebitstudio@corebitsystems.io."
      }
    ]
  }
};

export default function PrivacyPolicyPage({ params: { locale } }: { params: { locale: string } }) {
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
