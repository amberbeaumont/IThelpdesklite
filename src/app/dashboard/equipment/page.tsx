
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
import { EquipmentFormDialog, type EquipmentFormData } from "@/components/dashboard/equipment-form-dialog";
import { HardDrive, PlusCircle, Edit3, Trash2, Laptop, Printer, Server, Monitor as MonitorIcon, ScanLine as ScanLineIcon, Router as RouterIcon, Keyboard as KeyboardIcon, Mouse as MouseIcon } from "lucide-react";
import { mockEquipment, mockUsers } from "@/lib/placeholder-data";
import type { Equipment, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const equipmentTypeIcons: Record<string, React.ReactElement> = {
  Laptop: <Laptop className="h-4 w-4 text-muted-foreground" />,
  Printer: <Printer className="h-4 w-4 text-muted-foreground" />,
  Switch: <Server className="h-4 w-4 text-muted-foreground" />, 
  Desktop: <Laptop className="h-4 w-4 text-muted-foreground" data-ai-hint="desktop computer"/>, 
  Monitor: <MonitorIcon className="h-4 w-4 text-muted-foreground" data-ai-hint="monitor screen"/>,
  Scanner: <ScanLineIcon className="h-4 w-4 text-muted-foreground" data-ai-hint="scanner device"/>,
  Router: <RouterIcon className="h-4 w-4 text-muted-foreground" data-ai-hint="network router"/>,
  Keyboard: <KeyboardIcon className="h-4 w-4 text-muted-foreground" data-ai-hint="computer keyboard"/>,
  Mouse: <MouseIcon className="h-4 w-4 text-muted-foreground" data-ai-hint="computer mouse"/>,
  Other: <HardDrive className="h-4 w-4 text-muted-foreground" />,
};

const getStatusBadgeVariant = (status: Equipment['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Operational": return "default"; 
    case "Maintenance": return "secondary"; 
    case "Decommissioned": return "destructive"; 
    default: return "outline";
  }
};


export default function EquipmentPage() {
  const { toast } = useToast();
  const [equipmentList, setEquipmentList] = React.useState<Equipment[]>(mockEquipment);
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);
  const [equipmentToEdit, setEquipmentToEdit] = React.useState<Equipment | null>(null);
  const [equipmentToDeleteId, setEquipmentToDeleteId] = React.useState<string | null>(null);

  const handleAddEquipmentClick = () => {
    setEquipmentToEdit(null);
    setIsFormDialogOpen(true);
  };

  const handleEditEquipmentClick = (equipment: Equipment) => {
    setEquipmentToEdit(equipment);
    setIsFormDialogOpen(true);
  };

  const handleDeleteEquipmentClick = (equipmentId: string) => {
    setEquipmentToDeleteId(equipmentId);
  };

  const confirmDeleteEquipment = () => {
    if (equipmentToDeleteId) {
      const equipmentBeingDeleted = equipmentList.find(eq => eq.id === equipmentToDeleteId);
      setEquipmentList(equipmentList.filter((eq) => eq.id !== equipmentToDeleteId));
      toast({
        title: "Equipment Deleted",
        description: `${equipmentBeingDeleted?.name || 'The equipment'} has been successfully removed.`,
      });
      setEquipmentToDeleteId(null);
    }
  };

  const handleSaveEquipment = (data: EquipmentFormData) => {
    if (equipmentToEdit) {
      // Edit existing equipment
      setEquipmentList(
        equipmentList.map((eq) =>
          eq.id === equipmentToEdit.id ? { ...eq, ...data, purchaseDate: new Date(data.purchaseDate) } : eq
        )
      );
      toast({
        title: "Equipment Updated",
        description: `${data.name}'s details have been successfully updated.`,
      });
    } else {
      // Add new equipment
      const newEquipment: Equipment = {
        id: `EQP-${Date.now()}`, // Simple ID generation
        ...data,
        purchaseDate: new Date(data.purchaseDate),
        // status is already part of data from form
      };
      setEquipmentList([newEquipment, ...equipmentList]); // Add to beginning of list
      toast({
        title: "Equipment Added",
        description: `${data.name} has been successfully added.`,
      });
    }
    setIsFormDialogOpen(false);
    setEquipmentToEdit(null);
  };

  const getAssigneeName = (userId?: string): string => {
    if (!userId) return "Unassigned";
    const user = mockUsers.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };
  
  const equipmentToDeleteDetails = equipmentList.find(eq => eq.id === equipmentToDeleteId);

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <HardDrive className="h-7 w-7 text-primary" />
              IT Equipment Library
            </CardTitle>
            <CardDescription>
              Track and manage IT hardware and software assets.
            </CardDescription>
          </div>
          <Button onClick={handleAddEquipmentClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Equipment
          </Button>
        </CardHeader>
        <CardContent>
          {equipmentList.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipmentList.map((equipment) => (
                    <TableRow key={equipment.id}>
                      <TableCell className="font-medium">{equipment.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           {equipmentTypeIcons[equipment.type] || equipmentTypeIcons.Other}
                           {equipment.type}
                        </div>
                      </TableCell>
                      <TableCell>{equipment.serialNumber}</TableCell>
                      <TableCell>{getAssigneeName(equipment.assignedTo)}</TableCell>
                      <TableCell>{format(new Date(equipment.purchaseDate), "PP")}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(equipment.status)}>
                          {equipment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEquipmentClick(equipment)}
                          className="mr-2 hover:text-primary"
                          aria-label={`Edit equipment ${equipment.name}`}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEquipmentClick(equipment.id)}
                          className="hover:text-destructive"
                          aria-label={`Delete equipment ${equipment.name}`}
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
              <HardDrive className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">No Equipment Found</p>
              <p className="text-muted-foreground">Click "Add Equipment" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EquipmentFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => {
          setIsFormDialogOpen(false);
          setEquipmentToEdit(null);
        }}
        equipmentToEdit={equipmentToEdit}
        onSave={handleSaveEquipment}
        users={mockUsers} 
      /> 
      
      <AlertDialog open={!!equipmentToDeleteId} onOpenChange={(open) => !open && setEquipmentToDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the equipment <span className="font-semibold">{equipmentToDeleteDetails?.name}</span> and remove its data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEquipmentToDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEquipment} className="bg-destructive hover:bg-destructive/90">
              Delete Equipment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

