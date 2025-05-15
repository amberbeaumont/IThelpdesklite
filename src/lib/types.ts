
export type ProblemType = "Hardware" | "Software" | "Network" | "Account" | "Other";
export type Urgency = "Low" | "Medium" | "High" | "Critical";
export type TicketStatus = "Open" | "In Progress" | "Waiting on User" | "Closed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "User" | "IT_Support";
}

export interface Ticket {
  id: string;
  requesterName: string;
  requesterEmail: string;
  problemType: ProblemType;
  urgency: Urgency;
  subject: string;
  message: string;
  attachment?: File | null; // For client-side handling
  attachmentUrl?: string; // For stored file
  status: TicketStatus;
  assignedTo?: User["id"]; // IT Support User ID
  createdAt: Date;
  updatedAt: Date;
  comments: TicketComment[];
}

export interface TicketComment {
  id: string;
  userId: User["id"];
  userName: string;
  comment: string;
  createdAt: Date;
  isInternalNote?: boolean;
}

export interface Snippet {
  id: string;
  title: string;
  content: string;
}

export type EquipmentStatus = "Operational" | "Maintenance" | "Decommissioned";
export const equipmentStatuses: EquipmentStatus[] = ["Operational", "Maintenance", "Decommissioned"];

// Predefined common equipment types, can be expanded
export const commonEquipmentTypes: string[] = ["Laptop", "Desktop", "Monitor", "Printer", "Scanner", "Router", "Switch", "Keyboard", "Mouse", "Other"];


export interface Equipment {
  id: string;
  name: string;
  type: string; // Can be one of commonEquipmentTypes or custom
  serialNumber: string;
  assignedTo?: User["id"];
  purchaseDate: Date;
  status: EquipmentStatus;
}

export interface Report {
  id: string;
  title: string;
  generatedAt: Date;
  data: any; // Placeholder for report data structure
}

