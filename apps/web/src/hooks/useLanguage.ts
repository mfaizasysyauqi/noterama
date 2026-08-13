'use client';
import { useState, useEffect } from 'react';
import type { Lang } from '@/lib/translations';

const LS_KEY = 'noterama_lang';

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY) as Lang | null;
      if (stored === 'id' || stored === 'en') setLangState(stored);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(LS_KEY, l); } catch {}
  };

  const toggle = () => setLang(lang === 'en' ? 'id' : 'en');

  return { lang, setLang, toggle };
}
