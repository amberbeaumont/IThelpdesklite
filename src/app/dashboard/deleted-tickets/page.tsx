
"use client"; 

import { TicketList } from "@/components/dashboard/ticket-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTickets } from "@/lib/placeholder-data";
import type { Ticket } from '@/lib/types';
import { FileX2 } from 'lucide-react'; 
import * as React from 'react';

export default function DeletedTicketsPage() {
  const [deletedTickets, setDeletedTickets] = React.useState<Ticket[]>([]);

  React.useEffect(() => {
    const allTicketsData = getAllTickets();
    const softDeletedTickets = allTicketsData.filter(ticket => ticket.status === "Deleted");
    setDeletedTickets(softDeletedTickets);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileX2 className="h-7 w-7 text-primary" />
              Deleted Tickets
            </CardTitle>
            <CardDescription>
              View all soft-deleted support tickets. These tickets are hidden from active views.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <TicketList initialTickets={deletedTickets} hideDeleteButton={true} />
        </CardContent>
      </Card>
    </div>
  );
}
