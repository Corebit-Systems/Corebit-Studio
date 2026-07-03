import { getDictionary } from "@/dictionaries";

export default function Page() {
  // пока жёстко используем "ru", позже подключим динамический выбор языка
  const dict = getDictionary("ru");

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">{dict.services_title}</h1>
      <p className="mb-6">
        Corebit Studio предлагает создание сайтов для кафе, ресторанов, СТО и
        малого бизнеса. Мы обеспечиваем SEO‑оптимизацию, поддержку и хостинг.
      </p>

      <section className="space-y-4">
        <div className="p-4 border rounded bg-white shadow">
          <h2 className="text-xl font-semibold">Сайты для кафе и ресторанов</h2>
          <p>Адаптивные сайты с меню, онлайн‑заказами и интеграцией соцсетей.</p>
        </div>

        <div className="p-4 border rounded bg-white shadow">
          <h2 className="text-xl font-semibold">Сайты для СТО</h2>
          <p>Простая запись на услуги, карта расположения и отзывы клиентов.</p>
        </div>

        <div className="p-4 border rounded bg-white shadow">
          <h2 className="text-xl font-semibold">Лендинги</h2>
          <p>Быстрые одностраничные решения для акций и продвижения.</p>
        </div>

        <div className="p-4 border rounded bg-white shadow">
          <h2 className="text-xl font-semibold">SEO и поддержка</h2>
          <p>
            Оптимизация для поисковиков, регулярные обновления и техническая
            поддержка.
          </p>
        </div>
      </section>
    </main>
  );
}
