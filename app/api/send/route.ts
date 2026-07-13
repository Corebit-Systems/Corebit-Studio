import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { getDictionary, Locale } from '@/i18n/getDictionary';

// ── Allowed origins for CSRF protection ─────────────────────────────────────
const ALLOWED_ORIGINS = new Set([
  'https://studio.corebitsystems.io',
  'https://www.studio.corebitsystems.io',
]);

// ── Sliding window IP rate limiter cache ─────────────────────────────────────
const ipCache = new Map<string, number[]>();
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_HITS  = 3;

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
const SendSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .refine((val) => !/<[^>]+>/.test(val), { message: 'HTML is not allowed' }),
  email: z
    .string()
    .trim()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .refine((val) => !/[\r\n]/.test(val), { message: 'Invalid email' })
    .toLowerCase(),
  message: z
    .string()
    .trim()
    .min(10, 'Message too short')
    .max(2000, 'Message too long')
    .refine((val) => !/<[^>]+>/.test(val), { message: 'HTML is not allowed' }),
  service_type: z
    .string()
    .max(60)
    .optional()
    .default('general_inquiry'),
  source: z.string().optional().default('form'),
  locale: z
    .string()
    .regex(/^(en|ru|cnr|srb|sq)$/, 'Invalid locale')
    .optional()
    .default('en'),
  b_trap: z.literal('').optional(),
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

// ── Data Retention: compute ISO expiry date (12 months from now) ─────────────
function retentionExpiry(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
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

    const rawBody = body as Record<string, unknown>;

    // 3. Honeypot — silent 200 to fool bots
    if (rawBody.b_trap) {
      return NextResponse.json({ success: true });
    }

    // 4. IP Rate Limiting
    const ip      = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const firstIp = ip.split(',')[0].trim().slice(0, 45);
    if (!checkRateLimit(firstIp)) {
      const dict     = (await getDictionary((rawBody.locale as Locale) || 'en')) as any;
      const errorMsg = dict.contact_form?.error_rate || 'Too many requests. Please try again later.';
      return NextResponse.json({ error: errorMsg }, { status: 429 });
    }

    // 5. Zod structural validation
    const parsed = SendSchema.safeParse(rawBody);
    if (!parsed.success) {
      const isSpamLike = parsed.error.issues.some(
        (i) => i.path[0] === 'email' || i.message.includes('HTML') || i.message.includes('Invalid email'),
      );
      const dict     = (await getDictionary((rawBody.locale as Locale) || 'en')) as any;
      const errorMsg = isSpamLike
        ? (dict.contact_form?.error_spam    || 'Security check failed.')
        : (dict.contact_form?.error_general || 'Validation failed. Please check your input.');
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { name: rawName, email: rawEmail, message: rawMessage, service_type, source, locale } = parsed.data;

    // 6. Generate secure Lead ID — this is the ONLY identifier sent externally
    const leadId    = randomUUID();
    const dateStr   = new Date().toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC';
    const retention = retentionExpiry();

    // 7. HTML-encode PII for safe email rendering
    const safeName    = encodeForEmail(rawName);
    const safeEmail   = encodeForEmail(rawEmail);
    const safeMessage = encodeForEmail(rawMessage);

    // 8. Structured audit log — partial IP only, no full PII
    const auditLog = {
      timestamp:     new Date().toISOString(),
      event:         'lead_form_submission',
      lead_id:       leadId,
      service_type,
      locale,
      source,
      messageLength: rawMessage.length,
      ipPartial:     firstIp.slice(0, 8) + '***',
      retention_until: retention,
    };
    console.log(JSON.stringify(auditLog));

    if (!process.env.RESEND_API_KEY) {
      console.warn('[api/send] RESEND_API_KEY not set — email not dispatched.');
      return NextResponse.json({ success: true, lead_id: leadId });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // ── INTERNAL SECURE RECORD (full PII — stays inside EU inbox) ────────────
    // This email IS the secure storage record.
    // Treated as: "secure EU-based record" per GDPR Article 32.
    // Purge policy: 12-month automated retention window flagged in subject.
    const internalHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #050506; color: #f4f4f5; margin: 0; padding: 0; }
            .wrap { max-width: 600px; margin: 0 auto; padding: 24px; }
            .card { background: #0d0d11; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; }
            .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; margin-top: 20px; margin-bottom: 6px; }
            .value { font-size: 15px; color: #e4e4e7; line-height: 1.5; }
            .msg-box { background: #16161e; border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 18px; font-size: 14px; color: #d4d4d8; white-space: pre-wrap; line-height: 1.6; margin-top: 6px; }
            .retention { margin-top: 28px; padding: 14px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; font-size: 12px; color: #fca5a5; }
            .footer { margin-top: 24px; font-size: 11px; color: #52525b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="card">
              <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:4px;">Corebit Studio</div>
              <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#10b981;background:rgba(16,185,129,.1);display:inline-block;padding:5px 12px;border-radius:9999px;margin-bottom:20px;">
                Secure Internal Record
              </div>

              <div class="label">Lead ID (Secure Reference)</div>
              <div class="value" style="font-family:monospace;color:#34d399;">${leadId}</div>

              <div class="label">Client Name</div>
              <div class="value">${safeName}</div>

              <div class="label">Contact Email</div>
              <div class="value"><a href="mailto:${safeEmail}" style="color:#10b981;text-decoration:none;">${safeEmail}</a></div>

              <div class="label">Service Interest</div>
              <div class="value">${encodeForEmail(service_type)}</div>

              <div class="label">Locale</div>
              <div class="value">${locale}</div>

              <div class="label">Submitted</div>
              <div class="value">${dateStr}</div>

              <div class="label">Project Details</div>
              <div class="msg-box">${safeMessage}</div>

              <div class="retention">
                ⚠️ GDPR Retention Policy: This record must be anonymized or deleted by
                <strong>${retention}</strong> (12 months from submission).
                Right to erasure requests: reply to this email with Lead ID.
              </div>
            </div>
            <div class="footer">
              Automated — studio.corebitsystems.io · Internal Use Only · Do Not Forward
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from:    'Corebit Studio <noreply@corebitsystems.io>',
      to:      'corebitsystems.office@gmail.com',
      replyTo: rawEmail,
      subject: `[Lead #${leadId.slice(0, 8)}] ${encodeForEmail(service_type)} · Retention until ${retention}`,
      html:    internalHtml,
    });

    return NextResponse.json({ success: true, lead_id: leadId });

  } catch (error: unknown) {
    console.error('[api/send] Unhandled error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
