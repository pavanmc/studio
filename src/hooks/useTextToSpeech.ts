"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTextToSpeechOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
  lang?: string;
  voice?: SpeechSynthesisVoice | null;
}

export function useTextToSpeech(options?: UseTextToSpeechOptions) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        setVoices(availableVoices);
      };
      loadVoices();
      // Some browsers load voices asynchronously.
      if (synthRef.current?.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
      return () => {
        if (synthRef.current?.speaking) {
          synthRef.current.cancel();
        }
      };
    } else {
      setError('Text-to-speech not supported in this browser.');
    }
  }, []);

  const speak = useCallback((text: string, lang?: string) => {
    if (!synthRef.current || !text) return;

    if (synthRef.current.speaking) {
      synthRef.current.cancel(); // Stop current speech before starting new one
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang || options?.lang || 'en-US';
      
      if (options?.voice) {
        utterance.voice = options.voice;
      } else if (lang || options?.lang) {
        // Attempt to find a voice that matches the language
        const targetLang = lang || options?.lang;
        const suitableVoice = voices.find(v => v.lang.startsWith(targetLang!));
        if (suitableVoice) {
          utterance.voice = suitableVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
        if (options?.onStart) options.onStart();
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        if (options?.onEnd) options.onEnd();
      };
      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        setError(event.error || 'An unknown error occurred during speech synthesis.');
        setIsSpeaking(false);
        if (options?.onError) options.onError(event);
      };
      synthRef.current.speak(utterance);
    } catch (e: any) {
      setError(e.message || 'Failed to speak.');
      setIsSpeaking(false);
    }
  }, [options, voices]);

  const cancel = useCallback(() => {
    if (synthRef.current?.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    error,
    speak,
    cancel,
    voices,
    isSupported: !!synthRef.current,
  };
}
