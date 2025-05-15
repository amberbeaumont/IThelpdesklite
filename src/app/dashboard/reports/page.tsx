
"use client";

import * as React from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTickets, ticketStatuses, problemTypes } from "@/lib/placeholder-data";
import type { TicketStatus, ProblemType } from "@/lib/types";
import { BarChartBig, Activity, AlertTriangle } from "lucide-react";

const statusColors: Record<TicketStatus, string> = {
  "Open": "hsl(var(--chart-1))",
  "In Progress": "hsl(var(--chart-2))",
  "Waiting on User": "hsl(var(--chart-3))",
  "Closed": "hsl(var(--chart-4))",
};

const problemTypeColors: Record<ProblemType, string> = {
  "Hardware": "hsl(var(--chart-1))",
  "Software": "hsl(var(--chart-2))",
  "Network": "hsl(var(--chart-3))",
  "Account": "hsl(var(--chart-4))",
  "Other": "hsl(var(--chart-5))",
};


export default function ReportsPage() {
  const ticketStatusData = React.useMemo(() => {
    const counts: Record<TicketStatus, number> = {
      "Open": 0,
      "In Progress": 0,
      "Waiting on User": 0,
      "Closed": 0,
    };
    mockTickets.forEach(ticket => {
      counts[ticket.status]++;
    });
    return ticketStatuses.map(status => ({
      name: status,
      count: counts[status],
      fill: statusColors[status],
    }));
  }, []);

  const ticketStatusChartConfig = {
    count: {
      label: "Tickets",
    },
    // Dynamically create a config for each status to use its color in legend/tooltip
    ...ticketStatuses.reduce((acc, status) => {
      acc[status] = {
        label: status,
        color: statusColors[status],
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>)
  } satisfies ChartConfig;


  const ticketsByProblemTypeData = React.useMemo(() => {
    const counts: Record<ProblemType, number> = {
      "Hardware": 0,
      "Software": 0,
      "Network": 0,
      "Account": 0,
      "Other": 0,
    };
    mockTickets.forEach(ticket => {
      counts[ticket.problemType]++;
    });
    return problemTypes.map(type => ({
      name: type,
      count: counts[type],
      fill: problemTypeColors[type],
    }));
  }, []);

 const ticketsByProblemTypeChartConfig = {
    count: {
      label: "Tickets",
    },
    ...problemTypes.reduce((acc, type) => {
      acc[type] = {
        label: type,
        color: problemTypeColors[type],
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>)
  } satisfies ChartConfig;


  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BarChartBig className="h-7 w-7 text-primary" />
            Reports & Analytics
          </CardTitle>
          <CardDescription>
            Visual insights into help desk performance and ticket distribution.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              Ticket Status Overview
            </CardTitle>
            <CardDescription>Number of tickets by current status.</CardDescription>
          </CardHeader>
          <CardContent>
            {ticketStatusData.length > 0 ? (
              <ChartContainer config={ticketStatusChartConfig} className="min-h-[250px] w-full">
                <RechartsBarChart accessibilityLayer data={ticketStatusData} layout="vertical">
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" dataKey="count" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tickLine={false} 
                    axisLine={false} 
                    width={120}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" hideLabel />}
                  />
                  <Bar dataKey="count" radius={5}>
                    {ticketStatusData.map((entry) => (
                        <div key={entry.name} style={{backgroundColor: entry.fill}} /> // This is actually not how Recharts handles individual bar colors in a single <Bar />. The fill is applied to the <Bar /> component itself or dynamically via a function in `fill` prop.
                                                                                        // However, for ChartLegend and ChartTooltip to pick up colors, we define them in chartConfig and map dataKey to these colors.
                                                                                        // The `fill` prop on `<Bar>` will be `fill="var(--color-count)"` if `dataKey="count"` maps to a color in config.
                                                                                        // Let's assume a single color for the bar and let legend/tooltip differentiate, or use multiple <Bar> components if needed.
                                                                                        // For simplicity here, we'll use a single bar component and color it.
                    ))}
                  </Bar>
                   {/* <ChartLegend content={<ChartLegendContent />} /> */}
                </RechartsBarChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground">No ticket data available for status chart.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-primary" />
              Tickets by Problem Type
            </CardTitle>
            <CardDescription>Distribution of tickets by problem category.</CardDescription>
          </CardHeader>
          <CardContent>
            {ticketsByProblemTypeData.length > 0 ? (
              <ChartContainer config={ticketsByProblemTypeChartConfig} className="min-h-[250px] w-full">
                <RechartsBarChart accessibilityLayer data={ticketsByProblemTypeData} layout="vertical">
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" dataKey="count" />
                   <YAxis 
                    dataKey="name" 
                    type="category" 
                    tickLine={false} 
                    axisLine={false} 
                    width={100}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" hideLabel />}
                  />
                  <Bar dataKey="count" radius={5}>
                     {/* Similar to above, individual cell coloring in <Bar> is tricky.
                         Typically done by multiple <Bar> components or advanced cell rendering.
                         We'll rely on the chartConfig to handle this if tooltip/legend need to show varied colors.
                         Or apply a single fill to the bar. For distinct colors per bar in a single series,
                         the `fill` prop on `<Bar>` can take a function, or data should have a `fill` attribute.
                         We added `fill` to `ticketStatusData` and `ticketsByProblemTypeData` items.
                      */}
                  </Bar>
                  {/* <ChartLegend content={<ChartLegendContent />} /> */}
                </RechartsBarChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground">No ticket data available for problem type chart.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

