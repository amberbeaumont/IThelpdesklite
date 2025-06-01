
"use client"; 

import { TicketList } from "@/components/dashboard/ticket-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTickets } from "@/lib/placeholder-data";
import type { Ticket, TicketStatus } from '@/lib/types';
import { Archive } from 'lucide-react'; // Changed icon to Archive
import * as React from 'react';

export default function ArchivedAndDeletedTicketsPage() { // Renamed component
  const [displayableTickets, setDisplayableTickets] = React.useState<Ticket[]>([]);

  React.useEffect(() => {
    const allTicketsData = getAllTickets();
    const closedOrDeletedTickets = allTicketsData.filter(
      ticket => ticket.status === "Closed" || ticket.status === "Deleted"
    );
    setDisplayableTickets(closedOrDeletedTickets);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Archive className="h-7 w-7 text-primary" /> {/* Using Archive icon */}
              Archived & Deleted Tickets
            </CardTitle>
            <CardDescription>
              View all closed (archived) and soft-deleted support tickets. Use the filter below to switch views.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <TicketList 
            initialTickets={displayableTickets} 
            allowedStatusesForFilter={["Closed", "Deleted"]}
            hideDeleteButton={false} // Allow deleting "Closed" to "Deleted"
          />
        </CardContent>
      </Card>
    </div>
  );
}

    