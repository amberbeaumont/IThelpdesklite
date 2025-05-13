"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleAlert,
  LoaderCircle,
  UserCircle,
  CheckCircle2,
} from "lucide-react";
import type { Ticket, TicketStatus } from "@/lib/types";

interface StatusSummaryCardProps {
  title: TicketStatus;
  count: number;
  icon: React.ReactNode;
  colorClass: string;
}

function SummaryCard({ title, count, icon, colorClass }: StatusSummaryCardProps) {
  return (
    <Link href={`/dashboard/tickets?status=${encodeURIComponent(title)}`} passHref>
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`h-6 w-6 ${colorClass}`}>{icon}</div>
        </CardHeader>
        <CardContent className="flex-grow flex items-end">
          <div className="text-2xl font-bold">{count}</div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface StatusSummaryCardsProps {
  tickets: Ticket[];
}

export function StatusSummaryCards({ tickets }: StatusSummaryCardsProps) {
  const getStatusCount = (status: TicketStatus) => {
    return tickets.filter((ticket) => ticket.status === status).length;
  };

  const summaryData: StatusSummaryCardProps[] = [
    {
      title: "Open",
      count: getStatusCount("Open"),
      icon: <CircleAlert className="h-full w-full" />,
      colorClass: "text-destructive",
    },
    {
      title: "In Progress",
      count: getStatusCount("In Progress"),
      icon: <LoaderCircle className="h-full w-full" />,
      colorClass: "text-blue-500", // Custom color, not from theme for distinction
    },
    {
      title: "Waiting on User",
      count: getStatusCount("Waiting on User"),
      icon: <UserCircle className="h-full w-full" />,
      colorClass: "text-yellow-500", // Custom color
    },
    {
      title: "Closed",
      count: getStatusCount("Closed"),
      icon: <CheckCircle2 className="h-full w-full" />,
      colorClass: "text-green-600", // Custom color
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((data) => (
        <SummaryCard key={data.title} {...data} />
      ))}
    </div>
  );
}
