
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTickets, mockEquipment, mockUsers } from "@/lib/placeholder-data";
import type { Ticket, Equipment, User } from "@/lib/types";
import { BarChartBig, ChevronDown, FileText, FileSpreadsheet, Settings2, ArrowUpZA, ArrowDownAZ, Minus } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type DataSource = "tickets" | "equipment" | "users" | "";

interface ReportField {
  key: string; 
  label: string; 
  source: "tickets" | "equipment" | "users"; 
  resolve: (
    primaryItem: any, 
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

// Helper function to extract text from React nodes for CSV export
function getNodeText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getNodeText).join('');
  }
  if (React.isValidElement(node) && node.props.children) {
    // Basic attempt to get text from components like <Badge>Text</Badge>
    // This might need refinement for more complex components.
    return getNodeText(node.props.children);
  }
  // Fallback for other React element types or complex objects
  if (React.isValidElement(node) && (node.type === 'svg' || typeof node.type === 'function')) {
    // Try to get 'aria-label' if it's an icon or a component that might have one
    if (node.props['aria-label']) return String(node.props['aria-label']);
    // For specific components like Badge, we might already be handling children above.
    // For other functional components without simple text children, return placeholder.
    return `[${typeof node.type === 'function' ? node.type.name || 'Component' : 'Element'}]`;
  }
  return ''; // Or some placeholder like '[Object]'
}


export default function ReportsPage() {
  const { toast } = useToast();
  const [dataSource, setDataSource] = React.useState<DataSource>("");
  const [selectedFieldKeys, setSelectedFieldKeys] = React.useState<string[]>([]);
  const [reportData, setReportData] = React.useState<any[]>([]);
  const [reportHeaders, setReportHeaders] = React.useState<ReportField[]>([]);
  
  const [sortConfig, setSortConfig] = React.useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

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
    let processedData = rawData.map(item => {
      const row: Record<string, any> = {};
      currentReportHeaders.forEach(header => {
         row[header.key] = header.resolve(item, allMockData);
      });
      return row;
    });

    if (sortConfig.key) {
      processedData.sort((a, b) => {
        // For sorting, try to get primitive values if possible, or stringify nodes
        const valA = typeof a[sortConfig.key!] !== 'object' ? a[sortConfig.key!] : getNodeText(a[sortConfig.key!]);
        const valB = typeof b[sortConfig.key!] !== 'object' ? b[sortConfig.key!] : getNodeText(b[sortConfig.key!]);

        if (valA === null || valA === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valB === null || valB === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
        
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        // Fallback for other types (like React nodes which might be objects/booleans)
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return sortConfig.direction === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
    }
    setReportData(processedData);
  }, [dataSource, selectedFieldKeys, sortConfig]);

  const handleFieldSelectionChange = (fieldKey: string) => {
    setSelectedFieldKeys(prevSelectedKeys => {
      const isCurrentlySelected = prevSelectedKeys.includes(fieldKey);
      let newSelectedFieldKeys: string[];

      if (isCurrentlySelected) {
        newSelectedFieldKeys = prevSelectedKeys.filter(key => key !== fieldKey);
      } else {
        newSelectedFieldKeys = [...prevSelectedKeys, fieldKey]; // Add to end, preserving order
      }

      if (newSelectedFieldKeys.length > 0) {
        const firstActualSelectedKey = newSelectedFieldKeys[0];
        const firstFieldDetails = ALL_REPORT_FIELDS_MAP.get(firstActualSelectedKey);
        
        if (firstFieldDetails && (dataSource === "" || dataSource !== firstFieldDetails.source)) {
          setDataSource(firstFieldDetails.source as DataSource);
          // If the data source changes, we might want to clear fields not related to the new source,
          // or more simply, let the user manage it. For now, just set the source.
          // Optionally, filter newSelectedFieldKeys to only those matching the new source:
          // newSelectedFieldKeys = newSelectedFieldKeys.filter(key => ALL_REPORT_FIELDS_MAP.get(key)?.source === firstFieldDetails.source);
        }
      } else { 
        if (dataSource !== "") { 
          setDataSource("");
          setSortConfig({ key: null, direction: 'asc' });
        }
      }
      return newSelectedFieldKeys;
    });
  };
  
  const numSelectedFields = selectedFieldKeys.length;

  const handleSort = (columnKey: string) => {
    setSortConfig(prevSortConfig => {
      if (prevSortConfig.key === columnKey) {
        return { key: columnKey, direction: prevSortConfig.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  const exportToCSV = () => {
    if (reportData.length === 0 || reportHeaders.length === 0) {
      toast({ title: "No data to export", description: "Please generate a report first.", variant: "destructive" });
      return;
    }

    const escapeCSVCell = (cellData: any): string => {
      const text = getNodeText(cellData); // Use helper to get text from ReactNode
      const result = String(text).replace(/"/g, '""'); // Escape double quotes
      if (result.includes(',')) {
        return `"${result}"`; // Enclose in double quotes if it contains a comma
      }
      return result;
    };
    
    const headerRow = reportHeaders.map(header => escapeCSVCell(header.label)).join(',');
    const dataRows = reportData.map(row => 
      reportHeaders.map(header => escapeCSVCell(row[header.key])).join(',')
    );

    const csvContent = [headerRow, ...dataRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `report-${dataSource || 'custom'}-${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: "CSV Exported", description: "The report has been downloaded as a CSV file." });
    } else {
        toast({ title: "Export Failed", description: "Your browser does not support this export method.", variant: "destructive"});
    }
  };


  const renderFieldSelectorDropdown = (fields: ReportField[], title: string) => (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium block mb-2">{title}</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto justify-between">
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
          <CardTitle className="text-xl flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" />
            Custom Report Builder
          </CardTitle>
          <CardDescription>
           Select fields from Tickets, Equipment, or Users to build your report. The first field selected will determine the report's primary data focus (what each row represents). Column order is based on selection order. Click table headers to sort.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {renderFieldSelectorDropdown(TICKET_REPORT_FIELDS, "Ticket Fields")}
              {renderFieldSelectorDropdown(EQUIPMENT_REPORT_FIELDS, "Equipment Fields")}
              {renderFieldSelectorDropdown(USER_REPORT_FIELDS, "User Fields")}
            </div>
          </div>

          {dataSource && numSelectedFields > 0 && reportData.length > 0 && (
            <div className="space-y-4 pt-6">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => toast({title: "Coming Soon!", description: "PDF export will be available in a future update."})}>
                  <FileText className="mr-2 h-4 w-4" /> Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={exportToCSV}>
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
                            <TableHead 
                              key={header.key} 
                              onClick={() => handleSort(header.key)}
                              className="cursor-pointer hover:bg-muted/50"
                            >
                              <div className="flex items-center gap-2">
                                {header.label}
                                {sortConfig.key === header.key ? (
                                  sortConfig.direction === 'asc' ? <ArrowUpZA className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />
                                ) : <Minus className="h-4 w-4 text-muted-foreground/50" /> }
                              </div>
                            </TableHead>
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
           {numSelectedFields === 0 && (
            <div className="text-center text-muted-foreground py-8">
                Please select at least one field from any category to build a report. The first field chosen will set the report's focus.
            </div>
           )}
           {dataSource && numSelectedFields > 0 && reportData.length === 0 && (
             <div className="text-center text-muted-foreground py-8">
                No data available for the selected fields and data focus.
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
    

    

      
