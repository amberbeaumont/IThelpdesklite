
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotebookText } from "lucide-react";

export default function NotesDocsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <NotebookText className="h-7 w-7 text-primary" />
            Notes & Documentation
          </CardTitle>
          <CardDescription>
            Manage internal notes, documentation, and knowledge base articles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-md">
            <NotebookText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">Notes & Docs Feature</p>
            <p className="text-muted-foreground">This section is currently under development.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Soon you'll be able to create, organize, and search your team's notes and documents here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
