import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppSettings } from '@noterama/core';

// Survive HMR module re-evaluation by anchoring to globalThis
declare global {
  // eslint-disable-next-line no-var
  var __supabaseInstance: SupabaseClient | undefined;
  // eslint-disable-next-line no-var
  var __supabaseCacheKey: string | undefined;
}

export function getSupabaseClient(settings: AppSettings): SupabaseClient | null {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const envKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
  );

  const url = envUrl || settings.supabaseUrl?.trim();
  
  const settingsKey = settings.supabaseAnonKey?.trim();
  // Filter out invalid keys (e.g. sb_publishable) stored in localStorage
  const validSettingsKey = settingsKey && !settingsKey.startsWith('sb_publishable') ? settingsKey : undefined;
  
  const key = envKey || validSettingsKey;

  if (!url || !key) return null;
  try { const u = new URL(url); if (!['http:', 'https:'].includes(u.protocol)) return null; }
  catch { return null; }

  const cacheKey = `${url}_${key}`;
  if (!globalThis.__supabaseInstance || globalThis.__supabaseCacheKey !== cacheKey) {
    globalThis.__supabaseInstance = createClient(url, key);
    globalThis.__supabaseCacheKey = cacheKey;
  }

  return globalThis.__supabaseInstance;
}
