'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Github,
  FolderOpen,
  FileText,
  Bot,
  Database,
  Lock,
  Terminal,
  ArrowUpRight,
} from 'lucide-react';

/* ─── types ─── */
type DemoTab = 'agent' | 'explorer' | 'editor';
type Message = { role: 'user' | 'assistant'; content: string };

const INIT_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content: 'Noterama Agent active. Loaded 6 workspace files across 3 folders. What do you need?',
  },
];

/* ─── Animated counter ─── */
function Counter({ to, duration = 1400 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            setVal(Math.round(ease * to));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{val}</span>;
}

/* ─── Main page ─── */
export default function LandingPage() {
  const [tab, setTab] = useState<DemoTab>('agent');
  const [query, setQuery] = useState('Summarize everything in my AI Research folder');
  const [messages, setMessages] = useState<Message[]>(INIT_MESSAGES);
  const [busy, setBusy] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollChat = () =>
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollChat();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || busy) return;
    const q = query.trim();
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setBusy(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Found 4 files in AI Research:\n\n• **agent-context.md** — Prompt hierarchy & memory config\n• **groq-models.md** — Llama 3.3, Mixtral, Gemma model list\n• **benchmarks.md** — Latency comparisons\n• **notes.md** — Raw session notes\n\nAll persisted in your Supabase instance.',
        },
      ]);
      setBusy(false);
    }, 700);
  };

  return (
    <div className="lp-root">
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className={`lp-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className={`lp-nav-inner ${isScrolled ? 'scrolled' : ''}`}>
          {/* Logo dengan Badge Code Icon Hijau */}
          <Link href="/" className="lp-logo">
            <span className="lp-logo-badge">
              <code>&lt;/&gt;</code>
            </span>
            <span className="lp-logo-text">
              Noterama<span className="lp-logo-dot">.studio</span>
            </span>
          </Link>

          {/* Menu Navigasi Capsule Center */}
          <nav className="lp-nav-pill-menu">
            <a href="#product">Product</a>
            <a href="#features">Features</a>
            <a href="#stack">Stack</a>
            <a href="#architecture">Architecture</a>
          </nav>

          {/* Akses Kanan (GitHub & Launch Studio CTA) */}
          <div className="lp-nav-right">
            <a
              href="https://github.com/mfaizasysyauqi/noterama"
              target="_blank"
              rel="noreferrer"
              className="lp-nav-gh-pill"
            >
              <Github size={14} />
              <span className="desktop-only">GitHub</span>
            </a>

            <Link href="/studio" className="lp-cta-nav-green">
              <span>Launch App</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          {/* Left: Copy */}
          <div className="lp-hero-copy">
            <p className="lp-kicker">Markdown workspace · Groq AI · Supabase</p>

            <h1 className="lp-h1">
              Notes that<br />
              <em>think with you.</em>
            </h1>

            <p className="lp-sub">
              A high-performance markdown workspace with an AI agent that understands
              your entire folder tree — and remembers every session.
            </p>

            <div className="lp-hero-actions">
              <Link href="/studio" className="lp-btn-primary">
                Open Studio <ArrowRight size={15} />
              </Link>
              <a
                href="https://github.com/mfaizasysyauqi/noterama"
                target="_blank"
                rel="noreferrer"
                className="lp-btn-ghost"
              >
                <Github size={15} /> View Source
              </a>
            </div>
          </div>

          {/* Right: Live Demo Window */}
          <div className="lp-demo-wrap" id="product">
            {/* macOS-style chrome */}
            <div className="lp-demo-chrome">
              <div className="lp-traffic">
                <span className="lp-dot red" />
                <span className="lp-dot amber" />
                <span className="lp-dot green" />
              </div>
              <div className="lp-tab-row">
                {(['agent', 'explorer', 'editor'] as DemoTab[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`lp-tab ${tab === t ? 'lp-tab-active' : ''}`}
                  >
                    {t === 'agent' ? 'AI Agent' : t === 'explorer' ? 'Files' : 'Canvas'}
                  </button>
                ))}
              </div>
              <span className="lp-live-badge">● LIVE</span>
            </div>

            {/* Tab: Agent */}
            {tab === 'agent' && (
              <div className="lp-demo-body">
                <div className="lp-chat-log">
                  {messages.map((m, i) => (
                    <div key={i} className={`lp-msg lp-msg-${m.role}`}>
                      <span className="lp-msg-label">
                        {m.role === 'user' ? 'You' : 'Agent'}
                      </span>
                      <p className="lp-msg-text">{m.content}</p>
                    </div>
                  ))}
                  {busy && <p className="lp-thinking">Agent is reading…</p>}
                  <div ref={chatEndRef} />
                </div>
                <form className="lp-chat-form" onSubmit={sendMessage}>
                  <input
                    className="lp-chat-input"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Ask your workspace anything…"
                  />
                  <button type="submit" className="lp-chat-send">
                    Send
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Files */}
            {tab === 'explorer' && (
              <div className="lp-demo-body lp-tree">
                <p className="lp-tree-label">WORKSPACE</p>
                <div className="lp-tree-row lp-tree-folder">
                  <FolderOpen size={13} /> AI Research
                </div>
                <div className="lp-tree-row lp-tree-file indent">
                  <FileText size={12} /> agent-context.md
                </div>
                <div className="lp-tree-row lp-tree-file indent">
                  <FileText size={12} /> groq-models.md
                </div>
                <div className="lp-tree-row lp-tree-folder" style={{ marginTop: 8 }}>
                  <FolderOpen size={13} /> Portfolio
                </div>
                <div className="lp-tree-row lp-tree-file indent">
                  <FileText size={12} /> README.md
                </div>
                <div className="lp-tree-row lp-tree-file indent">
                  <FileText size={12} /> design-notes.md
                </div>
                <div className="lp-info-pill">
                  Drag & drop with circular-folder protection built in.
                </div>
              </div>
            )}

            {/* Tab: Canvas */}
            {tab === 'editor' && (
              <div className="lp-demo-body">
                <div className="lp-card-block">
                  <div className="lp-card-block-header">
                    <span>Notion Card Block</span>
                    <span className="lp-date">Aug 13 2026</span>
                  </div>
                  <p>
                    Markdown is parsed into modular note cards. Edit title, date, or body
                    with 300ms debounced autosave.
                  </p>
                </div>
                <div className="lp-card-block" style={{ marginTop: 12 }}>
                  <div className="lp-card-block-header">
                    <span>Audio Overview</span>
                    <span className="lp-date">Aug 13 2026</span>
                  </div>
                  <p>Click the audio button for an AI voice summary of your current file.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Tech stack marquee strip ───────────────────────────────────── */}
      <div className="lp-stack-strip">
        <div className="lp-marquee-track">
          {[
            { name: 'Next.js 15', icon: 'nextdotjs', color: 'ffffff' },
            { name: 'React 19', icon: 'react', color: '61DAFB' },
            { name: 'TypeScript', icon: 'typescript', color: '3178C6' },
            { name: 'Supabase', icon: 'supabase', color: '3ECF8E' },
            { name: 'Tailwind CSS', icon: 'tailwindcss', color: '06B6D4' },
            { name: 'PostgreSQL', icon: 'postgresql', color: '4169E1' },
            { name: 'Groq AI', icon: 'meta', color: '0467DF' },
            { name: 'Node.js', icon: 'nodedotjs', color: '5FA04E' },
            { name: 'Vercel', icon: 'vercel', color: 'ffffff' },
          ].concat([
            { name: 'Next.js 15', icon: 'nextdotjs', color: 'ffffff' },
            { name: 'React 19', icon: 'react', color: '61DAFB' },
            { name: 'TypeScript', icon: 'typescript', color: '3178C6' },
            { name: 'Supabase', icon: 'supabase', color: '3ECF8E' },
            { name: 'Tailwind CSS', icon: 'tailwindcss', color: '06B6D4' },
            { name: 'PostgreSQL', icon: 'postgresql', color: '4169E1' },
            { name: 'Groq AI', icon: 'meta', color: '0467DF' },
            { name: 'Node.js', icon: 'nodedotjs', color: '5FA04E' },
            { name: 'Vercel', icon: 'vercel', color: 'ffffff' },
          ]).map((item, idx) => (
            <div key={idx} className="lp-stack-pill">
              <img
                src={`https://cdn.simpleicons.org/${item.icon}/${item.color}`}
                alt={item.name}
                width={16}
                height={16}
                style={{ flexShrink: 0 }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature section ────────────────────────────────────────────── */}
      <section className="lp-features" id="stack">
        <div className="lp-features-inner">
          {/* Left: big text */}
          <div className="lp-features-lead">
            <h2 className="lp-h2">
              Built for the way developers actually work.
            </h2>
            <p className="lp-features-sub">
              No vendor lock-in. No opaque sync. Bring your own API keys, run against your
              own Supabase instance, and own every byte.
            </p>
            <Link href="/studio" className="lp-btn-primary lp-btn-sm">
              Try it free <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Right: feature list (not cards) */}
          <ul className="lp-feature-list">
            {[
              {
                icon: <Bot size={18} />,
                title: 'Full-context AI agent',
                desc: 'Reads all files and folders at query time. Multi-session history persisted in Supabase.',
              },
              {
                icon: <FolderOpen size={18} />,
                title: 'Infinite nested folders',
                desc: 'Drag & drop with circular-move protection. Folder state survives browser restarts.',
              },
              {
                icon: <Database size={18} />,
                title: 'Supabase cloud sync',
                desc: 'Row-Level Security policies keep your data yours. Auto-generated SQL setup.',
              },
              {
                icon: <Lock size={18} />,
                title: 'BYOK privacy model',
                desc: 'Your Groq API key never leaves your browser session. Zero telemetry.',
              },
              {
                icon: <Terminal size={18} />,
                title: 'Groq streaming responses',
                desc: 'Llama 3.3 70B with token-level streaming. Feels instant at any file size.',
              },
            ].map(({ icon, title, desc }) => (
              <li key={title} className="lp-feature-item">
                <span className="lp-feature-icon">{icon}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Stats marquee strip ────────────────────────────────────────── */}
      <div className="lp-stats-strip">
        <div className="lp-marquee-track-reverse">
          {[
            { num: '100%', label: 'OPEN SOURCE' },
            { num: '0', label: 'SIGN-UPS NEEDED' },
            { num: '4+', label: 'AI MODELS SUPPORTED' },
            { num: '300ms', label: 'AUTOSAVE DEBOUNCE' },
            { num: '100%', label: 'DATA PRIVACY (BYOK)' },
            { num: '0ms', label: 'CLOUD DEPENDENCY' },
          ].concat([
            { num: '100%', label: 'OPEN SOURCE' },
            { num: '0', label: 'SIGN-UPS NEEDED' },
            { num: '4+', label: 'AI MODELS SUPPORTED' },
            { num: '300ms', label: 'AUTOSAVE DEBOUNCE' },
            { num: '100%', label: 'DATA PRIVACY (BYOK)' },
            { num: '0ms', label: 'CLOUD DEPENDENCY' },
          ]).map((stat, idx) => (
            <div key={idx} className="lp-stat-pill">
              <span className="lp-stat-pill-num">{stat.num}</span>
              <span className="lp-stat-pill-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA section ─────────────────────────────────────────────────── */}
      <section className="lp-cta-section">
        <div className="lp-cta-inner">
          <h2 className="lp-h2">Your workspace. Your data. Your AI.</h2>
          <p>
            Open Noterama Studio directly in your browser. No account, no cloud dependency — unless you want it.
          </p>
          <Link href="/studio" className="lp-btn-primary lp-btn-lg">
            Launch Noterama Studio <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <span className="lp-logo" style={{ fontSize: 14 }}>
            Noterama
          </span>
          <span className="lp-footer-copy">
            © {new Date().getFullYear()} — Built with Next.js, Supabase & Groq
          </span>
          <a
            href="https://github.com/mfaizasysyauqi/noterama"
            target="_blank"
            rel="noreferrer"
            className="lp-footer-gh"
          >
            <Github size={14} /> Source
          </a>
        </div>
      </footer>

      <style>{`
        /* ── Reset & tokens ─────────────────────────────── */
        .lp-root {
          background: #07090e;
          color: #e2e8f0;
          font-family: 'Geist', 'Inter', system-ui, -apple-system, sans-serif;
          min-height: 100vh;
          overflow-x: clip;
        }

        /* ── Nav (mfaizasysyauqi style) ──────────────────── */
        .lp-nav {
          position: sticky;
          top: 16px;
          z-index: 100;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
        }
        .lp-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .lp-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .lp-logo-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
          font-weight: 700;
          font-size: 13px;
          font-family: monospace;
        }
        .lp-logo-text {
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.03em;
        }
        .lp-logo-dot {
          color: #10b981;
          font-weight: 600;
          font-size: 14px;
        }
        .lp-nav-pill-menu {
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(10, 14, 22, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 100px;
          padding: 8px 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .lp-nav-inner.scrolled .lp-nav-pill-menu {
          background: rgba(5, 8, 14, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(16, 185, 129, 0.15);
        }
        .lp-nav-pill-menu a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: color 0.2s;
        }
        .lp-nav-pill-menu a:hover {
          color: #f8fafc;
        }
        .lp-nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lp-nav-gh-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 100px;
          background: rgba(13, 18, 27, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          font-size: 12.5px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }
        .lp-nav-gh-pill:hover {
          border-color: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }
        .lp-cta-nav-green {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 18px;
          border-radius: 100px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #10b981;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .lp-cta-nav-green:hover {
          background: rgba(16, 185, 129, 0.2);
          border-color: #10b981;
          color: #34d399;
          transform: translateY(-1px);
        }

        /* ── Hero ───────────────────────────────────────── */
        .lp-hero {
          height: calc(100dvh - 64px);
          display: flex;
          align-items: center;
          padding: 0 24px 64px;
          border-bottom: 1px solid #161c2a;
        }
        .lp-hero-inner {
          max-width: 1160px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
        }
        .lp-hero-copy { display: flex; flex-direction: column; }
        .lp-kicker {
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #0ea5e9;
          margin: 0 0 18px;
        }
        .lp-h1 {
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: #f8fafc;
          margin: 0 0 20px;
        }
        .lp-h1 em {
          font-style: italic;
          color: #0ea5e9;
        }
        .lp-sub {
          font-size: 16px;
          color: #94a3b8;
          line-height: 1.65;
          max-width: 460px;
          margin: 0 0 32px;
        }
        .lp-hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* ── Buttons ────────────────────────────────────── */
        .lp-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 22px;
          border-radius: 7px;
          background: #0ea5e9;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: background .2s, transform .1s;
          white-space: nowrap;
        }
        .lp-btn-primary:hover { background: #0284c7; transform: translateY(-1px); }
        .lp-btn-primary:active { transform: translateY(0) scale(0.98); }
        .lp-btn-sm { font-size: 13px; padding: 9px 18px; }
        .lp-btn-lg { font-size: 15px; padding: 13px 28px; }
        .lp-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 18px;
          border-radius: 7px;
          background: transparent;
          border: 1px solid #1e293b;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: border-color .2s, color .2s;
        }
        .lp-btn-ghost:hover { border-color: #334155; color: #e2e8f0; }

        /* ── Demo window ────────────────────────────────── */
        .lp-demo-wrap {
          background: #0d111b;
          border: 1px solid #1e2a3e;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,.55);
        }
        .lp-demo-chrome {
          height: 40px;
          background: #111826;
          border-bottom: 1px solid #1b2437;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 14px;
        }
        .lp-traffic { display: flex; gap: 5px; }
        .lp-dot { width: 10px; height: 10px; border-radius: 50%; }
        .lp-dot.red { background: #ef4444; }
        .lp-dot.amber { background: #f59e0b; }
        .lp-dot.green { background: #22c55e; }
        .lp-tab-row {
          display: flex;
          gap: 2px;
          background: #09101a;
          border: 1px solid #1b2437;
          border-radius: 5px;
          padding: 2px;
        }
        .lp-tab {
          background: transparent;
          border: none;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          border-radius: 4px;
          cursor: pointer;
          transition: background .15s, color .15s;
        }
        .lp-tab-active { background: #1e2a3e; color: #f8fafc; }
        .lp-live-badge {
          margin-left: auto;
          font-size: 10px;
          font-weight: 700;
          color: #22c55e;
          letter-spacing: 0.04em;
          font-family: monospace;
        }
        .lp-demo-body {
          padding: 16px;
          height: 340px;
          min-height: 260px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        @media (max-width: 900px) {
          .lp-demo-body { height: auto; min-height: 300px; }
        }

        /* Chat */
        .lp-chat-log {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-right: 4px;
          scrollbar-width: thin;
          scrollbar-color: #1e2a3e transparent;
        }
        .lp-msg { display: flex; flex-direction: column; gap: 3px; max-width: 88%; }
        .lp-msg-user { align-self: flex-end; text-align: right; }
        .lp-msg-assistant { align-self: flex-start; }
        .lp-msg-label {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .lp-msg-user .lp-msg-label { color: #0ea5e9; }
        .lp-msg-assistant .lp-msg-label { color: #64748b; }
        .lp-msg-text {
          margin: 0;
          font-size: 12px;
          line-height: 1.55;
          padding: 8px 12px;
          border-radius: 8px;
          white-space: pre-wrap;
        }
        .lp-msg-user .lp-msg-text { background: #1e293b; color: #f1f5f9; border: 1px solid #2d3b54; }
        .lp-msg-assistant .lp-msg-text { background: #111726; color: #cbd5e1; border: 1px solid #1c2538; }
        .lp-thinking { font-size: 11px; color: #0ea5e9; font-style: italic; padding-left: 4px; }
        .lp-chat-form {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          flex-shrink: 0;
        }
        .lp-chat-input {
          flex: 1;
          background: #111926;
          border: 1px solid #1e2d47;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
          color: #f8fafc;
          outline: none;
          font-family: inherit;
          transition: border-color .2s;
        }
        .lp-chat-input:focus { border-color: #0ea5e9; }
        .lp-chat-input::placeholder { color: #475569; }
        .lp-chat-send {
          background: #0ea5e9;
          border: none;
          border-radius: 6px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: background .2s;
          font-family: inherit;
        }
        .lp-chat-send:hover { background: #0284c7; }

        /* Tree tab */
        .lp-tree { gap: 0; }
        .lp-tree-label {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #334155;
          margin: 0 0 10px;
        }
        .lp-tree-row {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 0;
          font-size: 12.5px;
        }
        .lp-tree-folder { color: #f8fafc; font-weight: 600; }
        .lp-tree-file { color: #94a3b8; }
        .lp-tree-row.indent { padding-left: 20px; }
        .lp-info-pill {
          margin-top: 20px;
          background: #111726;
          border: 1px solid #1e283d;
          border-radius: 7px;
          padding: 10px 12px;
          font-size: 11px;
          color: #64748b;
          line-height: 1.5;
        }

        /* Canvas tab */
        .lp-card-block {
          background: #111726;
          border: 1px solid #1e283d;
          border-radius: 8px;
          padding: 14px;
        }
        .lp-card-block-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          font-weight: 700;
          font-size: 13px;
          color: #f8fafc;
        }
        .lp-card-block p {
          margin: 0;
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.55;
        }
        .lp-date { font-size: 11px; font-weight: 400; color: #475569; }

        /* ── Stats strip (Reverse Marquee) ───────────────── */
        .lp-stats-strip {
          position: relative;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 24px 0;
          background-color: #06080d;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
        .lp-marquee-track-reverse {
          display: flex;
          align-items: center;
          gap: 16px;
          width: max-content;
          animation: marquee-reverse 30s linear infinite;
        }
        .lp-marquee-track-reverse:hover {
          animation-play-state: paused;
        }
        .lp-stat-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 20px;
          border-radius: 12px;
          background: rgba(13, 17, 26, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 13px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: border-color 0.2s, transform 0.2s;
        }
        .lp-stat-pill:hover {
          border-color: rgba(16, 185, 129, 0.4);
          transform: translateY(-1px);
        }
        .lp-stat-pill-num {
          font-weight: 800;
          color: #10b981;
          font-size: 14px;
          letter-spacing: -0.02em;
        }
        .lp-stat-pill-label {
          font-weight: 700;
          color: #f1f5f9;
          font-size: 11.5px;
          letter-spacing: 0.04em;
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        /* ── Features section ────────────────────────────── */
        .lp-features { padding: 100px 24px; }
        .lp-features-inner {
          max-width: 1160px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .lp-features-lead { position: sticky; top: 100px; }
        .lp-h2 {
          font-size: clamp(28px, 3.2vw, 40px);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #f8fafc;
          line-height: 1.15;
          margin: 0 0 16px;
        }
        .lp-features-sub {
          font-size: 15px;
          color: #64748b;
          line-height: 1.65;
          max-width: 380px;
          margin: 0 0 28px;
        }

        .lp-feature-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
        }
        .lp-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 22px 0;
          border-bottom: 1px solid #161c2a;
        }
        .lp-feature-item:first-child { border-top: 1px solid #161c2a; }
        .lp-feature-icon {
          width: 34px;
          height: 34px;
          border-radius: 7px;
          background: rgba(14, 165, 233, 0.08);
          border: 1px solid rgba(14, 165, 233, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0ea5e9;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .lp-feature-item strong {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 4px;
        }
        .lp-feature-item p {
          margin: 0;
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
        }

        /* ── Stack strip ─────────────────────────────────── */
        .lp-stack-strip {
          position: relative;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 28px 0;
          background-color: #06080d;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
        .lp-marquee-track {
          display: flex;
          align-items: center;
          gap: 16px;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .lp-marquee-track:hover {
          animation-play-state: paused;
        }
        .lp-stack-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 18px;
          border-radius: 12px;
          background: rgba(13, 17, 26, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 13.5px;
          color: #f1f5f9;
          font-weight: 600;
          letter-spacing: -0.01em;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: border-color 0.2s, transform 0.2s;
        }
        .lp-stack-pill:hover {
          border-color: rgba(56, 189, 248, 0.4);
          transform: translateY(-1px);
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ── CTA section ─────────────────────────────────── */
        .lp-cta-section {
          padding: 120px 24px;
          border-top: 1px solid #161c2a;
        }
        .lp-cta-inner {
          max-width: 680px;
          margin: 0 auto;
          text-align: left;
        }
        .lp-cta-inner p {
          font-size: 16px;
          color: #64748b;
          line-height: 1.65;
          margin: 0 0 32px;
          max-width: 520px;
        }

        /* ── Footer ──────────────────────────────────────── */
        .lp-footer {
          border-top: 1px solid #0f1624;
          background: #07090e;
          padding: 24px;
        }
        .lp-footer-inner {
          max-width: 1160px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px 16px;
          font-size: 12.5px;
          color: #334155;
        }
        .lp-footer-copy { flex: 1; text-align: center; }
        .lp-footer-gh {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #475569;
          text-decoration: none;
          font-size: 12.5px;
          transition: color .2s;
        }
        .lp-footer-gh:hover { color: #94a3b8; }

        /* ── Responsive ──────────────────────────────────── */
        @media (max-width: 900px) {
          .lp-hero {
            height: auto;
            min-height: calc(100dvh - 64px);
            padding: 48px 24px;
          }
          .lp-hero-inner,
          .lp-features-inner {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .lp-features-lead { position: static; }
          .lp-stats-inner {
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .lp-nav-pill-menu { display: none; }
          .lp-features { padding: 72px 24px; }
          .lp-cta-section { padding: 80px 24px; }
        }
        @media (max-width: 540px) {
          .lp-stats-inner { grid-template-columns: 1fr 1fr; }
          .lp-h1 { font-size: 36px; }
          .lp-hero { padding: 36px 16px; min-height: calc(100dvh - 64px); }
          .lp-nav-inner { padding: 0 16px; }
          .lp-features { padding: 56px 16px; }
          .lp-cta-section { padding: 64px 16px; }
          .lp-stack-strip { padding: 16px; }
          .lp-hero-actions { flex-direction: column; align-items: flex-start; }
          .lp-footer-inner { flex-direction: column; align-items: flex-start; }
          .lp-footer-copy { text-align: left; }
          .lp-stats-strip .lp-stats-inner { padding: 28px 16px; }
          .lp-cta-inner { padding: 0; }
        }
      `}</style>
    </div>
  );
}
