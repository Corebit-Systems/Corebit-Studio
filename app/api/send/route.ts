import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_for_build');
    const body = await request.json();
    const { name, email, message, source = 'form' } = body;

    // Validate presence of required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields (name, email, message)' },
        { status: 400 }
      );
    }

    const isDirect = source === 'direct';
    const dateStr = new Date().toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC';

    // Define source tags and visual elements
    const sourceLabel = isDirect ? 'Direct Client Email Simulation' : 'Website Lead Form';
    const subjectPrefix = isDirect ? '[Direct Email]' : '[Lead Form]';
    const subject = `${subjectPrefix} Inquiry from ${name}`;

    // Premium HTML Email Template styled for clean, readable layout in Gmail/clients
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
              background-color: ${isDirect ? 'rgba(56, 189, 248, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
              color: ${isDirect ? '#38bdf8' : '#10b981'};
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
                <div class="badge">${sourceLabel}</div>
              </div>
              
              <div class="section-title">Client Name</div>
              <div class="field-value">${name}</div>
              
              <div class="section-title">Contact Email</div>
              <div class="field-value">
                <a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a>
              </div>
              
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

    // Send email using Resend SDK
    const data = await resend.emails.send({
      from: 'Corebit Studio <noreply@corebitsystems.io>',
      to: 'corebitsystems.office@gmail.com',
      replyTo: email,
      subject: subject,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
