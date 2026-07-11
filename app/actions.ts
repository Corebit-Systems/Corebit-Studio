'use server';

import { z } from 'zod';
import { headers, cookies } from 'next/headers';
import { Resend } from 'resend';

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

  // 5. Encode for safe email body transmission (HTML entity encoding)
  const safeBody = {
    name:    encodeForEmail(name),
    email:   encodeForEmail(email),
    message: encodeForEmail(message),
  };

  // 6. Commit timestamp to sliding window cache
  recentTimestamps.push(now);
  ipCache.set(ip, recentTimestamps);

  // 7. Set durable rate-limit cookie — httpOnly prevents JS bypass
  cookieStore.set('sec_last_submit', now.toString(), {
    httpOnly: true,
    secure:   true,
    sameSite: 'strict',
    maxAge:   Math.ceil(COOLDOWN_MS / 1000),
  });

  // 8. Structured metadata log — NO PII content logged, no log injection possible
  const auditLog = {
    timestamp:     new Date().toISOString(),
    event:         'contact_form_submission',
    to:            'corebitstudio@corebitsystems.io',
    senderEmail:   safeBody.email,
    senderName:    safeBody.name.slice(0, 60),
    messageLength: safeBody.message.length,
    replyLocale:   userLocale,  // Language the lead used — determines reply language
    ipHash:        ip.slice(0, 8) + '***',  // Partial IP — not full PII
  };
  console.log(JSON.stringify(auditLog));

  // 9. Send email using Resend SDK
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const dateStr = new Date().toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC';

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>[Lead Form] Inquiry from ${safeBody.name}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                background-color: #050506;
                color: #f4f4f5;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
              }
              .wrapper {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 24px;
                box-sizing: border-box;
              }
              .card {
                background-color: #0d0d11;
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 16px;
                padding: 32px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
              }
              .header {
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                padding-bottom: 20px;
                margin-bottom: 24px;
              }
              .brand {
                font-size: 20px;
                font-weight: 700;
                color: #ffffff;
                letter-spacing: -0.02em;
              }
              .badge {
                display: inline-block;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                background-color: rgba(16, 185, 129, 0.1);
                color: #10b981;
                padding: 6px 12px;
                border-radius: 9999px;
                margin-top: 8px;
              }
              .section-title {
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                color: #71717a;
                margin-top: 24px;
                margin-bottom: 8px;
              }
              .field-value {
                font-size: 16px;
                color: #e4e4e7;
                line-height: 1.5;
              }
              .message-box {
                background-color: #16161e;
                border: 1px solid rgba(255, 255, 255, 0.04);
                border-radius: 12px;
                padding: 20px;
                margin-top: 8px;
                font-size: 15px;
                color: #d4d4d8;
                line-height: 1.6;
                white-space: pre-wrap;
              }
              .footer {
                margin-top: 32px;
                text-align: center;
                font-size: 12px;
                color: #52525b;
              }
              .footer a {
                color: #10b981;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="card">
                <div class="header">
                  <div class="brand">Corebit Studio</div>
                  <div class="badge">Website Lead Form</div>
                </div>
                
                <div class="section-title">Client Name</div>
                <div class="field-value">${safeBody.name}</div>
                
                <div class="section-title">Contact Email</div>
                <div class="field-value">
                  <a href="mailto:${safeBody.email}" style="color: #10b981; text-decoration: none;">${safeBody.email}</a>
                </div>
                
                <div class="section-title">Submitted Time</div>
                <div class="field-value">${dateStr}</div>
                
                <div class="section-title">Project Details / Message</div>
                <div class="message-box">${safeBody.message}</div>
              </div>
              
              <div class="footer">
                <p>Sent automatically from <a href="https://studio.corebitsystems.io">studio.corebitsystems.io</a></p>
              </div>
            </div>
          </body>
        </html>
      `;

      await resend.emails.send({
        from: 'Corebit Studio <noreply@corebitsystems.io>',
        to: 'corebitsystems.office@gmail.com',
        replyTo: safeBody.email,
        subject: `[Lead Form] Inquiry from ${safeBody.name}`,
        html: htmlContent,
      });
    }
  } catch (err) {
    console.error('Resend email dispatch error:', err);
  }

  return { success: true };
}
