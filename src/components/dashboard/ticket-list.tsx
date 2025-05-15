
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
import { Card, CardContent } from "@/components/ui/card"; 
import { mockUsers, ticketStatuses, urgencies } from "@/lib/placeholder-data";
import type { Ticket, TicketStatus, Urgency } from "@/lib/types";
import { Eye, Filter, CircleAlert, LoaderCircle, UserCircle, CheckCircle2, ChevronDown, Minus, ChevronUp, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface TicketListProps {
  initialTickets: Ticket[];
}

const statusIcons: Record<TicketStatus, React.ReactElement> = {
  "Open": <CircleAlert className="h-4 w-4 text-destructive" />,
  "In Progress": <LoaderCircle className="h-4 w-4 text-blue-500 animate-spin" />,
  "Waiting on User": <UserCircle className="h-4 w-4 text-yellow-500" />,
  "Closed": <CheckCircle2 className="h-4 w-4 text-green-600" />,
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
    default: return "default";
  }
};

export function TicketList({ initialTickets }: TicketListProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<TicketStatus | "all">("all");
  const [urgencyFilter, setUrgencyFilter] = React.useState<Urgency | "all">("all");
  const [currentTickets, setCurrentTickets] = React.useState<Ticket[]>([]);

  React.useEffect(() => {
    // Convert date strings to Date objects for initialTickets
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

  const getAssigneeName = (userId?: string) => {
    if (!userId) return "Unassigned";
    const user = mockUsers.find(u => u.id === userId && u.role === 'IT_Support');
    return user ? user.name : "Unknown";
  };

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
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus | "all")}>
            <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {ticketStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
            </SelectContent>
            </Select>
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
                <TableHead>ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Urgency</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
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
                    <TableCell>{getAssigneeName(ticket.assignedTo)}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</TableCell>
                    <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={`/dashboard/tickets/${ticket.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Ticket</span>
                        </Link>
                    </Button>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                    No tickets found.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
      </Card>
    </div>
  );
}
