'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Key, ExternalLink, CheckCircle, AlertCircle, Loader, Database, Copy, Check, BookOpen } from 'lucide-react';
import {
  AppSettings,
  AIProvider,
  PROVIDER_LABELS,
  PROVIDER_KEY_LINKS,
  DEFAULT_MODELS,
  SUPABASE_SETUP_SQL,
} from '@noterama/core';

interface Props {
  settings: AppSettings;
  onUpdate: (patch: Partial<AppSettings>) => void;
  onClose: () => void;
}

const PROVIDERS: AIProvider[] = ['groq'];

export default function SettingsModal({ settings, onUpdate, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'ai' | 'database' | 'tutorial'>('ai');

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'ok' | 'error' | null>(null);
  const [testMsg, setTestMsg] = useState('');

  // Auto-fetch models state
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelFetchError, setModelFetchError] = useState<string | null>(null);

  // Copy SQL script state
  const [copiedSql, setCopiedSql] = useState(false);

  const keyLink = PROVIDER_KEY_LINKS[settings.provider];

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Fetch available models from API key
  const fetchModels = useCallback(async (provider: AIProvider, apiKey: string) => {
    if (!apiKey && provider !== 'anthropic') {
      setAvailableModels([]);
      return;
    }

    setLoadingModels(true);
    setModelFetchError(null);

    try {
      const res = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, apiKey }),
      });
      const data = await res.json();

      if (res.ok && data.models && data.models.length > 0) {
        setAvailableModels(data.models);
        if (!data.models.includes(settings.model)) {
          onUpdate({ model: data.models[0] });
        }
      } else {
        setAvailableModels([]);
        if (data.error) setModelFetchError(data.error);
      }
    } catch {
      setModelFetchError('Failed to load models list');
      setAvailableModels([]);
    } finally {
      setLoadingModels(false);
    }
  }, [settings.model, onUpdate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchModels(settings.provider, settings.apiKey);
    }, 400);
    return () => clearTimeout(timer);
  }, [settings.provider, settings.apiKey, fetchModels]);

  async function testConnection() {
    setTesting(true);
    setTestResult(null);
    setTestMsg('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Reply with exactly: OK' }],
          settings,
          systemPrompt: 'You are a connection test. Reply with exactly: OK',
        }),
      });
      if (res.ok) {
        setTestResult('ok');
        setTestMsg('Connection successful!');
      } else {
        const json = await res.json().catch(() => ({}));
        setTestResult('error');
        setTestMsg(json.error ?? `Error ${res.status}`);
      }
    } catch (e) {
      setTestResult('error');
      setTestMsg(e instanceof Error ? e.message : 'Network error');
    } finally {
      setTesting(false);
    }
  }

  return (
    /* Backdrop */
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal Container */}
      <div style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-strong)',
        borderRadius: 12,
        width: '100%',
        maxWidth: 540,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Key size={16} style={{ color: 'var(--accent-text)' }} />
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
              Settings & Integrations (BYOK)
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-tertiary)', display: 'flex', padding: 4,
              borderRadius: 'var(--r-sm)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-panel)',
          padding: '0 12px',
          gap: 4,
        }}>
          <button
            onClick={() => setActiveTab('ai')}
            style={{
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: 500,
              color: activeTab === 'ai' ? 'var(--accent-text)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'ai' ? '2px solid var(--accent)' : '2px solid transparent',
              background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Key size={14} /> AI Provider
          </button>
          <button
            onClick={() => setActiveTab('database')}
            style={{
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: 500,
              color: activeTab === 'database' ? 'var(--accent-text)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'database' ? '2px solid var(--accent)' : '2px solid transparent',
              background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Database size={14} /> Supabase DB & Storage
          </button>
          <button
            onClick={() => setActiveTab('tutorial')}
            style={{
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: 500,
              color: activeTab === 'tutorial' ? 'var(--accent-text)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'tutorial' ? '2px solid var(--accent)' : '2px solid transparent',
              background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <BookOpen size={14} /> Tutorial Setup
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* TAB 1: AI PROVIDER */}
          {activeTab === 'ai' && (
            <>
              {/* Provider Selection */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  AI Provider
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {PROVIDERS.map(p => (
                    <button
                      key={p}
                      onClick={() => onUpdate({ provider: p, model: DEFAULT_MODELS[p] })}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--r-md)',
                        border: `1px solid ${settings.provider === p ? 'var(--accent)' : 'var(--border-strong)'}`,
                        background: settings.provider === p ? 'var(--accent-subtle)' : 'var(--bg-hover)',
                        color: settings.provider === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                        fontSize: 13, fontWeight: 500,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'all 150ms',
                      }}
                    >
                      {PROVIDER_LABELS[p]}
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    API Key
                  </label>
                  {keyLink && (
                    <a href={keyLink} target="_blank" rel="noreferrer"
                      style={{ fontSize: 12, color: 'var(--accent-text)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                      Get key <ExternalLink size={11} />
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={e => onUpdate({ apiKey: e.target.value })}
                  placeholder={`${PROVIDER_LABELS[settings.provider]} API key...`}
                  className="input-notion"
                  style={{ fontSize: 13 }}
                  autoComplete="off"
                />
                <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>
                  Stored locally in your browser. Never sent to our servers.
                </p>
              </div>

              {/* Model Dropdown */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Selected Model
                  </label>
                  {loadingModels && (
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Loader size={11} style={{ animation: 'spin 1s linear infinite' }} /> Fetching models...
                    </span>
                  )}
                </div>

                <select
                  value={settings.model}
                  onChange={e => onUpdate({ model: e.target.value })}
                  disabled={loadingModels || availableModels.length === 0}
                  className="input-notion"
                  style={{
                    fontSize: 13,
                    cursor: availableModels.length > 0 ? 'pointer' : 'not-allowed',
                    opacity: availableModels.length > 0 ? 1 : 0.6,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    paddingRight: '36px',
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                  }}
                >
                  {availableModels.length > 0 ? (
                    availableModels.map(m => (
                      <option key={m} value={m} style={{ background: 'var(--bg-panel)', color: 'white' }}>
                        {m}
                      </option>
                    ))
                  ) : (
                    <option value={settings.model} style={{ background: 'var(--bg-panel)', color: 'white' }}>
                      {settings.apiKey ? 'No models found for this API Key' : 'Enter API Key above to select model'}
                    </option>
                  )}
                </select>

                {modelFetchError && (
                  <p style={{ fontSize: 11, color: '#ef4444', marginTop: 6 }}>
                    {modelFetchError}
                  </p>
                )}
              </div>

              {/* Test result */}
              {testResult && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  padding: '10px 14px',
                  borderRadius: 'var(--r-md)',
                  background: testResult === 'ok' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${testResult === 'ok' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                }}>
                  {testResult === 'ok'
                    ? <CheckCircle size={15} style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }} />
                    : <AlertCircle size={15} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                  }
                  <span style={{ fontSize: 13, color: testResult === 'ok' ? '#22c55e' : '#ef4444' }}>
                    {testMsg}
                  </span>
                </div>
              )}
            </>
          )}

          {/* TAB 2: SUPABASE DATABASE & STORAGE */}
          {activeTab === 'database' && (
            <>
              <div style={{
                background: 'rgba(35, 131, 226, 0.08)',
                border: '1px solid rgba(35, 131, 226, 0.2)',
                borderRadius: 'var(--r-md)',
                padding: '12px 14px',
                fontSize: 12,
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}>
                Hubungkan project <strong>Supabase</strong> pribadi Anda untuk menyimpan catatan, notebook, dan berkas audio secara independen.
              </div>

              {/* Supabase URL */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={settings.supabaseUrl || ''}
                  onChange={e => onUpdate({ supabaseUrl: e.target.value })}
                  placeholder="https://xyzxyz.supabase.co"
                  className="input-notion"
                  style={{ fontSize: 13 }}
                />
              </div>

              {/* Supabase Anon Key */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Supabase Anon / Public API Key
                </label>
                <input
                  type="password"
                  value={settings.supabaseAnonKey || ''}
                  onChange={e => onUpdate({ supabaseAnonKey: e.target.value })}
                  placeholder="eyJhYmdj... (Project API Key)"
                  className="input-notion"
                  style={{ fontSize: 13 }}
                  autoComplete="off"
                />
              </div>

              {/* Supabase Bucket */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Storage Bucket Name
                </label>
                <input
                  type="text"
                  value={settings.supabaseBucket || 'notebooks'}
                  onChange={e => onUpdate({ supabaseBucket: e.target.value })}
                  placeholder="notebooks"
                  className="input-notion"
                  style={{ fontSize: 13 }}
                />
              </div>
            </>
          )}

          {/* TAB 3: TUTORIAL SETUP */}
          {activeTab === 'tutorial' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                  1. Buat Project Supabase
                </h4>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Buka console <a href="https://database.new" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-text)' }}>database.new</a> lalu buat project Supabase baru secara gratis. Dapatkan URL & Anon Key dari menu Settings &gt; API.
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    2. Jalankan Script SQL berikut
                  </h4>
                  <button
                    onClick={handleCopySql}
                    className="btn btn-ghost"
                    style={{ fontSize: 12, padding: '4px 8px', border: '1px solid var(--border-strong)', color: 'var(--accent-text)' }}
                  >
                    {copiedSql ? <Check size={12} /> : <Copy size={12} />}
                    {copiedSql ? 'Copied!' : 'Copy SQL'}
                  </button>
                </div>

                <pre style={{
                  background: 'var(--bg-page)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  padding: 12,
                  fontSize: 11,
                  fontFamily: 'monospace',
                  color: 'var(--text-secondary)',
                  overflowX: 'auto',
                  maxHeight: 180,
                }}>
                  {SUPABASE_SETUP_SQL}
                </pre>
              </div>

              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                  3. Siapkan Storage Bucket
                </h4>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Buka menu <strong>Storage</strong> di Supabase, buat bucket baru bernama <code>notebooks</code> dan jadikan <strong>Public</strong> agar berkas audio &amp; dokumen dapat diakses secara instan oleh Noterama.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: 8, justifyContent: 'flex-end',
          padding: '14px 20px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-panel)',
        }}>
          {activeTab === 'ai' && (
            <button
              onClick={testConnection}
              disabled={testing}
              className="btn btn-ghost"
              style={{
                fontSize: 13, border: '1px solid var(--border-strong)',
                opacity: testing ? 0.6 : 1,
              }}
            >
              {testing ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
          )}
          <button onClick={onClose} className="btn btn-primary" style={{ fontSize: 13 }}>
            Done
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
