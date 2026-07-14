#!/usr/bin/env node
/**
 * scripts/generate-sitemap-xml.js
 *
 * Generates a static public/sitemap.xml after `next build`.
 * This file is served directly by the CDN edge, bypassing any Next.js
 * rendering overhead, and ensures search engines always get a fresh copy
 * even if the dynamic /sitemap endpoint is cold.
 *
 * Run: node scripts/generate-sitemap-xml.js
 * Or:  npm run postbuild  (wired below)
 *
 * Priority schema:
 *   1.00  – locale root pages
 *   0.80  – portfolio case studies
 *   0.75  – generic city landing pages
 *   0.60  – niche service+city landing pages
 *
 * Legal pages are excluded to preserve crawl budget.
 */

const fs   = require('fs');
const path = require('path');

// ── Config ────────────────────────────────────────────────────────────────────
const SITE_URL   = 'https://studio.corebitsystems.io';
const LOCALES    = ['en', 'ru', 'cnr', 'srb', 'sq'];
const PORTFOLIOS = ['cupertino-roast', 'shift-drive', 'umami-bistro', 'aura-wellness'];
const SERVICE_IDS = ['rent_a_car', 'sto', 'restoran', 'salon', 'nekretnine', 'hoteli', 'charter', 'klinike', 'ciscenje', 'transferi'];

const slugMap = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'i18n', 'slug-map.json'), 'utf8'),
);

const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// ── URL entry builder ─────────────────────────────────────────────────────────
function entry(url, priority, changefreq) {
  return [
    '  <url>',
    `    <loc>${url}</loc>`,
    `    <lastmod>${now}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority.toFixed(2)}</priority>`,
    '  </url>',
  ].join('\n');
}

const entries = [];

// 1. Locale roots
for (const locale of LOCALES) {
  entries.push(entry(`${SITE_URL}/${locale}`, 1.0, 'daily'));
}

// 2. Portfolio pages
for (const locale of LOCALES) {
  for (const slug of PORTFOLIOS) {
    entries.push(entry(`${SITE_URL}/${locale}/portfolio/${slug}`, 0.8, 'weekly'));
  }
}

// 3. SEO landing pages from slug-map
const cityEntries  = [];
const nicheEntries = [];

for (const slugEntry of slugMap) {
  const isNiche = SERVICE_IDS.some((svc) => slugEntry.id.includes(`_${svc}`));

  for (const locale of LOCALES) {
    const slug = slugEntry.slugs[locale];
    if (!slug) continue;

    const url = `${SITE_URL}/${locale}/${slug}`;

    if (isNiche) {
      nicheEntries.push(entry(url, 0.6, 'weekly'));
    } else {
      cityEntries.push(entry(url, 0.75, 'daily'));
    }
  }
}

entries.push(...cityEntries, ...nicheEntries);

// ── Write output ──────────────────────────────────────────────────────────────
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset',
  '  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
  '  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9',
  '    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
  ...entries,
  '</urlset>',
].join('\n');

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');

const count = entries.length;
console.log(`✅  sitemap.xml written → ${outPath}`);
console.log(`    URLs: ${count} entries`);
