
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SnippetFormDialog, type SnippetFormData } from "@/components/dashboard/snippet-form-dialog";
import { ClipboardEdit, PlusCircle, Edit3, Trash2 } from "lucide-react";
import { getStoredSnippets, storeSnippets } from "@/lib/placeholder-data";
import type { Snippet } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function SnippetsPage() {
  const { toast } = useToast();
  const [snippets, setSnippets] = React.useState<Snippet[]>([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);
  const [snippetToEdit, setSnippetToEdit] = React.useState<Snippet | null>(null);
  const [snippetToDelete, setSnippetToDelete] = React.useState<Snippet | null>(null);

  React.useEffect(() => {
    setSnippets(getStoredSnippets());
  }, []);

  const handleAddSnippetClick = () => {
    setSnippetToEdit(null);
    setIsFormDialogOpen(true);
  };

  const handleEditSnippetClick = (snippet: Snippet) => {
    setSnippetToEdit(snippet);
    setIsFormDialogOpen(true);
  };

  const handleDeleteSnippetClick = (snippet: Snippet) => {
    setSnippetToDelete(snippet);
  };

  const confirmDeleteSnippet = () => {
    if (snippetToDelete) {
      const updatedSnippets = snippets.filter((s) => s.id !== snippetToDelete.id);
      setSnippets(updatedSnippets);
      storeSnippets(updatedSnippets);
      toast({
        title: "Snippet Deleted",
        description: `Snippet "${snippetToDelete.title}" has been successfully removed.`,
      });
      setSnippetToDelete(null);
    }
  };

  const handleSaveSnippet = (data: SnippetFormData) => {
    const now = new Date().toISOString();
    if (snippetToEdit) {
      const updatedSnippets = snippets.map((s) =>
        s.id === snippetToEdit.id ? { ...s, ...data, updatedAt: now } : s
      );
      setSnippets(updatedSnippets);
      storeSnippets(updatedSnippets);
      toast({
        title: "Snippet Updated",
        description: `Snippet "${data.title}" has been successfully updated.`,
      });
    } else {
      const newSnippet: Snippet = {
        id: `snip-${Date.now()}`, // Simple ID generation
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      const updatedSnippets = [newSnippet, ...snippets]; // Add to beginning
      setSnippets(updatedSnippets);
      storeSnippets(updatedSnippets);
      toast({
        title: "Snippet Added",
        description: `Snippet "${data.title}" has been successfully added.`,
      });
    }
    setIsFormDialogOpen(false);
    setSnippetToEdit(null);
  };
  
  const snippetToDeleteDetails = snippetToDelete;

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <ClipboardEdit className="h-7 w-7 text-primary" />
              Manage Snippets
            </CardTitle>
            <CardDescription>
              Create, edit, and delete pre-written responses for quick insertion.
            </CardDescription>
          </div>
          <Button onClick={handleAddSnippetClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Snippet
          </Button>
        </CardHeader>
        <CardContent>
          {snippets.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Title</TableHead>
                    <TableHead className="w-[50%]">Content Preview</TableHead>
                    <TableHead className="text-center w-[10%]">Last Updated</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snippets.map((snippet) => (
                    <TableRow key={snippet.id}>
                      <TableCell className="font-medium">{snippet.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground truncate max-w-md">
                        {snippet.content}
                      </TableCell>
                       <TableCell className="text-center text-xs">
                        {snippet.updatedAt ? format(new Date(snippet.updatedAt), "PP p") : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditSnippetClick(snippet)}
                          className="mr-2 hover:text-primary"
                          aria-label={`Edit snippet ${snippet.title}`}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSnippetClick(snippet)}
                          className="hover:text-destructive"
                          aria-label={`Delete snippet ${snippet.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-md">
              <ClipboardEdit className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">No Snippets Found</p>
              <p className="text-muted-foreground">Click "Add Snippet" to create your first one.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <SnippetFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => {
          setIsFormDialogOpen(false);
          setSnippetToEdit(null);
        }}
        snippetToEdit={snippetToEdit}
        onSave={handleSaveSnippet}
      />
      
      <AlertDialog open={!!snippetToDeleteDetails} onOpenChange={(open) => !open && setSnippetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the snippet <span className="font-semibold">"{snippetToDeleteDetails?.title}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSnippetToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSnippet} className="bg-destructive hover:bg-destructive/90">
              Delete Snippet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
