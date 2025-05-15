
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
  attachmentName?: string; // Store filename for localStorage
  attachmentUrl?: string; // For stored file
  status: TicketStatus;
  assignedTo?: User["id"]; // IT Support User ID
  createdAt: Date | string; // Allow string for JSON parsing
  updatedAt: Date | string; // Allow string for JSON parsing
  comments: TicketComment[];
}

export interface TicketComment {
  id: string;
  userId: User["id"];
  userName: string;
  comment: string;
  createdAt: Date | string; // Allow string for JSON parsing
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
  purchaseDate: Date | string; // Allow string for JSON parsing
  status: EquipmentStatus;
}

export interface Report {
  id: string;
  title: string;
  generatedAt: Date;
  data: any; // Placeholder for report data structure
}

// Notes & Docs specific types
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: string; // ISO string
}

export interface Document {
  id:string;
  name: string;
  type: string; // MIME type
  size: number; // in bytes
  uploadedAt: string; // ISO string
  equipmentId?: string; // Optional: for future linking to equipment
  // dataUrl?: string; // If we were to store small files in localStorage (not recommended for large files)
}
