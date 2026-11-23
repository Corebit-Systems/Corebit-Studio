import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';

const MAX_BODY_BYTES = 32 * 1024;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2000;
const RATE_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const MAX_CLIENTS_PER_WINDOW = 4096;
const requestsByClient = new Map<string, number>();
let windowEndsAt = 0;

const ChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    parts: z.array(z.object({
      type: z.literal('text'),
      text: z.string().max(MAX_MESSAGE_LENGTH),
    })).length(1),
  })).min(1).max(MAX_MESSAGES),
});

function allowRequest(request: Request) {
  const now = Date.now();
  if (now >= windowEndsAt) {
    requestsByClient.clear();
    windowEndsAt = now + RATE_WINDOW_MS;
  }

  const client = request.headers.get('x-forwarded-for')?.split(',')[0].trim().slice(0, 45) || 'unknown';
  const count = requestsByClient.get(client) ?? 0;
  if (count >= MAX_REQUESTS_PER_WINDOW || (count === 0 && requestsByClient.size >= MAX_CLIENTS_PER_WINDOW)) {
    return false;
  }

  requestsByClient.set(client, count + 1);
  return true;
}

class RequestTooLarge extends Error {}

async function readChatBody(request: Request): Promise<unknown> {
  let bytes = 0;
  const body = request.body?.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      bytes += chunk.byteLength;
      if (bytes > MAX_BODY_BYTES) throw new RequestTooLarge();
      controller.enqueue(chunk);
    },
  }));
  return new Response(body).json();
}

export async function POST(request: Request) {
  if (!allowRequest(request)) {
    return Response.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.max(1, Math.ceil((windowEndsAt - Date.now()) / 1000))) },
    });
  }

  let body: unknown;
  try {
    body = await readChatBody(request);
  } catch (error) {
    return error instanceof RequestTooLarge
      ? Response.json({ error: 'Request too large' }, { status: 413 })
      : Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = ChatSchema.safeParse(body);
  if (!parsed.success || parsed.data.messages.at(-1)?.role !== 'user') {
    return Response.json({ error: 'Invalid messages' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return Response.json({ error: 'Chat unavailable' }, { status: 503 });

  try {
    const google = createGoogleGenerativeAI({ apiKey });
    const result = streamText({
      model: google('gemini-3.5-flash'),
      messages: parsed.data.messages.map(({ role, parts }) => ({ role, content: parts[0].text })),
      maxOutputTokens: 768,
      maxRetries: 0,
      abortSignal: request.signal,
      system: `Ты консультант Corebit Studio по разработке сайтов, онлайн-бронированию, SEO и автоматизации.
Отвечай кратко на языке посетителя. Задавай по одному вопросу о проекте.
Не выдумывай цены, сроки или гарантии. Не запрашивай контактные данные в чате.
Если посетитель хочет получить точную оценку, оставить заявку или связаться с менеджером,
предложи подготовить заявку через кнопку под чатом. Посетитель сможет проверить текст и отправить его через форму.
Не сообщай, что заявка уже отправлена.`,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('AI chat unavailable', { reason: error instanceof Error ? error.name : 'unknown' });
    return Response.json({ error: 'Chat unavailable' }, { status: 503 });
  }
}
