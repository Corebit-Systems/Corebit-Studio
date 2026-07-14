// File: c:\dev\Corebit-Studio\app\api\chat\route.ts
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not configured');
    }

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages: await convertToModelMessages(messages),
      system: "Ты — профессиональный ИИ-сейлз. Твоя задача — коротко и емко консультировать клиентов и собирать их контакты для передачи менеджеру. Отвечай лаконично, держи инициативу в диалоге, всегда задавай встречный вопрос. Категорически запрещено общаться на отвлеченные темы, не связанные с услугами компании.",
    });

    return result.toUIMessageStreamResponse();
  } catch (err: any) {
    console.error('AI chat endpoint error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
