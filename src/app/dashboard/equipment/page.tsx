import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive } from "lucide-react";

export default function EquipmentPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <HardDrive className="h-7 w-7 text-primary" />
            IT Equipment Library
          </CardTitle>
          <CardDescription>
            Track and manage IT hardware and software assets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-md">
            <HardDrive className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">IT Equipment Library Feature</p>
            <p className="text-muted-foreground">This section is currently under development.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Here you'll be able to log, assign, and monitor IT assets.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
