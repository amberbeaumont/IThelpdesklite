"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockSnippets } from "@/lib/placeholder-data";
import type { Snippet } from "@/lib/types";
import { MessageSquareQuote, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SnippetToolProps {
  onInsertSnippet: (content: string) => void;
}

export function SnippetTool({ onInsertSnippet }: SnippetToolProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredSnippets = mockSnippets.filter(
    (snippet) =>
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquareQuote className="mr-2 h-4 w-4" />
          Insert Snippet
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-2 border-b">
            <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search snippets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9"
                />
            </div>
        </div>
        <ScrollArea className="h-64">
          {filteredSnippets.length > 0 ? (
            filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                onClick={() => {
                  onInsertSnippet(snippet.content);
                  setOpen(false);
                  setSearchTerm("");
                }}
                className="p-3 hover:bg-accent cursor-pointer text-sm"
              >
                <p className="font-medium">{snippet.title}</p>
                <p className="text-xs text-muted-foreground truncate">{snippet.content}</p>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No snippets found.
            </p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
