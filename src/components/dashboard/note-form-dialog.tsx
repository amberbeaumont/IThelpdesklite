
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Note } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export interface NoteFormData {
  title: string;
  content: string;
}

interface NoteFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit?: Note | null;
  onSave: (data: NoteFormData) => void;
}

export function NoteFormDialog({
  isOpen,
  onClose,
  noteToEdit,
  onSave,
}: NoteFormDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      if (noteToEdit) {
        setTitle(noteToEdit.title);
        setContent(noteToEdit.content);
      } else {
        setTitle("");
        setContent("");
      }
    }
  }, [isOpen, noteToEdit]);

  const handleDialogSave = () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "Error", description: "Note title and content cannot be empty.", variant: "destructive" });
      return;
    }
    onSave({ title, content });
  };

  const handleDialogClose = () => {
    onClose();
    // Reset local state if needed, though useEffect handles it on next open
    setTitle("");
    setContent("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleDialogClose();
    }}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{noteToEdit ? "Edit Note" : "Add New Note"}</DialogTitle>
          <DialogDescription>
            {noteToEdit ? "Update your note details." : "Create a new note for your knowledge base."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 flex-grow overflow-y-auto pr-2">
          <div>
            <Label htmlFor="noteTitle" className="mb-1 block">Title</Label>
            <Input
              id="noteTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="text-lg font-semibold"
            />
          </div>
          <div>
            <Label htmlFor="noteContent" className="mb-1 block">Content</Label>
            {/* Mock RTE Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border-b border-border mb-2">
                {[
                    { icon: Bold, label: 'Bold' }, { icon: Italic, label: 'Italic' }, { icon: Underline, label: 'Underline' },
                    { icon: List, label: 'Bullet List' }, { icon: ListOrdered, label: 'Numbered List' },
                    { icon: AlignLeft, label: 'Left' }, { icon: AlignCenter, label: 'Center' }, { icon: AlignRight, label: 'Right' },
                    { icon: LinkIcon, label: 'Link' }, { icon: ImageIcon, label: 'Image' },
                ].map(item => (
                    <Button key={item.label} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 px-2" title={item.label} onClick={() => toast({title: "Mock Action", description:`${item.label} clicked (UI only).`})}> <item.icon className="h-4 w-4" /> </Button>
                ))}
            </div>
            <Textarea
              id="noteContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your note..."
              className="min-h-[200px] bg-background text-foreground"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogSave} className="bg-primary hover:bg-primary/90">
            {noteToEdit ? "Save Changes" : "Save Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
