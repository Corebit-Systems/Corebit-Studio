"use client";

import Link from "next/link";
import { Caveat } from "next/font/google";

// Подключаем рукописный шрифт Caveat
const caveat = Caveat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
});

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 
                 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-between px-10 py-5"
    >
      {/* Название студии */}
      <h1 className={`${caveat.className} text-3xl font-bold text-purple-700 drop-shadow-sm`}>
        Corebit Studio
      </h1>

      {/* Навигация */}
      <nav className="flex gap-8 font-medium text-gray-900">
        <Link href="/services" className="hover:text-purple-600 transition-colors">Услуги</Link>
        <Link href="/projects" className="hover:text-blue-600 transition-colors">Проекты</Link>
        <Link href="/contacts" className="hover:text-teal-600 transition-colors">Контакты</Link>
        <Link href="/legal" className="hover:text-orange-500 transition-colors">Юридическая часть</Link>
      </nav>
    </header>
  );
}
