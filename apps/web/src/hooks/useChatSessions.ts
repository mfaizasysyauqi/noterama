'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { getSupabaseClient } from '@/lib/supabase';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  created_at?: string;
  updated_at?: string;
}

const LOCAL_KEY = 'noterama_chat_sessions';

function localLoad(): ChatSession[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function localSave(sessions: ChatSession[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(sessions)); } catch {}
}

export function useChatSessions() {
  const { settings } = useSettings();

  const supabase = useMemo(
    () => getSupabaseClient(settings),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings.supabaseUrl, settings.supabaseAnonKey]
  );

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loaded, setLoaded]     = useState(false);

  /* ── Load sessions ──────────────────────────────────────────────── */
  const loadSessions = useCallback(async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('id, name, messages, created_at, updated_at')
          .order('updated_at', { ascending: false });
        if (!error && data) {
          const mapped: ChatSession[] = data.map(r => ({
            id: r.id,
            name: r.name,
            messages: (r.messages as ChatMessage[]) || [],
            created_at: r.created_at,
            updated_at: r.updated_at,
          }));
          setSessions(mapped);
          localSave(mapped);
          setLoaded(true);
          return;
        }
      } catch { /* fall through to local */ }
    }
    // Offline fallback
    const local = localLoad();
    setSessions(local);
    setLoaded(true);
  }, [supabase]);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  /* ── Create ─────────────────────────────────────────────────────── */
  const createSession = useCallback(async (name = 'New Chat'): Promise<ChatSession> => {
    const welcome: ChatMessage = { role: 'assistant', content: '**Noterama Agent Ready.**\nOpen a file to begin.' };
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('chat_sessions')
          .insert({ name, messages: [welcome] })
          .select()
          .single();
        if (!error && data) {
          const s: ChatSession = { id: data.id, name: data.name, messages: data.messages as ChatMessage[] };
          setSessions(prev => { const next = [s, ...prev]; localSave(next); return next; });
          return s;
        }
      } catch { /* fallback */ }
    }
    // Local fallback
    const s: ChatSession = { id: `local-${Date.now()}`, name, messages: [welcome] };
    setSessions(prev => { const next = [s, ...prev]; localSave(next); return next; });
    return s;
  }, [supabase]);

  /* ── Update (messages + name) ───────────────────────────────────── */
  const updateSession = useCallback(async (id: string, patch: Partial<Pick<ChatSession, 'name' | 'messages'>>) => {
    setSessions(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...patch } : s);
      localSave(next);
      return next;
    });
    if (supabase && !id.startsWith('local-')) {
      try {
        await supabase
          .from('chat_sessions')
          .update({ ...patch, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch { /* silent */ }
    }
  }, [supabase]);

  /* ── Delete ─────────────────────────────────────────────────────── */
  const deleteSession = useCallback(async (id: string) => {
    setSessions(prev => { const next = prev.filter(s => s.id !== id); localSave(next); return next; });
    if (supabase && !id.startsWith('local-')) {
      try { await supabase.from('chat_sessions').delete().eq('id', id); } catch { /* silent */ }
    }
  }, [supabase]);

  return { sessions, setSessions, loaded, createSession, updateSession, deleteSession };
}
