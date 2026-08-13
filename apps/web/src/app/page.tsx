'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Folder,
  FolderOpen,
  FileText,
  Bot,
  Database,
  ShieldCheck,
  Zap,
  Layers,
  Headphones,
  Github,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  Cpu,
  Lock,
  Code2,
  Terminal,
  Server,
  Command,
  ArrowUpRight,
} from 'lucide-react';

export default function AntiSlopLandingPage() {
  const [activeDemoTab, setActiveDemoTab] = useState<'explorer' | 'editor' | 'agent'>('agent');
  const [demoQuery, setDemoQuery] = useState('Tolong rangkum semua file di folder AI Research');
  const [demoMessages, setDemoMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: 'assistant',
      content: '**Noterama Agent Active.** Reading 4 workspace files & 2 nested folders...',
    },
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoQuery.trim() || isSimulating) return;
    const q = demoQuery;
    setDemoQuery('');
    setDemoMessages(prev => [...prev, { role: 'user', content: q }]);
    setIsSimulating(true);

    setTimeout(() => {
      setDemoMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Rangkuman Folder **AI Research**:\n\n1. **agent-context.md** — Berisi konfigurasi prompt & memori hirarki folder.\n2. **groq-models.md** — Daftar model Groq termasuk Llama 3.3 70B & Mixtral.\n\nSemua file ini tersimpan aman di Supabase database kamu!`,
        },
      ]);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div style={{ background: '#080a0f', color: '#e2e8f0', minHeight: '100vh', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      
      {/* ── Top Announcement Bar ────────────────────────────────────────────── */}
      <div style={{
        background: '#0d1117', borderBottom: '1px solid #1e2638',
        padding: '8px 16px', textAlign: 'center', fontSize: 12, color: '#94a3b8',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
      }}>
        <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '1px 6px', borderRadius: 4, fontWeight: 600, fontSize: 11 }}>NEW</span>
        <span>Noterama Studio v2.0 is live with Supabase Multi-Session AI History</span>
        <Link href="/studio" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          Launch App <ArrowRight size={12} />
        </Link>
      </div>

      {/* ── Navbar ───────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(12px)', background: 'rgba(8, 10, 15, 0.85)',
        borderBottom: '1px solid #191f2e',
        padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(56, 189, 248, 0.3)'
          }}>
            <Sparkles size={15} style={{ color: '#ffffff' }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Noterama <span style={{ color: '#38bdf8', fontSize: 11, fontWeight: 600, marginLeft: 2, padding: '2px 6px', borderRadius: 4, background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>STUDIO</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 13, fontWeight: 500 }} className="desktop-only">
          <a href="#demo" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Live Interactive Demo</a>
          <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Core Features</a>
          <a href="#architecture" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>System Architecture</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href="https://github.com/mfaizasysyauqi/noterama"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6,
              background: '#131824', border: '1px solid #232d42',
              color: '#cbd5e1', fontSize: 12.5, fontWeight: 500, textDecoration: 'none'
            }}
          >
            <Github size={14} />
            <span className="desktop-only">GitHub</span>
          </a>
          <Link
            href="/studio"
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 6,
              background: '#0284c7', color: '#ffffff', fontSize: 12.5, fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 0 16px rgba(2, 132, 199, 0.35)', transition: 'background 0.2s'
            }}
          >
            <span>Launch Studio</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </nav>

      {/* ── Editorial Hero Section (Anti-AI-Slop Layout) ──────────────────── */}
      <section style={{ padding: '80px 28px 60px', maxWidth: 1200, margin: '0 auto' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          
          {/* Left Column: Stark Typographic Pitch */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 4,
              background: '#121826', border: '1px solid #232e47',
              color: '#38bdf8', fontSize: 11, fontWeight: 600, fontFamily: 'monospace', marginBottom: 20
            }}>
              <span>01 // BESPOKE KNOWLEDGE ENGINE</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 4.5vw, 54px)', fontWeight: 800, color: '#f8fafc',
              lineHeight: 1.08, letterSpacing: '-0.03em', margin: '0 0 20px'
            }}>
              Modular Markdown Canvas.<br />
              <span style={{ color: '#38bdf8' }}>Full-Context AI Agent.</span>
            </h1>

            <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.6, margin: '0 0 32px', maxWidth: 520 }}>
              Noterama Studio is an open, high-performance workspace designed for developers.
              Enjoy Notion-style card editing, infinite nested folders, real-time Supabase sync, and an AI Agent that understands your entire workspace tree.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <Link
                href="/studio"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 8,
                  background: '#0284c7', color: '#ffffff', fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  boxShadow: '0 0 24px rgba(2, 132, 199, 0.4)'
                }}
              >
                <span>Open Studio Workspace</span>
                <ArrowRight size={15} />
              </Link>

              <a
                href="https://github.com/mfaizasysyauqi/noterama"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 8,
                  background: '#131824', border: '1px solid #232e47',
                  color: '#e2e8f0', fontSize: 14, fontWeight: 500, textDecoration: 'none'
                }}
              >
                <Github size={16} />
                <span>View Source</span>
              </a>
            </div>

            {/* Micro Feature Bullet Points */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, borderTop: '1px solid #192030', paddingTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#cbd5e1' }}>
                <CheckCircle2 size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                <span>Infinite Folder Nesting</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#cbd5e1' }}>
                <CheckCircle2 size={15} style={{ color: '#38bdf8', flexShrink: 0 }} />
                <span>Multi-Session Chat History</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#cbd5e1' }}>
                <CheckCircle2 size={15} style={{ color: '#e2b13c', flexShrink: 0 }} />
                <span>Supabase RLS Persistence</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#cbd5e1' }}>
                <CheckCircle2 size={15} style={{ color: '#c084fc', flexShrink: 0 }} />
                <span>BYOK Groq AI Engine</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Demo Workspace Simulator */}
          <div id="demo" style={{
            background: '#0d111a', border: '1px solid #1e283d', borderRadius: 12, overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            {/* Window Header */}
            <div style={{
              height: 38, background: '#131824', borderBottom: '1px solid #1e283d', padding: '0 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#10b981' }} />
              </div>

              {/* Demo Tabs */}
              <div style={{ display: 'flex', gap: 4, background: '#090c12', padding: 2, borderRadius: 6, border: '1px solid #1b2336' }}>
                {[
                  { id: 'agent', label: 'AI Agent' },
                  { id: 'explorer', label: 'Explorer' },
                  { id: 'editor', label: 'Notion Canvas' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveDemoTab(t.id as any)}
                    style={{
                      background: activeDemoTab === t.id ? '#1e283d' : 'transparent',
                      border: 'none', color: activeDemoTab === t.id ? '#f8fafc' : '#64748b',
                      fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, cursor: 'pointer'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <span style={{ fontSize: 10, color: '#10b981', fontFamily: 'monospace' }}>LIVE DEMO</span>
            </div>

            {/* Interactive Tab 1: AI Agent Simulator */}
            {activeDemoTab === 'agent' && (
              <div style={{ padding: 16, height: 380, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>SESSION: <strong>AI Research Summary</strong></span>
                  <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '1px 6px', borderRadius: 3, fontSize: 10 }}>llama-3.3-70b-versatile</span>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }}>
                  {demoMessages.map((m, i) => (
                    <div key={i} style={{
                      background: m.role === 'user' ? '#1e293b' : '#111726',
                      border: m.role === 'user' ? '1px solid #2d3b54' : '1px solid #1c2538',
                      borderRadius: 8, padding: '8px 12px', fontSize: 12, color: m.role === 'user' ? '#f8fafc' : '#cbd5e1',
                      alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%'
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: m.role === 'user' ? '#38bdf8' : '#e2b13c', marginBottom: 3 }}>
                        {m.role === 'user' ? 'YOU' : 'NOTERAMA AGENT'}
                      </div>
                      <div style={{ lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.content}</div>
                    </div>
                  ))}
                  {isSimulating && (
                    <div style={{ fontSize: 11, color: '#38bdf8', fontStyle: 'italic' }}>Agent is reading workspace context…</div>
                  )}
                </div>

                <form onSubmit={handleSimulateChat} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <input
                    value={demoQuery}
                    onChange={e => setDemoQuery(e.target.value)}
                    placeholder="Try typing a question..."
                    style={{
                      flex: 1, background: '#131926', border: '1px solid #222d45', borderRadius: 6,
                      padding: '8px 12px', fontSize: 12, color: '#f8fafc', outline: 'none'
                    }}
                  />
                  <button type="submit" style={{
                    background: '#0284c7', border: 'none', color: 'white', borderRadius: 6,
                    padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                  }}>
                    Send
                  </button>
                </form>
              </div>
            )}

            {/* Interactive Tab 2: Explorer Simulator */}
            {activeDemoTab === 'explorer' && (
              <div style={{ padding: 16, height: 380, overflowY: 'auto', fontSize: 12.5 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.05em', marginBottom: 12 }}>WORKSPACE FILE TREE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f8fafc', fontWeight: 600, padding: '4px 0' }}>
                  <FolderOpen size={14} style={{ color: '#e2b13c' }} />
                  <span>AI Research</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0 4px 20px', color: '#38bdf8' }}>
                  <FileText size={13} />
                  <span>agent-context.md</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0 4px 20px', color: '#94a3b8' }}>
                  <FileText size={13} />
                  <span>groq-models.md</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f8fafc', fontWeight: 600, padding: '8px 0 4px' }}>
                  <FolderOpen size={14} style={{ color: '#e2b13c' }} />
                  <span>Portfolio</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0 4px 20px', color: '#94a3b8' }}>
                  <FileText size={13} />
                  <span>README.md</span>
                </div>

                <div style={{ marginTop: 24, padding: 12, background: '#111726', border: '1px solid #1d273c', borderRadius: 8, fontSize: 11, color: '#94a3b8' }}>
                  💡 <strong>Drag & Drop & Circular Protection:</strong> Moving subfolders into child folders is automatically detected and blocked to keep your file tree pristine.
                </div>
              </div>
            )}

            {/* Interactive Tab 3: Notion Canvas Simulator */}
            {activeDemoTab === 'editor' && (
              <div style={{ padding: 16, height: 380, overflowY: 'auto' }}>
                <div style={{ background: '#111726', border: '1px solid #1e283d', borderRadius: 8, padding: 14, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: 13 }}>Notion Card Block</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>@August 13, 2026</span>
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.5, margin: 0 }}>
                    Markdown content is automatically parsed into modular note cards. Edit dates, titles, or body text with 300ms debounced autosave.
                  </p>
                </div>
                <div style={{ background: '#111726', border: '1px solid #1e283d', borderRadius: 8, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: 13 }}>Audio Speech Synthesizer</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>@August 13, 2026</span>
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.5, margin: 0 }}>
                    Click the audio overview button to hear an AI voice summary of your current file.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </section>

      {/* ── Technical Bento Grid (Structured & Bespoke) ──────────────────── */}
      <section id="features" style={{ padding: '80px 28px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, borderBottom: '1px solid #192030', paddingBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace', letterSpacing: '0.05em', marginBottom: 6 }}>02 // SYSTEM CAPABILITIES</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>Engineered for Developers</h2>
          </div>
          <Link href="/studio" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            Explore Studio Workspace <ArrowUpRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          
          {/* Card 1 */}
          <div style={{ background: '#0e121b', border: '1px solid #1d2536', borderRadius: 10, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 6, background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <Bot size={20} />
              </div>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748b' }}>AI AGENT</span>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f8fafc', margin: '0 0 8px' }}>Full-Context Memory</h3>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              The agent reads all files & nested folders dynamically. Multi-session history is saved to Supabase so your context is never lost.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{ background: '#0e121b', border: '1px solid #1d2536', borderRadius: 10, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 6, background: 'rgba(226, 177, 60, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2b13c' }}>
                <Layers size={20} />
              </div>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748b' }}>FILE TREE</span>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f8fafc', margin: '0 0 8px' }}>Infinite Nested Folders</h3>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              Drag & drop files into nested subfolders. Root files stay clean, while folder hierarchy maps persist across browser restarts.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{ background: '#0e121b', border: '1px solid #1d2536', borderRadius: 10, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 6, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <Database size={20} />
              </div>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748b' }}>SUPABASE DB</span>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f8fafc', margin: '0 0 8px' }}>Supabase Cloud Sync</h3>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              Zero-config database sync with custom SQL setup generator & Row-Level Security (RLS) policies for complete data ownership.
            </p>
          </div>

        </div>
      </section>

      {/* ── System Architecture Section ───────────────────────────────────── */}
      <section id="architecture" style={{ padding: '60px 28px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ background: '#0c0f17', border: '1px solid #1d263b', borderRadius: 12, padding: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#c084fc', fontFamily: 'monospace', letterSpacing: '0.05em', marginBottom: 8 }}>03 // ARCHITECTURE & STACK</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: '0 0 24px' }}>Tech Stack & Data Flow</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'center' }}>
            <div style={{ background: '#121724', border: '1px solid #202a3f', padding: 20, borderRadius: 8 }}>
              <Code2 size={24} style={{ color: '#38bdf8', marginBottom: 8 }} />
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: 14 }}>Next.js 15</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>App Router & Turbopack</div>
            </div>

            <div style={{ background: '#121724', border: '1px solid #202a3f', padding: 20, borderRadius: 8 }}>
              <Cpu size={24} style={{ color: '#e2b13c', marginBottom: 8 }} />
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: 14 }}>Groq AI Engine</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Llama 3.3 70B Streaming</div>
            </div>

            <div style={{ background: '#121724', border: '1px solid #202a3f', padding: 20, borderRadius: 8 }}>
              <Server size={24} style={{ color: '#10b981', marginBottom: 8 }} />
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: 14 }}>Supabase DB</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>PostgreSQL + RLS Policies</div>
            </div>

            <div style={{ background: '#121724', border: '1px solid #202a3f', padding: 20, borderRadius: 8 }}>
              <Lock size={24} style={{ color: '#c084fc', marginBottom: 8 }} />
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: 14 }}>BYOK Security</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Local Key Encryption</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final Call to Action ────────────────────────────────────────────── */}
      <section style={{ padding: '80px 28px', textAlign: 'center', borderTop: '1px solid #192030', background: '#090c12' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#f8fafc', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
          Start Building Your Workspace Now
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 540, margin: '0 auto 32px' }}>
          Open Noterama Studio in your browser. No sign-up required to test local features.
        </p>
        <Link
          href="/studio"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', borderRadius: 8,
            background: '#0284c7', color: '#ffffff', fontSize: 15, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 0 24px rgba(2, 132, 199, 0.4)'
          }}
        >
          <span>Launch Noterama Studio</span>
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer style={{
        padding: '28px 28px', borderTop: '1px solid #171d2b',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 12.5, color: '#64748b', maxWidth: 1200, margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={14} style={{ color: '#38bdf8' }} />
          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Noterama Studio</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div>Built with Next.js 15, React 19, Supabase & Groq AI</div>
      </footer>

    </div>
  );
}
