
"use client"; 

import * as React from 'react'; // Added React import
import { TicketDetails } from "@/components/dashboard/ticket-details";
import { getAllTickets } from "@/lib/placeholder-data"; // Updated import
import type { Ticket } from '@/lib/types'; // Added Ticket import
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export default function SingleTicketPage({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = React.useState<Ticket | undefined | null>(undefined); // null for not found

  React.useEffect(() => {
    const allTickets = getAllTickets();
    const foundTicket = allTickets.find((t) => t.id === params.id);
    setTicket(foundTicket || null); // Set to null if not found after checking
  }, [params.id]);

  if (ticket === undefined) { // Still loading
    return (
        <div className="flex flex-col items-center justify-center h-full p-8">
             <p>Loading ticket details...</p>
        </div>
    );
  }

  if (!ticket) { // Not found
    return (
        <div className="flex flex-col items-center justify-center h-full p-8">
            <Card className="w-full max-w-md text-center shadow-lg">
                <CardHeader>
                     <h1 className="text-2xl font-semibold text-destructive">Ticket Not Found</h1>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">
                    The ticket with ID <span className="font-medium">{params.id}</span> could not be found. It might have been deleted or the ID is incorrect.
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
