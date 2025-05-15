
"use client";

import * as React from "react";
// Removed RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer as they are only used by the removed charts.
// ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent are also removed if no other charts use them.
// For now, assuming they might be used if user wants to add other charts later, but if not, they can be cleaned up.
// Update: Since we are removing the only charts using these, they can be removed.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTickets, mockEquipment, mockUsers } from "@/lib/placeholder-data"; // Removed ticketStatuses, problemTypes as they were for the charts
import type { Ticket, Equipment, User } from "@/lib/types"; // Removed TicketStatus, ProblemType
import { BarChartBig, ChevronDown, FileText, FileSpreadsheet, Settings2 } from "lucide-react"; // Removed Activity, AlertTriangle
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Removed statusColors and problemTypeColors as they were for the charts

type DataSource = "tickets" | "equipment" | "";

interface FieldDefinition {
  key: string;
  label: string;
  formatter?: (value: any, item: any) => string | React.ReactNode;
}

const TICKET_FIELDS: FieldDefinition[] = [
  { key: "id", label: "Ticket ID" },
  { key: "subject", label: "Subject" },
  { key: "requesterName", label: "Requester Name" },
  { key: "requesterEmail", label: "Requester Email" },
  { key: "problemType", label: "Problem Type" },
  { key: "urgency", label: "Urgency" },
  { key: "status", label: "Status" },
  { 
    key: "assignedTo", 
    label: "Assigned To",
    formatter: (userId: string) => mockUsers.find(u => u.id === userId)?.name || "Unassigned"
  },
  { key: "createdAt", label: "Created At", formatter: (date: Date) => format(new Date(date), "PP p") },
  { key: "updatedAt", label: "Last Updated", formatter: (date: Date) => format(new Date(date), "PP p") },
];

const EQUIPMENT_FIELDS: FieldDefinition[] = [
  { key: "id", label: "Equipment ID" },
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "serialNumber", label: "Serial Number" },
  { 
    key: "assignedTo", 
    label: "Assigned To",
    formatter: (userId: string) => mockUsers.find(u => u.id === userId)?.name || "Unassigned"
  },
  { key: "purchaseDate", label: "Purchase Date", formatter: (date: Date) => format(new Date(date), "PP") },
  { key: "status", label: "Status" },
];


export default function ReportsPage() {
  const { toast } = useToast();
  const [dataSource, setDataSource] = React.useState<DataSource>("");
  const [availableFields, setAvailableFields] = React.useState<FieldDefinition[]>([]);
  const [selectedFields, setSelectedFields] = React.useState<Record<string, boolean>>({});
  const [reportData, setReportData] = React.useState<any[]>([]);
  const [reportHeaders, setReportHeaders] = React.useState<FieldDefinition[]>([]);

  React.useEffect(() => {
    if (dataSource === "tickets") {
      setAvailableFields(TICKET_FIELDS);
    } else if (dataSource === "equipment") {
      setAvailableFields(EQUIPMENT_FIELDS);
    } else {
      setAvailableFields([]);
    }
    setSelectedFields({}); // Reset selected fields when data source changes
    setReportData([]);
    setReportHeaders([]);
  }, [dataSource]);

  const handleFieldSelectionChange = (fieldKey: string) => {
    setSelectedFields(prev => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  const handleGenerateReport = () => {
    if (!dataSource) {
      toast({ title: "Select Data Source", description: "Please select a data source for the report.", variant: "destructive" });
      return;
    }
    const activeFieldKeys = Object.entries(selectedFields).filter(([,isSelected]) => isSelected).map(([key]) => key);
    if (activeFieldKeys.length === 0) {
      toast({ title: "Select Fields", description: "Please select at least one field for the report.", variant: "destructive" });
      return;
    }

    const currentReportHeaders = availableFields.filter(field => activeFieldKeys.includes(field.key));
    setReportHeaders(currentReportHeaders);

    let rawData = [];
    if (dataSource === "tickets") {
      rawData = mockTickets;
    } else if (dataSource === "equipment") {
      rawData = mockEquipment;
    }

    const processedData = rawData.map(item => {
      const row: Record<string, any> = {};
      currentReportHeaders.forEach(header => {
        row[header.key] = item[header.key];
      });
      return row;
    });
    setReportData(processedData);
    toast({ title: "Report Generated", description: `Displaying ${processedData.length} records with ${currentReportHeaders.length} fields.` });
  };
  
  const numSelectedFields = Object.values(selectedFields).filter(Boolean).length;

  // ---- Removed chart data and config ----

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BarChartBig className="h-7 w-7 text-primary" />
            Reports & Analytics
          </CardTitle>
          <CardDescription>
            Visual insights and custom report generation.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Custom Report Builder */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" />
            Custom Report Builder
          </CardTitle>
          <CardDescription>Select data source and fields to generate a custom report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label htmlFor="dataSource" className="text-sm font-medium">Data Source</label>
              <Select value={dataSource} onValueChange={(value) => setDataSource(value as DataSource)}>
                <SelectTrigger id="dataSource">
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tickets">Tickets</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium block mb-2">Select Fields</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto justify-between" disabled={!dataSource}>
                    {numSelectedFields > 0 ? `${numSelectedFields} field(s) selected` : "Choose fields"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 max-h-80 overflow-y-auto">
                  <DropdownMenuLabel>Available Fields</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableFields.map(field => (
                    <DropdownMenuCheckboxItem
                      key={field.key}
                      checked={selectedFields[field.key] || false}
                      onCheckedChange={() => handleFieldSelectionChange(field.key)}
                      onSelect={(e) => e.preventDefault()} // Prevent menu closing on item select
                    >
                      {field.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button onClick={handleGenerateReport} disabled={!dataSource || numSelectedFields === 0}>
              Generate Report
            </Button>
          </div>

          {reportData.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => toast({title: "Coming Soon!", description: "PDF export will be available in a future update."})}>
                  <FileText className="mr-2 h-4 w-4" /> Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast({title: "Coming Soon!", description: "CSV export will be available in a future update."})}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
                </Button>
              </div>
              <Card className="border shadow-none">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {reportHeaders.map(header => (
                            <TableHead key={header.key}>{header.label}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {reportHeaders.map(header => (
                              <TableCell key={`${rowIndex}-${header.key}`}>
                                {header.formatter ? header.formatter(row[header.key], row) : row[header.key]}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing Charts Removed */}
    </div>
  );
}
    
