"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LanguageSelect } from "./LanguageSelect";
import { TextAreaWithActions } from "./TextAreaWithActions";
import { languages, Language } from "@/lib/languages";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { translateText, TranslateTextInput } from "@/ai/flows/translate-text";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const MAX_INPUT_LENGTH = 5000;

// Helper to map language codes for speech APIs
const mapLangToSpeechCode = (langCode: string): string => {
  const map: { [key: string]: string } = {
    en: "en-US", es: "es-ES", fr: "fr-FR", de: "de-DE", it: "it-IT",
    pt: "pt-PT", ru: "ru-RU", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR",
    hi: "hi-IN", ar: "ar-SA", tr: "tr-TR", nl: "nl-NL", pl: "pl-PL",
    sv: "sv-SE", id: "id-ID", da: "da-DK", fi: "fi-FI", el: "el-GR",
    cs: "cs-CZ", hu: "hu-HU", th: "th-TH", ro: "ro-RO", sk: "sk-SK",
    bn: "bn-IN", uk: "uk-UA", vi: "vi-VN", he: "he-IL", fa: "fa-IR",
    ur: "ur-PK",
  };
  return map[langCode.toLowerCase()] || langCode; // Fallback to langCode if no specific mapping
};

export default function TranslatorClient() {
  const [sourceLang, setSourceLang] = useState<string>("en");
  const [targetLang, setTargetLang] = useState<string>("es");
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [debouncedInputText, setDebouncedInputText] = useState<string>(inputText);

  const { toast } = useToast();

  const {
    isListening: isRecording,
    transcript: voiceTranscript,
    error: recognitionError,
    startListening: startRecording,
    stopListening: stopRecording,
    isSupported: isRecognitionSupported,
  } = useSpeechRecognition({
    onResult: (transcript) => {
      setInputText(transcript.slice(0, MAX_INPUT_LENGTH));
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Voice Input Error", description: error.error || "Could not start voice input." });
    },
  });

  const {
    isSpeaking: isSpeakingSource,
    speak: speakSourceText,
    cancel: cancelSourceSpeech,
    isSupported: isSourceSpeechSupported,
  } = useTextToSpeech();
  
  const {
    isSpeaking: isSpeakingTarget,
    speak: speakTargetText,
    cancel: cancelTargetSpeech,
    isSupported: isTargetSpeechSupported,
  } = useTextToSpeech();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInputText(inputText);
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [inputText]);

  const handleTranslation = useCallback(async () => {
    if (!debouncedInputText.trim()) {
      setOutputText("");
      return;
    }
    if (sourceLang === targetLang) {
      setOutputText(debouncedInputText);
      return;
    }

    setIsLoading(true);
    setOutputText(""); // Clear previous translation

    try {
      const input: TranslateTextInput = {
        sourceLang,
        targetLang,
        inputText: debouncedInputText,
      };
      const result = await translateText(input);
      setOutputText(result.translatedText);
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        variant: "destructive",
        title: "Translation Failed",
        description: "Could not translate text. Please try again.",
      });
      setOutputText("Error: Could not translate.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedInputText, sourceLang, targetLang, toast]);

  useEffect(() => {
    if (debouncedInputText.trim()) {
      handleTranslation();
    } else {
      setOutputText(""); // Clear output if input is empty
    }
  }, [debouncedInputText, sourceLang, targetLang, handleTranslation]);
  
  const handleSwapLanguages = () => {
    const currentSource = sourceLang;
    const currentTarget = targetLang;
    const currentInput = inputText;
    const currentOutput = outputText;

    setSourceLang(currentTarget);
    setTargetLang(currentSource);
    setInputText(currentOutput.startsWith("Error:") ? "" : currentOutput); // Avoid setting error message as input
    // Output will be updated by useEffect
  };

  const handleClearInput = () => {
    setInputText("");
    setOutputText("");
  };

  const handleCopyOutput = () => {
    if (outputText && !outputText.startsWith("Error:")) {
      navigator.clipboard.writeText(outputText)
        .then(() => toast({ title: "Copied to clipboard!" }))
        .catch(() => toast({ variant: "destructive", title: "Failed to copy" }));
    }
  };

  const handleVoiceInputToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording(mapLangToSpeechCode(sourceLang));
    }
  };

  const handleListenSource = () => {
    if (isSpeakingSource) {
      cancelSourceSpeech();
    } else if (inputText.trim()) {
      speakSourceText(inputText, mapLangToSpeechCode(sourceLang));
    }
  };
  
  const handleListenOutput = () => {
    if (isSpeakingTarget) {
      cancelTargetSpeech();
    } else if (outputText.trim() && !outputText.startsWith("Error:")) {
      speakTargetText(outputText, mapLangToSpeechCode(targetLang));
    }
  };
  
  const handleInputTextChange = (value: string) => {
    if (value.length <= MAX_INPUT_LENGTH) {
      setInputText(value);
    } else {
      toast({
        title: "Character limit reached",
        description: `Input cannot exceed ${MAX_INPUT_LENGTH} characters.`,
        variant: "destructive"
      })
    }
  };


  return (
    <Card className="w-full max-w-3xl shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl md:text-4xl font-bold">LinguaLens</CardTitle>
        <CardDescription className="text-sm mt-1">
          Translate text between selected languages with voice support.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-2/5">
            <Label htmlFor="sourceLang" className="block text-sm font-medium mb-1">From:</Label>
            <LanguageSelect
              languages={languages}
              value={sourceLang}
              onChange={setSourceLang}
            />
          </div>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSwapLanguages}
                  className="p-2 rounded-full self-end sm:self-center mt-2 sm:mt-5"
                  aria-label="Swap languages"
                >
                  <ArrowLeftRight className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Swap languages</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="w-full sm:w-2/5">
            <Label htmlFor="targetLang" className="block text-sm font-medium mb-1">To:</Label>
            <LanguageSelect
              languages={languages}
              value={targetLang}
              onChange={setTargetLang}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TextAreaWithActions
            id="inputText"
            label="Enter text:"
            value={inputText}
            onChange={handleInputTextChange}
            placeholder="Type or speak here..."
            onClear={handleClearInput}
            onListen={handleListenSource}
            isListening={isSpeakingSource}
            onVoiceInput={handleVoiceInputToggle}
            isRecording={isRecording}
            isLoading={isLoading}
            isSpeechNotSupported={!isRecognitionSupported || !isSourceSpeechSupported}
            charCount={inputText.length}
            maxLength={MAX_INPUT_LENGTH}
          />
          <TextAreaWithActions
            id="outputText"
            label="Translation:"
            value={outputText}
            placeholder="Translation will appear here..."
            isOutput
            onCopy={handleCopyOutput}
            onListen={handleListenOutput}
            isListening={isSpeakingTarget}
            isLoading={isLoading}
            isSpeechNotSupported={!isTargetSpeechSupported}
          />
        </div>
        
        <Separator className="my-6" />

        <footer className="text-center">
          <p className="text-xs text-muted-foreground">
            LinguaLens uses AI for translation. Voice features depend on browser support for speech recognition and synthesis. Max input length {MAX_INPUT_LENGTH} characters.
          </p>
        </footer>
      </CardContent>
    </Card>
  );
}
