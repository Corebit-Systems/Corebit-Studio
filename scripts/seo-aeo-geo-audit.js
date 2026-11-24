const assert = require('node:assert/strict');
const slugMap = require('../i18n/slug-map.json');

const origin = process.env.SEO_AUDIT_URL || 'http://localhost:3000';
const fullAudit = process.argv.includes('--full');
const canonicalOrigin = 'https://studio.corebitsystems.io';
const organizationId = `${canonicalOrigin}/#organization`;
const websiteId = `${canonicalOrigin}/#website`;
const logoPath = '/apple-icon.png';
const languages = { en: 'en', ru: 'ru', cnr: 'sr-ME', srb: 'sr-RS', sq: 'sq-AL' };
const socialLocales = { en: 'en_US', ru: 'ru_RU', cnr: 'sr_ME', srb: 'sr_RS', sq: 'sq_AL' };
const policySlugs = ['privacy-policy', 'cookie-policy', 'terms-of-service'];
const projects = ['cupertino-roast', 'shift-drive', 'umami-bistro', 'aura-wellness'];
const priorityServices = [
  { id: 'budva_restoran', project: 'umami-bistro' },
  { id: 'podgorica_sto', project: 'shift-drive' },
  { id: 'budva_rent_a_car' },
  { id: 'tivat' },
];
const servicePaths = priorityServices.map(({ id, project }) => ({ path: localePathsFor(id), project }));

function pathForSlug(entry, locale) {
  const slug = entry.slugs[locale];
  return slug ? `/${locale}/${slug}` : undefined;
}

function localePathsFor(id) {
  const entry = slugMap.find(item => item.id === id);
  assert.ok(entry, `Missing localized slug entry for ${id}`);
  return locale => pathForSlug(entry, locale);
}

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

function checkStudioIdentity(schema, html, path) {
  const organizations = schema.filter(item => item['@id'] === organizationId);
  assert.equal(organizations.length, 1, path);
  const [organization] = organizations;
  assert.equal(organization['@type'], 'Organization', path);
  assert.equal(organization.name, 'Corebit Studio', path);
  assert.equal(organization.url, canonicalOrigin, path);
  assert.equal(organization.logo, canonicalOrigin + logoPath, path);
  assert.equal(organization.address?.addressLocality, 'Tivat', path);
  assert.equal(organization.address?.addressCountry, 'ME', path);
  assert.match(organization.telephone, /^\+382\d+$/, path);
  assert.equal(organization.contactPoint?.['@type'], 'ContactPoint', path);
  assert.match(organization.contactPoint.url, /^https:\/\/wa\.me\/\d+$/, path);

  const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1];
  assert.ok(footer, path);
  const contactLinks = tags(footer, 'a').map(link => link.href);
  for (const contact of [`tel:${organization.telephone}`, `mailto:${organization.email}`, organization.contactPoint.url]) {
    assert.ok(contactLinks.includes(contact), `Contact mismatch for ${path}`);
  }

  const website = schema.find(item => item['@type'] === 'WebSite');
  assert.equal(website?.['@id'], websiteId, path);
  assert.equal(website?.publisher?.['@id'], organizationId, path);
}

async function get(path, headers) {
  return fetch(new URL(path, origin), { headers, redirect: 'manual', signal: AbortSignal.timeout(25000) });
}

async function checkLocaleRouting() {
  const scenarios = [
    ['sr-ME', 'cnr'],
    ['sr-Latn-ME', 'cnr'],
    ['sr-Latn-RS', 'srb'],
    ['sr', 'srb'],
    ['ru-RU,en;q=0.8', 'ru'],
    ['en;q=0.2,ru-RU;q=0.9', 'ru'],
    ['sq-AL,en;q=0.7', 'sq'],
    ['ru;q=0,en;q=0.5', 'en'],
    ['ru;q=2,en;q=0.5', 'en'],
    ['ru;q=0.9,en;q=0.9', 'ru'],
    ['fr-FR,de-DE;q=0.7', 'en'],
  ];
  for (const [header, locale] of scenarios) {
    const response = await get('/?utm_source=seo-audit', { 'accept-language': header });
    assert.equal(response.status, 307, header);
    const location = response.headers.get('location');
    assert.ok(location, header);
    assert.equal(new URL(location, origin).href, new URL(`/${locale}?utm_source=seo-audit`, origin).href, header);
    assert.match(response.headers.get('vary') || '', /\baccept-language\b/i, header);
    assert.match(response.headers.get('cache-control') || '', /\bno-store\b/i, header);
  }
  const localized = await get('/sq/tivat', { 'accept-language': 'ru-RU' });
  assert.equal(localized.status, 200, 'Explicit locale must take precedence');
  assert.equal(tags(await localized.text(), 'html')[0]?.lang, languages.sq);
  console.log(`Verified ${scenarios.length + 1} language routing scenarios.`);
}

function checkSocialMetadata(meta, locale, path, title, description) {
  const card = Object.fromEntries(meta.map(tag => [tag.property || tag.name, tag.content]));
  const image = `${canonicalOrigin}/${locale}/opengraph-image`;
  assert.equal(card['og:url'], canonicalOrigin + path, path);
  assert.equal(card['og:locale'], socialLocales[locale], path);
  assert.equal(card['og:title'], title, path);
  assert.equal(card['og:description'], description, path);
  assert.equal(card['og:image'], image, path);
  assert.equal(card['og:image:type'], 'image/png', path);
  assert.equal(card['og:image:width'], '1200', path);
  assert.equal(card['og:image:height'], '630', path);
  assert.equal(card['og:image:alt'], 'Corebit Studio', path);
  assert.equal(card['twitter:card'], 'summary_large_image', path);
  assert.equal(card['twitter:title'], title, path);
  assert.equal(card['twitter:description'], description, path);
  assert.equal(card['twitter:image'], image, path);
  assert.equal(card['twitter:image:alt'], 'Corebit Studio', path);
}

async function checkPage(path, locale, localizedPaths, type, project) {
  const response = await get(path, { 'user-agent': 'facebookexternalhit/1.1' });
  assert.equal(response.status, 200, `HTTP status for ${path}`);
  assert.doesNotMatch(response.headers.get('x-robots-tag') || '', /\b(?:noindex|none)\b/i, path);
  const html = await response.text();
  const pageTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  assert.ok(pageTitle && (type === 'policy' || pageTitle.includes('Corebit Studio')), `Missing title for ${path}`);
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1];
  assert.ok(head, `Missing head for ${path}`);
  const meta = tags(head, 'meta');
  for (const tag of meta.filter(tag => ['robots', 'googlebot', 'bingbot'].includes(tag.name?.toLowerCase()))) {
    assert.doesNotMatch(tag.content || '', /\b(?:noindex|none)\b/i, path);
  }
  const descriptions = meta.filter(tag => tag.name === 'description');
  assert.equal(descriptions.length, 1, `Expected one description for ${path}`);
  assert.ok(descriptions[0].content?.trim(), `Missing description for ${path}`);
  checkSocialMetadata(meta, locale, path, pageTitle, descriptions[0].content);
  assert.equal(tags(html, 'html')[0]?.lang, languages[locale], path);
  assert.equal(tags(html, 'h1').length, 1, path);
  const links = tags(html, 'link');
  assert.deepEqual(links.filter(link => link.rel === 'canonical').map(link => link.href), [canonicalOrigin + path], path);
  const alternates = links.filter(link => link.rel === 'alternate' && link.hreflang);
  const expectedAlternates = {};
  for (const [language, tag] of Object.entries(languages)) {
    const localizedPath = localizedPaths(language);
    if (localizedPath) expectedAlternates[tag] = canonicalOrigin + localizedPath;
  }
  if (expectedAlternates.en) expectedAlternates['x-default'] = expectedAlternates.en;
  assert.equal(alternates.length, Object.keys(expectedAlternates).length, `Unexpected language links for ${path}`);
  assert.deepEqual(Object.fromEntries(alternates.map(link => [link.hreflang, link.href])), expectedAlternates, path);

  const schema = structuredData(html);
  checkStudioIdentity(schema, html, path);
  assert.equal(schema.some(item => item.aggregateRating), false, path);
  if (type !== 'case' && type !== 'policy') {
    assert.ok(html.includes('id="faq"'), path);
    const header = html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)?.[1];
    assert.ok(header, `Missing navigation on ${path}`);
    const navigationLinks = tags(header, 'a').map(link => link.href);
    for (const section of ['modules', 'portfolio', 'pricing', 'contact']) {
      assert.ok(navigationLinks.includes(`#${section}`) && html.includes(`id="${section}"`), path);
    }
  }

  if (type === 'home') {
    const links = tags(html, 'a').map(link => link.href);
    for (const service of servicePaths) assert.ok(links.includes(service.path(locale)), path);
    const timeline = html.match(/<section id="development-process"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(timeline, `Missing development timeline on ${path}`);
    const steps = tags(timeline, 'button').filter(button => button.role === 'tab');
    assert.equal(steps.length, 5, path);
    assert.equal(steps.filter(step => step['aria-selected'] === 'true').length, 1, path);
  }
  if (type === 'service') {
    const guide = html.match(/<section aria-labelledby="service-answer-title"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(guide?.includes('id="service-answer-title"') && guide.includes('id="service-quote-title"'), path);
    const guideLinks = tags(guide, 'a').map(link => link.href);
    assert.ok(guideLinks.includes('#contact') && guideLinks.includes('#pricing'), path);
    assert.ok(html.includes('id="contact"') && html.includes('id="pricing"'), path);
    if (project) assert.ok(guideLinks.includes(`/${locale}/portfolio/${project}#project-workflow`), path);
  }
  if (type === 'service' || type === 'region') {
    const service = schema.find(item => item['@type'] === 'Service' && item.url === canonicalOrigin + path);
    assert.equal(service?.provider?.['@id'], organizationId, path);
    if (type === 'service') assert.equal(pageTitle, `${service.name} | Corebit Studio`, path);
  }
  if (type === 'case') {
    const casePage = schema.find(item => item['@type'] === 'WebPage');
    assert.equal(casePage?.isPartOf?.['@id'], websiteId, path);
    assert.equal(casePage?.mainEntity?.['@type'], 'CreativeWork', path);
    assert.equal(casePage.mainEntity.creator?.['@id'], organizationId, path);
    assert.ok(html.includes('id="project-workflow"'), path);
    const relatedService = servicePaths.find(service => service.project && path.endsWith(`/${service.project}`));
    if (relatedService) assert.ok(tags(html, 'a').some(link => link.href === relatedService.path(locale)), path);
  }
  return path;
}

async function audit() {
  await checkLocaleRouting();

  const logo = await get(logoPath);
  assert.equal(logo.status, 200);
  assert.match(logo.headers.get('content-type') || '', /^image\/png\b/i);
  const png = Buffer.from(await logo.arrayBuffer());
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.ok(png.readUInt32BE(16) >= 112 && png.readUInt32BE(20) >= 112, 'Logo is too small');

  for (const locale of Object.keys(languages)) {
    const path = `/${locale}/opengraph-image`;
    const response = await get(path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('content-type') || '', /^image\/png\b/i, path);
    const image = Buffer.from(await response.arrayBuffer());
    assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', path);
    assert.deepEqual([image.readUInt32BE(16), image.readUInt32BE(20)], [1200, 630], path);
  }

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
  const expectedUrls = Object.keys(languages).flatMap(locale => [
    `${canonicalOrigin}/${locale}`,
    ...projects.map(project => `${canonicalOrigin}/${locale}/portfolio/${project}`),
    ...slugMap.flatMap(entry => {
      const path = pathForSlug(entry, locale);
      return path ? [canonicalOrigin + path] : [];
    }),
  ]);
  const expected = new Set(expectedUrls);
  assert.equal(expectedUrls.length, expected.size, 'Multiple entries resolve to the same URL');
  assert.equal(urls.length, new Set(urls).size, 'Sitemap contains duplicate URLs');
  assert.deepEqual(new Set(urls), expected);

  const regions = fullAudit
    ? slugMap.filter(entry => !priorityServices.some(service => service.id === entry.id))
        .map(entry => locale => pathForSlug(entry, locale))
    : ['kotor', 'kotor_salon'].map(localePathsFor);
  const pageGroups = [
    [locale => `/${locale}`, 'home'],
    ...servicePaths.map(({ path, project }) => [path, 'service', project]),
    ...regions.map(path => [path, 'region']),
    ...policySlugs.map(slug => [locale => `/${locale}/${slug}`, 'policy']),
    ...projects.map(project => [locale => `/${locale}/portfolio/${project}`, 'case']),
  ];
  const verified = new Set();
  const auditErrors = [];
  for (const [index, [paths, type, project]] of pageGroups.entries()) {
    const jobs = Object.keys(languages).flatMap(locale => {
      const path = paths(locale);
      return path ? [checkPage(path, locale, paths, type, project)] : [];
    });
    const results = await Promise.allSettled(jobs);
    const errors = results.filter(result => result.status === 'rejected').map(result => result.reason);
    const passed = results.filter(result => result.status === 'fulfilled').map(result => result.value);
    passed.forEach(path => verified.add(canonicalOrigin + path));
    if (!fullAudit && errors.length) throw new AggregateError(errors, `Failed checks for ${type}`);
    auditErrors.push(...errors);
    if (!fullAudit) console.log(`OK ${type}: ${passed.join(', ')}`);
    if (fullAudit && (index + 1) % 25 === 0) {
      console.log(`Checked ${index + 1}/${pageGroups.length} page groups. ${verified.size} passed, ${auditErrors.length} failed.`);
    }
  }

  if (auditErrors.length) {
    throw new AggregateError(auditErrors.slice(0, 20), `${auditErrors.length} pages failed the full audit (up to 20 shown)`);
  }
  if (fullAudit) {
    assert.deepEqual(new Set([...verified].filter(url => expected.has(url))), expected, 'Full audit did not cover the whole sitemap');
  }
  console.log(`Verified robots, ${urls.length} sitemap URLs and ${verified.size} localized pages.`);
}

audit().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
