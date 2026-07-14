// File: c:\dev\Corebit-Studio\app\api\chat\route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Convert messages to Gemini API format. Filter out system/welcome placeholder if any.
    // Roles must alternate between 'user' and 'model'.
    const formattedMessages = messages
      .filter((m: any) => m.role === 'user' || m.role === 'assistant')
      .map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

    const geminiStream = await genAI
      .getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: "Ты — профессиональный ИИ-сейлз веб-студии Corebit Studio. Твоя задача — коротко и емко консультировать клиентов по услугам веб-разработки (создание Next.js сайтов, автоматизация бронирования, CRM-интеграция) и собирать их контакты (телефон, email, имя) для передачи менеджеру. Отвечай лаконично, держи инициативу в диалоге, всегда задавай встречный вопрос. Категорически запрещено общаться на отвлеченные темы, не связанные с услугами компании."
      })
      .generateContentStream({
        contents: formattedMessages
      });

    const stream = GoogleGenerativeAIStream(geminiStream);
    return new StreamingTextResponse(stream);
  } catch (err: any) {
    console.error('AI chat endpoint error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
