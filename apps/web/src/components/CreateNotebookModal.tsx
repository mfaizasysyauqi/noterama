'use client';

import React, { useState } from 'react';
import { X, Plus, Loader } from 'lucide-react';

interface Props {
  onCreate: (title: string, description: string, techStack: string[]) => Promise<void>;
  onClose: () => void;
}

export default function CreateNotebookModal({ onCreate, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const techStack = techInput.split(',').map(t => t.trim()).filter(Boolean);
      await onCreate(title, description, techStack);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create notebook';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-strong)',
        borderRadius: 12,
        width: '100%',
        maxWidth: 440,
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
            Create New Notebook
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>
              Notebook Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Supabase Realtime Engine"
              className="input-notion"
              style={{ fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief summary of what this notebook is about..."
              className="input-notion"
              style={{ fontSize: 13, minHeight: 80, resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>
              Tech Stack (Comma Separated)
            </label>
            <input
              type="text"
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              placeholder="React, Next.js, Supabase, Tailwind"
              className="input-notion"
              style={{ fontSize: 13 }}
            />
          </div>

          {error && <p style={{ fontSize: 12, color: '#ef4444' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ fontSize: 13 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading || !title.trim()} className="btn btn-primary" style={{ fontSize: 13 }}>
              {loading ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />}
              <span>{loading ? 'Creating...' : 'Create'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
