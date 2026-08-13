'use client';

import React, { useState } from 'react';
import { X, Upload, Loader, FileText } from 'lucide-react';

interface Props {
  notebookId: string;
  onAddSource: (title: string, type: 'pdf' | 'text' | 'link' | 'audio', content: string, fileUrl?: string) => Promise<void>;
  uploadFile: (file: File) => Promise<string>;
  onClose: () => void;
}

export default function UploadSourceModal({ onAddSource, uploadFile, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      // 1. Extract text via API
      setExtracting(true);
      const formData = new FormData();
      formData.append('file', file);

      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      const extractData = await extractRes.json();
      if (!extractRes.ok) throw new Error(extractData.error || 'Failed to extract text');
      setExtracting(false);

      // 2. Upload file to Supabase Storage (if configured, optional)
      let publicUrl: string | undefined = undefined;
      try {
        publicUrl = await uploadFile(file);
      } catch (err) {
        console.warn('Storage upload optional error:', err);
      }

      // 3. Save Source to DB
      const fileType = file.type === 'application/pdf' ? 'pdf' : 'text';
      await onAddSource(file.name, fileType, extractData.text || '', publicUrl);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload source';
      setError(msg);
    } finally {
      setLoading(false);
      setExtracting(false);
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
            Upload Document Source
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleUpload} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            border: '2px dashed var(--border-strong)',
            borderRadius: 'var(--r-md)',
            padding: '24px 16px',
            textAlign: 'center',
            background: 'var(--bg-page)',
            cursor: 'pointer',
          }}>
            <input
              type="file"
              accept=".pdf,.txt,.md,.js,.ts,.json"
              onChange={e => setFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <FileText size={24} style={{ color: 'var(--accent-text)' }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                {file ? file.name : 'Click to select PDF or Text document'}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                Supports .pdf, .txt, .md files up to 10MB
              </span>
            </label>
          </div>

          {error && <p style={{ fontSize: 12, color: '#ef4444' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ fontSize: 13 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading || !file} className="btn btn-primary" style={{ fontSize: 13 }}>
              {loading ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
              <span>{extracting ? 'Extracting Text...' : loading ? 'Uploading...' : 'Upload & Add'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
