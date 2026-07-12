const fs = require('fs');
const path = require('path');

const locales = ['ru', 'en', 'cnr', 'srb', 'sq'];

const privacySection5 = {
  en: {
    title: "5. Data Processors, Data Retention, and Right to be Forgotten",
    text: "We engage third-party data processors to facilitate our communications: (a) Meta Platforms Ireland Ltd. (data transfer via WhatsApp forms to US servers based on Standard Contractual Clauses - SCC). (b) Telegram FZ-LLC (data transfer via bots/forms in UAE, processing of personal data outside the EEA based on explicit user consent when clicking deep links). The data retention period for lead information is strictly limited to 12 months from the moment of the last contact, after which all personal files are permanently deleted. Users retain their right to erasure ('Right to be Forgotten') and can request absolute removal of their personal data from our databases at any time by contacting our data protection officer."
  },
  ru: {
    title: "5. Обработчики данных, сроки хранения и Право на забвение",
    text: "Мы привлекаем сторонних обработчиков данных для обеспечения коммуникации: (а) Meta Platforms Ireland Ltd. (передача данных через WhatsApp-формы на серверы в США в соответствии со Стандартными договорными условиями - SCC). (б) Telegram FZ-LLC (передача данных через ботов/формы в ОАЭ, обработка данных вне ЕЭЗ на основании согласия пользователя при клике на deep-link). Срок хранения полученных лидов (Data Retention Period) составляет 12 месяцев с момента последнего контакта, после чего все персональные данные безвозвратно удаляются. Пользователи сохраняют свое право на удаление («Право на забвение») и могут потребовать полного уничтожения своих персональных данных из наших баз данных в любое время, направив запрос нашему специалисту по защите данных."
  },
  cnr: {
    title: "5. Obrađivači podataka, period čuvanja i Pravo na zaborav",
    text: "Angažujemo eksterne obrađivače podataka radi olakšavanja komunikacije: (a) Meta Platforms Ireland Ltd. (prenos podataka putem WhatsApp formi na servere u SAD-u na osnovu Standardnih ugovornih klauzula - SCC). (b) Telegram FZ-LLC (prenos podataka putem botova/formi u UAE, obrada podataka van Evropskog ekonomskog prostora - EEP na osnovu saglasnosti korisnika klikom na deep-link). Period čuvanja podataka o potencijalnim klijentima (Data Retention Period) je ograničen na 12 mjeseci od posljednjeg kontakta, nakon čega se svi lični podaci trajno brišu. Korisnici zadržavaju svoje pravo na brisanje („Pravo na zaborav“) i mogu zatražiti trajno uklanjanje svojih ličnih podataka iz naših baza podataka u bilo kom trenutku slanjem zahtjeva našem službeniku za zaštitu podataka."
  },
  srb: {
    title: "5. Obrađivači podataka, period čuvanja i Pravo na zaborav",
    text: "Angažujemo eksterne obrađivače podataka radi olakšavanja komunikacije: (a) Meta Platforms Ireland Ltd. (prenos podataka putem WhatsApp formi na servere u SAD-u na osnovu Standardnih ugovornih klauzula - SCC). (b) Telegram FZ-LLC (prenos podataka putem botova/formi u UAE, obrada podataka van Evropskog ekonomskog prostora - EEP na osnovu saglasnosti korisnika klikom na deep-link). Period čuvanja podataka o potencijalnim klijentima (Data Retention Period) je ograničen na 12 meseci od poslednjeg kontakta, nakon čega se svi lični podaci trajno brišu. Korisnici zadržavaju svoje pravo na brisanje („Pravo na zaborav“) i mogu zatražiti trajno uklanjanje svojih ličnih podataka iz naših baza podataka u bilo kom trenutku slanjem zahteva našem službeniku za zaštitu podataka."
  },
  sq: {
    title: "5. Përpunuesit e të Dhënave, Periudha e Ruajtjes dhe E Drejta për t'u Harruar",
    text: "Ne angazhojmë përpunues të palëve të treta për të lehtësuar komunikimin: (a) Meta Platforms Ireland Ltd. (transferimi i të dhënave përmes formave të WhatsApp në serverët në SHBA bazuar në Klauzolat Kontraktuale Standarde - SCC). (b) Telegram FZ-LLC (transferimi i të dhënave përmes botëve/formave në Emiratet e Bashkuara Arabe, përpunimi i të dhënave jashtë ZEE-së bazuar në pëlqimin e përdoruesit kur klikon në deep-link). Periudha e ruajtjes së të dhënave për klientët potencialë (Data Retention Period) është e kufizuar në 12 muaj nga kontakti i fundit, pas së cilës të gjitha të dhënat personale fshihen përgjithmonë. Përdoruesit gëzojnë të drejtën e tyre për fshirje («E drejta për t'u harruar») dhe mund të kërkojnë heqjen e plotë të të dhënave të tyre personale nga bazat tona të të dhënave në çdo kohë duke kontaktuar zyrtarin tonë për mbrojtjen e të dhënave."
  }
};

const dictionariesDir = path.join(__dirname, '..', 'i18n', 'dictionaries');
const outputBaseDir = path.join(__dirname, '..', 'content', 'legal');

// Ensure output directories exist
['privacy', 'cookie', 'terms'].forEach(sub => {
  fs.mkdirSync(path.join(outputBaseDir, sub), { recursive: true });
});

locales.forEach((locale) => {
  const dictPath = path.join(dictionariesDir, `${locale}.json`);
  if (!fs.existsSync(dictPath)) {
    console.error(`File not found: ${dictPath}`);
    return;
  }

  const dictContent = JSON.parse(fs.readFileSync(dictPath, 'utf-8'));
  const policies = dictContent.policies;
  
  if (!policies) {
    console.warn(`No policies found in dictionary for locale ${locale}`);
    return;
  }

  // 1. Extract policy structures
  const privacyPolicy = policies.privacy_policy;
  const cookiePolicy = policies.cookie_policy;
  const termsOfService = policies.terms_of_service;

  // 2. Inject GDPR Section 5 in privacy policy
  if (privacyPolicy && privacyPolicy.sections) {
    // Check if section 5 already exists to prevent duplicate injection
    const exists = privacyPolicy.sections.some(sec => sec.title.startsWith('5.') || sec.title.includes('Data Processors') || sec.title.includes('Обработчики'));
    if (!exists) {
      privacyPolicy.sections.push(privacySection5[locale]);
      console.log(`Injected GDPR Section 5 to privacy policy for ${locale}`);
    }
  }

  // 3. Write policy content files
  if (privacyPolicy) {
    fs.writeFileSync(
      path.join(outputBaseDir, 'privacy', `${locale}.json`),
      JSON.stringify(privacyPolicy, null, 2),
      'utf-8'
    );
  }
  if (cookiePolicy) {
    fs.writeFileSync(
      path.join(outputBaseDir, 'cookie', `${locale}.json`),
      JSON.stringify(cookiePolicy, null, 2),
      'utf-8'
    );
  }
  if (termsOfService) {
    fs.writeFileSync(
      path.join(outputBaseDir, 'terms', `${locale}.json`),
      JSON.stringify(termsOfService, null, 2),
      'utf-8'
    );
  }

  // 4. Update the dictionary in-place by removing large objects
  dictContent.policies = {
    privacy_title: policies.privacy_title,
    cookie_title: policies.cookie_title,
    terms_title: policies.terms_title,
    back_btn: policies.back_btn
  };

  fs.writeFileSync(dictPath, JSON.stringify(dictContent, null, 2), 'utf-8');
  console.log(`Successfully split and cleaned ${locale}.json`);
});

console.log('Extraction complete.');
