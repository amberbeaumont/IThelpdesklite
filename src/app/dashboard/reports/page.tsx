
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
  key: string; // Unique identifier for the field, e.g., "ticket.id" or "user.name"
  label: string; // Column header text
  source: "tickets" | "equipment" | "users"; // Indicates which primary entity this field belongs to
  resolve: (
    primaryItem: any, // Type will be User, Ticket, or Equipment based on dataSource
    allData: { users: User[]; tickets: Ticket[]; equipment: Equipment[] }
  ) => React.ReactNode;
}

const TICKET_REPORT_FIELDS: ReportField[] = [
  { key: "ticket.id", label: "Ticket ID", source: "tickets", resolve: (item: Ticket) => item.id },
  { key: "ticket.subject", label: "Subject", source: "tickets", resolve: (item: Ticket) => item.subject },
  { key: "ticket.requesterName", label: "Requester Name", source: "tickets", resolve: (item: Ticket) => item.requesterName },
  { key: "ticket.requesterEmail", label: "Requester Email", source: "tickets", resolve: (item: Ticket) => item.requesterEmail },
  {
    key: "ticket.requesterRole",
    label: "Requester Role",
    source: "tickets",
    resolve: (item: Ticket, allData) => {
      const user = allData.users.find(u => u.email === item.requesterEmail);
      return user ? user.role : "N/A";
    }
  },
  { key: "ticket.problemType", label: "Problem Type", source: "tickets", resolve: (item: Ticket) => item.problemType },
  { key: "ticket.urgency", label: "Urgency", source: "tickets", resolve: (item: Ticket) => item.urgency },
  { key: "ticket.status", label: "Status", source: "tickets", resolve: (item: Ticket) => item.status },
  {
    key: "ticket.assignedToName",
    label: "Assigned To",
    source: "tickets",
    resolve: (item: Ticket, allData) => {
      if (!item.assignedTo) return "Unassigned";
      const user = allData.users.find(u => u.id === item.assignedTo);
      return user ? user.name : "Unknown User";
    }
  },
  { key: "ticket.createdAt", label: "Created At", source: "tickets", resolve: (item: Ticket) => format(new Date(item.createdAt), "PP p") },
  { key: "ticket.updatedAt", label: "Last Updated", source: "tickets", resolve: (item: Ticket) => format(new Date(item.updatedAt), "PP p") },
];

const EQUIPMENT_REPORT_FIELDS: ReportField[] = [
  { key: "equipment.id", label: "Equipment ID", source: "equipment", resolve: (item: Equipment) => item.id },
  { key: "equipment.name", label: "Name", source: "equipment", resolve: (item: Equipment) => item.name },
  { key: "equipment.type", label: "Type", source: "equipment", resolve: (item: Equipment) => item.type },
  { key: "equipment.serialNumber", label: "Serial Number", source: "equipment", resolve: (item: Equipment) => item.serialNumber },
  {
    key: "equipment.assignedToName",
    label: "Assigned User Name",
    source: "equipment",
    resolve: (item: Equipment, allData) => {
      if (!item.assignedTo) return "Unassigned";
      const user = allData.users.find(u => u.id === item.assignedTo);
      return user ? user.name : "Unknown User";
    }
  },
   {
    key: "equipment.assignedToEmail",
    label: "Assigned User Email",
    source: "equipment",
    resolve: (item: Equipment, allData) => {
      if (!item.assignedTo) return "N/A";
      const user = allData.users.find(u => u.id === item.assignedTo);
      return user ? user.email : "Unknown User";
    }
  },
  {
    key: "equipment.assigneeRole",
    label: "Assignee Role",
    source: "equipment",
    resolve: (item: Equipment, allData) => {
      if (!item.assignedTo) return "N/A";
      const user = allData.users.find(u => u.id === item.assignedTo);
      return user ? user.role : "Unknown";
    }
  },
  { key: "equipment.purchaseDate", label: "Purchase Date", source: "equipment", resolve: (item: Equipment) => format(new Date(item.purchaseDate), "PP") },
  { key: "equipment.status", label: "Status", source: "equipment", resolve: (item: Equipment) => item.status },
];

const USER_REPORT_FIELDS: ReportField[] = [
  { key: "user.id", label: "User ID", source: "users", resolve: (item: User) => item.id },
  { key: "user.name", label: "Name", source: "users", resolve: (item: User) => item.name },
  { key: "user.email", label: "Email", source: "users", resolve: (item: User) => item.email },
  { key: "user.role", label: "Role", source: "users", resolve: (item: User) => item.role },
  {
    key: "user.openTicketsCount",
    label: "Open Tickets Count",
    source: "users",
    resolve: (item: User, allData) => {
      return allData.tickets.filter(t => t.requesterEmail === item.email && t.status !== "Closed").length;
    }
  },
  {
    key: "user.firstTicketSubject",
    label: "First Ticket Subject",
    source: "users",
    resolve: (item: User, allData) => {
      const userTickets = allData.tickets.filter(t => t.requesterEmail === item.email).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return userTickets.length > 0 ? userTickets[0].subject : "No tickets";
    }
  },
  {
    key: "user.assignedEquipment",
    label: "Assigned Equipment (Names)",
    source: "users",
    resolve: (item: User, allData) => {
      const equipmentNames = allData.equipment
        .filter(eq => eq.assignedTo === item.id)
        .map(eq => eq.name)
        .join(", ");
      return equipmentNames || "None";
    }
  },
];

const ALL_REPORT_FIELDS: ReportField[] = [
  ...TICKET_REPORT_FIELDS,
  ...EQUIPMENT_REPORT_FIELDS,
  ...USER_REPORT_FIELDS,
];

const ALL_REPORT_FIELDS_MAP = new Map<string, ReportField>(
  ALL_REPORT_FIELDS.map(field => [field.key, field])
);


export default function ReportsPage() {
  const { toast } = useToast();
  const [dataSource, setDataSource] = React.useState<DataSource>("");
  const [selectedFieldKeys, setSelectedFieldKeys] = React.useState<string[]>([]);
  const [reportData, setReportData] = React.useState<any[]>([]);
  const [reportHeaders, setReportHeaders] = React.useState<ReportField[]>([]);

  // Reset selected fields when data source changes
  React.useEffect(() => {
    setSelectedFieldKeys([]);
  }, [dataSource]);
  
  // Regenerate report when selected fields or data source changes
  React.useEffect(() => {
    if (!dataSource || selectedFieldKeys.length === 0) {
        setReportData([]);
        setReportHeaders([]);
        return;
    }

    const currentReportHeaders = selectedFieldKeys
      .map(key => ALL_REPORT_FIELDS_MAP.get(key))
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

  }, [dataSource, selectedFieldKeys]);

  const handleFieldSelectionChange = (fieldKey: string) => {
    setSelectedFieldKeys(prev => 
      prev.includes(fieldKey) 
        ? prev.filter(key => key !== fieldKey) 
        : [...prev, fieldKey]
    );
  };
  
  const numSelectedFields = selectedFieldKeys.length;

  const renderFieldSelectorDropdown = (fields: ReportField[], title: string, idSuffix: string) => (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium block mb-2">{title}</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto justify-between" disabled={!dataSource}>
            {`${selectedFieldKeys.filter(key => fields.some(f => f.key === key)).length} / ${fields.length} selected`}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 max-h-80 overflow-y-auto">
          <DropdownMenuLabel>{title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {fields.map(field => (
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
  );


  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BarChartBig className="h-7 w-7 text-primary" />
            Reports & Analytics
          </CardTitle>
          <CardDescription>
            Select a primary data source, then choose fields from Tickets, Equipment, or Users to build your report.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" />
            Custom Report Builder
          </CardTitle>
          <CardDescription>The table will update automatically as you select fields. Column order is based on selection order.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex-1 space-y-2">
              <label htmlFor="dataSource" className="text-sm font-medium">Primary Data Source (defines report rows)</label>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {renderFieldSelectorDropdown(TICKET_REPORT_FIELDS, "Ticket Fields", "tickets")}
              {renderFieldSelectorDropdown(EQUIPMENT_REPORT_FIELDS, "Equipment Fields", "equipment")}
              {renderFieldSelectorDropdown(USER_REPORT_FIELDS, "User Fields", "users")}
            </div>
          </div>


          {dataSource && numSelectedFields > 0 && reportData.length > 0 && (
            <div className="space-y-4 pt-6">
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
                Please select at least one field from any category to display the report.
            </div>
           )}
            {!dataSource && (
            <div className="text-center text-muted-foreground py-8">
                Please select a primary data source to begin building your report.
            </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
    
