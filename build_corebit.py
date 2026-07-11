import os
import json

# Target Project Directory
BASE_DIR = r"C:\dev\Studio"

# Complete Project File Structure & Code
FILES = {
    "middleware.ts": """import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ru', 'cnr', 'srb', 'sq'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
""",

    "i18n/getDictionary.ts": """import 'server-only';

export type Locale = 'en' | 'ru' | 'cnr' | 'srb' | 'sq';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ru: () => import('./dictionaries/ru.json').then((module) => module.default),
  cnr: () => import('./dictionaries/cnr.json').then((module) => module.default),
  srb: () => import('./dictionaries/srb.json').then((module) => module.default),
  sq: () => import('./dictionaries/sq.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.en();
};
""",

    "app/[locale]/layout.tsx": """import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const SITE_URL = 'https://studio.corebitsystems.io';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    metadataBase: new URL(SITE_URL),
    title: 'Corebit Studio | Elite Frontend Architecture & Web Infrastructure',
    description: 'Premium software engineering, Next.js architecture, and fractional CTO services for high-end B2B clients.',
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        'en': `${SITE_URL}/en`,
        'ru': `${SITE_URL}/ru`,
        'cnr': `${SITE_URL}/cnr`,
        'srb': `${SITE_URL}/srb`,
        'sq': `${SITE_URL}/sq`,
      },
    },
    openGraph: {
      title: 'Corebit Studio',
      url: SITE_URL,
      siteName: 'Corebit Studio',
      locale: locale,
      type: 'website',
    },
  };
}

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Corebit Studio",
    "url": SITE_URL,
    "telephone": "068914816",
    "email": "corebitstudio@corebitsystems.io",
    "priceRange": "€2900 - €7500+",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tivat",
      "addressCountry": "ME"
    },
    "sameAs": ["https://wa.me/359882905657"]
  };

  return (
    <html lang={locale} className="dark scroll-smooth">
      <body className={`${inter.variable} bg-[#050506] text-white antialiased min-h-screen selection:bg-white/20 selection:text-white`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#050506] to-[#050506]"></div>
        <main className="relative z-10 flex flex-col items-center w-full overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
""",

    "app/[locale]/page.tsx": """import { getDictionary, Locale } from '../../i18n/getDictionary';
import BentoCard from '../../components/BentoCard';
import { Code2, Server, ShieldCheck, Zap, Phone, Mail, MessageCircle } from 'lucide-react';

export default async function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const dict = await getDictionary(locale);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 flex flex-col gap-32">
      <section className="flex flex-col items-center text-center gap-8 pt-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-neutral-300 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {dict.hero.badge}
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          {dict.hero.title}
        </h1>
        <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl leading-relaxed font-light">
          {dict.hero.subtitle}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BentoCard title="Edge Rendering" description="Ultra-fast Next.js deployments configured for global Vercel Edge Networks." icon={<Zap size={24} />} delay={0.1} className="md:col-span-2" />
        <BentoCard title="Security Hardening" description="Strict CSPs, middleware authentication, and DDoS mitigation." icon={<ShieldCheck size={24} />} delay={0.2} />
        <BentoCard title="Infrastructure as Code" description="Automated CI/CD pipelines and scalable cloud architecture." icon={<Server size={24} />} delay={0.3} />
        <BentoCard title="Custom Frontend" description="Bespoke React engineering with fluid Framer Motion physics." icon={<Code2 size={24} />} delay={0.4} className="md:col-span-2" />
      </section>

      <section className="flex flex-col items-center text-center gap-8 py-16 border-t border-white/10 mt-16">
        <h2 className="text-3xl font-bold">{dict.contact.title}</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <a href={`tel:${dict.contact.phone}`} className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all">
            <Phone className="text-neutral-400 group-hover:text-white transition-colors" size={20} />
            <span className="font-mono text-lg tracking-wider">{dict.contact.phone}</span>
          </a>
          <a href={`https://wa.me/${dict.contact.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all">
            <MessageCircle className="text-neutral-400 group-hover:text-emerald-400 transition-colors" size={20} />
            <span className="font-mono text-lg tracking-wider">{dict.contact.whatsapp}</span>
          </a>
          <a href={`mailto:${dict.contact.email}`} className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all">
            <Mail className="text-neutral-400 group-hover:text-white transition-colors" size={20} />
            <span className="font-mono text-lg tracking-wider">{dict.contact.email}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
""",

    "components/BentoCard.tsx": """'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface BentoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function BentoCard({ title, description, icon, className = '', delay = 0 }: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-8 flex flex-col gap-4 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div style={{ transform: "translateZ(30px)" }} className="flex flex-col gap-3">
        <div className="p-3 bg-white/5 rounded-2xl w-fit border border-white/10 text-neutral-300">{icon}</div>
        <h3 className="text-xl font-semibold tracking-tight text-white">{title}</h3>
        <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
""",

    "app/globals.css": """@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
  }
}
""",

    "tailwind.config.ts": """import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
""",

    "tsconfig.json": """{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
""",

    "package.json": """{
  "name": "corebit-studio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.350.0",
    "next": "14.1.0",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
""",

    "postcss.config.js": """module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
""",

    "next.config.mjs": """/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
"""
}

# Base Dictionary Content
DICTIONARY_JSON = {
    "hero": {
        "badge": "Accepting New Enterprise Clients",
        "title": "Corebit Studio",
        "subtitle": "Elite frontend architecture, extreme Vercel optimizations, and scalable web infrastructure for high-end B2B entities."
    },
    "contact": {
        "title": "Establish Secure Connection",
        "phone": "068914816",
        "whatsapp": "+359882905657",
        "email": "corebitstudio@corebitsystems.io"
    }
}

# Add dictionaries to FILES
locales = ['en', 'ru', 'cnr', 'srb', 'sq']
for loc in locales:
    FILES[f"i18n/dictionaries/{loc}.json"] = json.dumps(DICTIONARY_JSON, indent=2)

def generate_project():
    print(f"🚀 Initializing Corebit Studio architecture at: {BASE_DIR}")
    
    if not os.path.exists(BASE_DIR):
        os.makedirs(BASE_DIR)

    for filepath, content in FILES.items():
        full_path = os.path.join(BASE_DIR, filepath.replace('/', os.sep))
        
        # Ensure parent directories exist
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        # Write the file
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Created: {filepath}")

    print("\n🎉 Architecture successfully generated!")
    print("=============================================")
    print("Next Steps:")
    print(f"1. Open Terminal and run: cd {BASE_DIR}")
    print(f"2. Run: npm install")
    print(f"3. Run: npm run dev")
    print("=============================================")

if __name__ == "__main__":
    generate_project()