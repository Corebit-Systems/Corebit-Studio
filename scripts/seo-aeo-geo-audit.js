// File: C:\dev\Corebit-Studio\scripts\seo-aeo-geo-audit.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3000';
const slugMapPath = path.join(__dirname, '..', 'i18n', 'slug-map.json');

if (!fs.existsSync(slugMapPath)) {
  console.error(`❌ Error: slug-map.json not found at ${slugMapPath}`);
  console.error(`Please run "node scripts/generate-slug-matrix.js" first.`);
  process.exit(1);
}

const slugMap = JSON.parse(fs.readFileSync(slugMapPath, 'utf-8'));

// Define 10 representative test cases to cover all languages, GEO pages, legacy and new B2B niches
const testCases = [
  { id: 'budva', locale: 'ru' },
  { id: 'belgrade', locale: 'srb' },
  { id: 'tirana', locale: 'sq' },
  { id: 'budva_rent_a_car', locale: 'cnr' },
  { id: 'belgrade_nekretnine', locale: 'srb' },
  { id: 'tivat_charter', locale: 'en' },
  { id: 'novi_sad_hoteli', locale: 'ru' },
  { id: 'podgorica_ciscenje', locale: 'cnr' },
  { id: 'durres_klinike', locale: 'sq' },
  { id: 'skopye_transferi', locale: 'en' }
];

// Valid hreflangs
const VALID_HREFLANGS = ['en-US', 'ru-RU', 'sr-RS', 'sr-ME', 'sq-AL', 'x-default', 'en', 'ru', 'cnr', 'srb', 'sq'];

async function runAudit() {
  console.log(`\n🚀 Starting SEO/AEO/GEO Automated Audit...`);
  console.log(`🔗 Target server: ${BASE_URL}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalTests: testCases.length,
    passed: 0,
    failed: 0,
    results: []
  };

  for (const tc of testCases) {
    const entry = slugMap.find(e => e.id === tc.id);
    if (!entry) {
      console.log(`⚠️ Skip: Entry with id "${tc.id}" not found in slug-map.json`);
      continue;
    }

    const slug = entry.slugs[tc.locale];
    const testUrl = `${BASE_URL}/${tc.locale}/${slug}`;
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`🔍 Auditing URL: ${testUrl} (ID: ${tc.id})`);

    const result = {
      id: tc.id,
      locale: tc.locale,
      url: testUrl,
      seo: { status: 'passed', errors: [], warnings: [] },
      aeo: { status: 'passed', errors: [], warnings: [] },
      geo: { status: 'passed', errors: [], warnings: [] }
    };

    const page = await browser.newPage();
    try {
      await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // ==========================================
      // 1. SEO AUDIT
      // ==========================================
      const title = await page.title();
      if (!title) {
        result.seo.errors.push('Title is empty or missing.');
      } else {
        if (title.length > 60) {
          result.seo.warnings.push(`Title is long (${title.length} chars). Keep it under 60.`);
        }
      }

      const description = await page.evaluate(() => {
        const meta = document.querySelector('meta[name="description"]');
        return meta ? meta.getAttribute('content') : null;
      });
      if (!description) {
        result.seo.errors.push('Description meta tag is missing.');
      } else {
        if (description.length > 160) {
          result.seo.warnings.push(`Description is long (${description.length} chars). Keep it under 160.`);
        }
      }

      const h1s = await page.evaluate(() => {
        const headers = Array.from(document.querySelectorAll('h1'));
        return headers.map(h => h.textContent.trim());
      });
      if (h1s.length !== 1) {
        result.seo.errors.push(`Page must contain exactly one <h1>, found ${h1s.length}.`);
      }

      const hreflangs = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]'));
        return links.map(l => ({
          hreflang: l.getAttribute('hreflang'),
          href: l.getAttribute('href')
        }));
      });

      if (hreflangs.length === 0) {
        result.seo.errors.push('Hreflang alternates are missing.');
      } else {
        hreflangs.forEach(hl => {
          if (!VALID_HREFLANGS.includes(hl.hreflang)) {
            result.seo.errors.push(`Invalid hreflang attribute: "${hl.hreflang}".`);
          }
          if (!hl.href.startsWith(BASE_URL) && !hl.href.startsWith('https://studio.corebitsystems.io')) {
            result.seo.errors.push(`Hreflang href does not point to site root: "${hl.href}".`);
          }
        });
      }

      if (result.seo.errors.length > 0) result.seo.status = 'failed';

      // ==========================================
      // 2. AEO AUDIT
      // ==========================================
      const ldJsons = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        return scripts.map(s => s.textContent);
      });

      let faqSchema = null;
      for (const rawJson of ldJsons) {
        try {
          const parsed = JSON.parse(rawJson);
          if (parsed['@type'] === 'FAQPage') {
            faqSchema = parsed;
            break;
          }
        } catch (e) {
          result.aeo.errors.push('Malformed JSON-LD detected in script tags.');
        }
      }

      if (!faqSchema) {
        result.aeo.errors.push('FAQPage Schema.org JSON-LD is missing.');
      } else {
        if (!faqSchema.mainEntity || !Array.isArray(faqSchema.mainEntity)) {
          result.aeo.errors.push('FAQPage: mainEntity array is missing or invalid.');
        } else {
          faqSchema.mainEntity.forEach((ent, index) => {
            if (ent['@type'] !== 'Question') {
              result.aeo.errors.push(`Entity [${index}]: Expected @type "Question", got "${ent['@type']}".`);
            }
            if (!ent.name) {
              result.aeo.errors.push(`Entity [${index}]: Question text is empty.`);
            }
            if (!ent.acceptedAnswer || ent.acceptedAnswer['@type'] !== 'Answer') {
              result.aeo.errors.push(`Entity [${index}]: acceptedAnswer block is missing or invalid.`);
            } else {
              const answerText = ent.acceptedAnswer.text;
              if (!answerText) {
                result.aeo.errors.push(`Entity [${index}]: Answer text is empty.`);
              } else {
                // Word count analysis (recommend 40-60 words for Voice Search/AI snippets)
                const wordCount = answerText.split(/\s+/).filter(Boolean).length;
                if (wordCount < 40 || wordCount > 60) {
                  result.aeo.warnings.push(`Answer word count is ${wordCount} (recommended: 40-60 words for AEO).`);
                }
              }
            }
          });
        }
      }

      if (result.aeo.errors.length > 0) result.aeo.status = 'failed';

      // ==========================================
      // 3. GEO AUDIT
      // ==========================================
      const bodyText = await page.evaluate(() => document.body.innerText);

      // Check Entity Mentions (USP / authoritative triggers)
      const entities = ['next.js', 'брониров', 'упущенной', 'roi', 'кейс', 'booking', 'loss', 'profit', 'cases'];
      const hasEntities = entities.some(ent => bodyText.toLowerCase().includes(ent));
      if (!hasEntities) {
        result.geo.warnings.push('Authoritative GEO entities (Next.js, ROI, booking automation, loss/profit analysis, cases) were not detected in text.');
      }

      // Localized Pricing Validation
      const pageHasRSD = bodyText.includes('RSD');
      if (tc.locale === 'srb') {
        if (!pageHasRSD) {
          result.geo.errors.push('Serbian localization: RSD pricing hints are missing.');
        }
      } else {
        if (pageHasRSD) {
          result.geo.errors.push(`RSD pricing is leaking to non-Serbian locale ("${tc.locale}").`);
        }
      }

      if (result.geo.errors.length > 0) result.geo.status = 'failed';

      // ==========================================
      // REPORT PRINTING
      // ==========================================
      // Print SEO Results
      if (result.seo.status === 'passed') {
        console.log(`  ✅ SEO Status: PASSED`);
      } else {
        console.log(`  ❌ SEO Status: FAILED`);
        result.seo.errors.forEach(e => console.log(`     - ERROR: ${e}`));
      }
      result.seo.warnings.forEach(w => console.log(`     - WARNING: ${w}`));

      // Print AEO Results
      if (result.aeo.status === 'passed') {
        console.log(`  ✅ AEO Status: PASSED`);
      } else {
        console.log(`  ❌ AEO Status: FAILED`);
        result.aeo.errors.forEach(e => console.log(`     - ERROR: ${e}`));
      }
      result.aeo.warnings.forEach(w => console.log(`     - WARNING: ${w}`));

      // Print GEO Results
      if (result.geo.status === 'passed') {
        console.log(`  ✅ GEO Status: PASSED`);
      } else {
        console.log(`  ❌ GEO Status: FAILED`);
        result.geo.errors.forEach(e => console.log(`     - ERROR: ${e}`));
      }
      result.geo.warnings.forEach(w => console.log(`     - WARNING: ${w}`));

      if (result.seo.status === 'passed' && result.aeo.status === 'passed' && result.geo.status === 'passed') {
        report.passed++;
      } else {
        report.failed++;
      }

    } catch (err) {
      console.log(`  ❌ CRITICAL ERROR visiting page: ${err.message}`);
      result.seo.status = 'failed';
      result.seo.errors.push(`Critical: ${err.message}`);
      report.failed++;
    } finally {
      await page.close();
    }

    report.results.push(result);
  }

  await browser.close();

  // Create logs folder if it doesn't exist
  const logsDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  const reportPath = path.join(logsDir, 'seo-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`\n================================================================================`);
  console.log(`📊 Audit Finished!`);
  console.log(`   Passed pages: ${report.passed}/${report.totalTests}`);
  console.log(`   Failed pages: ${report.failed}/${report.totalTests}`);
  console.log(`💾 JSON report saved to: ${reportPath}`);
  console.log(`================================================================================\n`);
}

runAudit();
