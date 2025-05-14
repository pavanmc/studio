
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  contentHtml: string;
}

export function InfoModal({ isOpen, onClose, title, contentHtml }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-6">
            <div
              className="prose dark:prose-invert max-w-none text-sm text-foreground"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
        </ScrollArea>
         {/* 
          The DialogContent component from shadcn/ui already provides a close button.
          The explicit DialogClose button below was redundant and has been removed.
         */}
      </DialogContent>
    </Dialog>
  );
}
