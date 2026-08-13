'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PROVIDER_LABELS } from '@noterama/core';
import { useSettings } from '@/hooks/useSettings';
import { useNotebookData, DbSource } from '@/hooks/useNotebookData';
import { useChatSessions, type ChatSession } from '@/hooks/useChatSessions';
import { useAudioSpeech } from '@/hooks/useAudioSpeech';
import SettingsModal from '@/components/SettingsModal';
import UploadSourceModal from '@/components/UploadSourceModal';
import Link from 'next/link';
import {
  Sparkles, Send, AlertCircle, X, Settings, Upload,
  Bot, Search, Menu, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Folder, FolderOpen, FileText, FilePlus, FolderPlus,
  Eye, Edit3, Headphones, Play, Pause, BookOpen, MoreVertical, Plus, History, Home,
} from 'lucide-react';

type NoteCard = {
  id: string;
  title: string;
  date: string;
  content: string;
};

type FileItem = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  content: string;
  cards?: NoteCard[];
  expanded?: boolean;
};

type Message = { role: 'user' | 'assistant'; content: string };
type ActivityTab = 'explorer' | 'search' | 'agent' | 'settings';

/* Helper to parse markdown file content into card lists */
function parseMarkdownToCards(content: string): NoteCard[] {
  if (!content.trim()) return [];
  const sections = content.split(/\n\s*---\s*\n/);
  const cards: NoteCard[] = [];
  
  sections.forEach((sect, idx) => {
    const lines = sect.trim().split('\n');
    if (lines.length === 0 || !sect.trim()) return;
    
    let title = 'Untitled Note';
    let date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    let startIdx = 0;
    let titleFound = false;
    
    for (let k = 0; k < Math.min(lines.length, 3); k++) {
      const line = lines[k].trim();
      if (!titleFound && (line.startsWith('#') || line.startsWith('**') || line.length > 0) && !line.startsWith('@')) {
        title = line.replace(/^[#\*\s]+/, '').replace(/[#\*\s]+$/, '');
        titleFound = true;
        startIdx = k + 1;
      } else if (line.startsWith('@')) {
        date = line.slice(1).trim();
        if (startIdx <= k) startIdx = k + 1;
      }
    }
    
    const cardContent = lines.slice(startIdx).join('\n').trim();
    cards.push({
      id: `card-${idx}-${Date.now()}`,
      title,
      date,
      content: cardContent
    });
  });
  
  if (cards.length === 0) {
    cards.push({
      id: `card-0-${Date.now()}`,
      title: 'Note Title',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      content: content.trim()
    });
  }
  
  return cards;
}

function stringifyCardsToMarkdown(cards: NoteCard[]): string {
  return cards.map(c => `### ${c.title}\n@${c.date}\n\n${c.content}`).join('\n\n---\n\n');
}

function inlineMd(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const r = m[0];
    if (r.startsWith('`'))        parts.push(<code key={m.index} style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 5px', borderRadius: 3, fontFamily: 'var(--font-mono)', fontSize: '0.88em' }}>{r.slice(1, -1)}</code>);
    else if (r.startsWith('**'))  parts.push(<strong key={m.index} style={{ color: 'var(--text-bright)', fontWeight: 600 }}>{r.slice(2, -2)}</strong>);
    else                          parts.push(<em key={m.index} style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{r.slice(1, -1)}</em>);
    last = m.index + r.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function renderDoc(md: string): React.ReactNode {
  const lines = md.split('\n');
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith('# ')) {
      out.push(<h1 key={i} style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-bright)', margin: '0 0 6px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>{inlineMd(l.slice(2))}</h1>);
    } else if (l.startsWith('## ')) {
      out.push(<h2 key={i} style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', margin: '24px 0 8px', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>{inlineMd(l.slice(3))}</h2>);
    } else if (l.startsWith('### ')) {
      out.push(<h3 key={i} style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-bright)', margin: '16px 0 6px' }}>{inlineMd(l.slice(4))}</h3>);
    } else if (l.startsWith('> ')) {
      out.push(<blockquote key={i} style={{ borderLeft: '3px solid var(--accent-blue)', paddingLeft: 16, color: 'var(--text-secondary)', margin: '12px 0', fontStyle: 'italic' }}>{inlineMd(l.slice(2))}</blockquote>);
    } else if (l.match(/^---+$/)) {
      out.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />);
    } else if (l.startsWith('- ') || l.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) { items.push(lines[i].slice(2)); i++; }
      out.push(<ul key={`ul${i}`} style={{ paddingLeft: 22, margin: '8px 0' }}>{items.map((t, j) => <li key={j} style={{ margin: '4px 0', lineHeight: 1.6, color: 'var(--text-primary)' }}>{inlineMd(t)}</li>)}</ul>);
      continue;
    } else if (/^\d+\. /.test(l)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /, '')); i++; }
      out.push(<ol key={`ol${i}`} style={{ paddingLeft: 22, margin: '8px 0' }}>{items.map((t, j) => <li key={j} style={{ margin: '4px 0', lineHeight: 1.6, color: 'var(--text-primary)' }}>{inlineMd(t)}</li>)}</ol>);
      continue;
    } else if (l.trim() === '') {
      out.push(<div key={i} style={{ height: 8 }} />);
    } else {
      out.push(<p key={i} style={{ margin: '2px 0', color: 'var(--text-primary)', lineHeight: 1.7, fontSize: 14 }}>{inlineMd(l)}</p>);
    }
    i++;
  }
  return <>{out}</>;
}

function renderChat(text: string): React.ReactNode {
  const lines = text.split('\n');
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith('# ')) {
      out.push(<h1 key={i} style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-bright)', margin: '8px 0 4px', lineHeight: 1.2 }}>{inlineMd(l.slice(2))}</h1>);
    } else if (l.startsWith('## ')) {
      out.push(<h2 key={i} style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-bright)', margin: '8px 0 4px' }}>{inlineMd(l.slice(3))}</h2>);
    } else if (l.startsWith('### ')) {
      out.push(<h3 key={i} style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-bright)', margin: '6px 0 2px' }}>{inlineMd(l.slice(4))}</h3>);
    } else if (l.startsWith('> ')) {
      out.push(<blockquote key={i} style={{ borderLeft: '2px solid var(--accent-blue)', paddingLeft: 10, color: 'var(--text-secondary)', margin: '6px 0', fontStyle: 'italic' }}>{inlineMd(l.slice(2))}</blockquote>);
    } else if (l.match(/^---+$/)) {
      out.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '10px 0' }} />);
    } else if (l.startsWith('- ') || l.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) { items.push(lines[i].slice(2)); i++; }
      out.push(<ul key={`ul${i}`} style={{ paddingLeft: 18, margin: '4px 0' }}>{items.map((t, j) => <li key={j} style={{ margin: '2px 0', lineHeight: 1.5, color: 'var(--text-primary)' }}>{inlineMd(t)}</li>)}</ul>);
      continue;
    } else if (/^\d+\. /.test(l)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /, '')); i++; }
      out.push(<ol key={`ol${i}`} style={{ paddingLeft: 18, margin: '4px 0' }}>{items.map((t, j) => <li key={j} style={{ margin: '2px 0', lineHeight: 1.5, color: 'var(--text-primary)' }}>{inlineMd(t)}</li>)}</ol>);
      continue;
    } else if (l.trim() === '') {
      out.push(<div key={i} style={{ height: 4 }} />);
    } else {
      out.push(<p key={i} style={{ margin: '2px 0', color: 'var(--text-primary)', lineHeight: 1.55, fontSize: 13 }}>{inlineMd(l)}</p>);
    }
    i++;
  }
  return <>{out}</>;
}

function isDescendantOrSelf(folderId: string, targetId: string, tree: FileItem[]): boolean {
  if (folderId === targetId) return true;
  const children = tree.filter(f => f.parentId === folderId);
  return children.some(c => isDescendantOrSelf(c.id, targetId, tree));
}

function getFolderParentMap(): Record<string, string | null> {
  try {
    const raw = localStorage.getItem('noterama_folder_parents');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveFolderParent(folderId: string, parentId: string | null) {
  try {
    const map = getFolderParentMap();
    if (parentId) map[folderId] = parentId;
    else delete map[folderId];
    localStorage.setItem('noterama_folder_parents', JSON.stringify(map));
  } catch {}
}

function buildTree(
  nbs: Array<{ id: string; title: string; description?: string | null; tech_stack?: string[] }>,
  dbSources: DbSource[] = [],
  rootFileIds: string[] = [],
  folderParentMap: Record<string, string | null> = {}
): FileItem[] {
  const tree: FileItem[] = [];
  const rootSet = new Set(rootFileIds);

  for (const nb of nbs) {
    const parentId = folderParentMap[nb.id] || null;
    tree.push({ id: nb.id, name: nb.title, type: 'folder', parentId, content: '', expanded: true });
    
    const nbSources = dbSources.filter(s => s.notebook_id === nb.id);
    for (const src of nbSources) {
      const content = src.content || '';
      const isRoot = rootSet.has(src.id);
      tree.push({
        id: src.id,
        name: src.title,
        type: 'file',
        parentId: isRoot ? null : nb.id,
        content,
        cards: parseMarkdownToCards(content),
      });
    }
  }
  return tree;
}

export default function StudioPage() {
  const [activeTab, setActiveTab]               = useState<ActivityTab>('explorer');
  const [sidebarOpen, setSidebarOpen]           = useState(true);
  const [showAgentPanel, setShowAgentPanel]     = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showSettings, setShowSettings]         = useState(false);
  const [showUploadModal, setShowUploadModal]   = useState(false);
  const [isPreview, setIsPreview]               = useState(false);

  const [agentWidth, setAgentWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const startResizing = useCallback((e: React.MouseEvent) => { e.preventDefault(); setIsResizing(true); }, []);
  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e: MouseEvent) => setAgentWidth(Math.min(650, Math.max(260, window.innerWidth - e.clientX)));
    const onUp = () => setIsResizing(false);
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isResizing]);

  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isSidebarResizing, setIsSidebarResizing] = useState(false);
  const startSidebarResizing = useCallback((e: React.MouseEvent) => { e.preventDefault(); setIsSidebarResizing(true); }, []);
  useEffect(() => {
    if (!isSidebarResizing) return;
    const onMove = (e: MouseEvent) => setSidebarWidth(Math.min(450, Math.max(180, e.clientX - 48)));
    const onUp = () => setIsSidebarResizing(false);
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isSidebarResizing]);

  const { settings, updateSettings, loaded } = useSettings();
  const {
    notebooks, sources, isSupabaseConnected, addSource, uploadFile, fetchSources,
    createNotebook, updateNotebook, deleteNotebook, createSource, updateSource, deleteSource,
  } = useNotebookData();

  const displayNbs = notebooks;

  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [openTabs, setOpenTabs]             = useState<string[]>([]);
  const [fileTree, setFileTree]             = useState<FileItem[]>([]);

  const [rootFileIds, setRootFileIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('noterama_root_files');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  const saveRootFileId = (id: string) => {
    setRootFileIds(prev => {
      const next = Array.from(new Set([...prev, id]));
      try { localStorage.setItem('noterama_root_files', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const removeRootFileId = (id: string) => {
    setRootFileIds(prev => {
      const next = prev.filter(r => r !== id);
      try { localStorage.setItem('noterama_root_files', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  useEffect(() => {
    const tree = buildTree(displayNbs, sources, rootFileIds, getFolderParentMap());
    setFileTree(tree);
    
    const firstFile = tree.find(f => f.type === 'file')?.id ?? null;
    if (firstFile && (!selectedFileId || !tree.some(f => f.id === selectedFileId))) {
      setSelectedFileId(firstFile);
      setOpenTabs([firstFile]);
    }
  }, [notebooks, sources, loaded, rootFileIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const [editContent, setEditContent]       = useState('');
  
  const [creating, setCreating]       = useState<{ parentId: string | null; type: 'file' | 'folder' } | null>(null);
  const [createName, setCreateName]   = useState('');
  const createInputRef                = useRef<HTMLInputElement>(null);

  const [renaming, setRenaming]       = useState<string | null>(null);
  const [renameName, setRenameName]   = useState('');
  const renameInputRef                = useRef<HTMLInputElement>(null);
  useEffect(() => { if (renaming) setTimeout(() => renameInputRef.current?.focus(), 30); }, [renaming]);

  const commitRename = async () => {
    const name = renameName.trim();
    if (name && renaming) {
      setFileTree(prev => prev.map(f => f.id === renaming ? { ...f, name } : f));
      const target = fileTree.find(f => f.id === renaming);
      if (target?.type === 'folder') {
        updateNotebook(renaming, { title: name });
      } else {
        updateSource(renaming, { title: name });
      }
    }
    setRenaming(null); setRenameName('');
  };

  type CtxMenu = { x: number; y: number; itemId: string } | null;
  const [ctxMenu, setCtxMenu] = useState<CtxMenu>(null);
  useEffect(() => {
    if (!ctxMenu) return;
    const close = () => setCtxMenu(null);
    window.addEventListener('click', close);
    window.addEventListener('contextmenu', close);
    return () => { window.removeEventListener('click', close); window.removeEventListener('contextmenu', close); };
  }, [ctxMenu]);

  const deleteItem = (id: string) => {
    const target = fileTree.find(f => f.id === id);
    if (target?.type === 'folder') {
      deleteNotebook(id);
    } else {
      deleteSource(id);
    }
    const collect = (pid: string): string[] => {
      const children = fileTree.filter(f => f.parentId === pid).map(f => f.id);
      return [pid, ...children.flatMap(collect)];
    };
    const ids = new Set(collect(id));
    setFileTree(prev => prev.filter(f => !ids.has(f.id)));
    setOpenTabs(prev => prev.filter(t => !ids.has(t)));
    if (selectedFileId && ids.has(selectedFileId)) setSelectedFileId(null);
    setCtxMenu(null);
  };

  const dragId = useRef<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const editorRef     = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const f = fileTree.find(f => f.id === selectedFileId && f.type === 'file');
    if (f) setEditContent(f.content);
  }, [selectedFileId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selectedFileId) return;
    const t = setTimeout(() => {
      setFileTree(prev => prev.map(f => f.id === selectedFileId ? { ...f, content: editContent } : f));
      updateSource(selectedFileId, { content: editContent });
    }, 300);
    return () => clearTimeout(t);
  }, [editContent, selectedFileId]);

  useEffect(() => {
    if (!editorRef.current || isPreview) return;
    editorRef.current.style.height = 'auto';
    editorRef.current.style.height = editorRef.current.scrollHeight + 'px';
  }, [editContent, isPreview]);

  useEffect(() => {
    if (creating) setTimeout(() => createInputRef.current?.focus(), 40);
  }, [creating]);

  const selectedFile   = fileTree.find(f => f.id === selectedFileId && f.type === 'file') ?? null;
  const selectedFolder = selectedFile ? fileTree.find(f => f.id === selectedFile.parentId) ?? null : null;
  const activeNb       = selectedFolder ? displayNbs.find(n => n.id === selectedFolder.id) ?? null : null;

  const toggleFolder = (id: string) => setFileTree(prev => prev.map(f => f.id === id ? { ...f, expanded: !f.expanded } : f));

  const selectFile = (id: string) => {
    setSelectedFileId(id);
    setIsPreview(false);
    setMobileDrawerOpen(false);
    setOpenTabs(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenTabs(prev => {
      const next = prev.filter(t => t !== id);
      if (selectedFileId === id) {
        const idx = prev.indexOf(id);
        const fallback = next[Math.min(idx, next.length - 1)] ?? null;
        setSelectedFileId(fallback);
        if (fallback) {
          const f = fileTree.find(f => f.id === fallback);
          if (f) setEditContent(f.content);
        }
      }
      return next;
    });
  };

  const commitCreate = async () => {
    if (!creating || !createName.trim()) { setCreating(null); setCreateName(''); return; }
    const name = creating.type === 'file' && !createName.endsWith('.md') ? createName + '.md' : createName;
    
    let realId = `local-${Date.now()}`;
    if (creating.type === 'folder') {
      const created = await createNotebook(name);
      if (created) realId = created.id;
      if (creating.parentId) {
        saveFolderParent(realId, creating.parentId);
      }
    } else {
      let targetFolderId = creating.parentId;
      if (!targetFolderId || !UUID_RE.test(targetFolderId)) {
        const validFolder = notebooks.find(n => UUID_RE.test(n.id)) || fileTree.find(f => f.type === 'folder' && UUID_RE.test(f.id));
        if (validFolder) {
          targetFolderId = validFolder.id;
        } else {
          const newNb = await createNotebook('My Notebook');
          if (newNb) targetFolderId = newNb.id;
        }
      }
      if (targetFolderId && UUID_RE.test(targetFolderId)) {
        const created = await createSource(targetFolderId, name, '');
        if (created) realId = created.id;
      }
      if (creating.parentId === null) {
        saveRootFileId(realId);
      }
    }

    const newItem: FileItem = { id: realId, name, type: creating.type, parentId: creating.parentId, content: '', expanded: true };
    if (creating.parentId) {
      setFileTree(prev => [...prev.map(f => f.id === creating.parentId ? { ...f, expanded: true } : f), newItem]);
    } else {
      setFileTree(prev => [...prev, newItem]);
    }
    if (creating.type === 'file') selectFile(realId);
    setCreating(null);
    setCreateName('');
  };

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  useEffect(() => {
    if (activeNb && isSupabaseConnected && UUID_RE.test(activeNb.id)) {
      fetchSources(activeNb.id);
    }
  }, [activeNb?.id, isSupabaseConnected, fetchSources]);

  const { isPlaying, speak, stop } = useAudioSpeech();
  const handleAudio = () => {
    if (isPlaying) { stop(); return; }
    speak(`Audio overview. ${activeNb?.title ?? 'Notebook'}. ${activeNb?.description ?? ''}. ${editContent.slice(0, 400)}`);
  };

  const {
    sessions, loaded: sessionsLoaded,
    createSession, updateSession, deleteSession,
  } = useChatSessions();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const historyDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showHistory) return;
    const handler = (e: MouseEvent) => {
      if (historyDropdownRef.current && !historyDropdownRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showHistory]);

  useEffect(() => {
    if (!sessionsLoaded) return;
    if (sessions.length === 0) {
      createSession().then(s => setActiveSessionId(s.id));
    } else if (!activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessionsLoaded, sessions.length, activeSessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeSession: ChatSession | undefined =
    sessions.find(s => s.id === activeSessionId) ?? sessions[0];
  const messages = activeSession?.messages ?? [];

  const setMessages = (updater: Message[] | ((prev: Message[]) => Message[])) => {
    if (!activeSession) return;
    const next = typeof updater === 'function' ? updater(activeSession.messages) : updater;
    updateSession(activeSession.id, { messages: next });
  };

  const startNewSession = async () => {
    const s = await createSession();
    setActiveSessionId(s.id);
    setShowHistory(false);
  };

  const switchSession = (id: string) => {
    setActiveSessionId(id);
    setShowHistory(false);
  };

  const [query, setQuery]       = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatError, setChatError]     = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || isStreaming) return;
    setQuery(''); setChatError(null);
    const history = [...messages, { role: 'user' as const, content: q }];
    setMessages(history); setIsStreaming(true);
    setMessages(p => [...p, { role: 'assistant', content: '' }]);
    if (activeSession && activeSession.name === 'New Chat') {
      const name = q.slice(0, 30) + (q.length > 30 ? '…' : '');
      updateSession(activeSession.id, { name });
    }
    const treeSummary = fileTree
      .map(item => `${item.type === 'folder' ? '📁 Folder:' : '📄 File:'} ${item.name}${item.parentId ? ` (inside parent ID: ${item.parentId})` : ' (root)'}`)
      .join('\n');

    const allFilesContent = fileTree
      .filter(item => item.type === 'file')
      .map(item => {
        const content = item.id === selectedFileId ? editContent : item.content;
        return `=== FILE: ${item.name} ===\n${content.slice(0, 1500)}`;
      })
      .join('\n\n');

    const sys = `You are Noterama Agent, an AI assistant with full access to the user's workspace files and folders.

WORKSPACE STRUCTURE & FOLDERS:
${treeSummary || '(No folders/files in workspace)'}

ACTIVE SELECTED FILE: ${selectedFile?.name ?? 'None'}

WORKSPACE FILE CONTENTS:
${allFilesContent || '(No files)'}

INSTRUCTIONS:
- You have full context of all folders, files, and their contents listed above.
- Answer user questions accurately based on this workspace context.
- Be concise, smart, and helpful. Use Markdown format for clean formatting.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map(m => ({ role: m.role, content: m.content })), settings, systemPrompt: sys }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({} as { error?: string }))).error ?? `Error ${res.status}`);
      const reader = res.body?.getReader(); const dec = new TextDecoder();
      if (!reader) throw new Error('No body');
      let acc = '';
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages(p => [...p.slice(0, -1), { role: 'assistant', content: acc }]);
      }
    } catch (err) {
      setChatError(err instanceof Error ? err.message : 'Unknown'); setMessages(p => p.slice(0, -1));
    } finally { setIsStreaming(false); }
  }, [query, messages, selectedFile, editContent, fileTree, selectedFileId, settings, isStreaming]);

  const providerOk = !!settings.apiKey;

  const renderCreateInput = (indent: number) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: `3px 8px 3px ${indent}px`, margin: '1px 4px' }}>
      {creating?.type === 'folder'
        ? <Folder size={13} style={{ color: '#e2b13c', flexShrink: 0 }} />
        : <FileText size={13} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />}
      <input
        ref={createInputRef}
        value={createName}
        onChange={e => setCreateName(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') commitCreate(); if (e.key === 'Escape') { setCreating(null); setCreateName(''); } }}
        placeholder={creating?.type === 'file' ? 'untitled.md' : 'New Folder'}
        style={{
          flex: 1, background: 'var(--bg-input)', border: '1px solid var(--accent-blue)',
          borderRadius: 3, padding: '2px 6px', fontSize: 12, color: 'var(--text-bright)', outline: 'none',
        }}
      />
    </div>
  );

  const renderTree = (parentId: string | null, depth: number): React.ReactNode => {
    const items = parentId === null
      ? fileTree.filter(f => f.parentId === null || !fileTree.some(p => p.id === f.parentId))
      : fileTree.filter(f => f.parentId === parentId);

    const indent = depth * 14 + 8;
    const dropZoneId = parentId ?? '__root__';
    return (
      <>
        {dragId.current && (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(dropZoneId); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => {
              e.preventDefault(); e.stopPropagation();
              const id = dragId.current;
              if (id && id !== parentId) {
                setFileTree(prev => prev.map(f => f.id === id ? { ...f, parentId } : f));
                const dragged = fileTree.find(f => f.id === id);
                if (dragged?.type === 'file') {
                  if (parentId) {
                    removeRootFileId(id);
                    setFileTree(prev => prev.map(f => f.id === parentId ? { ...f, expanded: true } : f));
                    updateSource(id, { notebook_id: parentId });
                  } else {
                    saveRootFileId(id);
                  }
                } else if (dragged?.type === 'folder') {
                  saveFolderParent(id, parentId);
                }
              }
              setDragOver(null); dragId.current = null;
            }}
            style={{
              height: dragOver === dropZoneId ? 3 : 0,
              background: 'var(--accent-blue)',
              borderRadius: 2,
              margin: '0 8px',
              transition: 'height 0.1s',
              pointerEvents: dragId.current ? 'all' : 'none',
            }}
          />
        )}
        {creating && creating.parentId === parentId && parentId === null && (
          renderCreateInput(indent + 16)
        )}
        {items.map(item => (
          <React.Fragment key={item.id}>
            <div
              draggable
              onDragStart={e => { dragId.current = item.id; e.dataTransfer.effectAllowed = 'move'; }}
              onDragEnd={() => { dragId.current = null; setDragOver(null); }}
              onDragOver={e => {
                e.preventDefault(); e.stopPropagation();
                if (item.type === 'folder' && dragId.current && !isDescendantOrSelf(dragId.current, item.id, fileTree)) {
                  setDragOver(item.id);
                }
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => {
                e.preventDefault(); e.stopPropagation();
                const id = dragId.current;
                if (id && item.type === 'folder' && !isDescendantOrSelf(id, item.id, fileTree)) {
                  setFileTree(prev => prev.map(f => f.id === id ? { ...f, parentId: item.id } : f));
                  setFileTree(prev => prev.map(f => f.id === item.id ? { ...f, expanded: true } : f));
                  const dragged = fileTree.find(f => f.id === id);
                  if (dragged?.type === 'file') {
                    removeRootFileId(id);
                    updateSource(id, { notebook_id: item.id });
                  } else if (dragged?.type === 'folder') {
                    saveFolderParent(id, item.id);
                  }
                }
                setDragOver(null); dragId.current = null;
              }}
              onClick={() => {
                if (renaming === item.id) return;
                item.type === 'folder' ? toggleFolder(item.id) : selectFile(item.id);
              }}
              onDoubleClick={() => { setRenaming(item.id); setRenameName(item.name); }}
              onContextMenu={e => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, itemId: item.id }); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: `3px 8px 3px ${indent}px`,
                fontSize: 12.5, cursor: 'grab',
                background: dragOver === item.id
                  ? 'rgba(59,130,246,0.15)'
                  : selectedFileId === item.id ? 'var(--bg-active)' : 'transparent',
                color: selectedFileId === item.id ? 'var(--text-bright)' : 'var(--text-primary)',
                borderRadius: 4, margin: '1px 4px',
                transition: 'background var(--transition)',
                outline: dragOver === item.id ? '1px solid var(--accent-blue)' : 'none',
              }}
            >
              {item.type === 'folder' ? (
                <>
                  {item.expanded
                    ? <ChevronDown size={11} style={{ flexShrink: 0, color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
                    : <ChevronRight size={11} style={{ flexShrink: 0, color: 'var(--text-tertiary)', pointerEvents: 'none' }} />}
                  {item.expanded
                    ? <FolderOpen size={14} style={{ flexShrink: 0, color: '#e2b13c', pointerEvents: 'none' }} />
                    : <Folder size={14} style={{ flexShrink: 0, color: '#e2b13c', pointerEvents: 'none' }} />}
                  {renaming === item.id ? (
                    <input ref={renameInputRef} value={renameName}
                      onChange={e => setRenameName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setRenaming(null); setRenameName(''); } }}
                      onClick={e => e.stopPropagation()}
                      style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--accent-blue)', borderRadius: 3, padding: '1px 5px', fontSize: 12, color: 'var(--text-bright)', outline: 'none' }}
                    />
                  ) : (
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontWeight: 500, pointerEvents: 'none' }}>{item.name}</span>
                  )}
                  {renaming !== item.id && (
                    <button
                      className="ag-tree-more-btn"
                      title="CRUD Menu"
                      onClick={e => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setCtxMenu({ x: Math.min(window.innerWidth - 170, rect.left), y: rect.bottom + 4, itemId: item.id });
                      }}
                      style={{
                        background: 'none', border: 'none', color: 'var(--text-tertiary)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '2px 4px', borderRadius: 3, marginLeft: 'auto', flexShrink: 0,
                      }}
                    >
                      <MoreVertical size={13} />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <span style={{ width: 11, flexShrink: 0 }} />
                  <FileText size={13} style={{ flexShrink: 0, color: 'var(--accent-cyan)', pointerEvents: 'none' }} />
                  {renaming === item.id ? (
                    <input ref={renameInputRef} value={renameName}
                      onChange={e => setRenameName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setRenaming(null); setRenameName(''); } }}
                      onClick={e => e.stopPropagation()}
                      style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--accent-blue)', borderRadius: 3, padding: '1px 5px', fontSize: 12, color: 'var(--text-bright)', outline: 'none' }}
                    />
                  ) : (
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, pointerEvents: 'none' }}>{item.name}</span>
                  )}
                  {renaming !== item.id && (
                    <button
                      className="ag-tree-more-btn"
                      title="CRUD Menu"
                      onClick={e => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setCtxMenu({ x: Math.min(window.innerWidth - 170, rect.left), y: rect.bottom + 4, itemId: item.id });
                      }}
                      style={{
                        background: 'none', border: 'none', color: 'var(--text-tertiary)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '2px 4px', borderRadius: 3, marginLeft: 'auto', flexShrink: 0,
                      }}
                    >
                      <MoreVertical size={13} />
                    </button>
                  )}
                </>
              )}
            </div>
            {item.type === 'folder' && item.expanded && (
              <>
                {renderTree(item.id, depth + 1)}
                {creating && creating.parentId === item.id && (
                  renderCreateInput((depth + 1) * 14 + 8 + 15)
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  const renderSidebarContent = (isMobile?: boolean) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        height: 38, padding: '0 10px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: '1px solid var(--border)',
        fontWeight: 700, fontSize: 10.5, letterSpacing: '0.06em', color: 'var(--text-secondary)',
        flexShrink: 0,
      }}>
        <span>{activeTab === 'search' ? 'SEARCH' : 'EXPLORER'}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {activeTab === 'explorer' && (
            <div style={{ display: 'flex', gap: 1 }}>
              <button title="New File (.md)" onClick={() => setCreating({ parentId: null, type: 'file' })}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: 4, borderRadius: 3 }}>
                <FilePlus size={14} />
              </button>
              <button title="New Folder" onClick={() => setCreating({ parentId: null, type: 'folder' })}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: 4, borderRadius: 3 }}>
                <FolderPlus size={14} />
              </button>
            </div>
          )}
          {isMobile && (
            <button onClick={() => setMobileDrawerOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: 4, borderRadius: 3 }}>
              <ChevronLeft size={16} />
            </button>
          )}
        </div>
      </div>

      {activeTab === 'search' && (
        <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 10px' }}>
            <Search size={11} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
            <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search files…"
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-bright)', fontSize: 12, width: '100%' }} />
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', padding: '6px 0' }}>
        {activeTab === 'explorer'
          ? renderTree(null, 0)
          : fileTree.filter(f => f.type === 'file' && f.name.toLowerCase().includes(searchQuery.toLowerCase())).map(f => (
            <div key={f.id} onClick={() => { setActiveTab('explorer'); selectFile(f.id); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', cursor: 'pointer', fontSize: 12.5, color: 'var(--text-primary)', borderRadius: 4, margin: '1px 4px', transition: 'background var(--transition)' }}>
              <FileText size={13} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
            </div>
          ))
        }
      </div>
    </div>
  );

  const renderActivityIcon = (tab: ActivityTab, icon: React.ReactNode, label: string, badge?: number) => {
    const isActive = tab === activeTab || (tab === 'agent' && showAgentPanel);
    const handleClick = () => {
      if (tab === 'settings') { setShowSettings(true); return; }
      if (tab === 'agent') { setShowAgentPanel(p => !p); return; }
      if (tab === activeTab) setSidebarOpen(p => !p);
      else { setActiveTab(tab); setSidebarOpen(true); }
    };
    return (
      <button onClick={handleClick} title={label}
        style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'none', border: 'none', color: isActive ? 'var(--text-bright)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all var(--transition)', position: 'relative' }}>
        {isActive && <span style={{ position: 'absolute', left: -6, top: 6, bottom: 6, width: 2, background: 'var(--accent-blue)', borderRadius: 2 }} />}
        {icon}
        {badge != null && badge > 0 && (
          <span style={{ position: 'absolute', top: 2, right: 2, background: 'var(--accent-blue)', color: 'white', fontSize: 9, fontWeight: 700, lineHeight: 1, padding: '1px 4px', borderRadius: 10, minWidth: 14, textAlign: 'center' }}>{badge}</span>
        )}
      </button>
    );
  };

  return (
    <div className="ag-shell">
      {showSettings && <SettingsModal settings={settings} onUpdate={updateSettings} onClose={() => setShowSettings(false)} />}
      {showUploadModal && activeNb && (
        <UploadSourceModal notebookId={activeNb.id}
          onAddSource={async (t, ty, c, url) => { await addSource(activeNb.id, t, ty, c, url); }}
          uploadFile={uploadFile} onClose={() => setShowUploadModal(false)} />
      )}

      {mobileDrawerOpen && <div className="mobile-overlay" onClick={() => setMobileDrawerOpen(false)} />}

      {ctxMenu && (() => {
        const target = fileTree.find(f => f.id === ctxMenu.itemId);
        if (!target) return null;
        return (
          <div onClick={e => e.stopPropagation()} style={{
            position: 'fixed', zIndex: 9999,
            left: ctxMenu.x, top: ctxMenu.y,
            background: 'var(--bg-sidebar)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            minWidth: 160, padding: '4px 0',
            fontSize: 12.5,
          }}>
            <button onClick={() => { setRenaming(target.id); setRenameName(target.name); setCtxMenu(null); }}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Edit3 size={13} /> Rename
            </button>
            {target.type === 'folder' && (
              <>
                <button onClick={() => { setCreating({ parentId: target.id, type: 'file' }); setFileTree(p => p.map(f => f.id === target.id ? { ...f, expanded: true } : f)); setCtxMenu(null); }}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FilePlus size={13} /> New File Inside
                </button>
                <button onClick={() => { setCreating({ parentId: target.id, type: 'folder' }); setFileTree(p => p.map(f => f.id === target.id ? { ...f, expanded: true } : f)); setCtxMenu(null); }}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FolderPlus size={13} /> New Folder Inside
                </button>
              </>
            )}
            <div style={{ borderTop: '1px solid var(--border)', margin: '3px 0' }} />
            <button onClick={() => deleteItem(target.id)}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <X size={13} /> Delete
            </button>
          </div>
        );
      })()}

      <header className="ag-menu-bar" style={{ height: 42, padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, overflow: 'hidden' }}>
          <button className="mobile-burger" onClick={() => setMobileDrawerOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}>
            <Menu size={18} />
          </button>
          <Link
            href="/"
            title="Back to Landing Page"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: 'var(--text-bright)', textDecoration: 'none',
              fontWeight: 700, fontSize: 13, letterSpacing: '-0.01em', flexShrink: 0
            }}
          >
            <Home size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>Noterama Studio</span>
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <button
            onClick={() => setIsPreview(p => !p)}
            title={isPreview ? 'Switch to Edit mode' : 'Switch to Preview mode'}
            className="btn btn-ghost"
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 500,
              gap: 6,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              height: 28,
            }}
          >
            {isPreview ? (
              <>
                <Edit3 size={13} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ color: 'var(--text-bright)' }}>Edit</span>
              </>
            ) : (
              <>
                <Eye size={13} style={{ color: 'var(--text-secondary)' }} />
                <span>Preview</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowAgentPanel(p => !p)}
            title="Toggle AI Agent Panel"
            className="btn btn-ghost"
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 500,
              gap: 6,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              height: 28,
            }}
          >
            <Sparkles size={13} style={{ color: showAgentPanel ? 'var(--accent-cyan)' : 'var(--text-secondary)' }} />
            <span style={{ color: showAgentPanel ? 'var(--text-bright)' : 'inherit' }}>AI Agent</span>
          </button>
        </div>
      </header>

      <div className="ag-body">
        <div className="ag-activity-bar desktop-only">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {renderActivityIcon('explorer', <BookOpen size={18} />, 'Explorer')}
            {renderActivityIcon('search',   <Search size={18} />,   'Search')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 'auto' }}>
            {renderActivityIcon('settings', <Settings size={18} />, 'Settings')}
          </div>
        </div>

        {sidebarOpen && (
          <div className="ag-sidebar desktop-only" style={{ width: sidebarWidth, position: 'relative' }}>
            {renderSidebarContent()}
            <div
              className={`ag-resizer ${isSidebarResizing ? 'is-resizing' : ''}`}
              onMouseDown={startSidebarResizing}
              title="Drag to resize sidebar"
              style={{ left: 'auto', right: -3, width: 5, cursor: 'col-resize' }}
            />
          </div>
        )}

        <div className={`mobile-drawer ${mobileDrawerOpen ? 'open' : ''}`}>
          <div className="ag-activity-bar" style={{ borderRight: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {renderActivityIcon('explorer', <BookOpen size={18} />, 'Explorer')}
              {renderActivityIcon('search',   <Search size={18} />,   'Search')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 'auto' }}>
              {renderActivityIcon('settings', <Settings size={18} />, 'Settings')}
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-sidebar)', overflow: 'hidden' }}>
            {renderSidebarContent(true)}
          </div>
        </div>

        <div className="ag-editor">
          <div style={{
            display: 'flex', alignItems: 'stretch',
            background: 'var(--bg-activity)',
            borderBottom: '1px solid var(--border)',
            overflowX: 'auto', flexShrink: 0, height: 35,
            scrollbarWidth: 'none',
          }}>
            {openTabs.map(tabId => {
              const tabFile = fileTree.find(f => f.id === tabId);
              if (!tabFile) return null;
              const isActive = tabId === selectedFileId;
              return (
                <div
                  key={tabId}
                  onClick={() => selectFile(tabId)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '0 12px 0 14px',
                    borderRight: '1px solid var(--border)',
                    background: isActive ? 'var(--bg-editor)' : 'transparent',
                    borderTop: isActive ? '1px solid var(--accent-blue)' : '1px solid transparent',
                    cursor: 'pointer', flexShrink: 0, userSelect: 'none',
                    transition: 'background var(--transition)',
                    minWidth: 0,
                  }}
                >
                  <FileText size={13} style={{ color: isActive ? 'var(--accent-cyan)' : 'var(--text-tertiary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: isActive ? 'var(--text-bright)' : 'var(--text-secondary)', whiteSpace: 'nowrap', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tabFile.name}
                  </span>
                  <button
                    onClick={e => closeTab(tabId, e)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', padding: '1px 2px', borderRadius: 3, marginLeft: 2, flexShrink: 0 }}
                    title="Close tab"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
            <div style={{ marginLeft: 'auto' }} />
          </div>

          {selectedFile && (
            <div style={{
              height: 26, padding: '0 16px',
              display: 'flex', alignItems: 'center', gap: 5,
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-editor)',
              fontSize: 12, color: 'var(--text-tertiary)',
              flexShrink: 0, overflow: 'hidden',
            }}>
              {selectedFolder && (
                <>
                  <Folder size={12} style={{ color: '#e2b13c', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{selectedFolder.name}</span>
                  <ChevronRight size={11} style={{ flexShrink: 0 }} />
                </>
              )}
              <FileText size={12} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{selectedFile.name}</span>
            </div>
          )}

          {selectedFile ? (
            <>
              <div style={{ flex: 1, overflowY: 'auto', padding: '40px 60px' }}>
                <div style={{ maxWidth: 760, margin: '0 auto' }}>
                  <div className="notion-card-list">
                    {(selectedFile.cards || parseMarkdownToCards(editContent)).map((card, index) => {
                      const updateCard = (updatedFields: Partial<NoteCard>) => {
                        const currentCards = selectedFile.cards || parseMarkdownToCards(editContent);
                        const newCards = currentCards.map(c => c.id === card.id ? { ...c, ...updatedFields } : c);
                        const newContent = stringifyCardsToMarkdown(newCards);
                        setEditContent(newContent);
                        setFileTree(prev => prev.map(f => f.id === selectedFile.id ? { ...f, content: newContent, cards: newCards } : f));
                      };

                      const deleteCard = () => {
                        const currentCards = selectedFile.cards || parseMarkdownToCards(editContent);
                        const newCards = currentCards.filter(c => c.id !== card.id);
                        const newContent = stringifyCardsToMarkdown(newCards);
                        setEditContent(newContent);
                        setFileTree(prev => prev.map(f => f.id === selectedFile.id ? { ...f, content: newContent, cards: newCards } : f));
                      };

                      return (
                        <div key={card.id} className="notion-card">
                          <div className="notion-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                              <FileText size={15} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                              <input
                                value={card.title}
                                onChange={e => updateCard({ title: e.target.value })}
                                placeholder="Note Title"
                                className="notion-card-title-input"
                                style={{ width: `${Math.max(50, card.title.length * 8.5)}px`, flex: '0 0 auto' }}
                              />
                              <div className="notion-card-date" style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--text-tertiary)', fontSize: 13, marginTop: 1 }}>
                                <span>@</span>
                                <input
                                  value={card.date}
                                  onChange={e => updateCard({ date: e.target.value })}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: 13,
                                    color: 'var(--text-tertiary)',
                                    width: `${Math.max(20, card.date.length * 7)}px`,
                                  }}
                                  placeholder="Date / Time"
                                />
                              </div>
                            </div>
                            <button onClick={deleteCard} className="notion-card-delete-btn" title="Delete card" style={{ flexShrink: 0 }}>
                              <X size={14} />
                            </button>
                          </div>

                          {isPreview ? (
                            <div style={{ userSelect: 'text', padding: '4px 0', minHeight: 40 }}>
                              {renderDoc(card.content || '*Empty note. Click Edit to add details.*')}
                            </div>
                          ) : (
                            <textarea
                              value={card.content}
                              onChange={e => updateCard({ content: e.target.value })}
                              placeholder="Write some markdown..."
                              spellCheck
                              rows={Math.max(3, card.content.split('\n').length)}
                              style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'var(--text-primary)',
                                fontSize: 14,
                                lineHeight: 1.6,
                                fontFamily: 'inherit',
                                resize: 'none',
                                minHeight: 60,
                                caretColor: 'var(--accent-cyan)',
                                userSelect: 'text',
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => {
                        const currentCards = selectedFile.cards || parseMarkdownToCards(editContent);
                        const newCards = [
                          ...currentCards,
                          {
                            id: `card-new-${Date.now()}`,
                            title: 'New Note Item',
                            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                            content: ''
                          }
                        ];
                        const newContent = stringifyCardsToMarkdown(newCards);
                        setEditContent(newContent);
                        setFileTree(prev => prev.map(f => f.id === selectedFile.id ? { ...f, content: newContent, cards: newCards } : f));
                      }}
                      className="btn btn-ghost"
                      style={{ fontSize: 13, gap: 6 }}
                    >
                      <FilePlus size={15} />
                      <span>Add Note Card</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, color: 'var(--text-tertiary)' }}>
              <FileText size={44} style={{ opacity: 0.2 }} />
              <span style={{ fontSize: 14, opacity: 0.6 }}>Select a file or create a new one</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setCreating({ parentId: null, type: 'file' })} className="btn btn-ghost" style={{ fontSize: 12 }}>
                  <FilePlus size={13} /> New File
                </button>
                <button onClick={() => setCreating({ parentId: null, type: 'folder' })} className="btn btn-ghost" style={{ fontSize: 12 }}>
                  <FolderPlus size={13} /> New Folder
                </button>
              </div>
            </div>
          )}
        </div>

        {showAgentPanel && (
          <div className="ag-agent-panel" style={{ width: agentWidth }}>
            <div className={`ag-resizer desktop-only ${isResizing ? 'is-resizing' : ''}`} onMouseDown={startResizing} title="Drag to resize" />

            <div style={{ height: 38, padding: '0 8px 0 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, position: 'relative' }}>
              <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-bright)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                title={activeSession?.name ?? 'New Chat'}>
                {activeSession?.name ?? 'New Chat'}
              </span>

              <button title="New chat" onClick={startNewSession}
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px 5px', borderRadius: 4 }}>
                <Plus size={14} />
              </button>

              <div ref={historyDropdownRef} style={{ position: 'relative' }}>
                <button title="Chat history" onClick={() => setShowHistory(p => !p)}
                  style={{ background: showHistory ? 'var(--bg-active)' : 'none', border: 'none', color: showHistory ? 'var(--text-bright)' : 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px 5px', borderRadius: 4 }}>
                  <History size={14} />
                </button>
                {showHistory && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, zIndex: 200, background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.4)', minWidth: 200, maxHeight: 280, overflowY: 'auto', marginTop: 4 }}>
                    {sessions.length === 0 && (
                      <div style={{ padding: '10px 12px', fontSize: 11, color: 'var(--text-tertiary)' }}>No chat history</div>
                    )}
                    {sessions.map(s => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 4px 2px 8px', borderRadius: 4, background: s.id === activeSessionId ? 'var(--bg-active)' : 'none' }}>
                        <button onClick={() => switchSession(s.id)}
                          style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', color: s.id === activeSessionId ? 'var(--text-bright)' : 'var(--text-primary)', padding: '5px 4px', fontSize: 12, cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.name}
                        </button>
                        <button
                          title="Delete session"
                          onClick={async e => {
                            e.stopPropagation();
                            await deleteSession(s.id);
                            if (s.id === activeSessionId) setActiveSessionId(null);
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: 3, flexShrink: 0 }}>
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button title="Close" onClick={() => setShowAgentPanel(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px 5px', borderRadius: 4 }}>
                <X size={14} />
              </button>
            </div>

            {loaded && !providerOk && (
              <div style={{ margin: 10, padding: '8px 10px', borderRadius: 6, background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)', display: 'flex', gap: 6, alignItems: 'flex-start', cursor: 'pointer' }}
                onClick={() => setShowSettings(true)}>
                <AlertCircle size={13} style={{ color: '#eab308', flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 11, color: '#eab308' }}>No API key set. <u>Open Settings</u> to configure Groq.</span>
              </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'ag-chat-user' : 'ag-chat-agent'}>
                  {msg.content
                    ? renderChat(msg.content)
                    : (isStreaming && i === messages.length - 1 ? <span style={{ opacity: 0.5 }}>▋</span> : null)}
                </div>
              ))}
              {chatError && (
                <div style={{ display: 'flex', gap: 6, padding: '8px 10px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertCircle size={13} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 11, color: '#ef4444' }}>{chatError}</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={sendMessage} style={{ padding: 10, borderTop: '1px solid var(--border)', background: 'var(--bg-sidebar)' }}>
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: 8 }}>
                <textarea
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={providerOk ? `Ask about ${selectedFile?.name ?? 'your file'}…` : 'Configure API key in Settings…'}
                  disabled={!providerOk || isStreaming}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-bright)', fontSize: 12, outline: 'none', resize: 'none', minHeight: 48, fontFamily: 'inherit' }}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e as unknown as React.FormEvent); } }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--border)' }}>
                  <span className="ag-badge" style={{ fontSize: 10, cursor: 'pointer', gap: 4, maxWidth: 'calc(100% - 70px)', overflow: 'hidden', flexShrink: 1, minWidth: 0 }} onClick={() => setShowSettings(true)}>
                    <Bot size={11} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{settings.model || 'Groq'}</span>
                    <ChevronUp size={10} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                  </span>
                  <button type="submit" disabled={!providerOk || isStreaming || !query.trim()}
                    style={{ background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, opacity: (!providerOk || isStreaming || !query.trim()) ? 0.5 : 1 }}>
                    <span>Send</span><Send size={11} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
