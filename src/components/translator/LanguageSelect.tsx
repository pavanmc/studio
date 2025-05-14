"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Language } from "@/lib/languages";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LanguageSelectProps {
  languages: Language[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function LanguageSelect({
  languages,
  value,
  onChange,
  placeholder = "Select language...",
}: LanguageSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selectedLanguage = languages.find(
    (lang) => lang.code.toLowerCase() === value.toLowerCase()
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-sm h-10"
        >
          {selectedLanguage
            ? selectedLanguage.name
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search language..." icon={<Search className="h-4 w-4" />} />
          <CommandList>
            <ScrollArea className="h-[200px]">
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {languages.map((language) => (
                  <CommandItem
                    key={language.code}
                    value={language.name}
                    onSelect={() => {
                      onChange(language.code);
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.toLowerCase() === language.code.toLowerCase() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {language.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
