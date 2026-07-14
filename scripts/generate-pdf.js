const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public');
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
      --text: #e4e4e7;
      --text-muted: #a1a1aa;
      --border: rgba(255, 255, 255, 0.1);
      --code-bg: #18181b;
    }

    * { box-sizing: border-box; }
    
    body {
      margin: 0;
      padding: 0;
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.4;
      -webkit-print-color-adjust: exact;
    }

    /* A4 specific dimensions */
    .page {
      width: 210mm;
      height: 297mm;
      padding: 25mm 20mm;
      page-break-after: always;
      position: relative;
      overflow: hidden;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
      padding-bottom: 10px;
      margin-bottom: 15px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    .footer {
      border-top: 1px solid var(--border);
      padding-top: 10px;
      position: absolute;
      bottom: 20mm;
      left: 20mm;
      right: 20mm;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      color: var(--accent);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-text {
      text-align: right;
      flex-grow: 1;
    }

    .footer a {
      color: var(--text-muted);
      text-decoration: none;
    }

    h1 {
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 4px;
      letter-spacing: -0.02em;
    }

    h2 {
      font-size: 14px;
      color: var(--accent);
      border-bottom: 1px dashed var(--border);
      padding-bottom: 4px;
      margin-top: 15px;
      margin-bottom: 10px;
      font-weight: 600;
    }

    h3 {
      font-size: 11px;
      color: #fff;
      margin-top: 12px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    h3::before {
      content: '■';
      color: var(--accent);
      font-size: 10px;
    }

    p {
      font-size: 9px;
      color: var(--text-muted);
      margin-top: 0;
      margin-bottom: 6px;
    }

    pre {
      background: var(--code-bg);
      border-radius: 4px;
      padding: 8px;
      margin: 6px 0 10px 0;
      font-family: 'JetBrains Mono', 'Courier New', Courier, monospace;
      font-size: 8px;
      color: #d4d4d8;
      overflow-x: hidden;
      white-space: pre-wrap;
      page-break-inside: avoid;
    }

    .code-hl {
      color: var(--accent);
    }
    
    .card {
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.02);
      border-radius: 6px;
      padding: 12px 15px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }

    .lang-label {
      display: inline-block;
      background: var(--text);
      color: var(--bg);
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      font-weight: bold;
      padding: 3px 6px;
      border-radius: 3px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1: ENGLISH P1 ==================== -->
  <div class="page">
    <div class="header">
      <div>Corebit Studio // Systems Engineering</div>
      <div>Confidential / 2026</div>
    </div>
    
    <span class="lang-label">SECTION 1: ENGLISH (EN)</span>
    <h1>Architectural Checklist 2026</h1>
    <p style="font-size: 10px; margin-bottom: 20px;">
      Technical blueprint for next-generation web engineering.
    </p>

    <div class="card">
      <h2>01. Next.js App Router & SSR Optimization</h2>
      
      <h3>Partial Prerendering (PPR)</h3>
      <p>Combine static shell with dynamic holes for instant loading:</p>
<pre><code><span class="code-hl">// next.config.js</span>
const nextConfig = { experimental: { ppr: 'incremental' } };

<span class="code-hl">// page.tsx</span>
import { Suspense } from 'react';
export default function Page() {
  return (
    &lt;main&gt;
      &lt;StaticHeader /&gt;
      &lt;Suspense fallback={&lt;Skeleton /&gt;}&gt;
        &lt;DynamicContent /&gt;
      &lt;/Suspense&gt;
    &lt;/main&gt;
  );
}</code></pre>

      <h3>Server Actions Security</h3>
      <p>Implement strict mutation barriers including Zod validation and rate limiting:</p>
<pre><code>export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  
  await rateLimit(session.user.id);
  const data = schema.safeParse(Object.fromEntries(formData));
  if (!data.success) return { error: "Invalid payload" };
  // ... db update
}</code></pre>

      <h3>Route Segment Configuration</h3>
      <p>Use granular caching semantics per route segment:</p>
<pre><code><span class="code-hl">// Cache for 1 hour vs Force dynamic</span>
export const revalidate = 3600; 
export const dynamic = 'force-dynamic';</code></pre>
    </div>

    <div class="footer">
      <div>Page 1 of 6</div>
      <div class="footer-text">Corebit Studio // Systems Engineering // <a href="https://corebitsystems.io">corebitsystems.io</a></div>
    </div>
  </div>

  <!-- ==================== PAGE 2: ENGLISH P2 ==================== -->
  <div class="page">
    <div class="header">
      <div>Corebit Studio // Systems Engineering</div>
      <div>Confidential / 2026</div>
    </div>

    <div class="card">
      <h2>02. AI & LLM Dialog Agents Integration</h2>
      
      <h3>Latency Optimization via Streaming</h3>
      <p>Stream tokens to the client directly via Vercel AI SDK:</p>
<pre><code>import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    prompt,
  });
  return result.toDataStreamResponse();
}</code></pre>

      <h3>Vector Cache & Retry Policy</h3>
      <p>Cache embeddings in Redis/Valkey before querying Pinecone to reduce API costs. Implement an exponential backoff retry strategy for handling 429/503 HTTP errors.</p>
    </div>

    <div class="card">
      <h2>03. Sub-100ms LCP on Edge CDN</h2>
      
      <h3>Edge Runtime Migration</h3>
      <p>Move mission-critical middleware and fast API routes to the Edge:</p>
<pre><code><span class="code-hl">// Opt into Edge runtime (No Node.js APIs)</span>
export const runtime = 'edge'; 
export const preferredRegion = 'fra1'; // Frankfurt</code></pre>

      <h3>Advanced Asset Optimization</h3>
      <p>Configure Next.js image optimization for AVIF and aggressive font caching:</p>
<pre><code><span class="code-hl">// next.config.js</span>
module.exports = {
  images: { formats: ['image/avif', 'image/webp'] },
};</code></pre>

      <h3>Streaming HTML via Suspense</h3>
      <p>Separate heavy SQL queries from the initial HTML document response:</p>
<pre><code>import { Suspense } from 'react';
&lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
  &lt;HeavyDatabaseComponent /&gt;
&lt;/Suspense&gt;</code></pre>
    </div>

    <div class="card">
      <h2>04. EU GDPR Compliance & PII Encryption</h2>
      
      <h3>Zero-Knowledge Architecture</h3>
      <p>Encrypt PII on-the-fly before Postgres insertion using Node crypto:</p>
<pre><code>import crypto from 'crypto';
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
let encrypted = cipher.update(piiData, 'utf8', 'hex');
encrypted += cipher.final('hex');</code></pre>

      <h3>Consent Management</h3>
      <p>Load tracking scripts via Partytown or worker strategy to prevent blocking:</p>
<pre><code>import Script from 'next/script';
&lt;Script src="gtm.js" strategy="worker" /&gt;</code></pre>

      <h3>Data Residency</h3>
      <p>Route requests dynamically using Edge headers like <code>x-vercel-ip-country</code> to ensure EU data stays in the EU.</p>
    </div>

    <div class="footer">
      <div>Page 2 of 6</div>
      <div class="footer-text">Corebit Studio // Systems Engineering // <a href="https://corebitsystems.io">corebitsystems.io</a></div>
    </div>
  </div>

  <!-- ==================== PAGE 3: SRB P1 ==================== -->
  <div class="page">
    <div class="header">
      <div>Corebit Studio // Systems Engineering</div>
      <div>Confidential / 2026</div>
    </div>
    
    <span class="lang-label">SECTION 2: SRPSKI / CRNOGORSKI (SRB/CNR)</span>
    <h1>Arhitektonski ček-list 2026</h1>
    <p style="font-size: 10px; margin-bottom: 20px;">
      Tehnički nacrt za sledeću generaciju veb inženjeringa.
    </p>

    <div class="card">
      <h2>01. Next.js App Router i SSR optimizacija</h2>
      
      <h3>Partial Prerendering (PPR)</h3>
      <p>Kombinujte statički kostur sa dinamičkim delovima za trenutno učitavanje:</p>
<pre><code><span class="code-hl">// next.config.js</span>
const nextConfig = { experimental: { ppr: 'incremental' } };

<span class="code-hl">// page.tsx</span>
import { Suspense } from 'react';
export default function Page() {
  return (
    &lt;main&gt;
      &lt;StaticHeader /&gt;
      &lt;Suspense fallback={&lt;Skeleton /&gt;}&gt;
        &lt;DynamicContent /&gt;
      &lt;/Suspense&gt;
    &lt;/main&gt;
  );
}</code></pre>

      <h3>Server Actions Security</h3>
      <p>Implementirajte striktne barijere, Zod validaciju i limitiranje zahteva:</p>
<pre><code>export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  
  await rateLimit(session.user.id);
  const data = schema.safeParse(Object.fromEntries(formData));
  if (!data.success) return { error: "Invalid payload" };
  // ... db update
}</code></pre>

      <h3>Route Segment Configuration</h3>
      <p>Koristite granularno keširanje po ruti:</p>
<pre><code><span class="code-hl">// Keš na 1 sat naspram forsiranja dinamičkog renderovanja</span>
export const revalidate = 3600; 
export const dynamic = 'force-dynamic';</code></pre>
    </div>

    <div class="footer">
      <div>Page 3 of 6</div>
      <div class="footer-text">Corebit Studio // Systems Engineering // <a href="https://corebitsystems.io">corebitsystems.io</a></div>
    </div>
  </div>

  <!-- ==================== PAGE 4: SRB P2 ==================== -->
  <div class="page">
    <div class="header">
      <div>Corebit Studio // Systems Engineering</div>
      <div>Confidential / 2026</div>
    </div>

    <div class="card">
      <h2>02. Integracija AI i LLM agenata</h2>
      
      <h3>Latency Optimization (Strimovanje)</h3>
      <p>Strimujte tokene direktno klijentu putem Vercel AI SDK-a:</p>
<pre><code>import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    prompt,
  });
  return result.toDataStreamResponse();
}</code></pre>

      <h3>Vector Cache i Retry Policy</h3>
      <p>Keširajte embedding podatke u Redis/Valkey bazama. Implementirajte eksponencijalni backoff za rešavanje grešaka (429/503).</p>
    </div>

    <div class="card">
      <h2>03. Sub-100ms LCP na Edge CDN-u</h2>
      
      <h3>Edge Runtime</h3>
      <p>Prebacite kritični middleware i brze API rute na Edge:</p>
<pre><code><span class="code-hl">// Prelazak na Edge runtime (Bez Node.js API-ja)</span>
export const runtime = 'edge'; 
export const preferredRegion = 'fra1'; // Frankfurt</code></pre>

      <h3>Advanced Asset Optimization</h3>
      <p>Konfigurišite Next.js optimizaciju slika za AVIF i agresivno keširanje fontova:</p>
<pre><code><span class="code-hl">// next.config.js</span>
module.exports = {
  images: { formats: ['image/avif', 'image/webp'] },
};</code></pre>

      <h3>Streaming HTML (Suspense)</h3>
      <p>Odvojte teške SQL upite od početnog HTML odgovora:</p>
<pre><code>import { Suspense } from 'react';
&lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
  &lt;HeavyDatabaseComponent /&gt;
&lt;/Suspense&gt;</code></pre>
    </div>

    <div class="card">
      <h2>04. Usklađenost sa EU GDPR i PII enkripcija</h2>
      
      <h3>Zero-Knowledge Architecture</h3>
      <p>Enkriptujte PII pre unosa u bazu (Postgres) koristeći Node crypto:</p>
<pre><code>import crypto from 'crypto';
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
let encrypted = cipher.update(piiData, 'utf8', 'hex');
encrypted += cipher.final('hex');</code></pre>

      <h3>Consent Management</h3>
      <p>Učitavajte skripte za praćenje preko Partytown-a ili worker strategije:</p>
<pre><code>import Script from 'next/script';
&lt;Script src="gtm.js" strategy="worker" /&gt;</code></pre>

      <h3>Data Residency</h3>
      <p>Rutirajte zahteve dinamički pomoću zaglavlja <code>x-vercel-ip-country</code>.</p>
    </div>

    <div class="footer">
      <div>Page 4 of 6</div>
      <div class="footer-text">Corebit Studio // Systems Engineering // <a href="https://corebitsystems.io">corebitsystems.io</a></div>
    </div>
  </div>

  <!-- ==================== PAGE 5: RU P1 ==================== -->
  <div class="page">
    <div class="header">
      <div>Corebit Studio // Systems Engineering</div>
      <div>Confidential / 2026</div>
    </div>
    
    <span class="lang-label">СЕКЦИЯ 3: РУССКИЙ (RU)</span>
    <h1>Архитектурный чек-лист 2026</h1>
    <p style="font-size: 10px; margin-bottom: 20px;">
      Технический чертеж для веб-инженерии следующего поколения.
    </p>

    <div class="card">
      <h2>01. Оптимизация Next.js App Router & SSR</h2>
      
      <h3>Partial Prerendering (PPR)</h3>
      <p>Комбинация статического скелета и динамических островов для мгновенной загрузки:</p>
<pre><code><span class="code-hl">// next.config.js</span>
const nextConfig = { experimental: { ppr: 'incremental' } };

<span class="code-hl">// page.tsx</span>
import { Suspense } from 'react';
export default function Page() {
  return (
    &lt;main&gt;
      &lt;StaticHeader /&gt;
      &lt;Suspense fallback={&lt;Skeleton /&gt;}&gt;
        &lt;DynamicContent /&gt;
      &lt;/Suspense&gt;
    &lt;/main&gt;
  );
}</code></pre>

      <h3>Server Actions Security</h3>
      <p>Барьеры безопасности мутаций: Zod валидация, проверка сессии, rate limit:</p>
<pre><code>export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  
  await rateLimit(session.user.id);
  const data = schema.safeParse(Object.fromEntries(formData));
  if (!data.success) return { error: "Invalid payload" };
  // ... db update
}</code></pre>

      <h3>Route Segment Configuration</h3>
      <p>Настройка семантики кэширования для отдельных сегментов:</p>
<pre><code><span class="code-hl">// Кэширование на час или строго динамический роут</span>
export const revalidate = 3600; 
export const dynamic = 'force-dynamic';</code></pre>
    </div>

    <div class="footer">
      <div>Page 5 of 6</div>
      <div class="footer-text">Corebit Studio // Systems Engineering // <a href="https://corebitsystems.io">corebitsystems.io</a></div>
    </div>
  </div>

  <!-- ==================== PAGE 6: RU P2 ==================== -->
  <div class="page" style="page-break-after: auto;">
    <div class="header">
      <div>Corebit Studio // Systems Engineering</div>
      <div>Confidential / 2026</div>
    </div>

    <div class="card">
      <h2>02. Интеграция ИИ и Диалоговых агентов (AI & LLM)</h2>
      
      <h3>Latency Optimization</h3>
      <p>Потоковая передача токенов клиенту через Vercel AI SDK:</p>
<pre><code>import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    prompt,
  });
  return result.toDataStreamResponse();
}</code></pre>

      <h3>Vector Cache & Retry Policy</h3>
      <p>Локальное кэширование эмбеддингов в Redis/Valkey перед Pinecone. Реализация паттерна экспоненциального бэк-оффа (retry-policy) при ошибках 429/503.</p>
    </div>

    <div class="card">
      <h2>03. Загрузка Sub-100ms LCP на Edge CDN</h2>
      
      <h3>Edge Runtime</h3>
      <p>Перенос middleware и быстрых API на Edge (ближе к пользователю):</p>
<pre><code><span class="code-hl">// Использование Edge runtime (отсутствуют API Node.js)</span>
export const runtime = 'edge'; 
export const preferredRegion = 'fra1'; // Frankfurt</code></pre>

      <h3>Advanced Asset Optimization</h3>
      <p>Оптимизация изображений в AVIF и настройка кэширования шрифтов:</p>
<pre><code><span class="code-hl">// next.config.js</span>
module.exports = {
  images: { formats: ['image/avif', 'image/webp'] },
};</code></pre>

      <h3>Streaming HTML</h3>
      <p>Отделение тяжелых SQL-запросов от мгновенного ответа сервера:</p>
<pre><code>import { Suspense } from 'react';
&lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
  &lt;HeavyDatabaseComponent /&gt;
&lt;/Suspense&gt;</code></pre>
    </div>

    <div class="card">
      <h2>04. Соответствие EU GDPR и Шифрование данных</h2>
      
      <h3>Zero-Knowledge Architecture</h3>
      <p>Шифрование "на лету" персональных данных перед записью в БД:</p>
<pre><code>import crypto from 'crypto';
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
let encrypted = cipher.update(piiData, 'utf8', 'hex');
encrypted += cipher.final('hex');</code></pre>

      <h3>Consent Management</h3>
      <p>Изоляция GTM и аналитики для предотвращения блокировки UI потока:</p>
<pre><code>import Script from 'next/script';
&lt;Script src="gtm.js" strategy="worker" /&gt;</code></pre>

      <h3>Data Residency</h3>
      <p>Проксирование запросов на основе заголовка <code>x-vercel-ip-country</code>.</p>
    </div>

    <div class="footer">
      <div>Page 6 of 6</div>
      <div class="footer-text">Corebit Studio // Systems Engineering // <a href="https://corebitsystems.io">corebitsystems.io</a></div>
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
