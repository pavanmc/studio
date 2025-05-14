"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Volume2, Copy, Trash2, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TextAreaWithActionsProps {
  id: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
  label: string;
  isOutput?: boolean;
  onClear?: () => void;
  onCopy?: () => void;
  onListen?: () => void;
  isListening?: boolean;
  onVoiceInput?: () => void;
  isRecording?: boolean;
  isLoading?: boolean;
  isSpeechNotSupported?: boolean;
  charCount?: number;
  maxLength?: number;
}

export function TextAreaWithActions({
  id,
  value,
  onChange,
  placeholder,
  label,
  isOutput = false,
  onClear,
  onCopy,
  onListen,
  isListening = false,
  onVoiceInput,
  isRecording = false,
  isLoading = false,
  isSpeechNotSupported = false,
  charCount,
  maxLength,
}: TextAreaWithActionsProps) {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="flex space-x-1">
          <TooltipProvider delayDuration={300}>
            {onListen && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onListen}
                    disabled={isListening || !value || isLoading || isSpeechNotSupported}
                    className={`h-8 w-8 ${isListening ? "text-accent animate-pulse" : ""}`}
                    aria-label={isOutput ? "Listen to translation" : "Listen to source text"}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isListening ? "Speaking..." : (isOutput ? "Listen to translation" : "Listen to source text")}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {!isOutput && onVoiceInput && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onVoiceInput}
                    disabled={isRecording || isLoading || isSpeechNotSupported}
                    className={`h-8 w-8 ${isRecording ? "text-destructive animate-pulse" : ""}`}
                    aria-label="Voice input"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRecording ? "Recording..." : "Voice input"}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {isOutput && onCopy && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onCopy} disabled={!value || isLoading} className="h-8 w-8" aria-label="Copy text">
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy text</p>
                </TooltipContent>
              </Tooltip>
            )}
            {!isOutput && onClear && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onClear} disabled={!value || isLoading} className="h-8 w-8" aria-label="Clear text">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear text</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </div>
      <div className="relative">
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={isOutput || isLoading}
          rows={6}
          className="resize-none custom-scrollbar pr-10 text-base"
          maxLength={maxLength}
        />
        {isLoading && isOutput && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
      {maxLength && (
        <p className="text-xs text-muted-foreground text-right">
          {charCount ?? value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}
