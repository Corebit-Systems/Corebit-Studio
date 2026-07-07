import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { getDictionary, Locale } from '@/i18n/getDictionary';

// ── Allowed origins for CSRF protection ─────────────────────────────────────
const ALLOWED_ORIGINS = new Set([
  'https://corebit-studio.vercel.app',
  'https://www.corebit-studio.vercel.app',
]);

// ── Sliding window IP rate limiter cache ─────────────────────────────────────
// NOTE: Resets on serverless cold-start; the actions.ts cookie layer is the durable fallback.
const ipCache = new Map<string, number[]>();
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_HITS = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipCache.get(ip) || [];
  const recent = timestamps.filter(t => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) return false;
  recent.push(now);
  ipCache.set(ip, recent);
  return true;
}

// ── Zod validation schema ────────────────────────────────────────────────────
const SendSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .refine(val => !/<[^>]+>/.test(val), { message: 'HTML is not allowed' }),
  email: z
    .string()
    .trim()
    .email('Invalid email format')
    .max(254, 'Email too long')
    // Block email header injection via newlines
    .refine(val => !/[\r\n]/.test(val), { message: 'Invalid email' })
    .toLowerCase(),
  message: z
    .string()
    .trim()
    .min(10, 'Message too short')
    .max(2000, 'Message too long')
    .refine(val => !/<[^>]+>/.test(val), { message: 'HTML is not allowed' }),
  source: z.string().optional().default('form'),
  locale: z
    .string()
    .regex(/^(en|ru|cnr|srb|sq)$/, 'Invalid locale')
    .optional()
    .default('en'),
  b_trap: z.literal('').optional(),
});

// ── Safe HTML encoder for email body ────────────────────────────────────────
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
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev && origin && !ALLOWED_ORIGINS.has(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Parse body (guard against malformed JSON / oversized body)
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const rawBody = body as Record<string, unknown>;

    // 3. Honeypot check — silent 200 to fool bots
    if (rawBody.b_trap) {
      return NextResponse.json({ success: true });
    }

    // 4. IP Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const firstIp = ip.split(',')[0].trim().slice(0, 45);
    if (!checkRateLimit(firstIp)) {
      const dict = (await getDictionary((rawBody.locale as Locale) || 'en')) as any;
      const errorMsg = dict.contact_form?.error_rate || 'Too many requests. Please try again later.';
      return NextResponse.json({ error: errorMsg }, { status: 429 });
    }

    // 5. Zod structural validation
    const parsed = SendSchema.safeParse(rawBody);
    if (!parsed.success) {
      const isSpamLike = parsed.error.issues.some(
        i => i.path[0] === 'email' || i.message.includes('HTML') || i.message.includes('Invalid email')
      );
      const dict = (await getDictionary((rawBody.locale as Locale) || 'en')) as any;
      const errorMsg = isSpamLike
        ? (dict.contact_form?.error_spam || 'Security check failed.')
        : (dict.contact_form?.error_general || 'Validation failed. Please check your input.');
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { name: rawName, email: rawEmail, message: rawMessage, source, locale } = parsed.data;

    // 6. HTML entity encode for safe email rendering
    const name    = encodeForEmail(rawName);
    const email   = encodeForEmail(rawEmail);
    const message = encodeForEmail(rawMessage);

    // 7. Guard: only send email if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('[api/send] RESEND_API_KEY not set — email not dispatched.');
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const isDirect = source === 'direct';
    const dateStr = new Date().toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC';
    const sourceLabel = isDirect ? 'Direct Client Email Simulation' : 'Website Lead Form';
    const subjectPrefix = isDirect ? '[Direct Email]' : '[Lead Form]';
    const subject = `${subjectPrefix} Inquiry from ${name}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #050506; color: #f4f4f5; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .wrapper { width: 100%; max-width: 600px; margin: 0 auto; padding: 24px; box-sizing: border-box; }
            .card { background-color: #0d0d11; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
            .header { border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 20px; margin-bottom: 24px; }
            .brand { font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; }
            .badge { display: inline-block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background-color: ${isDirect ? 'rgba(56,189,248,0.1)' : 'rgba(16,185,129,0.1)'}; color: ${isDirect ? '#38bdf8' : '#10b981'}; padding: 6px 12px; border-radius: 9999px; margin-top: 8px; }
            .section-title { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; margin-top: 24px; margin-bottom: 8px; }
            .field-value { font-size: 16px; color: #e4e4e7; line-height: 1.5; }
            .message-box { background-color: #16161e; border: 1px solid rgba(255,255,255,0.04); border-radius: 12px; padding: 20px; margin-top: 8px; font-size: 15px; color: #d4d4d8; line-height: 1.6; white-space: pre-wrap; }
            .footer { margin-top: 32px; text-align: center; font-size: 12px; color: #52525b; }
            .footer a { color: #10b981; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="card">
              <div class="header">
                <div class="brand">Corebit Studio</div>
                <div class="badge">${sourceLabel}</div>
              </div>
              <div class="section-title">Client Name</div>
              <div class="field-value">${name}</div>
              <div class="section-title">Contact Email</div>
              <div class="field-value"><a href="mailto:${email}" style="color:#10b981;text-decoration:none;">${email}</a></div>
              <div class="section-title">Submitted Time</div>
              <div class="field-value">${dateStr}</div>
              <div class="section-title">Project Details / Message</div>
              <div class="message-box">${message}</div>
            </div>
            <div class="footer">
              <p>Sent automatically from <a href="https://corebit-studio.vercel.app">corebit-studio.vercel.app</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const data = await resend.emails.send({
      from: 'Corebit Studio <noreply@corebitsystems.io>',
      to: 'corebitsystems.office@gmail.com',
      replyTo: rawEmail,
      subject,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data });

  } catch (error: unknown) {
    // ── No internal details exposed to client ──────────────────────────────
    console.error('[api/send] Unhandled error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
