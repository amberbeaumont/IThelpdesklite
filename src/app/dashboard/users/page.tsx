import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="space-y-6">
       <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage users and their roles within the HelpDesk Lite system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-md">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">User Management Feature</p>
            <p className="text-muted-foreground">This section is currently under development.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Admins will be able to add, edit, and remove users, as well as assign roles.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
