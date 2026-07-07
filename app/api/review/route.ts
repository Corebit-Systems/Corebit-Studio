import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_for_build');
    const body = await request.json();
    const { name, company, rating, text } = body;

    // Validate inputs
    if (!name || !company || !rating || !text) {
      return NextResponse.json(
        { error: 'Missing required fields (name, company, rating, text)' },
        { status: 400 }
      );
    }

    const subject = `[Corebit Studio] Новый отзыв на модерацию от ${name}`;
    const dateStr = new Date().toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC';

    // Format HTML Email Template for Review Moderation
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #050506;
              color: #f4f4f5;
              margin: 0;
              padding: 0;
            }
            .wrapper {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 24px;
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
              font-size: 12px;
              color: #52525b;
              border-top: 1px solid rgba(255, 255, 255, 0.08);
              padding-top: 16px;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="card">
              <div class="header">
                <div class="brand">Corebit Studio</div>
                <div class="badge">Новый отзыв на модерацию</div>
              </div>

              <div class="section-title">Автор отзыва</div>
              <div class="field-value"><strong>${name}</strong></div>

              <div class="section-title">Компания & Сфера</div>
              <div class="field-value">${company}</div>

              <div class="section-title">Рейтинг</div>
              <div class="field-value" style="color: #fbbf24; font-size: 20px;">
                ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)
              </div>

              <div class="section-title">Текст отзыва</div>
              <div class="message-box">${text}</div>

              <div class="footer">
                Отправлено автоматически с corebit-studio.vercel.app в ${dateStr}.
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: 'Corebit Studio <noreply@corebitsystems.io>',
      to: ['corebitsystems.office@gmail.com'],
      subject: subject,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error dispatching review moderation email:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
