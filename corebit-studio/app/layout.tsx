import "./globals.css";
import Header from "@/components/Header";
import DynamicBackground from "@/components/DynamicBackground";

export const metadata = {
  title: "Corebit Studio",
  description: "Мини-студия сайтов в Тивате",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen text-gray-900 relative overflow-hidden">
        {/* Динамичный фон */}
        <DynamicBackground />

        <div className="relative z-10 min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 p-8">{children}</main>
          <footer className="p-4 bg-white/10 text-center text-sm text-gray-700 shadow-inner backdrop-blur-md border-t border-white/20">
            © 2026 Corebit Studio — Все права защищены
          </footer>
        </div>
      </body>
    </html>
  );
}
