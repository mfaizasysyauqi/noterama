import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGroq } from '@ai-sdk/groq';
import { AppSettings } from '@noterama/core';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

interface ChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
  settings: AppSettings;
  systemPrompt: string;
}

function getModel(settings: AppSettings) {
  const { provider, apiKey, model } = settings;

  switch (provider) {
    case 'openai':
      return createOpenAI({ apiKey })(model);
    case 'google':
      return createGoogleGenerativeAI({ apiKey })(model);
    case 'anthropic':
      return createAnthropic({ apiKey })(model);
    case 'groq':
      return createGroq({ apiKey })(model);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export async function POST(req: NextRequest) {
  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { messages, settings, systemPrompt } = body;

  // Validate: all cloud providers require an API key
  if (!settings.apiKey?.trim()) {
    return new Response(
      JSON.stringify({ error: 'API key not configured. Open Settings to add your key.' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const result = streamText({
      model: getModel(settings),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
