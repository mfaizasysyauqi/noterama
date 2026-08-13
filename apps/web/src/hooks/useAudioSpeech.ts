'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setSupported(true);
    }
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!synthRef.current) return;

    // Stop current speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Select natural English voice if available
    const voices = synthRef.current.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Natural')) ||
                         voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onend = () => {
      setIsPlaying(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    setIsPlaying(true);
    synthRef.current.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  }, []);

  return { isPlaying, supported, speak, stop };
}
