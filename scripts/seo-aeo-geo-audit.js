const assert = require('node:assert/strict');
const slugMap = require('../i18n/slug-map.json');

const origin = process.env.SEO_AUDIT_URL || 'http://localhost:3000';
const canonicalOrigin = 'https://studio.corebitsystems.io';
const languages = { en: 'en', ru: 'ru', cnr: 'sr-ME', srb: 'sr-RS', sq: 'sq-AL' };
const projects = ['cupertino-roast', 'shift-drive', 'umami-bistro', 'aura-wellness'];
const serviceIds = ['budva_restoran', 'podgorica_sto', 'budva_rent_a_car'];
const servicePaths = serviceIds.map(id => {
  const entry = slugMap.find(item => item.id === id);
  assert.ok(entry, `Missing localized slug entry for ${id}`);
  return locale => `/${locale}/${entry.slugs[locale]}`;
});

function tags(html, name) {
  const tagPattern = new RegExp(`<${name}\\b[^>]*>`, 'gi');
  return [...html.matchAll(tagPattern)].map(([tag]) => Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key.toLowerCase(), value]),
  ));
}

function structuredData(html) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(([, json]) => JSON.parse(json));
}

async function get(path) {
  return fetch(new URL(path, origin), { redirect: 'manual', signal: AbortSignal.timeout(25000) });
}

async function checkPage(path, locale, localizedPaths, type) {
  const response = await get(path);
  assert.equal(response.status, 200, `HTTP status for ${path}`);
  assert.doesNotMatch(response.headers.get('x-robots-tag') || '', /\bnoindex\b/i, path);
  const html = await response.text();
  const pageTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  assert.ok(pageTitle && pageTitle.includes('Corebit Studio'), `Missing title for ${path}`);
  assert.equal(tags(html, 'html')[0]?.lang, languages[locale], path);
  assert.equal(tags(html, 'h1').length, 1, path);
  const links = tags(html, 'link');
  assert.deepEqual(links.filter(link => link.rel === 'canonical').map(link => link.href), [canonicalOrigin + path], path);
  const alternates = Object.fromEntries(links.filter(link => link.rel === 'alternate' && link.hreflang).map(link => [link.hreflang, link.href]));
  for (const [language, tag] of Object.entries(languages)) {
    assert.equal(alternates[tag], canonicalOrigin + localizedPaths(language), path);
  }
  assert.equal(alternates['x-default'], canonicalOrigin + localizedPaths('en'), path);

  const schema = structuredData(html);
  assert.equal(schema.some(item => item.aggregateRating), false, path);
  if (type !== 'case') assert.ok(html.includes('id="faq"'), path);

  if (type === 'home') {
    const links = tags(html, 'a').map(link => link.href);
    for (const service of servicePaths) assert.ok(links.includes(service(locale)), path);
  }
  if (type === 'service') {
    assert.ok(html.includes('id="service-answer-title"'), path);
    assert.ok(schema.some(item => item['@type'] === 'Service' && item.url === canonicalOrigin + path), path);
  }
  if (type === 'case') {
    assert.ok(schema.some(item => item['@type'] === 'WebPage' && item.mainEntity?.['@type'] === 'CreativeWork'), path);
  }
  return path;
}

async function audit() {
  const robots = await get('/robots.txt');
  assert.equal(robots.status, 200);
  const rules = await robots.text();
  assert.doesNotMatch(rules, /Disallow:\s*\/_next\//i);
  assert.match(rules, /^User-agent: OAI-SearchBot$/im);
  assert.ok(rules.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));

  const sitemap = await get('/sitemap.xml');
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
  const expected = new Set(Object.keys(languages).flatMap(locale => [
    `${canonicalOrigin}/${locale}`,
    ...projects.map(project => `${canonicalOrigin}/${locale}/portfolio/${project}`),
    ...slugMap.flatMap(entry => entry.slugs[locale] ? [`${canonicalOrigin}/${locale}/${entry.slugs[locale]}`] : []),
  ]));
  assert.equal(urls.length, new Set(urls).size, 'Sitemap contains duplicate URLs');
  assert.deepEqual(new Set(urls), expected);

  const pageGroups = [
    [locale => `/${locale}`, 'home'],
    ...servicePaths.map(path => [path, 'service']),
    ...projects.map(project => [locale => `/${locale}/portfolio/${project}`, 'case']),
  ];
  for (const [paths, type] of pageGroups) {
    const results = await Promise.allSettled(Object.keys(languages).map(locale => checkPage(paths(locale), locale, paths, type)));
    const errors = results.filter(result => result.status === 'rejected').map(result => result.reason);
    if (errors.length) throw new AggregateError(errors, `Failed checks for ${type}`);
    console.log(`OK ${type}: ${results.map(result => result.value).join(', ')}`);
  }

  console.log(`Verified robots, ${urls.length} sitemap URLs and ${pageGroups.length * Object.keys(languages).length} localized pages.`);
}

audit().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
