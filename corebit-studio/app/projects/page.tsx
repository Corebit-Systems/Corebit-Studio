import { getDictionary } from "@/dictionaries";
import Card from "@/components/Card";

export default function ProjectsPage() {
  const dict = getDictionary("ru");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">{dict.projects_title}</h1>
      <p className="text-lg text-gray-800">
        Здесь представлены проекты Corebit Studio — демо‑кейсы и внутренние разработки.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Corebit Messenger" accent="indigo">
          Внутренний проект по созданию современного мессенджера с использованием
          Next.js, Tailwind и Strapi. Поддержка мультиязычности и параллакс‑эффектов.
        </Card>

        <Card title="Landing для кафе" accent="coral">
          Одностраничный сайт с меню, онлайн‑заказами и интеграцией соцсетей.
          Оптимизирован под SEO и мобильные устройства.
        </Card>

        <Card title="Сайт для СТО" accent="mint">
          Платформа для записи на услуги, карта расположения и отзывы клиентов.
          Простая архитектура и удобный интерфейс.
        </Card>

        <Card title="Corebit Studio Demo" accent="indigo">
          Демонстрационный сайт для презентации услуг студии, с мультиязычным
          контентом и строгой типизацией словарей.
        </Card>
      </div>
    </div>
  );
}
