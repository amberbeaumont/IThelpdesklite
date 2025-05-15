
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Snippet } from "@/lib/types";
import { ClientOnly } from "@/components/client-only";

const snippetFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }).max(100, "Title must be 100 characters or less."),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }).max(2000, "Content must be 2000 characters or less."),
});

export type SnippetFormData = z.infer<typeof snippetFormSchema>;

interface SnippetFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  snippetToEdit?: Snippet | null;
  onSave: (data: SnippetFormData) => void;
}

export function SnippetFormDialog({
  isOpen,
  onClose,
  snippetToEdit,
  onSave,
}: SnippetFormDialogProps) {
  const form = useForm<SnippetFormData>({
    resolver: zodResolver(snippetFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (snippetToEdit) {
        form.reset({
          title: snippetToEdit.title,
          content: snippetToEdit.content,
        });
      } else {
        form.reset({
          title: "",
          content: "",
        });
      }
    }
  }, [isOpen, snippetToEdit, form]);

  const handleSubmit = (data: SnippetFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        form.reset(); 
      }
    }}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{snippetToEdit ? "Edit Snippet" : "Add New Snippet"}</DialogTitle>
          <DialogDescription>
            {snippetToEdit
              ? "Update the details for this snippet."
              : "Create a new pre-written response."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4 flex-grow overflow-y-auto pr-2">
            <ClientOnly>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Snippet Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Password Reset Instructions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Snippet Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the full text of the snippet..."
                        className="min-h-[150px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ClientOnly>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => { onClose(); form.reset(); }}>
                Cancel
              </Button>
              <Button type="submit">
                {snippetToEdit ? "Save Changes" : "Add Snippet"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
