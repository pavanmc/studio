"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onError?: (error: SpeechRecognitionError) => void;
  onEnd?: () => void;
  lang?: string;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

export function useSpeechRecognition(options?: UseSpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = options?.lang || 'en-US';

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      if (options?.onResult) {
        options.onResult(currentTranscript);
      }
    };

    recognitionInstance.onerror = (event: Event) => {
      const speechError = event as SpeechRecognitionError;
      setError(speechError.error || 'An unknown error occurred during speech recognition.');
      if (options?.onError) {
        options.onError(speechError);
      }
      setIsListening(false); 
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      if (options?.onEnd) {
        options.onEnd();
      }
    };
    
    recognitionRef.current = recognitionInstance;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [options?.lang, options?.onResult, options?.onError, options?.onEnd]);
  
  useEffect(() => {
    if (recognitionRef.current && options?.lang) {
      recognitionRef.current.lang = options.lang;
    }
  }, [options?.lang]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript('');
        setError(null);
      } catch (e: any) {
        setError(e.message || 'Failed to start speech recognition.');
        setIsListening(false);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    isSupported: !!recognitionRef.current,
  };
}
