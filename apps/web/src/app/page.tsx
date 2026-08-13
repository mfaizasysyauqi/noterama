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
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'agent' | 'nested' | 'canvas' | 'sync'>('agent');

  return (
    <div style={{ background: '#0a0d14', color: '#e2e8f0', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* ── Navbar ───────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(16px)', background: 'rgba(10, 13, 20, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)'
          }}>
            <Sparkles size={18} style={{ color: '#ffffff' }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Noterama <span style={{ color: '#38bdf8', fontSize: 12, fontWeight: 600, marginLeft: 4, padding: '2px 6px', borderRadius: 4, background: 'rgba(56, 189, 248, 0.1)' }}>STUDIO</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 13, fontWeight: 500 }} className="desktop-only">
          <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
          <a href="#bento" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Architecture</a>
          <a href="#demo" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>AI Agent</a>
          <a href="#byok" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>BYOK Privacy</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href="https://github.com/mfaizasysyauqi/noterama"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1', fontSize: 13, fontWeight: 500, textDecoration: 'none'
            }}
          >
            <Github size={15} />
            <span className="desktop-only">GitHub</span>
          </a>
          <Link
            href="/studio"
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 8,
              background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
              color: '#ffffff', fontSize: 13, fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)', transition: 'transform 0.2s'
            }}
          >
            <span>Launch Studio</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 500, height: 300, background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20,
          background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)',
          color: '#38bdf8', fontSize: 12, fontWeight: 600, marginBottom: 24
        }}>
          <Sparkles size={14} />
          <span>Next-Gen AI Knowledge Canvas & Workspace</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, color: '#f8fafc',
          lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 20px', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto'
        }}>
          Where Your Notes Meet <span style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Full-Context AI</span>
        </h1>

        <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: '#94a3b8', lineHeight: 1.6, maxWidth: 740, margin: '0 auto 36px', fontWeight: 400 }}>
          Noterama Studio fuses Notion-style card editing, infinite folder hierarchies, real-time Supabase cloud sync, and an AI Agent that reads your entire workspace.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 60 }}>
          <Link
            href="/studio"
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderRadius: 10,
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff', fontSize: 15, fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 0 30px rgba(2, 132, 199, 0.4)'
            }}
          >
            <span>Open Studio App</span>
            <ArrowRight size={16} />
          </Link>

          <a
            href="https://github.com/mfaizasysyauqi/noterama"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f1f5f9', fontSize: 15, fontWeight: 500, textDecoration: 'none'
            }}
          >
            <Github size={18} />
            <span>Star on GitHub</span>
          </a>
        </div>

        {/* ── Mockup Window Preview ────────────────────────────────────────── */}
        <div style={{
          maxWidth: 980, margin: '0 auto', borderRadius: 12, overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          background: '#0f172a', boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)'
        }}>
          <div style={{
            height: 36, background: '#1e293b', borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            </div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>Noterama Studio — Interactive Workspace</div>
            <div style={{ width: 30 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', height: 380, textAlign: 'left', fontSize: 12.5 }} className="desktop-only">
            
            <div style={{ background: '#0b0f19', borderRight: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 8px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.05em', padding: '4px 8px 8px' }}>WORKSPACE EXPLORER</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', color: '#e2e8f0', fontWeight: 600 }}>
                <FolderOpen size={14} style={{ color: '#e2b13c' }} />
                <span>AI Research</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px 4px 24px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', borderRadius: 4 }}>
                <FileText size={13} style={{ color: '#38bdf8' }} />
                <span>agent-context.md</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px 4px 24px', color: '#94a3b8' }}>
                <FileText size={13} style={{ color: '#38bdf8' }} />
                <span>groq-models.md</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', color: '#e2e8f0', marginTop: 6 }}>
                <Folder size={14} style={{ color: '#e2b13c' }} />
                <span>Portfolio</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', color: '#94a3b8' }}>
                <FileText size={13} style={{ color: '#38bdf8' }} />
                <span>README.md</span>
              </div>
            </div>

            <div style={{ background: '#090d16', padding: '20px 24px', overflowY: 'auto' }}>
              <div style={{ border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 8, padding: 14, background: '#0f172a', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: 14 }}>Noterama Agent Deep Context</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>@August 13, 2026</span>
                </div>
                <p style={{ color: '#94a3b8', margin: 0, lineHeight: 1.5, fontSize: 12 }}>
                  The Noterama Agent scans all nested folders and files in real-time. It uses your Groq API key to process questions with full workspace context.
                </p>
              </div>

              <div style={{ border: '1px dashed rgba(255, 255, 255, 0.15)', borderRadius: 8, padding: 10, textAlign: 'center', color: '#64748b' }}>
                + Add Note Card
              </div>
            </div>

            <div style={{ background: '#0b0f19', borderLeft: '1px solid rgba(255, 255, 255, 0.08)', padding: 12, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: 12 }}>Move App Files to Subfolder</span>
                <span style={{ fontSize: 10, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: 4 }}>Active</span>
              </div>
              
              <div style={{ flex: 1, padding: '10px 0', fontSize: 11.5, color: '#94a3b8', lineHeight: 1.5 }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: 8, borderRadius: 6, border: '1px solid rgba(56, 189, 248, 0.15)', color: '#38bdf8', marginBottom: 8 }}>
                  <strong>Agent:</strong> I found 4 files in your workspace tree. All nested folders are synced with Supabase!
                </div>
              </div>

              <div style={{ background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 6, padding: 6 }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Ask about your workspace…</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: 10, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '1px 5px', borderRadius: 3 }}>llama-3.3-70b-versatile ^</span>
                  <span style={{ background: '#2563eb', color: 'white', fontSize: 10, padding: '2px 8px', borderRadius: 3 }}>Send</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Feature Bento Grid ───────────────────────────────────────────────── */}
      <section id="bento" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Built for Developers & Power Thinkers
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 16, margin: 0 }}>
            Everything you need in a modern knowledge studio, without lock-in or privacy compromises.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          
          <div style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #0b0f19 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: 28
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', marginBottom: 16 }}>
              <Bot size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#f8fafc', margin: '0 0 8px' }}>Noterama AI Agent</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Full workspace awareness. The agent reads every file and nested folder, providing intelligent summaries and code assistance.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #0b0f19 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: 28
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(226, 177, 60, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2b13c', marginBottom: 16 }}>
              <Layers size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#f8fafc', margin: '0 0 8px' }}>Infinite Nested Folders</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Drag & drop organization with zero nesting limits. Prevents circular moves automatically while preserving folder hierarchy.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #0b0f19 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: 28
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: 16 }}>
              <Database size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#f8fafc', margin: '0 0 8px' }}>Supabase Persistence</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              All notebooks, files, and AI chat history persist to your own Supabase database instantly with offline fallback.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #0b0f19 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: 28
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', marginBottom: 16 }}>
              <Lock size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#f8fafc', margin: '0 0 8px' }}>BYOK Privacy Control</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Bring Your Own Key for Groq or local LLMs. Your API keys stay encrypted in your local browser storage.
            </p>
          </div>

        </div>
      </section>

      {/* ── Interactive Feature Spotlight Tabs ──────────────────────────────── */}
      <section id="features" style={{ padding: '60px 24px 80px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f8fafc', margin: '0 0 10px' }}>
            Experience Noterama Studio Features
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 15 }}>Click below to explore core capabilities</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 30 }}>
          {[
            { id: 'agent', label: 'AI Agent Chat', icon: <Bot size={15} /> },
            { id: 'nested', label: 'Nested Explorer', icon: <FolderOpen size={15} /> },
            { id: 'canvas', label: 'Notion Canvas', icon: <FileText size={15} /> },
            { id: 'sync', label: 'Cloud Database', icon: <Database size={15} /> },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8,
                background: activeTab === t.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: activeTab === t.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                color: activeTab === t.id ? '#38bdf8' : '#94a3b8',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div style={{
          background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 32,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, alignItems: 'center'
        }}>
          <div>
            {activeTab === 'agent' && (
              <>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', margin: '0 0 12px' }}>Context-Aware Noterama Agent</h3>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>
                  Unlike standard chatbots, Noterama Agent reads your entire workspace tree and file contents. It maintains multi-session chat histories backed by Supabase.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: 13 }}>
                    <CheckCircle2 size={16} style={{ color: '#38bdf8' }} /> Auto-names sessions from user prompts
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: 13 }}>
                    <CheckCircle2 size={16} style={{ color: '#38bdf8' }} /> Model selection indicator with smooth dropdown
                  </div>
                </div>
              </>
            )}

            {activeTab === 'nested' && (
              <>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', margin: '0 0 12px' }}>Multi-Level Drag & Drop Explorer</h3>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>
                  Organize files and subfolders effortlessly. Create root files or nested items with full CRUD (Rename, New File, New Folder, Delete) via context menu or 3-dots left-click.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: 13 }}>
                    <CheckCircle2 size={16} style={{ color: '#e2b13c' }} /> Circular reference protection
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: 13 }}>
                    <CheckCircle2 size={16} style={{ color: '#e2b13c' }} /> Instant local storage & Supabase folder map
                  </div>
                </div>
              </>
            )}

            {activeTab === 'canvas' && (
              <>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', margin: '0 0 12px' }}>Notion-Style Card Editor</h3>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>
                  Write and organize markdown notes in clean, structured cards with date badges, real-time preview toggle, and instant speech audio overview.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: 13 }}>
                    <CheckCircle2 size={16} style={{ color: '#10b981' }} /> Debounced 300ms auto-save
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: 13 }}>
                    <CheckCircle2 size={16} style={{ color: '#10b981' }} /> Audio Speech Synthesis overview
                  </div>
                </div>
              </>
            )}

            {activeTab === 'sync' && (
              <>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', margin: '0 0 12px' }}>Zero-Config Cloud Database</h3>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>
                  Connect your own Supabase project in seconds. Run our automated SQL setup script directly from the settings panel to initialize tables and RLS policies.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: 13 }}>
                    <CheckCircle2 size={16} style={{ color: '#c084fc' }} /> Automated SQL script generator
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: 13 }}>
                    <CheckCircle2 size={16} style={{ color: '#c084fc' }} /> Row-Level Security (RLS) policies
                  </div>
                </div>
              </>
            )}
          </div>

          <div style={{ background: '#0b0f19', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: 20, fontSize: 12, color: '#94a3b8' }}>
            <div style={{ color: '#38bdf8', fontWeight: 600, marginBottom: 8, fontSize: 11, letterSpacing: '0.05em' }}>FEATURE PREVIEW</div>
            <pre style={{ background: '#070a11', padding: 12, borderRadius: 6, color: '#38bdf8', fontFamily: 'monospace', overflowX: 'auto', margin: 0 }}>
              {activeTab === 'agent' && `// Agent Workspace Tree Context\nconst treeSummary = fileTree.map(f => \n  \`\${f.type === 'folder' ? '📁' : '📄'} \${f.name}\`\n).join('\\n');`}
              {activeTab === 'nested' && `// Circular Move Guard\nfunction isDescendantOrSelf(folderId, targetId) {\n  if (folderId === targetId) return true;\n  return children.some(c => isDescendantOrSelf(c.id, targetId));\n}`}
              {activeTab === 'canvas' && `// Notion Card Parser\nfunction parseMarkdownToCards(md) {\n  return md.split('\\n---').map(sect => ({\n    title, date, content\n  }));\n}`}
              {activeTab === 'sync' && `// Supabase Sync\nawait supabase.from('chat_sessions')\n  .insert({ name, messages })\n  .select().single();`}
            </pre>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: 'linear-gradient(180deg, #0a0d14 0%, #0f172a 100%)', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#f8fafc', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
          Ready to Launch Your Knowledge Studio?
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 580, margin: '0 auto 32px' }}>
          No login required. Start organizing your notes, code, and AI conversations right now.
        </p>
        <Link
          href="/studio"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', borderRadius: 10,
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            color: '#ffffff', fontSize: 16, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 0 30px rgba(37, 99, 235, 0.4)'
          }}
        >
          <span>Open Noterama Studio Workspace</span>
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer style={{
        padding: '32px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center', color: '#64748b', fontSize: 13
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <Sparkles size={16} style={{ color: '#38bdf8' }} />
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Noterama Studio</span>
        </div>
        <p style={{ margin: '0 0 8px' }}>Created with Next.js 15, Turbopack, React 19, Supabase & Groq AI</p>
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} Noterama. MIT Licensed.</p>
      </footer>

    </div>
  );
}
