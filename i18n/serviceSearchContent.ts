import type { Locale } from './getDictionary';
import slugMap from './slug-map.json';
import type { ProjectReferenceId } from '@/components/projectReference';

export const serviceSearchIds = ['budva_restoran', 'podgorica_sto', 'budva_rent_a_car', 'tivat'] as const;
type ServiceId = (typeof serviceSearchIds)[number];
type ServiceCopy = [title: string, description: string, question: string, answer: string];

const serviceByProject: Partial<Record<ProjectReferenceId, ServiceId>> = {
  'umami-bistro': 'budva_restoran',
  'shift-drive': 'podgorica_sto',
};

const copy: Record<Locale, { title: string; services: Record<ServiceId, ServiceCopy> }> = {
  ru: { title: 'Сайты для бизнеса в Черногории', services: {
    budva_restoran: ['Сайт для ресторана в Будве', 'Меню для телефона, часы работы, карта и онлайн-заявки на бронирование столиков.', 'Как гости бронируют столик на сайте?', 'Гость выбирает дату, время и столик на плане зала. Менеджер видит заявку в кабинете и может управлять бронированиями и листом ожидания. План зала нужен, если вы хотите дать гостям выбор места.'],
    podgorica_sto: ['Сайт для автосервиса в Подгорице', 'Услуги, онлайн-запись на свободное время к механику и напоминания о визите.', 'Как автосервис принимает онлайн-запись?', 'Клиент выбирает услугу и свободное время. При настройке календаря важно учесть длительность работ и количество постов. Напоминания можно подключить, если они предусмотрены проектом.'],
    budva_rent_a_car: ['Сайт для проката авто в Будве', 'Каталог автомобилей, условия аренды и заявки с датами получения и возврата.', 'Какие данные нужны для заявки на аренду?', 'Укажите автомобиль, даты аренды и точки получения и возврата. Покажите условия депозита, страховки и доставки рядом с заявкой. Если парк ведётся в отдельной системе, возможность синхронизации проверим до оценки проекта.'],
    tivat: ['Разработка сайтов в Тивате', 'Corebit Studio — веб-студия в Тивате. Создаём сайты для бизнеса и подключаем онлайн-бронирование, запись и уведомления.', 'Как мы начинаем работу над сайтом?', 'Обсуждаем, что посетитель должен сделать на сайте, какие языки нужны и кто в команде будет отвечать на заявки. Если нужна онлайн-запись, заранее согласуем, какие брони подтверждаются автоматически, а какие проверяет сотрудник. Объём работ, сроки и цену фиксируем в договоре.'],
  } },
  en: { title: 'Business websites in Montenegro', services: {
    budva_restoran: ['Restaurant websites in Budva', 'Mobile menus, opening hours, maps and online table reservation requests.', 'How do guests book a table on the site?', 'Guests choose a date, time and table on the floor plan. Staff can see requests in a dashboard and manage reservations and the waitlist. A floor plan is useful if you want to let guests pick a specific table.'],
    podgorica_sto: ['Auto repair websites in Podgorica', 'Service listings, online appointments with available mechanics and visit reminders.', 'How does online workshop scheduling work?', 'Customers choose a service and an available time. The calendar should account for service duration and workshop capacity. Reminders can be included in the project scope.'],
    budva_rent_a_car: ['Car rental websites in Budva', 'A vehicle catalogue, rental conditions and requests with pickup and return dates.', 'What should a rental inquiry include?', 'Ask for the vehicle, rental dates and pickup and return locations. Show deposit, insurance and delivery terms near the inquiry form. If you use fleet software, we review integration options before quoting.'],
    tivat: ['Web development in Tivat', 'Corebit Studio is a web studio in Tivat, Montenegro. We build business websites and integrate online booking, appointments and notifications.', 'How do we start a website project?', 'We discuss what visitors need to do on the site, which languages to support and who on your team will handle enquiries. For online booking, we agree which reservations can be confirmed automatically and which your team should review. We put the scope, timeline and price in the contract.'],
  } },
  cnr: { title: 'Sajtovi za firme u Crnoj Gori', services: {
    budva_restoran: ['Izrada sajta za restoran u Budvi', 'Meni prilagođen telefonu, radno vrijeme, mapa i onlajn zahtjevi za rezervaciju stola.', 'Kako gosti rezervišu sto preko sajta?', 'Gost bira datum, termin i sto na planu sale. Osoblje vidi zahtjeve u panelu i može upravljati rezervacijama i listom čekanja. Plan sale je koristan ako gosti biraju konkretan sto.'],
    podgorica_sto: ['Izrada sajta za auto-servis u Podgorici', 'Spisak usluga, onlajn zakazivanje kod dostupnog mehaničara i podsjetnici za posjetu.', 'Kako radi onlajn zakazivanje u servisu?', 'Klijent bira uslugu i slobodan termin. Kalendar treba da uzme u obzir trajanje usluge i kapacitet servisa. Podsjetnici se mogu uključiti u obim projekta.'],
    budva_rent_a_car: ['Sajt za rent-a-car u Budvi', 'Katalog vozila, uslovi najma i upiti s datumima preuzimanja i vraćanja.', 'Šta treba da sadrži upit za najam?', 'Zatražite vozilo, datume i mjesta preuzimanja i vraćanja. Uz obrazac navedite uslove depozita, osiguranja i dostave. Ako koristite softver za vozni park, opcije povezivanja provjeravamo prije ponude.'],
    tivat: ['Izrada sajtova u Tivtu', 'Corebit Studio je veb studio u Tivtu. Pravimo poslovne sajtove i povezujemo onlajn rezervacije, zakazivanje i obavještenja.', 'Kako započinjemo izradu sajta?', 'Razgovaramo o tome šta posjetioci treba da urade na sajtu, koji su jezici potrebni i ko u vašem timu odgovara na upite. Za onlajn rezervacije dogovaramo šta se potvrđuje automatski, a šta provjerava osoblje. Ugovorom utvrđujemo obim posla, rokove i cijenu.'],
  } },
  srb: { title: 'Sajtovi za firme u Crnoj Gori', services: {
    budva_restoran: ['Izrada sajta za restoran u Budvi', 'Meni prilagođen telefonu, radno vreme, mapa i onlajn zahtevi za rezervaciju stola.', 'Kako gosti rezervišu sto preko sajta?', 'Gost bira datum, termin i sto na planu sale. Osoblje vidi zahteve u panelu i može upravljati rezervacijama i listom čekanja. Plan sale je koristan ako gosti biraju konkretan sto.'],
    podgorica_sto: ['Izrada sajta za auto-servis u Podgorici', 'Spisak usluga, onlajn zakazivanje kod dostupnog mehaničara i podsetnici za posetu.', 'Kako radi onlajn zakazivanje u servisu?', 'Klijent bira uslugu i slobodan termin. Kalendar treba da uzme u obzir trajanje usluge i kapacitet servisa. Podsetnici se mogu uključiti u obim projekta.'],
    budva_rent_a_car: ['Sajt za rent-a-car u Budvi', 'Katalog vozila, uslovi najma i upiti s datumima preuzimanja i vraćanja.', 'Šta treba da sadrži upit za najam?', 'Zatražite vozilo, datume i mesta preuzimanja i vraćanja. Uz obrazac navedite uslove depozita, osiguranja i dostave. Ako koristite softver za vozni park, opcije povezivanja proveravamo pre ponude.'],
    tivat: ['Izrada sajtova u Tivtu', 'Corebit Studio je veb studio u Tivtu. Pravimo poslovne sajtove i povezujemo onlajn rezervacije, zakazivanje i obaveštenja.', 'Kako započinjemo izradu sajta?', 'Razgovaramo o tome šta posetioci treba da urade na sajtu, koji su jezici potrebni i ko u vašem timu odgovara na upite. Za onlajn rezervacije dogovaramo šta se potvrđuje automatski, a šta proverava osoblje. Ugovorom utvrđujemo obim posla, rokove i cenu.'],
  } },
  sq: { title: 'Faqe për bizneset në Mal të Zi', services: {
    budva_restoran: ['Faqe për restorante në Budva', 'Menu për celular, orari, harta dhe kërkesa online për rezervimin e tavolinave.', 'Si rezervojnë mysafirët një tavolinë në faqe?', 'Mysafiri zgjedh datën, orën dhe tavolinën në planin e sallës. Stafi i sheh kërkesat në panel dhe mund të menaxhojë rezervimet dhe listën e pritjes. Plani shërben kur doni t’u ofroni mysafirëve zgjedhjen e tavolinës.'],
    podgorica_sto: ['Faqe për autoservise në Podgoricë', 'Lista e shërbimeve, rezervimi i orarit me mekanikun dhe kujtesa për vizitën.', 'Si caktohet një vizitë online?', 'Klienti zgjedh shërbimin dhe një orar të lirë. Kalendari duhet të marrë parasysh kohëzgjatjen e punëve dhe kapacitetin e servisit. Kujtesat mund të përfshihen në projekt.'],
    budva_rent_a_car: ['Faqe për makina me qira në Budva', 'Katalog automjetesh, kushtet e qirasë dhe kërkesa me datat e marrjes e të kthimit.', 'Çfarë duhet të përmbajë një kërkesë për qira?', 'Kërkoni automjetin, datat dhe vendet e marrjes e të kthimit. Vendosni kushtet e depozitës, sigurimit dhe dorëzimit pranë formularit. Nëse përdorni softuer për flotën, i shqyrtojmë mundësitë e integrimit para ofertës.'],
    tivat: ['Zhvillim faqesh interneti në Tivat', 'Corebit Studio është një studio uebi në Tivat, Mal i Zi. Krijojmë faqe për biznese dhe integrojmë rezervime online, caktim takimesh dhe njoftime.', 'Si e nisim punën për një faqe interneti?', 'Diskutojmë çfarë duhet të bëjnë vizitorët në faqe, cilat gjuhë duhen dhe kush në ekipin tuaj do t’u përgjigjet kërkesave. Për rezervimet online, përcaktojmë bashkë cilat konfirmohen automatikisht dhe cilat i shqyrton stafi. Punët, afatet dhe çmimin i përcaktojmë në kontratë.'],
  } },
};

const quoteBrief: Record<Locale, { title: string; byService: Record<ServiceId, string> }> = {
  ru: {
    title: 'Что прислать для расчёта стоимости',
    byService: {
      budva_restoran: 'Пришлите ссылку на меню, список языков сайта и часы приёма брони. Если гости должны выбирать столик, добавьте ссылку на схему зала. Уточните, какие заявки ресторан подтверждает вручную и когда бронирование закрывается.',
      podgorica_sto: 'Пришлите список работ, их примерную длительность и количество постов. Уточните, на какие услуги клиент может записаться сразу, а где сначала нужна диагностика или звонок мастера.',
      budva_rent_a_car: 'Пришлите список машин, правила расчёта цены и точки выдачи. Уточните, где сейчас хранится информация о занятости парка и должна ли форма сразу подтверждать бронь или отправлять запрос менеджеру.',
      tivat: 'Расскажите о бизнесе, перечислите нужные языки и опишите, как вы сейчас принимаете заявки. Если сайт уже есть, пришлите ссылку и укажите, какие страницы, формы и подключения нужно перенести.',
    },
  },
  en: {
    title: 'What to send for a quote',
    byService: {
      budva_restoran: 'Send a menu link, site languages and reservation hours. Add a link to the floor plan if guests should choose their table. Tell us which requests staff need to approve and when bookings should close.',
      podgorica_sto: 'Send your service list, estimated job durations and number of workshop bays. Tell us which jobs customers can book directly and which need an inspection or a call first.',
      budva_rent_a_car: 'Send your fleet list, pricing rules and pickup locations. Tell us where you track availability and whether the site should confirm bookings immediately or send requests to staff for review.',
      tivat: 'Tell us what your business does, which languages you need and how you handle enquiries today. If you already have a site, share the link and tell us which pages, forms and integrations need to carry over.',
    },
  },
  cnr: {
    title: 'Šta poslati za procjenu cijene',
    byService: {
      budva_restoran: 'Pošaljite link do menija, jezike sajta i vrijeme kada primate rezervacije. Dodajte link do plana sale ako gosti biraju sto. Navedite koje zahtjeve osoblje potvrđuje i kada se zatvara prijem rezervacija.',
      podgorica_sto: 'Pošaljite spisak usluga, okvirno trajanje radova i broj servisnih mjesta. Navedite šta klijenti mogu odmah zakazati, a za šta je prvo potreban pregled ili poziv majstoru.',
      budva_rent_a_car: 'Pošaljite spisak vozila, pravila obračuna cijene i mjesta preuzimanja. Recite nam gdje vodite evidenciju dostupnosti i da li sajt odmah potvrđuje rezervaciju ili šalje upit osoblju.',
      tivat: 'Opišite čime se bavite, koji su vam jezici potrebni i kako sada primate upite. Ako imate sajt, pošaljite link i navedite koje stranice, obrasce i integracije treba prenijeti.',
    },
  },
  srb: {
    title: 'Šta poslati za procenu cene',
    byService: {
      budva_restoran: 'Pošaljite link do menija, jezike sajta i vreme kada primate rezervacije. Dodajte link do plana sale ako gosti biraju sto. Navedite koje zahteve osoblje potvrđuje i kada se zatvara prijem rezervacija.',
      podgorica_sto: 'Pošaljite spisak usluga, okvirno trajanje radova i broj servisnih mesta. Navedite šta klijenti mogu odmah da zakažu, a za šta je prvo potreban pregled ili poziv majstoru.',
      budva_rent_a_car: 'Pošaljite spisak vozila, pravila obračuna cene i mesta preuzimanja. Recite nam gde vodite evidenciju dostupnosti i da li sajt odmah potvrđuje rezervaciju ili šalje zahtev osoblju.',
      tivat: 'Opišite čime se bavite, koji su vam jezici potrebni i kako sada primate upite. Ako imate sajt, pošaljite link i navedite koje stranice, obrasce i integracije treba preneti.',
    },
  },
  sq: {
    title: 'Çfarë të dërgoni për një ofertë',
    byService: {
      budva_restoran: 'Dërgoni lidhjen e menusë, gjuhët e faqes dhe orarin e rezervimeve. Shtoni një lidhje me planin e sallës nëse mysafirët mund të zgjedhin tavolinën. Tregoni cilat kërkesa konfirmon stafi dhe kur mbyllen rezervimet.',
      podgorica_sto: 'Dërgoni listën e shërbimeve, kohëzgjatjen e përafërt të punëve dhe numrin e vendeve të punës në servis. Tregoni cilat shërbime rezervohen menjëherë dhe cilat kërkojnë kontroll ose telefonatë paraprake.',
      budva_rent_a_car: 'Dërgoni listën e automjeteve, rregullat e çmimeve dhe pikat e marrjes. Tregoni ku e regjistroni disponueshmërinë dhe nëse faqja duhet të konfirmojë rezervimin menjëherë apo t’ia dërgojë kërkesën stafit.',
      tivat: 'Na tregoni çfarë bën biznesi juaj, cilat gjuhë ju duhen dhe si i merrni kërkesat sot. Nëse keni tashmë një faqe, na dërgoni lidhjen dhe tregoni cilat faqe, formularë dhe integrime duhen ruajtur.',
    },
  },
};

export function getServiceSearchCopy(locale: Locale, id: string | undefined) {
  const serviceId = serviceSearchIds.find(service => service === id);
  if (!serviceId) return undefined;

  const [title, description, question, answer] = copy[locale].services[serviceId];
  const brief = quoteBrief[locale];
  return { title, description, question, answer, briefTitle: brief.title, brief: brief.byService[serviceId] };
}

export function getServiceSearchLinks(locale: Locale) {
  return {
    title: copy[locale].title,
    links: serviceSearchIds.flatMap(id => {
      const link = getServiceSearchLink(locale, id);
      return link ? [link] : [];
    }),
  };
}

function getServiceSearchLink(locale: Locale, id: ServiceId) {
  const slug = slugMap.find(entry => entry.id === id)?.slugs[locale];
  if (!slug) return undefined;
  return { href: `/${locale}/${slug}`, title: copy[locale].services[id][0] };
}

export function getProjectServiceLink(locale: Locale, project: ProjectReferenceId) {
  const id = serviceByProject[project];
  return id ? getServiceSearchLink(locale, id) : undefined;
}
