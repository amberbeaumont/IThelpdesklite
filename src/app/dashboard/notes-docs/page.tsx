
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog as BookmarkDialog, 
  DialogContent as BookmarkDialogContent,
  DialogHeader as BookmarkDialogHeader,
  DialogTitle as BookmarkDialogTitle,
  DialogFooter as BookmarkDialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Note, Bookmark, Document } from "@/lib/types";
import { getStoredNotes, storeNotes, getStoredBookmarks, storeBookmarks, getStoredDocuments, storeDocuments } from "@/lib/placeholder-data";
import { NoteFormDialog, type NoteFormData } from "@/components/dashboard/note-form-dialog";
import {
  NotebookText,
  Bookmark as BookmarkIcon,
  FileText,
  PlusCircle,
  Edit3,
  Trash2,
  UploadCloud,
  Search,
} from "lucide-react";
import { format } from "date-fns";

export default function NotesDocsPage() {
  const { toast } = useToast();

  // State for notes
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [isNoteFormOpen, setIsNoteFormOpen] = React.useState(false);
  const [noteToEdit, setNoteToEdit] = React.useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = React.useState<Note | null>(null);

  // State for bookmarks
  const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([]);
  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = React.useState(false);
  const [currentBookmark, setCurrentBookmark] = React.useState<Partial<Bookmark>>({ title: "", url: "" });
  const [editingBookmarkId, setEditingBookmarkId] = React.useState<string | null>(null);
  const [bookmarkToDelete, setBookmarkToDelete] = React.useState<Bookmark | null>(null);
  
  // State for documents
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [documentToDelete, setDocumentToDelete] = React.useState<Document | null>(null);

  // State for search
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    setNotes(getStoredNotes());
    setBookmarks(getStoredBookmarks());
    setDocuments(getStoredDocuments());
  }, []);

  // --- Notes Handlers ---
  const handleAddNoteClick = () => {
    setNoteToEdit(null);
    setIsNoteFormOpen(true);
  };

  const handleEditNoteClick = (note: Note) => {
    setNoteToEdit(note);
    setIsNoteFormOpen(true);
  };

  const handleSaveNote = (data: NoteFormData) => {
    if (!data.title.trim() || !data.content.trim()) {
      toast({ title: "Error", description: "Note title and content cannot be empty.", variant: "destructive" });
      return;
    }
    const now = new Date().toISOString();
    if (noteToEdit) { 
      const updatedNotes = notes.map(n => n.id === noteToEdit.id ? { ...n, ...data, updatedAt: now } : n);
      setNotes(updatedNotes);
      storeNotes(updatedNotes);
      toast({ title: "Note Updated", description: "Your note has been successfully updated." });
    } else { 
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: data.title,
        content: data.content,
        createdAt: now,
        updatedAt: now,
      };
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      storeNotes(updatedNotes);
      toast({ title: "Note Added", description: "Your new note has been saved." });
    }
    setIsNoteFormOpen(false);
    setNoteToEdit(null);
  };
  
  const confirmDeleteNote = () => {
    if (noteToDelete) {
      const updatedNotes = notes.filter(n => n.id !== noteToDelete.id);
      setNotes(updatedNotes);
      storeNotes(updatedNotes);
      toast({ title: "Note Deleted", description: `${noteToDelete.title} has been deleted.` });
      setNoteToDelete(null);
      if (noteToEdit && noteToEdit.id === noteToDelete.id) {
        setIsNoteFormOpen(false); 
        setNoteToEdit(null);
      }
    }
  };

  // --- Bookmarks Handlers ---
  const handleBookmarkFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentBookmark(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveBookmark = () => {
    if (!currentBookmark.title?.trim() || !currentBookmark.url?.trim()) {
      toast({ title: "Error", description: "Bookmark title and URL cannot be empty.", variant: "destructive" });
      return;
    }
    if (!currentBookmark.url.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)) {
        toast({ title: "Error", description: "Please enter a valid URL (e.g., http://example.com).", variant: "destructive"});
        return;
    }

    const now = new Date().toISOString();
    if (editingBookmarkId) {
      const updatedBookmarks = bookmarks.map(b => b.id === editingBookmarkId ? { ...b, title: currentBookmark.title!, url: currentBookmark.url! } as Bookmark : b);
      setBookmarks(updatedBookmarks);
      storeBookmarks(updatedBookmarks);
      toast({ title: "Bookmark Updated" });
    } else {
      const newBookmark: Bookmark = {
        id: `bookmark-${Date.now()}`,
        title: currentBookmark.title!,
        url: currentBookmark.url!,
        createdAt: now,
      };
      const updatedBookmarks = [newBookmark, ...bookmarks];
      setBookmarks(updatedBookmarks);
      storeBookmarks(updatedBookmarks);
      toast({ title: "Bookmark Added" });
    }
    setIsBookmarkDialogOpen(false);
    setCurrentBookmark({ title: "", url: "" });
    setEditingBookmarkId(null);
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmarkId(bookmark.id);
    setCurrentBookmark({ title: bookmark.title, url: bookmark.url });
    setIsBookmarkDialogOpen(true);
  };
  
  const confirmDeleteBookmark = () => {
    if (bookmarkToDelete) {
      const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkToDelete.id);
      setBookmarks(updatedBookmarks);
      storeBookmarks(updatedBookmarks);
      toast({ title: "Bookmark Deleted", description: `${bookmarkToDelete.title} has been deleted.` });
      setBookmarkToDelete(null);
    }
  };

  // --- Documents Handlers ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
      const updatedDocuments = [newDocument, ...documents];
      setDocuments(updatedDocuments);
      storeDocuments(updatedDocuments);
      toast({ title: "File 'Added'", description: `${file.name} has been added to the list.` });
    }
    if (fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const confirmDeleteDocument = () => {
    if (documentToDelete) {
      const updatedDocuments = documents.filter(d => d.id !== documentToDelete.id);
      setDocuments(updatedDocuments);
      storeDocuments(updatedDocuments);
      toast({ title: "Document Deleted", description: `${documentToDelete.name} has been removed from the list.` });
      setDocumentToDelete(null);
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // --- Search Filtering ---
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredBookmarks = bookmarks.filter(bookmark => 
    bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-grow">
            <CardTitle className="text-2xl flex items-center gap-2">
              <NotebookText className="h-7 w-7 text-primary" />
              Notes & Documentation
            </CardTitle>
            <CardDescription>
              Manage internal notes, documentation, bookmarks, and knowledge base articles.
            </CardDescription>
          </div>
          <div className="w-full md:w-auto md:min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search"
                placeholder="Search notes, bookmarks, docs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          
        </CardHeader>
        <CardContent className="border-t pt-4">
            <div className="flex flex-wrap gap-2 mb-6">
             <Button variant="outline" onClick={handleAddNoteClick}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Note
            </Button>
             <Button variant="outline" onClick={() => setIsBookmarkDialogOpen(true)}>
                <BookmarkIcon className="mr-2 h-4 w-4" /> Add Bookmark
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload File
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notes Section (Left Column) */}
            <Card className="lg:col-span-2 shadow-md bg-sidebar-background text-sidebar-foreground p-0">
              <CardHeader className="rounded-t-lg bg-card">
                <CardTitle className="text-xl text-card-foreground">Notes ({filteredNotes.length})</CardTitle>
                 <CardDescription className="text-muted-foreground">Click "Add Note" or an existing note's edit icon.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {filteredNotes.length > 0 ? (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {filteredNotes.map(note => (
                        <Card key={note.id} className="bg-background text-foreground">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-md flex justify-between items-center">
                            {note.title}
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-primary" onClick={() => handleEditNoteClick(note)}><Edit3 className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => setNoteToDelete(note)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Last updated: {format(new Date(note.updatedAt), "PP p")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap truncate hover:whitespace-normal hover:overflow-visible h-10 hover:h-auto transition-all duration-200">{note.content}</p>
                        </CardContent>
                        </Card>
                    ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-sidebar-border rounded-md">
                        <NotebookText className="h-12 w-12 text-sidebar-foreground/50 mb-3" />
                        <p className="text-lg font-semibold text-sidebar-foreground/70">{searchTerm ? "No Matching Notes" : "No Notes Yet"}</p>
                        <p className="text-sidebar-foreground/60 text-sm">{searchTerm ? "Try a different search term." : 'Click "Add Note" to create your first one.'}</p>
                    </div>
                )}
              </CardContent>
            </Card>

            {/* Right Column (Bookmarks & Documents) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Bookmarks Section */}
              <Card className="shadow-md bg-accent text-accent-foreground">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BookmarkIcon className="h-6 w-6" /> Bookmarks ({filteredBookmarks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {filteredBookmarks.length > 0 ? filteredBookmarks.map(bookmark => (
                    <div key={bookmark.id} className="flex items-center justify-between p-2 bg-accent/80 rounded">
                      <div>
                        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline truncate block max-w-[180px]" title={bookmark.url}>{bookmark.title}</a>
                        <p className="text-xs opacity-80">Added: {format(new Date(bookmark.createdAt), "PP")}</p>
                      </div>
                      <div className="flex gap-1">
                         <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-accent/60" onClick={() => handleEditBookmark(bookmark)}><Edit3 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-accent/60" onClick={() => setBookmarkToDelete(bookmark)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  )) : <p className="text-sm opacity-90">{searchTerm ? "No matching bookmarks." : "No bookmarks added yet."}</p>}
                </CardContent>
              </Card>

              {/* Documents Section */}
              <Card className="shadow-md bg-primary/20 border border-primary/50">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-primary">
                    <FileText className="h-6 w-6" /> Documents ({filteredDocuments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {filteredDocuments.length > 0 ? filteredDocuments.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-background rounded border">
                            <div>
                                <p className="font-medium truncate max-w-[180px]" title={doc.name}>{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)} - Uploaded: {format(new Date(doc.uploadedAt), "PP")}</p>
                            </div>
                             <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setDocumentToDelete(doc)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    )) : <p className="text-sm text-muted-foreground">{searchTerm ? "No matching documents." : "No documents uploaded yet."}</p>}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <NoteFormDialog
        isOpen={isNoteFormOpen}
        onClose={() => {
          setIsNoteFormOpen(false);
          setNoteToEdit(null);
        }}
        noteToEdit={noteToEdit}
        onSave={handleSaveNote}
      />

      <BookmarkDialog open={isBookmarkDialogOpen} onOpenChange={(isOpen) => {
          if (!isOpen) {
              setIsBookmarkDialogOpen(false);
              setCurrentBookmark({ title: "", url: "" });
              setEditingBookmarkId(null);
          } else {
              setIsBookmarkDialogOpen(true);
          }
      }}>
        <BookmarkDialogContent>
          <BookmarkDialogHeader>
            <BookmarkDialogTitle>{editingBookmarkId ? "Edit Bookmark" : "Add New Bookmark"}</BookmarkDialogTitle>
          </BookmarkDialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="bookmarkTitle">Title</Label>
              <Input id="bookmarkTitle" name="title" value={currentBookmark.title || ""} onChange={handleBookmarkFormChange} placeholder="e.g., Google Docs" />
            </div>
            <div>
              <Label htmlFor="bookmarkUrl">URL</Label>
              <Input id="bookmarkUrl" name="url" type="url" value={currentBookmark.url || ""} onChange={handleBookmarkFormChange} placeholder="https://docs.google.com" />
            </div>
          </div>
          <BookmarkDialogFooter>
            <Button variant="outline" onClick={() => {setIsBookmarkDialogOpen(false); setCurrentBookmark({ title: "", url: "" }); setEditingBookmarkId(null); }}>Cancel</Button>
            <Button onClick={handleSaveBookmark}>{editingBookmarkId ? "Save Changes" : "Add Bookmark"}</Button>
          </BookmarkDialogFooter>
        </BookmarkDialogContent>
      </BookmarkDialog>

      <AlertDialog open={!!noteToDelete} onOpenChange={() => setNoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Note?</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete the note "{noteToDelete?.title}"? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDeleteNote} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!bookmarkToDelete} onOpenChange={() => setBookmarkToDelete(null)}>
         <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Bookmark?</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete the bookmark "{bookmarkToDelete?.title}"? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDeleteBookmark} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!documentToDelete} onOpenChange={() => setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Document?</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete the document "{documentToDelete?.name}"? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDeleteDocument} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

