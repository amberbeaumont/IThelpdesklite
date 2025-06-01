
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
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
import { mockUsers, ticketStatuses as allAppTicketStatuses, urgencies, getStoredTickets, storeSubmittedTickets } from "@/lib/placeholder-data";
import type { Ticket, TicketStatus, Urgency } from "@/lib/types";
import { Eye, Filter, CircleAlert, LoaderCircle, UserCircle, CheckCircle2, ChevronDown, Minus, ChevronUp, AlertTriangle, Trash2, FileX2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

interface TicketListProps {
  initialTickets: Ticket[];
  hideDeleteButton?: boolean;
  allowedStatusesForFilter?: TicketStatus[];
  hideStatusFilter?: boolean; // Added prop
}

const statusIcons: Record<TicketStatus, React.ReactElement> = {
  "Open": <CircleAlert className="h-4 w-4 text-destructive" />,
  "In Progress": <LoaderCircle className="h-4 w-4 text-blue-500 animate-spin" />,
  "Waiting on User": <UserCircle className="h-4 w-4 text-yellow-500" />,
  "Closed": <CheckCircle2 className="h-4 w-4 text-green-600" />,
  "Deleted": <FileX2 className="h-4 w-4 text-muted-foreground" />,
};

const urgencyIcons: Record<Urgency, React.ReactElement> = {
  "Low": <ChevronDown className="h-4 w-4 text-green-500" />,
  "Medium": <Minus className="h-4 w-4 text-yellow-500" />,
  "High": <ChevronUp className="h-4 w-4 text-orange-500" />,
  "Critical": <AlertTriangle className="h-4 w-4 text-destructive" />,
};

const getStatusBadgeVariant = (status: TicketStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Open": return "destructive";
    case "In Progress": return "default";
    case "Waiting on User": return "secondary";
    case "Closed": return "outline";
    case "Deleted": return "outline"; 
    default: return "default";
  }
};

export function TicketList({ initialTickets, hideDeleteButton = false, allowedStatusesForFilter, hideStatusFilter = false }: TicketListProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<TicketStatus | "all">("all");
  const [urgencyFilter, setUrgencyFilter] = React.useState<Urgency | "all">("all");
  const [currentTickets, setCurrentTickets] = React.useState<Ticket[]>([]);
  const [ticketToDelete, setTicketToDelete] = React.useState<Ticket | null>(null);

  React.useEffect(() => {
    const processedTickets = initialTickets.map(ticket => ({
      ...ticket,
      createdAt: new Date(ticket.createdAt),
      updatedAt: new Date(ticket.updatedAt),
    }));
    setCurrentTickets(processedTickets);
  }, [initialTickets]);


  const filteredTickets = React.useMemo(() => {
    return currentTickets.filter((ticket) => {
      const searchMatch =
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.requesterEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === "all" || ticket.status === statusFilter;
      const urgencyMatch = urgencyFilter === "all" || ticket.urgency === urgencyFilter;
      return searchMatch && statusMatch && urgencyMatch;
    });
  }, [currentTickets, searchTerm, statusFilter, urgencyFilter]);

  const handleDeleteTicketClick = (ticket: Ticket) => {
    setTicketToDelete(ticket);
  };

  const confirmDeleteTicket = () => {
    if (!ticketToDelete) return;

    const updatedTicketData = {
      ...ticketToDelete,
      status: "Deleted" as TicketStatus,
      updatedAt: new Date(),
    };

    setCurrentTickets(prevTickets => 
      prevTickets.map(t => t.id === updatedTicketData.id ? updatedTicketData : t)
    );
    
    if (typeof window !== 'undefined') {
      const storedSubmitted = getStoredTickets(); 
      const updatedStoredSubmitted = storedSubmitted.map(t => 
        t.id === updatedTicketData.id ? 
        { ...updatedTicketData, createdAt: new Date(updatedTicketData.createdAt).toISOString(), updatedAt: new Date(updatedTicketData.updatedAt).toISOString() } 
        : t
      );
      storeSubmittedTickets(updatedStoredSubmitted.map(t => ({
        ...t,
        createdAt: new Date(t.createdAt).toISOString(),
        updatedAt: new Date(t.updatedAt).toISOString(),
        comments: t.comments.map(c => ({...c, createdAt: new Date(c.createdAt).toISOString()}))
      })));

      const allTicketsRaw = localStorage.getItem('allTickets');
      if (allTicketsRaw) {
        try {
          let allTicketsData: Ticket[] = JSON.parse(allTicketsRaw).map((t:any) => ({...t, createdAt: new Date(t.createdAt), updatedAt: new Date(t.updatedAt)}));
          allTicketsData = allTicketsData.map(t => 
            t.id === updatedTicketData.id ? 
            updatedTicketData 
            : t
          );
          localStorage.setItem("allTickets", JSON.stringify(allTicketsData.map(t => ({
            ...t,
            createdAt: new Date(t.createdAt).toISOString(),
            updatedAt: new Date(t.updatedAt).toISOString(),
            comments: t.comments.map(c => ({...c, createdAt: new Date(c.createdAt).toISOString()}))
          }))));
        } catch (e) {
          console.error("Error updating allTickets in localStorage:", e);
        }
      }
    }
    
    toast({
      title: "Ticket Moved",
      description: `Ticket "${ticketToDelete.subject}" has been moved to Deleted Items.`,
    });
    setTicketToDelete(null);
  };
  
  const statusesForFilterDropdown = allowedStatusesForFilter || allAppTicketStatuses.filter(s => s !== "Deleted");


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          placeholder="Search tickets (ID, subject, requester...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
            {!hideStatusFilter && (
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus | "all")}>
              <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusesForFilterDropdown.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
              </SelectContent>
              </Select>
            )}
            <Select value={urgencyFilter} onValueChange={(value) => setUrgencyFilter(value as Urgency | "all")}>
            <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Urgency" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Urgencies</SelectItem>
                {urgencies.map(urgency => <SelectItem key={urgency} value={urgency}>{urgency}</SelectItem>)}
            </SelectContent>
            </Select>
        </div>
      </div>

      <Card>
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Urgency</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                    <TableCell className="font-medium max-w-xs truncate">{ticket.subject}</TableCell>
                    <TableCell>{ticket.requesterName}</TableCell>
                    <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(ticket.status)} className="flex items-center gap-1 w-fit mx-auto">
                        {statusIcons[ticket.status]}
                        {ticket.status}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                        {urgencyIcons[ticket.urgency]}
                        {ticket.urgency}
                        </div>
                    </TableCell>
                    <TableCell>{formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon" className="hover:text-primary">
                          <Link href={`/dashboard/tickets/${ticket.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Ticket</span>
                          </Link>
                      </Button>
                     {!hideDeleteButton && ticket.status !== "Deleted" && (
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTicketClick(ticket)} className="hover:text-destructive" aria-label={`Delete ticket ${ticket.subject}`}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                     )}
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                    No tickets found.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
      </Card>

      <AlertDialog open={!!ticketToDelete} onOpenChange={(open) => !open && setTicketToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move Ticket to Deleted Items?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the ticket <span className="font-semibold">"{ticketToDelete?.subject}"</span> as deleted. You can view it in the "Archived & Deleted Tickets" section using the "Deleted" filter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTicketToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTicket} className="bg-destructive hover:bg-destructive/90">
              Move to Deleted
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    