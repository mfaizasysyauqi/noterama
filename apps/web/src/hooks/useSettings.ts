'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AppSettings,
  DEFAULT_SETTINGS,
  DEFAULT_MODELS,
} from '@noterama/core';

const STORAGE_KEY = 'noterama_settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      // Auto-update model when provider changes (if still on old provider default)
      if (patch.provider && patch.provider !== prev.provider) {
        const wasDefault = Object.values(DEFAULT_MODELS).includes(prev.model);
        if (wasDefault) next.model = DEFAULT_MODELS[patch.provider];
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { settings, updateSettings, loaded };
}
