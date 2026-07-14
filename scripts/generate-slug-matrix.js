// File: C:\dev\Corebit-Studio\scripts\generate-slug-matrix.js
const fs = require('fs');
const path = require('path');

const locations = [
  'montenegro', 'serbia', 'albania', 'north_macedonia', 'bosnia_herzegovina', 'kosovo', 'greece', 'croatia', 'slovenia',
  'budva', 'tivat', 'podgorica', 'bar', 'kotor', 'herceg_novi', 'belgrade', 'novi_sad', 'nis', 'tirana', 'durres',
  'saranda', 'skopye', 'ohrid', 'sarajevo', 'mostar', 'trebinje', 'pristina', 'athens', 'thessaloniki', 'chalcidice',
  'zagreb', 'split', 'dubrovnik', 'ljubljana', 'maribor'
];

const niches = [
  'rent-a-car', 'sto', 'restoran', 'salon', 'nekretnine', 'hoteli', 'charter', 'klinike', 'ciscenje', 'transferi'
];

const patterns = {
  "rent-a-car": {
    ru: "rent-a-car-sajt-montenegro",
    en: "car-rental-website-montenegro",
    cnr: "rent-a-car-sajt-montenegro",
    srb: "izrada-sajta-rent-a-car-montenegro",
    sq: "webfaqe-rent-a-car-montenegro"
  },
  "sto": {
    ru: "sto-sajt-montenegro",
    en: "auto-service-website-montenegro",
    cnr: "sto-sajt-montenegro",
    srb: "izrada-sajta-sto-montenegro",
    sq: "webfaqe-auto-servis-montenegro"
  },
  "restoran": {
    ru: "restoran-sajt-montenegro",
    en: "restaurant-website-montenegro",
    cnr: "restoran-sajt-montenegro",
    srb: "izrada-sajta-restoran-montenegro",
    sq: "webfaqe-restorant-montenegro"
  },
  "salon": {
    ru: "salon-sajt-montenegro",
    en: "beauty-salon-website-montenegro",
    cnr: "salon-sajt-montenegro",
    srb: "izrada-sajta-salon-montenegro",
    sq: "webfaqe-sallon-bukurie-montenegro"
  },
  "nekretnine": {
    ru: "sajt-nedvizhimosti-montenegro",
    en: "real-estate-website-montenegro",
    cnr: "izrada-sajta-za-nekretnine-montenegro",
    srb: "izrada-sajta-za-nekretnine-montenegro",
    sq: "webfaqe-per-agjentsi-imobiliare-montenegro"
  },
  "hoteli": {
    ru: "sajt-dlya-otelya-montenegro",
    en: "hotel-website-montenegro",
    cnr: "izrada-sajta-za-hotele-montenegro",
    srb: "izrada-sajta-za-hotele-montenegro",
    sq: "webfaqe-per-hotele-montenegro"
  },
  "charter": {
    ru: "arenda-yaht-sajt-montenegro",
    en: "yacht-charter-website-montenegro",
    cnr: "izrada-sajta-za-iznajmljivanje-jahti-montenegro",
    srb: "izrada-sajta-za-iznajmljivanje-jahti-montenegro",
    sq: "webfaqe-per-rent-a-jaht-montenegro"
  },
  "klinike": {
    ru: "sajt-stomatologii-montenegro",
    en: "medical-clinic-website-montenegro",
    cnr: "izrada-sajta-za-stomatologiju-montenegro",
    srb: "izrada-sajta-za-stomatologiju-montenegro",
    sq: "webfaqe-per-klinika-montenegro"
  },
  "ciscenje": {
    ru: "sajt-klininga-montenegro",
    en: "cleaning-services-website-montenegro",
    cnr: "izrada-sajta-za-usluge-ciscenja-montenegro",
    srb: "izrada-sajta-za-usluge-ciscenja-montenegro",
    sq: "webfaqe-per-sherbime-pastrimi-montenegro"
  },
  "transferi": {
    ru: "sajt-transfera-montenegro",
    en: "airport-transfer-website-montenegro",
    cnr: "izrada-sajta-za-transfere-montenegro",
    srb: "izrada-sajta-za-transfere-montenegro",
    sq: "webfaqe-per-transferta-montenegro"
  }
};

const locales = ['ru', 'en', 'cnr', 'srb', 'sq'];

const result = [];

for (const city of locations) {
  // 1. General GEO page
  const geoEntry = {
    id: city,
    slugs: {}
  };
  for (const locale of locales) {
    geoEntry.slugs[locale] = city;
  }
  result.push(geoEntry);

  // 2. Specialized Niche pages
  for (const niche of niches) {
    const nicheEntry = {
      id: `${city}_${niche.replace(/-/g, '_')}`,
      slugs: {}
    };
    for (const locale of locales) {
      const pattern = patterns[niche][locale];
      nicheEntry.slugs[locale] = pattern.replace(/montenegro/g, city);
    }
    result.push(nicheEntry);
  }
}

const outputPath = path.join(__dirname, '..', 'i18n', 'slug-map.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');

console.log(`Successfully generated ${result.length} ID-groups in slug-map.json!`);
console.log(`With 5 languages, Next.js will build ${result.length * 5} unique paths.`);
