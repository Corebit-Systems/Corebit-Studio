import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// ── Allowed origins for CSRF protection ─────────────────────────────────────
const ALLOWED_ORIGINS = new Set([
  'https://studio.corebitsystems.io',
  'https://www.studio.corebitsystems.io',
]);

// ── Sliding window IP rate limiter cache ─────────────────────────────────────
const ipCache = new Map<string, number[]>();
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_HITS  = 5; // 5 requests per 5 min for checklist magnet

function checkRateLimit(ip: string): boolean {
  const now        = Date.now();
  const timestamps = ipCache.get(ip) || [];
  const recent     = timestamps.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) return false;
  recent.push(now);
  ipCache.set(ip, recent);
  return true;
}

// ── Zod validation schema ────────────────────────────────────────────────────
const ChecklistSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .toLowerCase(),
  selectedItems: z
    .array(z.string())
    .min(1, 'Please select at least one item'),
  locale: z
    .string()
    .regex(/^(en|ru|cnr|srb|sq)$/, 'Invalid locale')
    .optional()
    .default('en'),
});

// ── Safe HTML encoder ────────────────────────────────────────────────────────
function encodeForEmail(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

export async function POST(request: Request) {
  try {
    // 1. CSRF — Origin check
    const origin = request.headers.get('origin') ?? '';
    const isDev  = process.env.NODE_ENV === 'development';
    if (!isDev && origin && !ALLOWED_ORIGINS.has(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Parse body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // 3. IP Rate Limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || '127.0.0.1');
    const firstIp = ip.slice(0, 45);

    if (!checkRateLimit(firstIp)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // 4. Zod structural validation
    const parsed = ChecklistSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation failed.' },
        { status: 400 }
      );
    }

    const { email, selectedItems, locale } = parsed.data;

    if (!process.env.RESEND_API_KEY) {
      console.warn('[api/checklist] RESEND_API_KEY not set — email not dispatched.');
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // 5. Localization
    const isBalkan = locale === 'srb' || locale === 'cnr';
    const subject = isBalkan
      ? 'Vaša arhitektonska kontrolna lista 2026 — Corebit Studio'
      : 'Ваш архитектурный чек-лист 2026 — Corebit Studio';

    const pdfUrl = 'https://studio.corebitsystems.io/docs/architectural-checklist-2026.pdf';

    const titleText = isBalkan ? 'Arhitektonski ček-list 2026' : 'Архитектурный чек-лист 2026';
    const introText = isBalkan
      ? 'Hvala što ste preuzeli naš arhitektonski ček-list. U nastavku su izabrane tehnologije za proveru spremnosti Vašeg sistema:'
      : 'Спасибо за проявленный интерес к нашему архитектурному чек-листу. Ниже приведены выбранные вами технологии для оценки готовности вашей системы:';
    
    const listItemsHtml = selectedItems
      .map(item => `<li style="margin-bottom: 8px; color: #e4e4e7;">${encodeForEmail(item)}</li>`)
      .join('');

    const buttonText = isBalkan ? 'Preuzmite PDF Ček-list' : 'Скачать PDF Чек-лист';
    
    const footerText = isBalkan
      ? 'Ovaj e-mail je automatski poslat od strane Corebit Studio.'
      : 'Это автоматическое письмо от Corebit Studio.';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #050506; color: #f4f4f5; margin: 0; padding: 0; }
            .wrap { max-width: 600px; margin: 0 auto; padding: 24px; }
            .card { background: #0d0d11; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; }
            .title { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 12px; }
            .intro { font-size: 15px; color: #a1a1aa; line-height: 1.6; margin-bottom: 20px; }
            .list-box { background: #16161e; border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 20px; margin-bottom: 24px; }
            .btn-wrap { text-align: center; margin-top: 28px; margin-bottom: 16px; }
            .btn { background: #10b981; color: #000 !important; border-radius: 8px; font-weight: bold; text-decoration: none; padding: 12px 24px; display: inline-block; font-size: 15px; }
            .footer { margin-top: 24px; font-size: 12px; color: #52525b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="card">
              <div style="font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#10b981;margin-bottom:8px;">Corebit Studio</div>
              <div class="title">${titleText}</div>
              <div class="intro">${introText}</div>
              
              <div class="list-box">
                <ul style="margin: 0; padding-left: 20px;">
                  ${listItemsHtml}
                </ul>
              </div>

              <div class="btn-wrap">
                <a href="${pdfUrl}" class="btn">${buttonText}</a>
              </div>
            </div>
            <div class="footer">
              ${footerText}<br>
              studio.corebitsystems.io
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: 'Corebit Studio <info@corebitsystems.io>',
      to: email,
      subject: subject,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error('[api/checklist] Unhandled error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
