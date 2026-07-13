'use server';

import { z } from 'zod';
import { headers, cookies } from 'next/headers';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';

// ── In-memory sliding-window rate limiter ────────────────────────────────────
// NOTE: Resets on serverless cold-start; the cookie-based limiter is the durable layer.
const ipCache = new Map<string, number[]>();
const WINDOW_MS   = 5 * 60 * 1000; // 5 minutes
const MAX_HITS    = 3;
const COOLDOWN_MS = 60 * 1000;     // 60 seconds

// ── Zod schema — strict structural validation ────────────────────────────────
const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    // Unicode-safe: allows Latin, Cyrillic, Albanian, Serbian, Montenegrin chars
    .regex(/^[\p{L}\p{M}\s''\-,.]+$/u, 'Name contains invalid characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .toLowerCase(),
  message: z
    .string()
    .trim()
    .min(10, 'Message too short')
    .max(2000, 'Message too long')
    // Hard reject any HTML/script tags inside the message body
    .refine((val) => !/<[^>]+>/.test(val), {
      message: 'HTML markup is not allowed in messages',
    }),
  locale: z
    .string()
    .trim()
    .regex(/^(en|ru|cnr|srb|sq)$/, 'Invalid locale')
    .optional()
    .default('en'),
  bot_field: z.literal('').optional(),
});

// ── Safe HTML encoder for plain-text email body context ─────────────────────
// Prevents email header injection and XSS if rendered in an HTML email client.
function encodeForEmail(input: string): string {
  return input
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#x27;')
    .replace(/\r?\n|\r/g, ' ') // Flatten newlines — prevents email header injection
    .trim();
}

// ── Data Retention: compute ISO expiry date (12 months from now) ─────────────
function retentionExpiry(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ── Server Action ────────────────────────────────────────────────────────────
export async function submitContactForm(formData: FormData) {
  // 1. Honeypot — silent reject; bots filling hidden fields are discarded first
  const honeypot = formData.get('bot_field') as string;
  const bTrap = formData.get('b_trap') as string;
  if (honeypot || bTrap) {
    return { success: true };
  }

  // 2. IP-based rate limiter: max MAX_HITS submissions within WINDOW_MS
  const headerList = headers();
  const rawIp = headerList.get('x-forwarded-for') || headerList.get('x-real-ip') || '127.0.0.1';
  const ip = rawIp.split(',')[0].trim().slice(0, 45); // Bound IPv6 length
  const now = Date.now();

  const timestamps = ipCache.get(ip) || [];
  const recentTimestamps = timestamps.filter(t => now - t < WINDOW_MS);

  if (recentTimestamps.length >= MAX_HITS) {
    return { success: false, errorType: 'rate' };
  }

  // 3. Cookie-based rate limiter: max 1 submission per COOLDOWN_MS
  const cookieStore = cookies();
  const lastSubmitCookie = cookieStore.get('sec_last_submit')?.value;
  if (lastSubmitCookie && now - parseInt(lastSubmitCookie, 10) < COOLDOWN_MS) {
    return { success: false, errorType: 'rate' };
  }

  // 4. Zod structural validation — rejects malformed, oversized, or HTML-injected input
  const raw = {
    name:      formData.get('name'),
    email:     formData.get('email'),
    message:   formData.get('message'),
    locale:    formData.get('locale') ?? 'en',
    bot_field: formData.get('bot_field') ?? '',
  };

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    // Classify error type without exposing internal Zod field paths to client
    const isSpamLike = parsed.error.issues.some(
      (issue) => issue.path[0] === 'email' || issue.message.includes('HTML')
    );
    return { success: false, errorType: isSpamLike ? 'spam' : 'general' };
  }

  const { name, email, message, locale: userLocale } = parsed.data;

  // 5. Generate secure Lead ID — primary GDPR reference for this record
  const leadId    = randomUUID();
  const dsrId     = `R-${leadId.slice(0, 4).toUpperCase()}`;
  const retention = retentionExpiry();

  // 6. Encode for safe email body transmission (HTML entity encoding)
  const safeBody = {
    name:    encodeForEmail(name),
    email:   encodeForEmail(email),
    message: encodeForEmail(message),
  };

  // 7. Commit timestamp to sliding window cache
  recentTimestamps.push(now);
  ipCache.set(ip, recentTimestamps);

  // 8. Set durable rate-limit cookie — httpOnly prevents JS bypass
  cookieStore.set('sec_last_submit', now.toString(), {
    httpOnly: true,
    secure:   true,
    sameSite: 'strict',
    maxAge:   Math.ceil(COOLDOWN_MS / 1000),
  });

  // 9. Structured audit log — Lead ID only, NO raw PII content logged
  const auditLog = {
    timestamp:       new Date().toISOString(),
    event:           'contact_form_submission',
    lead_id:         leadId,
    dsr_id:          dsrId,
    messageLength:   message.length,
    replyLocale:     userLocale,
    ipPartial:       ip.slice(0, 8) + '***',
    retention_until: retention,
  };
  console.log(JSON.stringify(auditLog));

  // 10. Dispatch secure internal record via Resend (Email-as-Record pattern)
  //     PII is retained strictly inside the EU-hosted inbox as the GDPR Article 32 record.
  //     Subject line uses Lead ID only — no raw PII in email headers.
  try {
    if (process.env.RESEND_API_KEY) {
      const resend  = new Resend(process.env.RESEND_API_KEY);
      const dateStr = new Date().toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC';

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #050506; color: #f4f4f5; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
              .wrap { max-width: 600px; margin: 0 auto; padding: 24px; box-sizing: border-box; }
              .card { background: #0d0d11; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
              .header { border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 20px; margin-bottom: 24px; }
              .brand { font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
              .badge { display: inline-block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #10b981; background: rgba(16,185,129,0.1); padding: 6px 12px; border-radius: 9999px; margin-top: 8px; }
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
                <div class="header">
                  <div class="brand">Corebit Studio</div>
                  <div class="badge">Secure Internal Record</div>
                </div>

                <div class="label">Lead ID (Secure Reference)</div>
                <div class="value" style="font-family:monospace;color:#34d399;">${leadId}</div>

                <div class="label">Data Subject Request ID</div>
                <div class="value" style="font-family:monospace;color:#f59e0b;">${dsrId}</div>

                <div class="label">Client Name</div>
                <div class="value">${safeBody.name}</div>

                <div class="label">Contact Email</div>
                <div class="value"><a href="mailto:${safeBody.email}" style="color:#10b981;text-decoration:none;">${safeBody.email}</a></div>

                <div class="label">Locale</div>
                <div class="value">${userLocale}</div>

                <div class="label">Submitted</div>
                <div class="value">${dateStr}</div>

                <div class="label">Project Details</div>
                <div class="msg-box">${safeBody.message}</div>

                <div class="retention">
                  &#x26A0;&#xFE0F; GDPR Compliance Notice &#x2014; Data Retention Policy<br><br>
                  This record constitutes the secure internal data store under GDPR Article 32.<br>
                  <strong>Retention Expiry:</strong> ${retention} (12 months from submission).<br>
                  <strong>Data Subject Request ID:</strong> ${dsrId}<br><br>
                  This record must be anonymized or permanently deleted by the expiry date.
                  For Right to Erasure (Article 17) requests, reference the Lead ID or DSR ID above.
                </div>
              </div>
              <div class="footer">
                Automated &#x2014; studio.corebitsystems.io &#xB7; Internal Use Only &#xB7; Do Not Forward
              </div>
            </div>
          </body>
        </html>
      `;

      await resend.emails.send({
        from:    'Corebit Studio <noreply@corebitsystems.io>',
        to:      'corebitsystems.office@gmail.com',
        replyTo: email,
        subject: `[Lead #${leadId.slice(0, 8)}] New Inquiry \u00B7 ${dsrId} \u00B7 Retention until ${retention}`,
        html:    htmlContent,
      });
    }
  } catch (err) {
    console.error('Resend email dispatch error:', err);
  }

  return { success: true };
}
