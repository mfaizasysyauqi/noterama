import { NextRequest, NextResponse } from 'next/server';
import { AIProvider } from '@noterama/core';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { provider, apiKey } = (await req.json()) as { provider: AIProvider; apiKey: string };

    if (!apiKey?.trim()) {
      return NextResponse.json({ models: [] });
    }

    let models: string[] = [];

    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) throw new Error('Failed to fetch OpenAI models');
      const data = await res.json();
      models = data.data
        .map((m: { id: string }) => m.id)
        .filter((id: string) => id.startsWith('gpt-') || id.startsWith('o1') || id.startsWith('o3'))
        .sort();
    } else if (provider === 'google') {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (!res.ok) throw new Error('Failed to fetch Gemini models');
      const data = await res.json();
      models = (data.models || [])
        .map((m: { name: string }) => m.name.replace('models/', ''))
        .filter((id: string) => id.includes('gemini'))
        .sort();
    } else if (provider === 'groq') {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) throw new Error('Failed to fetch Groq models');
      const data = await res.json();
      models = data.data
        .map((m: { id: string }) => m.id)
        .filter((id: string) => !id.includes('whisper') && !id.includes('safetensors'))
        .sort();
    } else if (provider === 'anthropic') {
      // Anthropic does not have an open models list endpoint without high permissions, using official model IDs
      models = [
        'claude-3-5-sonnet-latest',
        'claude-3-5-haiku-latest',
        'claude-3-opus-latest',
        'claude-3-7-sonnet-latest',
      ];
    }

    return NextResponse.json({ models });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching models';
    return NextResponse.json({ error: msg, models: [] }, { status: 400 });
  }
}
