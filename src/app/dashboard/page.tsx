
"use client"; // Added "use client"

import * as React from 'react'; // Added React import
import { StatusSummaryCards } from "@/components/dashboard/status-summary-cards";
import { TicketList } from "@/components/dashboard/ticket-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUsers, getAllTickets } from "@/lib/placeholder-data"; // Updated import for tickets
import type { Ticket } from '@/lib/types'; // Added Ticket type import
import { Activity } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [allTicketsData, setAllTicketsData] = React.useState<Ticket[]>([]);

  React.useEffect(() => {
    setAllTicketsData(getAllTickets());
  }, []);

  const recentTickets = React.useMemo(() => 
    allTicketsData
      .sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5),
  [allTicketsData]);
  
  const itUser = mockUsers.find(u => u.role === 'IT_Support') || { name: "IT Team Member" };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {itUser.name}!</h1>
          <p className="text-muted-foreground">Here's an overview of the support tickets.</p>
        </div>
        <Link href="/dashboard/tickets/new" passHref>
           {/* Placeholder for new ticket button for IT staff, if needed. Or remove if only users submit.
           <Button><PlusCircle className="mr-2 h-4 w-4" /> New Ticket</Button> */}
        </Link>
      </div>
      
      <StatusSummaryCards tickets={allTicketsData} />

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Recent Activity (Latest 5 Tickets)
          </CardTitle>
          <CardDescription>
            A quick look at the most recently updated tickets. <Link href="/dashboard/tickets" className="text-primary hover:underline">View all tickets</Link>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Passing a minimal version of TicketList for overview */}
          <TicketList initialTickets={recentTickets} />
        </CardContent>
      </Card>
    </div>
  );
}
