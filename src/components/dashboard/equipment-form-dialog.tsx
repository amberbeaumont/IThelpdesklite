
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns"; // Removed parseISO as it's not used
import type { Equipment, User, EquipmentStatus } from "@/lib/types";
import { equipmentStatuses, commonEquipmentTypes } from "@/lib/types";
import { ClientOnly } from "@/components/client-only";

const equipmentFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100, "Name must be 100 characters or less."),
  type: z.string().min(2, { message: "Type must be at least 2 characters." }).max(50, "Type must be 50 characters or less."),
  serialNumber: z.string().min(1, { message: "Serial number is required." }).max(50, "Serial number must be 50 characters or less."),
  assignedTo: z.string().optional(), // User ID
  purchaseDate: z.date({ required_error: "Purchase date is required." }),
  status: z.enum(equipmentStatuses as [EquipmentStatus, ...EquipmentStatus[]], {
    required_error: "Please select a status.",
  }),
});

export type EquipmentFormData = z.infer<typeof equipmentFormSchema>;

interface EquipmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentToEdit?: Equipment | null;
  onSave: (data: EquipmentFormData) => void;
  users: User[];
}

// Constants for handling "Unassigned" state in the Select component
const RHF_UNASSIGNED_VALUE = ""; // Value used by react-hook-form for "unassigned"
const SELECT_ITEM_UNASSIGNED_VALUE = "__SELECT_ITEM_UNASSIGNED__"; // Unique, non-empty string for the SelectItem

export function EquipmentFormDialog({
  isOpen,
  onClose,
  equipmentToEdit,
  onSave,
  users,
}: EquipmentFormDialogProps) {
  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: {
      name: "",
      type: "",
      serialNumber: "",
      assignedTo: RHF_UNASSIGNED_VALUE, // Default to unassigned using RHF value
      purchaseDate: undefined,
      status: "Operational",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (equipmentToEdit) {
        form.reset({
          ...equipmentToEdit,
          purchaseDate: equipmentToEdit.purchaseDate ? new Date(equipmentToEdit.purchaseDate) : undefined,
          assignedTo: equipmentToEdit.assignedTo || RHF_UNASSIGNED_VALUE,
        });
      } else {
        form.reset({
          name: "",
          type: "",
          serialNumber: "",
          assignedTo: RHF_UNASSIGNED_VALUE,
          purchaseDate: new Date(), // Default to today for new equipment
          status: "Operational",
        });
      }
    }
  }, [isOpen, equipmentToEdit, form]);

  const handleSubmit = (data: EquipmentFormData) => {
    // Map RHF_UNASSIGNED_VALUE back if needed, though "" is fine for optional string
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        form.reset(); 
      }
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{equipmentToEdit ? "Edit Equipment" : "Add New Equipment"}</DialogTitle>
          <DialogDescription>
            {equipmentToEdit
              ? "Update the details for this piece of equipment."
              : "Fill in the details to add new equipment to the library."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <ClientOnly>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Dell XPS 15 Laptop" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type or type custom" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {commonEquipmentTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter serial number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Purchase Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {equipmentStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To (Optional)</FormLabel>
                    <Select
                      onValueChange={(valueFromSelect) => {
                        if (valueFromSelect === SELECT_ITEM_UNASSIGNED_VALUE) {
                          field.onChange(RHF_UNASSIGNED_VALUE);
                        } else {
                          field.onChange(valueFromSelect);
                        }
                      }}
                      value={field.value === RHF_UNASSIGNED_VALUE ? SELECT_ITEM_UNASSIGNED_VALUE : field.value || SELECT_ITEM_UNASSIGNED_VALUE}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user to assign" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={SELECT_ITEM_UNASSIGNED_VALUE}>Unassigned</SelectItem>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                {equipmentToEdit ? "Save Changes" : "Add Equipment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
