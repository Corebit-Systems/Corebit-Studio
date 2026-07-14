// File: c:\dev\Corebit-Studio\app\api\chat\route.ts
import { google } from '@ai-sdk/google';
import { streamText, tool, convertToModelMessages, isStepCount } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not configured');
    }

    const result = await streamText({
      model: google('gemini-3.5-flash'),
      messages: await convertToModelMessages(messages),
      stopWhen: isStepCount(5),
      system: `Ты — старший менеджер по продажам Corebit Studio.
Ты твоя задача — квалифицировать клиента. Тебе нужно узнать:
1. Суть проекта (сайт, сервис, магазин и т.д.)
2. Примерные сроки или бюджет
3. Контактные данные (Телефон или Telegram)

ПРАВИЛА:
- Задавай только по одному вопросу за раз.
- Никогда не проси контакты в первом сообщении.
- ВАЖНО: Как только клиент предоставил ВСЕ три пункта (проект, бюджет, контакт), ты ОБЯЗАН вызвать инструмент 'sendLeadToManager'.
- После вызова инструмента вежливо попрощайся и сообщи, что специалист скоро свяжется с клиентом.`,
      tools: {
        sendLeadToManager: tool({
          description: 'Отправляет итоговую заявку менеджеру в Telegram. Вызывать СТРОГО в конце диалога, когда собраны все данные.',
          inputSchema: z.object({
            clientName: z.string().describe('Имя клиента, если он его назвал, иначе "Не указано"'),
            contactInfo: z.string().describe('Номер телефона, Telegram или email'),
            projectSummary: z.string().describe('Подробное саммари проекта, сроков и бюджета на основе всей переписки')
          }),
          execute: async ({ clientName, contactInfo, projectSummary }) => {
            const text = `🔥 НОВЫЙ ЛИД (Corebit Studio)\n\n👤 Имя: ${clientName}\n📞 Контакты: ${contactInfo}\n💼 Детали проекта: ${projectSummary}`;
            
            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: text,
              }),
            });

            return "Заявка успешно доставлена менеджеру. Поблагодари клиента.";
          }
        })
      }
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
