const fs = require('fs');
const path = require('path');

const locations = [
  'montenegro', 'serbia', 'albania', 'north_macedonia', 'bosnia_herzegovina', 'kosovo', 'greece', 'croatia', 'slovenia',
  'budva', 'tivat', 'podgorica', 'bar', 'kotor', 'herceg_novi', 'belgrade', 'novi_sad', 'nis', 'tirana', 'durres',
  'saranda', 'skopye', 'ohrid', 'sarajevo', 'mostar', 'trebinje', 'pristina', 'athens', 'thessaloniki', 'chalcidice',
  'zagreb', 'split', 'dubrovnik', 'ljubljana', 'maribor'
];

const services = ['rent-a-car', 'sto', 'restoran', 'salon'];

const serviceTranslationEn = {
  'rent-a-car': 'car-rental',
  'sto': 'auto-service',
  'restoran': 'restaurant',
  'salon': 'beauty-salon'
};

const serviceTranslationSq = {
  'rent-a-car': 'rent-a-car',
  'sto': 'auto-servis',
  'restoran': 'restorant',
  'salon': 'sallon-bukurie'
};

const slugMap = [];

locations.forEach((city) => {
  // 1. General city entry
  slugMap.push({
    id: city,
    slugs: {
      ru: city,
      en: city,
      cnr: city,
      srb: city,
      sq: city
    }
  });

  // 2. Niche city entries
  services.forEach((service) => {
    const serviceId = service.replace(/-/g, '_');
    slugMap.push({
      id: `${city}_${serviceId}`,
      slugs: {
        ru: `${service}-sajt-${city}`,
        en: `${serviceTranslationEn[service]}-website-${city}`,
        cnr: `${service}-sajt-${city}`,
        srb: `izrada-sajta-${service}-${city}`,
        sq: `webfaqe-${serviceTranslationSq[service]}-${city}`
      }
    });
  });
});

const outputDir = path.join(__dirname, '..', 'i18n');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'slug-map.json'),
  JSON.stringify(slugMap, null, 2),
  'utf-8'
);

console.log(`Generated slug-map.json with ${slugMap.length} entries.`);
