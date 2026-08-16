// BYOK Settings — all AI provider configuration

export type AIProvider = 'openai' | 'google' | 'anthropic' | 'groq';

export interface AppSettings {
  // AI Config
  provider: AIProvider;
  apiKey: string;
  model: string;
  ollamaBaseUrl: string;

  // Supabase Database & Storage BYOK
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseBucket: string;
}

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  openai:    'gpt-4o-mini',
  google:    'gemini-2.0-flash',
  anthropic: 'claude-3-5-haiku-20241022',
  groq:      'qwen/qwen3.6-27b',
};

export const PROVIDER_LABELS: Record<AIProvider, string> = {
  openai:    'OpenAI',
  google:    'Google Gemini',
  anthropic: 'Anthropic',
  groq:      'Groq (Ultra-Fast)',
};

export const PROVIDER_KEY_LINKS: Record<AIProvider, string | null> = {
  openai:    'https://platform.openai.com/api-keys',
  google:    'https://aistudio.google.com/app/apikey',
  anthropic: 'https://console.anthropic.com/settings/keys',
  groq:      'https://console.groq.com/keys',
};

export const SUPABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor:

-- 1. Create notebooks table
CREATE TABLE IF NOT EXISTS notebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create notes / sources table
CREATE TABLE IF NOT EXISTS notebook_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id UUID REFERENCES notebooks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('pdf', 'text', 'link', 'audio')),
  content TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create chat sessions table (AI Agent history)
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'New Chat',
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS and public policy (for BYOK setup)
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebook_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read/Write Notebooks" ON notebooks;
CREATE POLICY "Public Read/Write Notebooks" ON notebooks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read/Write Sources" ON notebook_sources;
CREATE POLICY "Public Read/Write Sources" ON notebook_sources FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read/Write Chat Sessions" ON chat_sessions;
CREATE POLICY "Public Read/Write Chat Sessions" ON chat_sessions FOR ALL USING (true) WITH CHECK (true);
`;

export const DEFAULT_SETTINGS: AppSettings = {
  provider:      'groq',
  apiKey:        '',
  model:         DEFAULT_MODELS.groq,
  ollamaBaseUrl: 'http://localhost:11434',
  supabaseUrl:   '',
  supabaseAnonKey: '',
  supabaseBucket: 'notebooks',
};
