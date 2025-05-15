
"use client"; 

import { useSearchParams } from 'next/navigation';
import Link from 'next/link'; 
import { TicketList } from "@/components/dashboard/ticket-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { getAllTickets } from "@/lib/placeholder-data"; // Updated import
import type { Ticket, TicketStatus } from '@/lib/types';
import { ClipboardList, PlusCircle } from 'lucide-react'; 
import * as React from 'react';

export default function AllTicketsPage() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status') as TicketStatus | null;
  const [displayedTickets, setDisplayedTickets] = React.useState<Ticket[]>([]);

  React.useEffect(() => {
    // Load all tickets (mock + localStorage)
    const allTicketsData = getAllTickets();
    setDisplayedTickets(allTicketsData);
  }, []);

  // This memo is for initial filtering if statusParam is present on first load
  // TicketList itself handles further filtering.
  const initialFilteredTicketsForList = React.useMemo(() => {
    if (statusParam) {
      return displayedTickets.filter(ticket => ticket.status === statusParam);
    }
    return displayedTickets;
  }, [statusParam, displayedTickets]);


  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <ClipboardList className="h-7 w-7 text-primary" />
              Manage All Tickets
            </CardTitle>
            <CardDescription>
              View, filter, and manage all support tickets.
              {statusParam && <span className="block mt-1">Currently filtered by status: <strong>{statusParam}</strong>.</span>}
            </CardDescription>
          </div>
          <Link href="/dashboard/tickets/new" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Ticket
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <TicketList initialTickets={initialFilteredTicketsForList} />
        </CardContent>
      </Card>
    </div>
  );
}
