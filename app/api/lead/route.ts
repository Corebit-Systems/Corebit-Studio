// File: c:\dev\Corebit-Studio\app\api\lead\route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { contact, message, utmParams, history } = await req.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn('Telegram API Credentials missing in environment variables');
      // Return success simulation for local environment if envs are missing
      return NextResponse.json({ success: true, warning: 'Simulated success (env variables missing)' });
    }

    const utmText = utmParams && Object.entries(utmParams).length > 0
      ? Object.entries(utmParams)
          .map(([key, val]) => `• *${key}*: ${val}`)
          .join('\n')
      : '• Нет UTM-меток';

    const recentHistory = history && Array.isArray(history)
      ? history
          .slice(-5)
          .map((m: any) => `*${m.role === 'user' ? 'User' : 'AI'}*: ${m.content}`)
          .join('\n')
      : 'Нет истории';

    const text = [
      `🚨 *Новый лид с сайта Corebit Studio!*`,
      `👤 *Контакты*: \`${contact}\``,
      `💬 *Последнее сообщение*: ${message || 'Отправлена статическая форма'}`,
      `📌 *UTM-метки*:\n${utmText}`,
      `📜 *Краткая история диалога*:\n${recentHistory}`
    ].join('\n\n');

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Telegram Bot API response error:', errText);
      return NextResponse.json({ success: false, error: 'Telegram Bot API error' });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Lead route error:', err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
