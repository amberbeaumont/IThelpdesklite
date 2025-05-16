
"use client"; 

import { TicketList } from "@/components/dashboard/ticket-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTickets } from "@/lib/placeholder-data";
import type { Ticket } from '@/lib/types';
import { Archive } from 'lucide-react'; 
import * as React from 'react';

export default function ArchivedTicketsPage() {
  const [archivedTickets, setArchivedTickets] = React.useState<Ticket[]>([]);

  React.useEffect(() => {
    const allTicketsData = getAllTickets();
    const closedTickets = allTicketsData.filter(ticket => ticket.status === "Closed");
    setArchivedTickets(closedTickets);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Archive className="h-7 w-7 text-primary" />
              Archived Tickets
            </CardTitle>
            <CardDescription>
              View all closed support tickets.
            </CardDescription>
          </div>
          {/* No "New Ticket" button on this page */}
        </CardHeader>
        <CardContent>
          <TicketList initialTickets={archivedTickets} />
        </CardContent>
      </Card>
    </div>
  );
}
