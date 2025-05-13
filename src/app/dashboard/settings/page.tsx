import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Settings className="h-7 w-7 text-primary" />
            System Settings
          </CardTitle>
          <CardDescription>
            Configure application settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-md">
            <Settings className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">Settings Feature</p>
            <p className="text-muted-foreground">This section is currently under development.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Manage general application preferences, integrations, and more.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
