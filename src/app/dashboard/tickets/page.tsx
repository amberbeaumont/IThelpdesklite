"use client"; // Required for searchParams and client-side filtering logic

import { useSearchParams } from 'next/navigation';
import { TicketList } from "@/components/dashboard/ticket-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTickets } from "@/lib/placeholder-data";
import type { TicketStatus } from '@/lib/types';
import { ClipboardList } from 'lucide-react';
import * as React from 'react';

export default function AllTicketsPage() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status') as TicketStatus | null;

  // This effect is illustrative if TicketList needed to re-fetch or re-filter based on param
  // Since TicketList handles its own filtering including status, direct prop passing might not be needed
  // Or, TicketList could accept an initialStatusFilter prop.
  // For now, TicketList's internal filter will pick up the status from its own Select component.
  // If we wanted cards to directly set the filter state of TicketList, more complex state sharing or URL param handling within TicketList would be needed.
  // This page component mainly serves as a container for the full TicketList.

  const initialFilteredTickets = React.useMemo(() => {
    if (statusParam) {
      return mockTickets.filter(ticket => ticket.status === statusParam);
    }
    return mockTickets;
  }, [statusParam]);


  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ClipboardList className="h-7 w-7 text-primary" />
            Manage All Tickets
          </CardTitle>
          <CardDescription>
            View, filter, and manage all support tickets.
            {statusParam && <span className="block mt-1">Currently filtered by status: <strong>{statusParam}</strong>.</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 
            If StatusSummaryCards navigation should pre-filter this list, 
            TicketList needs to accept `initialStatusFilter` prop and use it.
            For simplicity, TicketList currently has its own independent filters.
            Let's pass initialTickets which could be pre-filtered by statusParam
            and allow TicketList's own filters to further refine or change.
          */}
          <TicketList initialTickets={mockTickets} />
        </CardContent>
      </Card>
    </div>
  );
}
