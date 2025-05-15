
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTickets, mockEquipment, mockUsers } from "@/lib/placeholder-data";
import type { Ticket, Equipment, User } from "@/lib/types";
import { BarChartBig, ChevronDown, FileText, FileSpreadsheet, Settings2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type DataSource = "tickets" | "equipment" | "users" | "";

interface ReportField {
  key: string; // Unique identifier for the field
  label: string; // Column header text
  resolve: (
    primaryItem: any, // Type will be User, Ticket, or Equipment based on dataSource
    allData: { users: User[]; tickets: Ticket[]; equipment: Equipment[] }
  ) => React.ReactNode;
}

const TICKET_REPORT_FIELDS: ReportField[] = [
  { key: "ticket.id", label: "Ticket ID", resolve: (item: Ticket) => item.id },
  { key: "ticket.subject", label: "Subject", resolve: (item: Ticket) => item.subject },
  { key: "ticket.requesterName", label: "Requester Name", resolve: (item: Ticket) => item.requesterName },
  { key: "ticket.requesterEmail", label: "Requester Email", resolve: (item: Ticket) => item.requesterEmail },
  {
    key: "ticket.requesterRole",
    label: "Requester Role",
    resolve: (item: Ticket, allData) => {
      const user = allData.users.find(u => u.email === item.requesterEmail);
      return user ? user.role : "N/A";
    }
  },
  { key: "ticket.problemType", label: "Problem Type", resolve: (item: Ticket) => item.problemType },
  { key: "ticket.urgency", label: "Urgency", resolve: (item: Ticket) => item.urgency },
  { key: "ticket.status", label: "Status", resolve: (item: Ticket) => item.status },
  {
    key: "ticket.assignedToName",
    label: "Assigned To",
    resolve: (item: Ticket, allData) => {
      if (!item.assignedTo) return "Unassigned";
      const user = allData.users.find(u => u.id === item.assignedTo);
      return user ? user.name : "Unknown User";
    }
  },
  { key: "ticket.createdAt", label: "Created At", resolve: (item: Ticket) => format(new Date(item.createdAt), "PP p") },
  { key: "ticket.updatedAt", label: "Last Updated", resolve: (item: Ticket) => format(new Date(item.updatedAt), "PP p") },
];

const EQUIPMENT_REPORT_FIELDS: ReportField[] = [
  { key: "equipment.id", label: "Equipment ID", resolve: (item: Equipment) => item.id },
  { key: "equipment.name", label: "Name", resolve: (item: Equipment) => item.name },
  { key: "equipment.type", label: "Type", resolve: (item: Equipment) => item.type },
  { key: "equipment.serialNumber", label: "Serial Number", resolve: (item: Equipment) => item.serialNumber },
  {
    key: "equipment.assignedToName",
    label: "Assigned User Name",
    resolve: (item: Equipment, allData) => {
      if (!item.assignedTo) return "Unassigned";
      const user = allData.users.find(u => u.id === item.assignedTo);
      return user ? user.name : "Unknown User";
    }
  },
   {
    key: "equipment.assignedToEmail",
    label: "Assigned User Email",
    resolve: (item: Equipment, allData) => {
      if (!item.assignedTo) return "N/A";
      const user = allData.users.find(u => u.id === item.assignedTo);
      return user ? user.email : "Unknown User";
    }
  },
  {
    key: "equipment.assigneeRole",
    label: "Assignee Role",
    resolve: (item: Equipment, allData) => {
      if (!item.assignedTo) return "N/A";
      const user = allData.users.find(u => u.id === item.assignedTo);
      return user ? user.role : "Unknown";
    }
  },
  { key: "equipment.purchaseDate", label: "Purchase Date", resolve: (item: Equipment) => format(new Date(item.purchaseDate), "PP") },
  { key: "equipment.status", label: "Status", resolve: (item: Equipment) => item.status },
];

const USER_REPORT_FIELDS: ReportField[] = [
  { key: "user.id", label: "User ID", resolve: (item: User) => item.id },
  { key: "user.name", label: "Name", resolve: (item: User) => item.name },
  { key: "user.email", label: "Email", resolve: (item: User) => item.email },
  { key: "user.role", label: "Role", resolve: (item: User) => item.role },
  {
    key: "user.openTicketsCount",
    label: "Open Tickets Count",
    resolve: (item: User, allData) => {
      return allData.tickets.filter(t => t.requesterEmail === item.email && t.status !== "Closed").length;
    }
  },
  {
    key: "user.firstTicketSubject",
    label: "First Ticket Subject",
    resolve: (item: User, allData) => {
      const userTickets = allData.tickets.filter(t => t.requesterEmail === item.email).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return userTickets.length > 0 ? userTickets[0].subject : "No tickets";
    }
  },
  {
    key: "user.assignedEquipment",
    label: "Assigned Equipment (Names)",
    resolve: (item: User, allData) => {
      const equipmentNames = allData.equipment
        .filter(eq => eq.assignedTo === item.id)
        .map(eq => eq.name)
        .join(", ");
      return equipmentNames || "None";
    }
  },
];


export default function ReportsPage() {
  const { toast } = useToast();
  const [dataSource, setDataSource] = React.useState<DataSource>("");
  const [availableFields, setAvailableFields] = React.useState<ReportField[]>([]);
  const [selectedFieldKeys, setSelectedFieldKeys] = React.useState<string[]>([]);
  const [reportData, setReportData] = React.useState<any[]>([]);
  const [reportHeaders, setReportHeaders] = React.useState<ReportField[]>([]);

  React.useEffect(() => {
    if (dataSource === "tickets") {
      setAvailableFields(TICKET_REPORT_FIELDS);
    } else if (dataSource === "equipment") {
      setAvailableFields(EQUIPMENT_REPORT_FIELDS);
    } else if (dataSource === "users") {
      setAvailableFields(USER_REPORT_FIELDS);
    } else {
      setAvailableFields([]);
    }
    setSelectedFieldKeys([]); // Reset selected fields when data source changes
    setReportData([]);
    setReportHeaders([]);
  }, [dataSource]);

  const handleFieldSelectionChange = (fieldKey: string) => {
    setSelectedFieldKeys(prev => {
      const newSelection = prev.includes(fieldKey)
        ? prev.filter(key => key !== fieldKey)
        : [...prev, fieldKey];
      
      // Ensure field order is maintained as selected
      // This relies on availableFields being stable for the current dataSource
      return availableFields
        .filter(field => newSelection.includes(field.key))
        .map(field => field.key);
    });
  };
  
  React.useEffect(() => {
    if (!dataSource) {
        setReportData([]);
        setReportHeaders([]);
        return;
    }
    if (selectedFieldKeys.length === 0) {
        setReportData([]);
        setReportHeaders([]);
        return;
    }

    const currentReportHeaders = selectedFieldKeys
      .map(key => availableFields.find(field => field.key === key))
      .filter((field): field is ReportField => field !== undefined);
      
    setReportHeaders(currentReportHeaders);

    let rawData: any[] = [];
    if (dataSource === "tickets") {
      rawData = mockTickets;
    } else if (dataSource === "equipment") {
      rawData = mockEquipment;
    } else if (dataSource === "users") {
      rawData = mockUsers;
    }

    const allMockData = { users: mockUsers, tickets: mockTickets, equipment: mockEquipment };
    const processedData = rawData.map(item => {
      const row: Record<string, any> = {};
      currentReportHeaders.forEach(header => {
        row[header.key] = header.resolve(item, allMockData);
      });
      return row;
    });
    setReportData(processedData);

  }, [dataSource, selectedFieldKeys, availableFields]);


  const numSelectedFields = selectedFieldKeys.length;

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

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" />
            Custom Report Builder
          </CardTitle>
          <CardDescription>Select data source and fields to generate a custom report. The table will update as you select fields.</CardDescription>
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
                  <SelectItem value="users">Users</SelectItem>
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
                      checked={selectedFieldKeys.includes(field.key)}
                      onCheckedChange={() => handleFieldSelectionChange(field.key)}
                      onSelect={(e) => e.preventDefault()} 
                    >
                      {field.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* "Generate Report" button is removed as table updates dynamically */}
          </div>

          {dataSource && numSelectedFields > 0 && reportData.length > 0 && (
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
                                {row[header.key]}
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
           {dataSource && numSelectedFields === 0 && (
            <div className="text-center text-muted-foreground py-8">
                Please select at least one field to display the report.
            </div>
           )}
            {!dataSource && (
            <div className="text-center text-muted-foreground py-8">
                Please select a data source to begin building your report.
            </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
    

