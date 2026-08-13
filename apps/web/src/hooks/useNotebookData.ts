'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { getSupabaseClient } from '@/lib/supabase';

export interface DbNotebook {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  created_at: string;
}

export interface DbSource {
  id: string;
  notebook_id: string;
  title: string;
  type: 'pdf' | 'text' | 'link' | 'audio';
  content: string;
  file_url?: string;
  created_at: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (id: string) => UUID_RE.test(id);

export function useNotebookData() {
  const { settings } = useSettings();
  const [notebooks, setNotebooks] = useState<DbNotebook[]>([]);
  const [sources, setSources]     = useState<DbSource[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const supabase = useMemo(
    () => getSupabaseClient(settings),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings.supabaseUrl, settings.supabaseAnonKey]
  );

  /* ── Fetch all notebooks & sources ─────────────────────────────────── */
  const fetchAll = useCallback(async () => {
    if (!supabase) return;
    setLoading(true); setError(null);
    try {
      const { data: nbData, error: nbErr } = await supabase
        .from('notebooks').select('*').order('created_at', { ascending: false });
      if (nbErr) throw nbErr;
      setNotebooks(nbData || []);

      const { data: srcData, error: srcErr } = await supabase
        .from('notebook_sources').select('*').order('created_at', { ascending: false });
      if (srcErr) throw srcErr;
      setSources(srcData || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to fetch data');
    } finally { setLoading(false); }
  }, [supabase]);

  const fetchNotebooks = fetchAll;

  const fetchSources = useCallback(async (notebookId: string) => {
    if (!supabase || !isUUID(notebookId)) return;
    try {
      const { data, error: err } = await supabase
        .from('notebook_sources').select('*')
        .eq('notebook_id', notebookId).order('created_at', { ascending: false });
      if (err) throw err;
      setSources(prev => [
        ...prev.filter(s => s.notebook_id !== notebookId),
        ...(data || []),
      ]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : (e as { message?: string })?.message ?? JSON.stringify(e);
      console.error('Failed to fetch sources:', msg);
    }
  }, [supabase]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Notebooks CRUD ────────────────────────────────────────────────── */
  const createNotebook = async (title: string, description = '') => {
    if (!supabase) return null;
    try {
      const payload: Record<string, unknown> = { title };
      if (description) payload.description = description;
      
      const { data, error: err } = await supabase
        .from('notebooks')
        .insert([payload])
        .select()
        .single();

      if (err) {
        console.error('createNotebook error:', err.message, err.details);
        alert(`Failed to save folder to Supabase: ${err.message}`);
        return null;
      }
      setNotebooks(prev => [data, ...prev]);
      return data as DbNotebook;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('createNotebook exception:', msg);
      alert(`Exception saving folder: ${msg}`);
      return null;
    }
  };

  const updateNotebook = async (id: string, patch: Partial<Pick<DbNotebook, 'title' | 'description' | 'tech_stack'>>) => {
    if (!supabase || !isUUID(id)) return;
    const { error: err } = await supabase.from('notebooks').update(patch).eq('id', id);
    if (err) console.error('updateNotebook error:', err.message);
    else setNotebooks(prev => prev.map(n => n.id === id ? { ...n, ...patch } : n));
  };

  const deleteNotebook = async (id: string) => {
    if (!supabase || !isUUID(id)) return;
    const { error: err } = await supabase.from('notebooks').delete().eq('id', id);
    if (err) console.error('deleteNotebook error:', err.message);
    else setNotebooks(prev => prev.filter(n => n.id !== id));
  };

  /* ── Sources CRUD ──────────────────────────────────────────────────── */
  const createSource = async (notebookId: string, title: string, content = '') => {
    if (!supabase) return null;
    if (!isUUID(notebookId)) {
      alert(`Cannot create file: Parent folder ID "${notebookId}" is not a valid UUID in Supabase. Please create a new folder first.`);
      return null;
    }
    try {
      const { data, error: err } = await supabase
        .from('notebook_sources')
        .insert([{ notebook_id: notebookId, title, type: 'text', content }])
        .select()
        .single();

      if (err) {
        console.error('createSource error:', err.message, err.details);
        alert(`Failed to save file to Supabase: ${err.message}`);
        return null;
      }
      setSources(prev => [data, ...prev]);
      return data as DbSource;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('createSource exception:', msg);
      alert(`Exception saving file: ${msg}`);
      return null;
    }
  };

  const updateSource = async (id: string, patch: Partial<Pick<DbSource, 'title' | 'content' | 'notebook_id'>>) => {
    if (!supabase || !isUUID(id)) return;
    const { error: err } = await supabase.from('notebook_sources').update(patch).eq('id', id);
    if (err) console.error('updateSource error:', err.message);
    else setSources(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const deleteSource = async (id: string) => {
    if (!supabase || !isUUID(id)) return;
    const { error: err } = await supabase.from('notebook_sources').delete().eq('id', id);
    if (err) console.error('deleteSource error:', err.message);
    else setSources(prev => prev.filter(s => s.id !== id));
  };

  /* ── Legacy addSource for UploadSourceModal ────────────────────────── */
  const addSource = async (notebookId: string, title: string, type: DbSource['type'], content: string, fileUrl?: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error: err } = await supabase
      .from('notebook_sources')
      .insert([{ notebook_id: notebookId, title, type, content, file_url: fileUrl }])
      .select().single();
    if (err) throw err;
    setSources(prev => [data, ...prev]);
    return data as DbSource;
  };

  /* ── File upload ───────────────────────────────────────────────────── */
  const uploadFile = async (file: File) => {
    if (!supabase) throw new Error('Supabase not configured');
    const bucket = settings.supabaseBucket || 'notebooks';
    const filePath = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { error: err } = await supabase.storage.from(bucket).upload(filePath, file);
    if (err) throw err;
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  return {
    notebooks, sources, loading, error,
    isSupabaseConnected: !!supabase,
    fetchNotebooks, fetchSources,
    createNotebook, updateNotebook, deleteNotebook,
    createSource, updateSource, deleteSource,
    addSource, uploadFile,
  };
}
