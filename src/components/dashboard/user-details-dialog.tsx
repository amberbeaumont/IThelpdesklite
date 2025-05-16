
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User, Ticket, Equipment } from "@/lib/types";
import { ClipboardList, HardDrive, History, UserCircle } from "lucide-react";
import { format } from "date-fns";

interface UserDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  tickets: Ticket[];
  equipment: Equipment[];
}

export function UserDetailsDialog({
  isOpen,
  onClose,
  user,
  tickets,
  equipment,
}: UserDetailsDialogProps) {
  if (!user) return null;

  const userOpenTickets = tickets.filter(
    (ticket) => ticket.requesterEmail === user.email && ticket.status !== "Closed"
  );

  const userTicketHistory = tickets.filter(
    (ticket) => ticket.requesterEmail === user.email
  );

  const userEquipment = equipment.filter(
    (item) => item.assignedTo === user.id
  );

  const getStatusBadgeVariant = (status: Ticket['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Open": return "destructive";
      case "In Progress": return "default"; 
      case "Waiting on User": return "secondary";
      case "Closed": return "outline";
      default: return "default";
    }
  };
  
  const getEquipmentStatusBadgeVariant = (status: Equipment['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Operational": return "default"; 
      case "Maintenance": return "secondary"; 
      case "Decommissioned": return "destructive";
      default: return "outline";
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <UserCircle className="h-7 w-7 text-primary" /> User Details: {user.name}
          </DialogTitle>
          <DialogDescription>
            Role: {user.role === "IT_Support" ? "IT Support" : "User"} | Email: {user.email} {user.phone && `| Phone: ${user.phone}`}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-2">
          <div className="space-y-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ClipboardList className="h-6 w-6 text-primary" /> Open Tickets ({userOpenTickets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userOpenTickets.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userOpenTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>
                            <Link href={`/dashboard/tickets/${ticket.id}`} className="text-primary hover:underline" onClick={onClose}>
                              {ticket.id}
                            </Link>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                          </TableCell>
                          <TableCell>{format(new Date(ticket.updatedAt), "PP p")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No open tickets for this user.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <HardDrive className="h-6 w-6 text-primary" /> Assigned Equipment ({userEquipment.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userEquipment.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Serial No.</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userEquipment.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.serialNumber}</TableCell>
                          <TableCell>
                            <Badge variant={getEquipmentStatusBadgeVariant(item.status)}>{item.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No equipment assigned to this user.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <History className="h-6 w-6 text-primary" /> Ticket History ({userTicketHistory.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userTicketHistory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userTicketHistory.map((ticket) => (
                        <TableRow key={ticket.id}>
                           <TableCell>
                            <Link href={`/dashboard/tickets/${ticket.id}`} className="text-primary hover:underline" onClick={onClose}>
                              {ticket.id}
                            </Link>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                           <TableCell>
                            <Badge variant={getStatusBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                          </TableCell>
                          <TableCell>{format(new Date(ticket.createdAt), "PP p")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No ticket history for this user.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
