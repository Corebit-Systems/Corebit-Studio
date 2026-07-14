const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/docs');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const outFile = path.join(outDir, 'architectural-checklist-2026.pdf');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
    
    :root {
      --bg: #09090b;
      --accent: #10b981;
      --text: #f4f4f5;
      --text-muted: #a1a1aa;
      --border: rgba(255, 255, 255, 0.1);
    }

    * { box-sizing: border-box; }
    
    body {
      margin: 0;
      padding: 0;
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
    }

    .page {
      padding: 40px;
      page-break-after: always;
      position: relative;
    }

    .header, .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
      padding-bottom: 16px;
      margin-bottom: 32px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    .footer {
      border-bottom: none;
      border-top: 1px solid var(--border);
      padding-top: 16px;
      margin-top: 32px;
      margin-bottom: 0;
      position: absolute;
      bottom: 40px;
      left: 40px;
      right: 40px;
    }

    .footer a {
      color: var(--text-muted);
      text-decoration: none;
    }

    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }

    h2 {
      font-size: 18px;
      color: var(--accent);
      border-bottom: 1px dashed var(--border);
      padding-bottom: 8px;
      margin-top: 40px;
      margin-bottom: 20px;
      font-weight: 600;
    }

    h3 {
      font-size: 14px;
      color: #fff;
      margin-top: 24px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    h3::before {
      content: '■';
      color: var(--accent);
      font-size: 10px;
    }

    p {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 0;
      margin-bottom: 12px;
      padding-left: 18px;
    }

    .code-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      background: rgba(16, 185, 129, 0.1);
      color: var(--accent);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    
    .card {
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .lang-label {
      display: inline-block;
      background: var(--text);
      color: var(--bg);
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>

  <!-- ==================== SECTION 1: ENGLISH ==================== -->
  <div class="page">
    <div class="header">
      <div>Corebit Studio // Systems Engineering</div>
      <div>Confidential / 2026</div>
    </div>
    
    <span class="lang-label">SECTION 1: ENGLISH (EN)</span>
    <h1>Architectural Checklist 2026</h1>
    <p style="padding-left: 0; font-size: 14px; margin-bottom: 30px;">
      Evaluate your system readiness for the next generation of web engineering.
    </p>

    <div class="card">
      <h2>01. Next.js App Router & SSR Optimization</h2>
      
      <h3>Partial Prerendering (PPR)</h3>
      <p>How to correctly combine static skeletons and dynamic islands in 2026 for instant load times.</p>
      
      <h3>Server Actions Security</h3>
      <p>Mutation protection checklist: strict <span class="code-tag">Zod</span> validation, authorization checks, and per-action Rate Limiting.</p>
      
      <h3>Route Segment Config</h3>
      <p>Optimal use of <span class="code-tag">force-dynamic</span> vs revalidation timeouts for high-traffic pages and caching.</p>
    </div>

    <div class="card">
      <h2>02. AI & LLM Dialog Agents Integration</h2>
      
      <h3>Latency Optimization</h3>
      <p>Migrating to streaming responses via <span class="code-tag">Vercel AI SDK</span> and <span class="code-tag">Server-Sent Events</span>.</p>
      
      <h3>Context Window & Vector Cache</h3>
      <p>Utilizing local embedding caching to reduce API costs and optimize RAG pipelines.</p>
      
      <h3>Failover & Fallbacks</h3>
      <p>Graceful degradation strategy in case OpenAI/Anthropic APIs are overloaded or unavailable.</p>
    </div>

    <div class="footer">
      <div>Corebit Studio // Systems Engineering // <a href="https://corebitsystems.io">corebitsystems.io</a></div>
      <div>Page 1 of 4</div>
    </div>
  </div>

  <div class="page">
    <div class="header">
      <div>Corebit Studio // Systems Engineering</div>
      <div>Confidential / 2026</div>
    </div>

    <div class="card">
      <h2>03. Sub-100ms LCP on Edge CDN</h2>
      
      <h3>Edge Runtime</h3>
      <p>Migrating mission-critical middleware and API routes to Edge infrastructure (executing closer to the user).</p>
      
      <h3>Advanced Asset Optimization</h3>
      <p>Modern formats (AVIF), aggressive font caching, and purging unused CSS.</p>
      
      <h3>Streaming HTML</h3>
      <p>Progressive rendering of heavy data pages via <span class="code-tag">React Suspense</span>.</p>
    </div>

    <div class="card">
      <h2>04. EU GDPR Compliance & PII Encryption</h2>
      
      <h3>Zero-Knowledge Architecture</h3>
      <p>Storing Personally Identifiable Information (PII) securely encrypted on the database side.</p>
      
      <h3>Consent Management</h3>
      <p>Correct Cookie Consent integration without impacting CLS (Cumulative Layout Shift) and SEO metrics.</p>
      
      <h3>Data Residency</h3>
      <p>Routing European user requests strictly through EU-based servers (e.g., Frankfurt/Paris).</p>
    </div>

    <div class="footer">
      <div>Corebit Studio // Systems Engineering // <a href="https://corebitsystems.io">corebitsystems.io</a></div>
      <div>Page 2 of 4</div>
    </div>
  </div>

  <!-- ==================== SECTION 2: SRB/CNR ==================== -->
  <div class="page">
    <div class="header">
      <div>Corebit Studio // Systems Engineering</div>
      <div>Confidential / 2026</div>
    </div>
    
    <span class="lang-label">SECTION 2: SRPSKI / CRNOGORSKI (SRB/CNR)</span>
    <h1>Arhitektonski ček-list 2026</h1>
    <p style="padding-left: 0; font-size: 14px; margin-bottom: 30px;">
      Procenite spremnost vašeg sistema za sledeću generaciju veb inženjeringa.
    </p>

    <div class="card">
      <h2>01. Next.js App Router i SSR optimizacija</h2>
      
      <h3>Partial Prerendering (PPR)</h3>
      <p>Kako pravilno kombinovati statičke kosture i dinamička ostrva u 2026. za trenutno učitavanje.</p>
      
      <h3>Server Actions Security</h3>
      <p>Ček-lista za zaštitu mutacija: stroga <span class="code-tag">Zod</span> validacija, provera autorizacije i Rate Limiting na nivou akcije.</p>
      
      <h3>Route Segment Config</h3>
      <p>Optimalno korišćenje <span class="code-tag">force-dynamic</span> vs revalidation timeout-a za stranice sa velikim saobraćajem i keširanje.</p>
    </div>

    <div class="card">
      <h2>02. Integracija AI i LLM agenata</h2>
      
      <h3>Latency Optimization</h3>
      <p>Prelazak na strimovanje odgovora preko <span class="code-tag">Vercel AI SDK</span> i <span class="code-tag">Server-Sent Events</span>.</p>
      
      <h3>Context Window & Vector Cache</h3>
      <p>Korišćenje lokalnog keširanja embedding-a za smanjenje troškova API poziva i optimizaciju RAG cevovoda.</p>
      
      <h3>Failover & Fallbacks</h3>
      <p>Strategija postepene degradacije ukoliko su OpenAI/Anthropic API-ji preopterećeni ili nedostupni.</p>
    </div>

    <div class="card">
      <h2>03. Sub-100ms LCP na Edge CDN-u</h2>
      
      <h3>Edge Runtime</h3>
      <p>Premeštanje kritičnog middleware-a i API ruta na Edge infrastrukturu (bliže korisniku).</p>
      
      <h3>Advanced Asset Optimization</h3>
      <p>Moderni formati (AVIF), agresivno keširanje fontova i uklanjanje nekorišćenog CSS-a (Purge).</p>
      
      <h3>Streaming HTML</h3>
      <p>Progresivno renderovanje teških stranica preko <span class="code-tag">React Suspense</span>.</p>
    </div>

    <div class="card">
      <h2>04. Usklađenost sa EU GDPR i enkripcija PII podataka</h2>
      
      <h3>Zero-Knowledge Architecture</h3>
      <p>Čuvanje ličnih podataka (PII) u bezbedno šifrovanom obliku na strani baze podataka.</p>
      
      <h3>Consent Management</h3>
      <p>Pravilna integracija Cookie Consent-a bez uticaja na CLS (Cumulative Layout Shift) i SEO metrike.</p>
      
      <h3>Data Residency</h3>
      <p>Rutiranje zahteva evropskih korisnika isključivo preko servera u EU (npr. Frankfurt/Pariz).</p>
    </div>

    <div class="footer">
      <div>Corebit Studio // Systems Engineering // <a href="https://corebitsystems.io">corebitsystems.io</a></div>
      <div>Page 3 of 4</div>
    </div>
  </div>

  <!-- ==================== SECTION 3: RU ==================== -->
  <div class="page">
    <div class="header">
      <div>Corebit Studio // Systems Engineering</div>
      <div>Confidential / 2026</div>
    </div>
    
    <span class="lang-label">СЕКЦИЯ 3: РУССКИЙ (RU)</span>
    <h1>Архитектурный чек-лист 2026</h1>
    <p style="padding-left: 0; font-size: 14px; margin-bottom: 30px;">
      Оцените готовность вашей системы к следующему поколению веб-разработки.
    </p>

    <div class="card">
      <h2>01. Оптимизация Next.js App Router & SSR</h2>
      
      <h3>Partial Prerendering (PPR)</h3>
      <p>Как правильно комбинировать статический скелет и динамические острова в 2026 году для достижения мгновенной загрузки.</p>
      
      <h3>Server Actions Security</h3>
      <p>Чек-лист по защите мутаций: строгая валидация <span class="code-tag">Zod</span>, проверка авторизации, Rate Limiting на уровне каждого экшена.</p>
      
      <h3>Route Segment Config</h3>
      <p>Оптимальное использование <span class="code-tag">force-dynamic</span> vs revalidation тайм-аутов для высоконагруженных страниц и кеширования.</p>
    </div>

    <div class="card">
      <h2>02. Интеграция ИИ и Диалоговых агентов (AI & LLM)</h2>
      
      <h3>Latency Optimization</h3>
      <p>Переход на потоковую передачу ответов через <span class="code-tag">Vercel AI SDK</span> и <span class="code-tag">Server-Sent Events</span>.</p>
      
      <h3>Context Window & Vector Cache</h3>
      <p>Использование локального кэширования эмбеддингов для снижения стоимости API-запросов и оптимизации RAG.</p>
      
      <h3>Failover & Fallbacks</h3>
      <p>Стратегия плавного ухудшения интерфейса, если API OpenAI/Anthropic перегружен или недоступен.</p>
    </div>

    <div class="card">
      <h2>03. Загрузка Sub-100ms LCP на Edge CDN сетях</h2>
      
      <h3>Edge Runtime</h3>
      <p>Перенос критически важного middleware и API-роутов на Edge-инфраструктуру (выполнение кода ближе к пользователю).</p>
      
      <h3>Advanced Asset Optimization</h3>
      <p>Современные форматы (AVIF), агрессивное кэширование шрифтов, исключение неиспользуемого CSS (Purge).</p>
      
      <h3>Streaming HTML</h3>
      <p>Постепенный рендеринг тяжелых страниц через <span class="code-tag">React Suspense</span>.</p>
    </div>

    <div class="card">
      <h2>04. Соответствие EU GDPR и Шифрование PII данных</h2>
      
      <h3>Zero-Knowledge Architecture</h3>
      <p>Хранение персональных данных (PII) в надежно зашифрованном виде на стороне базы данных.</p>
      
      <h3>Consent Management</h3>
      <p>Правильная интеграция Cookie Consent без влияния на CLS (Cumulative Layout Shift) и SEO-показатели.</p>
      
      <h3>Data Residency</h3>
      <p>Маршрутизация запросов европейских пользователей строго через серверы в ЕС (например, Frankfurt/Paris).</p>
    </div>

    <div class="footer">
      <div>Corebit Studio // Systems Engineering // <a href="https://corebitsystems.io">corebitsystems.io</a></div>
      <div>Page 4 of 4</div>
    </div>
  </div>

</body>
</html>
`;

(async () => {
  console.log('Launching puppeteer...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  console.log('Generating PDF...');
  await page.pdf({
    path: outFile,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  await browser.close();
  console.log('PDF generated at:', outFile);
})();
