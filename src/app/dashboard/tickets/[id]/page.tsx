
"use client"; 

import * as React from 'react';
import { useParams } from 'next/navigation'; // Import useParams
import { TicketDetails } from "@/components/dashboard/ticket-details";
import { getAllTickets } from "@/lib/placeholder-data";
import type { Ticket } from '@/lib/types';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Remove params from function signature, will use useParams hook instead
export default function SingleTicketPage() {
  const routeParams = useParams();
  const ticketId = routeParams.id as string; // Assuming 'id' is always a string for this route

  const [ticket, setTicket] = React.useState<Ticket | undefined | null>(undefined); // null for not found

  React.useEffect(() => {
    if (ticketId) { // Only proceed if ticketId is available
      const allTickets = getAllTickets();
      const foundTicket = allTickets.find((t) => t.id === ticketId);
      setTicket(foundTicket || null); // Set to null if not found after checking
    } else {
      // If ticketId is not available from params (e.g. route mismatch, though unlikely for a dynamic segment page)
      // setTicket to null to indicate not found or error state.
      setTicket(null);
    }
  }, [ticketId]); // Depend on ticketId from useParams

  // Loading state: shown if ticketId is present but ticket data hasn't been resolved yet.
  if (ticketId && ticket === undefined) { 
    return (
        <div className="flex flex-col items-center justify-center h-full p-8">
             <p>Loading ticket details...</p>
        </div>
    );
  }

  // Not found or error state: ticketId might be missing or ticket data resolved to null.
  if (!ticket) { 
    return (
        <div className="flex flex-col items-center justify-center h-full p-8">
            <Card className="w-full max-w-md text-center shadow-lg">
                <CardHeader>
                     <h1 className="text-2xl font-semibold text-destructive">Ticket Not Found</h1>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">
                    The ticket {ticketId ? `with ID ${ticketId}` : ""} could not be found. It might have been deleted or the ID is incorrect.
                    </p>
                    <Button asChild>
                        <Link href="/dashboard/tickets">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to All Tickets
                        </Link>
                    </Button>
                </CardContent>
            </Card>
      </div>
    );
  }

  // Ticket found, render details
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard/tickets">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to tickets</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          Ticket Details: #{ticket.id}
        </h1>
      </div>
      <TicketDetails ticket={ticket} />
    </div>
  );
}
