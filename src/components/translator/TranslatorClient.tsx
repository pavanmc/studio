
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LanguageSelect } from "./LanguageSelect";
import { TextAreaWithActions } from "./TextAreaWithActions";
import { languages } from "@/lib/languages";
import { ArrowLeftRight, Loader2, Image as ImageIcon, Camera as CameraIcon, ScanLine, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { translateText, TranslateTextInput } from "@/ai/flows/translate-text";
import { extractTextFromFile } from "@/ai/flows/extract-text-from-file-flow"; // Updated import
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  return map[langCode.toLowerCase()] || langCode;
};

export default function TranslatorClient() {
  const [sourceLang, setSourceLang] = useState<string>("en");
  const [targetLang, setTargetLang] = useState<string>("es");
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExtractingText, setIsExtractingText] = useState<boolean>(false);
  const [debouncedInputText, setDebouncedInputText] = useState<string>(inputText);

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const {
    isListening: isRecording,
    startListening: startRecording,
    stopListening: stopRecording,
    isSupported: isRecognitionSupported,
  } = useSpeechRecognition({
    onResult: (transcript) => {
      setInputText(prev => (prev + transcript).slice(0, MAX_INPUT_LENGTH));
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Voice Input Error", description: error.message || "Could not start voice input." });
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
    }, 500); 

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
    setOutputText(""); 

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
      setOutputText(""); 
    }
  }, [debouncedInputText, sourceLang, targetLang, handleTranslation]);
  
  const handleSwapLanguages = () => {
    const currentSource = sourceLang;
    const currentTarget = targetLang;
    const currentInput = inputText;
    const currentOutput = outputText;

    setSourceLang(currentTarget);
    setTargetLang(currentSource);
    setInputText(currentOutput.startsWith("Error:") ? "" : currentOutput.slice(0, MAX_INPUT_LENGTH));
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
      });
      setInputText(value.slice(0,MAX_INPUT_LENGTH));
    }
  };

  const processFileWithOCR = async (fileDataUri: string) => {
    setIsExtractingText(true);
    try {
      const result = await extractTextFromFile({ fileDataUri }); // Updated function call
      if (result.extractedText) {
        setInputText(prev => (prev + result.extractedText).slice(0, MAX_INPUT_LENGTH));
        toast({ title: "Text Extracted", description: "Text from file has been added to the input." });
      } else {
        toast({ title: "No Text Found", description: "Could not find any text in the file.", variant: "default" });
      }
    } catch (error) {
      console.error("OCR error:", error);
      toast({
        variant: "destructive",
        title: "Text Extraction Failed",
        description: "Could not extract text from the file. Please try again.",
      });
    } finally {
      setIsExtractingText(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => { // Renamed from handleImageUpload
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileDataUri = e.target?.result as string;
        if (fileDataUri) {
          processFileWithOCR(fileDataUri);
        }
      };
      reader.readAsDataURL(file);
    }
    if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };

  const requestCameraPermission = async () => {
    if (hasCameraPermission === true) {
      setShowCameraModal(true);
      return true;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCameraModal(true);
      return true;
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
      setShowCameraModal(true); // Show modal to display error
      return false;
    }
  };

  useEffect(() => {
    if (showCameraModal && hasCameraPermission && videoRef.current && !videoRef.current.srcObject) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => setHasCameraPermission(false)); 
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [showCameraModal, hasCameraPermission]);


  const handleScanFromCamera = () => {
    if (videoRef.current && canvasRef.current && hasCameraPermission) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUri = canvas.toDataURL('image/jpeg');
        processFileWithOCR(imageDataUri); // Use generic processFileWithOCR
      }
      setShowCameraModal(false);
    } else {
       toast({ variant: "destructive", title: "Camera Scan Failed", description: "Could not capture image from camera."});
    }
  };
  
  const isLoadingAny = isLoading || isExtractingText;

  return (
    <>
      <Card className="w-full max-w-3xl shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-bold">LinguaLens</CardTitle>
          <CardDescription className="text-sm mt-1">
            Translate text, scan images or PDFs. Voice support available.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-row items-center justify-between mb-6 space-x-2 sm:space-x-4">
            <div className="flex-1">
              <Label htmlFor="sourceLang" className="block text-sm font-medium mb-1">From:</Label>
              <LanguageSelect
                languages={languages}
                value={sourceLang}
                onChange={setSourceLang}
                placeholder="Source Language"
              />
            </div>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSwapLanguages}
                    className="p-2 rounded-full self-center mt-5" 
                    aria-label="Swap languages"
                    disabled={isLoadingAny}
                  >
                    <ArrowLeftRight className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Swap languages</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex-1">
              <Label htmlFor="targetLang" className="block text-sm font-medium mb-1">To:</Label>
              <LanguageSelect
                languages={languages}
                value={targetLang}
                onChange={setTargetLang}
                placeholder="Target Language"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
            <TextAreaWithActions
              id="inputText"
              label="Enter text:"
              value={inputText}
              onChange={handleInputTextChange}
              placeholder="Type, speak, or scan file..."
              onClear={handleClearInput}
              onListen={handleListenSource}
              isListening={isSpeakingSource}
              onVoiceInput={handleVoiceInputToggle}
              isRecording={isRecording}
              isLoading={isLoadingAny}
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
          
          <div className="flex items-center justify-start space-x-2 mb-6 md:col-start-1">
            <TooltipProvider delayDuration={300}>
               <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isLoadingAny}>
                        <FileText className="mr-2 h-4 w-4" /> Upload File
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Extract text from an image or PDF file</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={requestCameraPermission} disabled={isLoadingAny}>
                        <CameraIcon className="mr-2 h-4 w-4" /> Use Camera
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Scan text using your camera (for images)</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload} // Updated handler
              accept="image/*,application/pdf" // Added PDF to accept
              className="hidden"
            />
             {isExtractingText && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
          </div>


          <Separator className="my-6" />

          <footer className="text-center">
            <p className="text-xs text-muted-foreground">
              LinguaLens uses AI for translation & OCR. Voice features depend on browser support. Max input length {MAX_INPUT_LENGTH} characters. PDFs up to 200 pages.
            </p>
          </footer>
        </CardContent>
      </Card>

      <Dialog open={showCameraModal} onOpenChange={(isOpen) => {
          setShowCameraModal(isOpen);
          if (!isOpen && videoRef.current && videoRef.current.srcObject) { 
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
          }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Scan Text with Camera</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {hasCameraPermission === null && <p>Requesting camera permission...</p>}
            {hasCameraPermission === false && (
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access in your browser settings to use this feature. You might need to refresh the page after granting permission.
                </AlertDescription>
              </Alert>
            )}
            {hasCameraPermission === true && (
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay playsInline muted />
            )}
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleScanFromCamera} disabled={!hasCameraPermission || isExtractingText}>
              {isExtractingText ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanLine className="mr-2 h-4 w-4" />}
              Scan Text
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
