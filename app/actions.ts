'use server';

import { headers, cookies } from 'next/headers';

const ipCache = new Map<string, number[]>();

function sanitize(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export async function submitContactForm(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;
  const honeypot = formData.get('bot_field') as string;

  // 1. Honeypot Check
  if (honeypot) {
    return { success: false, errorType: 'spam' };
  }

  // 2. IP-based Rate Limiter (max 3 submissions in 5 minutes)
  const headerList = headers();
  const rawIp = headerList.get('x-forwarded-for') || headerList.get('x-real-ip') || '127.0.0.1';
  const ip = rawIp.split(',')[0].trim();
  const now = Date.now();

  const timestamps = ipCache.get(ip) || [];
  const recentTimestamps = timestamps.filter(t => now - t < 300000);

  if (recentTimestamps.length >= 3) {
    return { success: false, errorType: 'rate' };
  }

  // 3. Cookie-based Rate Limiter (max 1 submission per 60 seconds)
  const cookieStore = cookies();
  const lastSubmitCookie = cookieStore.get('sec_last_submit')?.value;
  if (lastSubmitCookie && now - parseInt(lastSubmitCookie) < 60000) {
    return { success: false, errorType: 'rate' };
  }

  // 4. Input Validation & Sanitization
  if (!name || !email || !message) {
    return { success: false, errorType: 'general' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, errorType: 'spam' };
  }

  const cleanName = sanitize(name);
  const cleanEmail = sanitize(email);
  const cleanMessage = sanitize(message);

  // If any inputs were suspicious and modified during sanitization, flag as spam
  if (name !== cleanName || email !== cleanEmail || message !== cleanMessage) {
    return { success: false, errorType: 'spam' };
  }

  // Enforce sliding window timestamp caches
  recentTimestamps.push(now);
  ipCache.set(ip, recentTimestamps);

  // Set the rate limit cookie
  cookieStore.set('sec_last_submit', now.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60
  });

  // Log receipt (simulating safe email transmission to corebitstudio@corebitsystems.io)
  console.log(`[Form Submission Received] to: corebitstudio@corebitsystems.io
Sender: ${cleanName} <${cleanEmail}>
Message: ${cleanMessage}`);

  return { success: true };
}
