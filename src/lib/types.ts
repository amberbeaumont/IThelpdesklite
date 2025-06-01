
export type ProblemType = "Hardware" | "Software" | "Network" | "Account" | "Other";
export type Urgency = "Low" | "Medium" | "High" | "Critical";
export type TicketStatus = "Open" | "In Progress" | "Waiting on User" | "Closed" | "Deleted";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string; 
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
  attachmentName?: string; 
  attachmentUrl?: string; 
  status: TicketStatus;
  assignedTo?: User["id"]; 
  createdAt: Date | string; 
  updatedAt: Date | string; 
  comments: TicketComment[];
}

export interface TicketComment {
  id: string;
  userId: User["id"];
  userName: string;
  comment: string;
  createdAt: Date | string; 
  isInternalNote?: boolean;
}

export interface Snippet {
  id: string;
  title: string;
  content: string;
  createdAt?: string; 
  updatedAt?: string; 
}

export type EquipmentStatus = "Operational" | "Maintenance" | "Decommissioned";
export const equipmentStatuses: EquipmentStatus[] = ["Operational", "Maintenance", "Decommissioned"];

export const commonEquipmentTypes: string[] = ["Laptop", "Desktop", "Monitor", "Printer", "Scanner", "Router", "Switch", "Keyboard", "Mouse", "Other"];


export interface Equipment {
  id: string;
  name: string;
  type: string; 
  serialNumber: string;
  assignedTo?: User["id"];
  purchaseDate: Date | string; 
  status: EquipmentStatus;
}

export interface Report {
  id: string;
  title: string;
  generatedAt: Date;
  data: any; 
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; 
  updatedAt: string; 
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: string; 
}

export interface Document {
  id:string;
  name: string;
  type: string; 
  size: number; 
  uploadedAt: string; 
  equipmentId?: string; 
}
