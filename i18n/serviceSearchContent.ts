import type { Locale } from './getDictionary';
import slugMap from './slug-map.json';

export const serviceSearchIds = ['budva_restoran', 'podgorica_sto', 'budva_rent_a_car'] as const;
type ServiceId = (typeof serviceSearchIds)[number];
type ServiceCopy = [title: string, description: string, question: string, answer: string];

const copy: Record<Locale, { title: string; services: ServiceCopy[] }> = {
  ru: { title: 'Сайты для бизнеса в Черногории', services: [
    ['Сайт для ресторана в Будве', 'Меню для телефона, часы работы, карта и онлайн-заявки на бронирование столиков.', 'Как гости бронируют столик на сайте?', 'Гость выбирает дату, время и столик на плане зала. Менеджер видит заявку в кабинете и может управлять бронированиями и листом ожидания. План зала нужен, если вы хотите дать гостям выбор места.'],
    ['Сайт для автосервиса в Подгорице', 'Услуги, онлайн-запись на свободное время к механику и напоминания о визите.', 'Как автосервис принимает онлайн-запись?', 'Клиент выбирает услугу и свободное время. При настройке календаря важно учесть длительность работ и количество постов. Напоминания можно подключить, если они предусмотрены проектом.'],
    ['Сайт для проката авто в Будве', 'Каталог автомобилей, условия аренды и заявки с датами получения и возврата.', 'Какие данные нужны для заявки на аренду?', 'Укажите автомобиль, даты аренды и точки получения и возврата. Покажите условия депозита, страховки и доставки рядом с заявкой. Если парк ведётся в отдельной системе, возможность синхронизации проверим до оценки проекта.'],
  ] },
  en: { title: 'Business websites in Montenegro', services: [
    ['Restaurant websites in Budva', 'Mobile menus, opening hours, maps and online table reservation requests.', 'How do guests book a table on the site?', 'Guests choose a date, time and table on the floor plan. Staff can see requests in a dashboard and manage reservations and the waitlist. A floor plan is useful if you want to let guests pick a specific table.'],
    ['Auto repair websites in Podgorica', 'Service listings, online appointments with available mechanics and visit reminders.', 'How does online workshop scheduling work?', 'Customers choose a service and an available time. The calendar should account for service duration and workshop capacity. Reminders can be included in the project scope.'],
    ['Car rental websites in Budva', 'A vehicle catalogue, rental conditions and requests with pickup and return dates.', 'What should a rental inquiry include?', 'Ask for the vehicle, rental dates and pickup and return locations. Show deposit, insurance and delivery terms near the inquiry form. If you use fleet software, we review integration options before quoting.'],
  ] },
  cnr: { title: 'Sajtovi za firme u Crnoj Gori', services: [
    ['Izrada sajta za restoran u Budvi', 'Meni prilagođen telefonu, radno vrijeme, mapa i onlajn zahtjevi za rezervaciju stola.', 'Kako gosti rezervišu sto preko sajta?', 'Gost bira datum, termin i sto na planu sale. Osoblje vidi zahtjeve u panelu i može upravljati rezervacijama i listom čekanja. Plan sale je koristan ako gosti biraju konkretan sto.'],
    ['Izrada sajta za auto-servis u Podgorici', 'Spisak usluga, onlajn zakazivanje kod dostupnog mehaničara i podsjetnici za posjetu.', 'Kako radi onlajn zakazivanje u servisu?', 'Klijent bira uslugu i slobodan termin. Kalendar treba da uzme u obzir trajanje usluge i kapacitet servisa. Podsjetnici se mogu uključiti u obim projekta.'],
    ['Sajt za rent-a-car u Budvi', 'Katalog vozila, uslovi najma i upiti s datumima preuzimanja i vraćanja.', 'Šta treba da sadrži upit za najam?', 'Zatražite vozilo, datume i mjesta preuzimanja i vraćanja. Uz obrazac navedite uslove depozita, osiguranja i dostave. Ako koristite softver za vozni park, opcije povezivanja provjeravamo prije ponude.'],
  ] },
  srb: { title: 'Sajtovi za firme u Crnoj Gori', services: [
    ['Izrada sajta za restoran u Budvi', 'Meni prilagođen telefonu, radno vreme, mapa i onlajn zahtevi za rezervaciju stola.', 'Kako gosti rezervišu sto preko sajta?', 'Gost bira datum, termin i sto na planu sale. Osoblje vidi zahteve u panelu i može upravljati rezervacijama i listom čekanja. Plan sale je koristan ako gosti biraju konkretan sto.'],
    ['Izrada sajta za auto-servis u Podgorici', 'Spisak usluga, onlajn zakazivanje kod dostupnog mehaničara i podsetnici za posetu.', 'Kako radi onlajn zakazivanje u servisu?', 'Klijent bira uslugu i slobodan termin. Kalendar treba da uzme u obzir trajanje usluge i kapacitet servisa. Podsetnici se mogu uključiti u obim projekta.'],
    ['Sajt za rent-a-car u Budvi', 'Katalog vozila, uslovi najma i upiti s datumima preuzimanja i vraćanja.', 'Šta treba da sadrži upit za najam?', 'Zatražite vozilo, datume i mesta preuzimanja i vraćanja. Uz obrazac navedite uslove depozita, osiguranja i dostave. Ako koristite softver za vozni park, opcije povezivanja proveravamo pre ponude.'],
  ] },
  sq: { title: 'Faqe për bizneset në Mal të Zi', services: [
    ['Faqe për restorante në Budva', 'Menu për celular, orari, harta dhe kërkesa online për rezervimin e tavolinave.', 'Si rezervojnë mysafirët një tavolinë në faqe?', 'Mysafiri zgjedh datën, orën dhe tavolinën në planin e sallës. Stafi i sheh kërkesat në panel dhe mund të menaxhojë rezervimet dhe listën e pritjes. Plani shërben kur doni t’u ofroni mysafirëve zgjedhjen e tavolinës.'],
    ['Faqe për autoservise në Podgoricë', 'Lista e shërbimeve, rezervimi i orarit me mekanikun dhe kujtesa për vizitën.', 'Si caktohet një vizitë online?', 'Klienti zgjedh shërbimin dhe një orar të lirë. Kalendari duhet të marrë parasysh kohëzgjatjen e punëve dhe kapacitetin e servisit. Kujtesat mund të përfshihen në projekt.'],
    ['Faqe për makina me qira në Budva', 'Katalog automjetesh, kushtet e qirasë dhe kërkesa me datat e marrjes e të kthimit.', 'Çfarë duhet të përmbajë një kërkesë për qira?', 'Kërkoni automjetin, datat dhe vendet e marrjes e të kthimit. Vendosni kushtet e depozitës, sigurimit dhe dorëzimit pranë formularit. Nëse përdorni softuer për flotën, i shqyrtojmë mundësitë e integrimit para ofertës.'],
  ] },
};

export function getServiceSearchCopy(locale: Locale, id: string | undefined) {
  const index = serviceSearchIds.findIndex(service => service === id);
  return index < 0 ? undefined : copy[locale].services[index];
}

export function getServiceSearchLinks(locale: Locale) {
  const localized = copy[locale];
  return {
    title: localized.title,
    links: serviceSearchIds.flatMap((id, index) => {
      const slug = slugMap.find(entry => entry.id === id)?.slugs[locale];
      return slug ? [{ href: `/${locale}/${slug}`, title: localized.services[index][0] }] : [];
    }),
  };
}
