'use server';

import { z } from 'zod';
import { headers, cookies } from 'next/headers';

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
  if (honeypot) {
    return { success: false, errorType: 'spam' };
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

  // 9. TODO: Replace this block with a real email transport (e.g. Resend, Nodemailer)
  // Example payload ready for transmission:
  // await sendEmail({
  //   to: 'corebitstudio@corebitsystems.io',
  //   subject: `New contact from ${safeBody.name}`,
  //   html: `<p><strong>From:</strong> ${safeBody.name} &lt;${safeBody.email}&gt;</p>
  //          <p><strong>Message:</strong></p><p>${safeBody.message}</p>`,
  // });

  return { success: true };
}
