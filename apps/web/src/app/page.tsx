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
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/lib/translations';
import { FlagIcon } from '@/components/FlagIcon';

/* ─── types ─── */
type DemoTab = 'agent' | 'explorer' | 'editor';
type Message = { role: 'user' | 'assistant'; content: string };

/* ─── Feature icons (JSX — kept here, strings from translations) ─── */
const FEATURE_ICONS = [
  <Bot size={18} key="bot" />,
  <FolderOpen size={18} key="folder" />,
  <Database size={18} key="db" />,
  <Lock size={18} key="lock" />,
  <Terminal size={18} key="term" />,
];

const TECH_STACK_ITEMS = [
  { name: 'Next.js 15', icon: 'nextdotjs', color: 'ffffff' },
  { name: 'React 19', icon: 'react', color: '61DAFB' },
  { name: 'TypeScript', icon: 'typescript', color: '3178C6' },
  { name: 'Supabase', icon: 'supabase', color: '3ECF8E' },
  { name: 'Tailwind CSS', icon: 'tailwindcss', color: '06B6D4' },
  { name: 'PostgreSQL', icon: 'postgresql', color: '4169E1' },
  { name: 'Groq AI', icon: 'meta', color: '0467DF' },
  { name: 'Node.js', icon: 'nodedotjs', color: '5FA04E' },
  { name: 'Vercel', icon: 'vercel', color: 'ffffff' },
];
const MARQUEE_TECH_STACK = [...TECH_STACK_ITEMS, ...TECH_STACK_ITEMS];

/* ─── Minimal markdown renderer (bold + bullets + newlines) ─── */
function renderMarkdown(text: string): React.ReactNode {
  return text.split('\n').map((line, li) => {
    // Parse inline **bold**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((chunk, ci) => {
      if (chunk.startsWith('**') && chunk.endsWith('**')) {
        return <strong key={ci}>{chunk.slice(2, -2)}</strong>;
      }
      return chunk;
    });
    // Bullet line
    if (line.startsWith('• ') || line.startsWith('* ')) {
      return <li key={li} style={{ listStyle: 'disc', marginLeft: 16 }}>{parts.slice(1)}</li>;
    }
    if (line === '') return <br key={li} />;
    return <span key={li} style={{ display: 'block' }}>{parts}</span>;
  });
}

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
  const { lang, toggle } = useLanguage();
  const tx = t[lang];
  const MARQUEE_STATS = [...tx.stats, ...tx.stats];

  const [tab, setTab] = useState<DemoTab>('agent');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => [
    { role: 'assistant', content: tx.demo.agentInit },
  ]);
  const [busy, setBusy] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Re-init messages when language changes
  useEffect(() => {
    setMessages([{ role: 'assistant', content: tx.demo.agentInit }]);
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        { role: 'assistant', content: tx.demo.agentReply('AI Research') },
      ]);
      setBusy(false);
    }, 700);
  };

  return (
    <div className="lp-root">
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className={`lp-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="lp-nav-inner">
          {/* Logo — note + spark = AI-powered notes */}
          <Link href="/" className="lp-logo">
            <span className="lp-logo-badge">
              {/* Inline SVG: note doc with a spark/bolt overlay */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                {/* Note document */}
                <path d="M3 2.5C3 1.67 3.67 1 4.5 1H11L15 5V15.5C15 16.33 14.33 17 13.5 17H4.5C3.67 17 3 16.33 3 15.5V2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                {/* Folded corner */}
                <path d="M11 1V5H15" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                {/* Spark / bolt */}
                <path d="M9.5 7.5L7.5 10.5H9L8.5 13L11 9.5H9.5L9.5 7.5Z" fill="currentColor"/>
              </svg>
            </span>
            <span className="lp-logo-text">
              Noterama<span className="lp-logo-dot">.studio</span>
            </span>
          </Link>

          {/* Menu Navigasi Capsule Center */}
          <nav className="lp-nav-pill-menu">
            {tx.nav.items.map(({ label, href }) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </nav>

          {/* Akses Kanan */}
          <div className="lp-nav-right">
            {/* Language toggle */}
            <button
              onClick={toggle}
              title="Switch language / Ganti bahasa"
              className="lp-lang-toggle"
            >
              <FlagIcon country={lang === 'en' ? 'ID' : 'GB'} size={15} />
              <span>{lang === 'en' ? 'ID' : 'EN'}</span>
            </button>

            <a
              href="https://github.com/mfaizasysyauqi/noterama"
              target="_blank"
              rel="noreferrer"
              className="lp-nav-gh-pill"
            >
              <Github size={14} />
              <span className="desktop-only">{tx.nav.github}</span>
            </a>

            <Link href="/studio" className="lp-cta-nav-blue">
              <span>{tx.nav.launch}</span>
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
            <p className="lp-kicker">{tx.hero.kicker}</p>

            <h1 className="lp-h1">
              {tx.hero.h1Line1}<br />
              <em>{tx.hero.h1Em}</em>
            </h1>

            <p className="lp-sub">{tx.hero.sub}</p>

            <div className="lp-hero-actions">
              <Link href="/studio" className="lp-btn-primary">
                {tx.hero.openStudio} <ArrowRight size={15} />
              </Link>
              <a
                href="https://github.com/mfaizasysyauqi/noterama"
                target="_blank"
                rel="noreferrer"
                className="lp-btn-ghost"
              >
                <Github size={15} /> {tx.hero.viewSource}
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
                {(['agent', 'explorer', 'editor'] as DemoTab[]).map(tb => (
                  <button
                    key={tb}
                    onClick={() => setTab(tb)}
                    className={`lp-tab ${tab === tb ? 'lp-tab-active' : ''}`}
                  >
                    {tb === 'agent' ? tx.studio.aiAgent : tb === 'explorer' ? tx.studio.explorer : 'Canvas'}
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
                        {m.role === 'user' ? tx.demo.userLabel : tx.demo.agentLabel}
                      </span>
                      <div className="lp-msg-text">{renderMarkdown(m.content)}</div>
                    </div>
                  ))}
                  {busy && <p className="lp-thinking">{tx.demo.thinking}</p>}
                  <div ref={chatEndRef} />
                </div>
                <form className="lp-chat-form" onSubmit={sendMessage}>
                  <input
                    className="lp-chat-input"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={tx.demo.placeholder}
                  />
                  <button type="submit" className="lp-chat-send">
                    {tx.demo.send}
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Files */}
            {tab === 'explorer' && (
              <div className="lp-demo-body lp-tree">
                <p className="lp-tree-label">{tx.demo.workspace}</p>
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
                  {tx.demo.infoPill}
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
        <div className="lp-marquee-inner">
          <div className="lp-marquee-track">
            {MARQUEE_TECH_STACK.map((item, idx) => (
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
      </div>

      {/* ── Feature section ────────────────────────────────────────────── */}
      <section className="lp-features" id="stack">
        <div className="lp-features-inner">
          {/* Left: big text */}
          <div className="lp-features-lead">
            <h2 className="lp-h2">{tx.features.h2}</h2>
            <p className="lp-features-sub">{tx.features.sub}</p>
            <Link href="/studio" className="lp-btn-primary lp-btn-sm">
              {tx.features.tryFree} <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Right: feature list (not cards) */}
          <ul className="lp-feature-list">
            {tx.features.list.map(({ title, desc }, i) => (
              <li key={title} className="lp-feature-item">
                <span className="lp-feature-icon">{FEATURE_ICONS[i]}</span>
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
        <div className="lp-marquee-inner">
          <div className="lp-marquee-track-reverse">
            {MARQUEE_STATS.map((stat, idx) => (
              <div key={idx} className="lp-stat-pill">
                <span className="lp-stat-pill-num">{stat.num}</span>
                <span className="lp-stat-pill-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA section ─────────────────────────────────────────────────── */}
      <section className="lp-cta-section">
        <div className="lp-cta-inner">
          <h2 className="lp-h2">{tx.cta.h2}</h2>
          <p>{tx.cta.body}</p>
          <Link href="/studio" className="lp-btn-primary lp-btn-lg">
            {tx.cta.btn} <ArrowRight size={16} />
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
            {tx.footer.copy(new Date().getFullYear())}
          </span>
          <a
            href="https://github.com/mfaizasysyauqi/noterama"
            target="_blank"
            rel="noreferrer"
            className="lp-footer-gh"
          >
            <Github size={14} /> {tx.footer.source}
          </a>
        </div>
      </footer>

      <style>{`
        /* ── Reset & tokens ─────────────────────────────── */
        .lp-root {
          /* Layout tokens — change once, applies everywhere */
          --lp-px: 24px;
          --lp-max: 1160px;

          background: #07090e;
          color: #e2e8f0;
          font-family: 'Geist', 'Inter', system-ui, -apple-system, sans-serif;
          min-height: 100vh;
          overflow-x: clip;
        }

        /* ── Nav (exact mfaizasysyauqi style) ─────────────── */
        .lp-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 20px var(--lp-px);
          background: transparent;
          border: none;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .lp-nav.scrolled {
          padding: 14px var(--lp-px);
          background: rgba(9, 13, 22, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: none;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.9);
        }
        .lp-nav-inner {
          max-width: var(--lp-max);
          width: 100%;
          margin: 0 auto;
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
          background: rgba(14, 165, 233, 0.12);
          border: 1px solid rgba(14, 165, 233, 0.3);
          color: #0ea5e9;
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
          color: #0ea5e9;
          font-weight: 600;
          font-size: 14px;
        }
        .lp-nav-pill-menu {
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(13, 18, 27, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 100px;
          padding: 8px 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .lp-nav.scrolled .lp-nav-pill-menu {
          background: rgba(13, 18, 27, 0.9);
          border-color: rgba(255, 255, 255, 0.15);
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
        .lp-lang-toggle {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 100px;
          background: rgba(13, 18, 27, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .lp-lang-toggle:hover {
          border-color: rgba(255, 255, 255, 0.25);
          color: #f8fafc;
          background: rgba(13, 18, 27, 0.9);
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
        .lp-cta-nav-blue {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 18px;
          border-radius: 100px;
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.4);
          color: #0ea5e9;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .lp-cta-nav-blue:hover {
          background: rgba(14, 165, 233, 0.2);
          border-color: #0ea5e9;
          color: #38bdf8;
          transform: translateY(-1px);
        }

        /* ── Hero ───────────────────────────────────────── */
        .lp-hero {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          padding: 80px var(--lp-px) 64px;
          border-bottom: 1px solid #161c2a;
        }
        .lp-hero-inner {
          max-width: var(--lp-max);
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

        /* ── Stats strip (Reverse Marquee) ─────────────────── */
        .lp-stats-strip {
          position: relative;
          padding: 24px var(--lp-px);
          background-color: #06080d;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        /* shared inner wrapper for both marquee strips — aligned with max-width container */
        .lp-marquee-inner {
          max-width: var(--lp-max);
          width: 100%;
          margin: 0 auto;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
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
          border-color: rgba(14, 165, 233, 0.4);
          transform: translateY(-1px);
        }
        .lp-stat-pill-num {
          font-weight: 800;
          color: #0ea5e9;
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
        .lp-features { padding: 100px var(--lp-px); }
        .lp-features-inner {
          max-width: var(--lp-max);
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
          padding: 28px var(--lp-px);
          background-color: #06080d;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 32px 32px;
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
          padding: 120px var(--lp-px);
          border-top: 1px solid #161c2a;
        }
        .lp-cta-inner {
          max-width: var(--lp-max);
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
          padding: 24px var(--lp-px);
        }
        .lp-footer-inner {
          max-width: var(--lp-max);
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
          .lp-root { --lp-px: 24px; }
          .lp-hero {
            min-height: 100dvh;
            padding: 96px var(--lp-px) 56px;
          }
          .lp-hero-inner,
          .lp-features-inner {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .lp-features-lead { position: static; }
          .lp-nav-pill-menu { display: none; }
          .lp-features { padding: 72px var(--lp-px); }
          .lp-cta-section { padding: 80px var(--lp-px); }
        }
        @media (max-width: 540px) {
          .lp-root { --lp-px: 16px; }
          .lp-h1 { font-size: 36px; }
          .lp-hero { padding: 96px var(--lp-px) 48px; min-height: 100dvh; }
          .lp-features { padding: 56px var(--lp-px); }
          .lp-cta-section { padding: 64px var(--lp-px); }
          .lp-hero-actions { flex-direction: column; align-items: flex-start; }
          .lp-footer-inner { flex-direction: column; align-items: flex-start; }
          .lp-footer-copy { text-align: left; }
        }
      `}</style>
    </div>
  );
}
