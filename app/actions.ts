'use server';

import { z } from 'zod';
import { headers, cookies } from 'next/headers';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';
import { paymentOptions, pricingPlans } from '@/components/pricingInquiry';
import { isProjectReference, projectReferences, type ProjectReferenceId } from '@/components/projectReference';

// ── In-memory sliding-window rate limiter ────────────────────────────────────
// This limiter and the browser cooldown complement platform-level rate limits.
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
  consent: z.literal('accepted'),
  reference: z.custom<ProjectReferenceId>(isProjectReference).optional(),
  pricing: z.object({
    plan: z.enum(pricingPlans),
    payment: z.enum(paymentOptions),
  }).optional(),
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
  const headerList = await headers();
  const rawIp = headerList.get('x-forwarded-for') || headerList.get('x-real-ip') || '127.0.0.1';
  const ip = rawIp.split(',')[0].trim().slice(0, 45); // Bound IPv6 length
  const now = Date.now();

  const timestamps = ipCache.get(ip) || [];
  const recentTimestamps = timestamps.filter(t => now - t < WINDOW_MS);

  if (recentTimestamps.length >= MAX_HITS) {
    return { success: false, errorType: 'rate' };
  }

  // 3. Cookie-based rate limiter: max 1 submission per COOLDOWN_MS
  const cookieStore = await cookies();
  const lastSubmitCookie = cookieStore.get('sec_last_submit')?.value;
  if (lastSubmitCookie && now - parseInt(lastSubmitCookie, 10) < COOLDOWN_MS) {
    return { success: false, errorType: 'rate' };
  }

  // 4. Zod structural validation — rejects malformed, oversized, or HTML-injected input
  const plan = formData.get('plan');
  const payment = formData.get('payment');
  const raw = {
    name:      formData.get('name'),
    email:     formData.get('email'),
    message:   formData.get('message'),
    locale:    formData.get('locale') ?? 'en',
    bot_field: formData.get('bot_field') ?? '',
    consent:   formData.get('consent'),
    reference: formData.get('reference') ?? undefined,
    pricing:   plan === null && payment === null ? undefined : { plan, payment },
  };

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    // Classify error type without exposing internal Zod field paths to client
    const isSpamLike = parsed.error.issues.some(
      (issue) => issue.path[0] === 'email' || issue.message.includes('HTML')
    );
    return { success: false, errorType: isSpamLike ? 'spam' : 'general' };
  }

  const { name, email, message, locale: userLocale, pricing, reference } = parsed.data;
  const planNames = { starter: 'Starter', business: 'Business', enterprise: 'Enterprise' };
  const paymentNames = { full: 'Full payment (-10%)', split: 'Milestone payments (50/50)' };
  const projectTitle = reference ? projectReferences[reference] : undefined;
  const packageName = pricing ? planNames[pricing.plan] : undefined;
  const packageDetails = pricing ? `${planNames[pricing.plan]} · ${paymentNames[pricing.payment]}` : undefined;
  const inquiryContext = [packageName, projectTitle].filter(Boolean).join(' / ');

  // 5. Generate secure Lead ID — primary GDPR reference for this record
  const leadId    = randomUUID();
  const dsrId     = `R-${leadId.slice(0, 4).toUpperCase()}`;
  const retention = retentionExpiry();

  // 6. Encode for safe email body transmission (HTML entity encoding)
  const safeBody = {
    name:    encodeForEmail(name),
    email:   encodeForEmail(email),
    message: message.split(/\r\n|\n|\r/).map(encodeForEmail).join('<br>'),
  };
  const replyHref = `mailto:${encodeURIComponent(email).replace('%40', '@')}`;

  // 7. Commit timestamp to sliding window cache
  recentTimestamps.push(now);
  ipCache.set(ip, recentTimestamps);

  // Structured audit log — Lead ID only, no form content
  const auditLog = {
    timestamp:       new Date().toISOString(),
    event:           'contact_form_attempt',
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
  //     The subject identifies the lead and selected service context without customer text.
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
              .msg-box { background: #16161e; border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 18px; font-size: 14px; color: #d4d4d8; overflow-wrap: anywhere; line-height: 1.6; margin-top: 6px; }
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

                <div class="label">Client Name</div>
                <div class="value">${safeBody.name}</div>

                <div class="label">Contact Email</div>
                <div class="value">${safeBody.email}</div>
                <a href="${replyHref}" style="display:inline-block;margin-top:12px;padding:11px 16px;border-radius:8px;background:#047857;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">Reply to client</a>

                ${projectTitle ? `
                  <div class="label">Reference Project</div>
                  <div class="value">${encodeForEmail(projectTitle)}</div>
                ` : ''}

                ${packageDetails ? `
                  <div class="label">Selected Package</div>
                  <div class="value">${packageDetails}</div>
                ` : ''}

                <div class="label">Project Details</div>
                <div class="msg-box">${safeBody.message}</div>

                <div class="label">Locale and submission time</div>
                <div class="value">${userLocale} · ${dateStr}</div>

                <div class="label">Lead ID (Secure Reference)</div>
                <div class="value" style="font-family:monospace;color:#34d399;">${leadId}</div>

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

      const textContent = [
        'Corebit Studio — New inquiry',
        `Client: ${name.replace(/\r\n|\n|\r/g, ' ')}`,
        `Reply to: ${email}`,
        projectTitle && `Reference project: ${projectTitle}`,
        packageDetails && `Selected package: ${packageDetails}`,
        '',
        'Project details',
        message,
        '',
        `Locale: ${userLocale} · Submitted: ${dateStr}`,
        `Lead ID: ${leadId}`,
        `Data Subject Request ID: ${dsrId}`,
        `Retention expiry: ${retention}. Anonymize or delete this record by the expiry date.`,
        'Internal use only. Do not forward.',
      ].filter((line) => line !== undefined).join('\n');

      const { data, error } = await resend.emails.send({
        from:    'Corebit Studio <noreply@corebitsystems.io>',
        to:      'corebitsystems.office@gmail.com',
        replyTo: email,
        subject: `[Lead #${leadId.slice(0, 8)}] New Inquiry${inquiryContext ? ` · ${inquiryContext}` : ''} · ${dsrId} · Retention until ${retention}`,
        html:    htmlContent,
        text:    textContent,
      });

      if (error || !data?.id) {
        console.error('Contact form delivery rejected', { leadId, reason: error?.name });
        return { success: false, errorType: 'general' };
      }
    } else {
      console.error('Contact form delivery is not configured');
      return { success: false, errorType: 'general' };
    }
  } catch (err) {
    console.error('Contact form delivery failed', { leadId, reason: err instanceof Error ? err.name : 'unknown' });
    return { success: false, errorType: 'general' };
  }

  cookieStore.set('sec_last_submit', Date.now().toString(), {
    httpOnly: true,
    secure:   true,
    sameSite: 'strict',
    maxAge:   Math.ceil(COOLDOWN_MS / 1000),
  });

  return { success: true };
}
