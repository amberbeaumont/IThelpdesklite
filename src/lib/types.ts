
// Enums based on typical Supabase user-defined types (adjust if your enum names differ)
export type ProblemType = "Hardware" | "Software" | "Network" | "Account" | "Other";
export type UrgencyLevel = "Low" | "Medium" | "High" | "Critical"; // Renamed from Urgency to avoid conflict with a potential table
export type TicketStatusEnum = "Open" | "In Progress" | "Waiting on User" | "Closed" | "Deleted";
export type EquipmentStatusEnum = "Operational" | "Maintenance" | "Decommissioned" | "In Repair" | "Missing"; // Added from common equipment statuses
export type UserRoleEnum = "Admin" | "IT_Support" | "User" | "Manager"; // Assuming 'staff' from schema might map to 'User' or 'IT_Support'
export type BusinessUnitEnum = "Lofty Building Group" | "Lofty Homes" | "Lofty Developments" | "Corporate" | "Other"; // Example business units

export interface User {
  user_id: string; // uuid, PK from your 'users' table
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  user_level: UserRoleEnum; // Maps to user_role_enum
  business_unit: BusinessUnitEnum;
  // equipment?: string; // This was text, likely better as a related list
  created_by?: string; // uuid
  created_at: string; // timestamp with time zone
  updated_at: string; // timestamp with time zone
  // password?: string; // Typically not handled directly in client-side types after auth
}

export interface Profile { // Based on 'profiles' table
  id: number; // bigint
  user_id?: string; // uuid, FK to auth.users.id
  bio?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Ticket {
  ticket_id: number; // bigint, PK
  user_id?: string; // uuid, creator/requester from auth.uid()
  requester_name?: string;
  requester_email?: string;
  ticket_name: string; // Formerly subject
  message: string;
  attachment_url?: string;
  attachment_name?: string;
  issue_type?: ProblemType;
  status: TicketStatusEnum;
  assigned_to?: string; // uuid of an IT_Support user
  created_at: string; // timestamp with time zone
  updated_at: string; // timestamp with time zone
  urgency: UrgencyLevel;
  business_unit?: BusinessUnitEnum;
  // comments will be fetched separately from ticket_comments table
}

export interface TicketComment {
  id: string; // uuid, PK from ticket_comments
  ticket_id: number; // bigint, FK to tickets.ticket_id
  user_id?: string; // uuid of commenter
  user_name: string; // denormalized for display
  comment: string;
  created_at?: string; // timestamp with time zone
  is_internal_note?: boolean;
}

export interface Snippet {
  // Assuming snippets table has an 'id' pk, if not, (ticket_id, snippet_name) could be composite
  id?: number; // Added assuming a primary key for snippets, typically bigint
  ticket_id: number; // bigint - Is this correct? Snippets are usually general, not per-ticket. Schema shows PK.
  snippet_name: string;
  snippet_text: string;
  created_by?: string; // uuid
  created_at: string; // timestamp with time zone
  updated_at: string; // timestamp with time zone
  updated_by?: string; // uuid
}

export interface Equipment {
  id: number; // bigint, PK
  item_name: string; // Formerly name
  serial_number: string;
  status: EquipmentStatusEnum;
  details?: string;
  acquired_at: string; // timestamp with time zone (formerly purchaseDate)
  assigned_to?: string; // uuid of a user
  cost?: string; // text, consider numeric if possible in DB
  attachment?: string; // URL or path to attachment
  business_unit?: BusinessUnitEnum;
  created_by?: string; // uuid
  created_at: string; // timestamp with time zone
  updated_at: string; // timestamp with time zone
  updated_by?: string; // uuid
  // The 'type' field (Laptop, Desktop) from old type is missing.
  // It could be part of 'details', a new column, or a classification based on item_name.
  // For now, we'll omit it or you can add it to 'details'.
  type?: string; // Added back for compatibility, consider how to map this from/to Supabase
}

export interface Note { // Based on 'notes' table
  id: number; // bigint, PK
  ticket_id?: number; // bigint, FK to tickets.ticket_id (optional if notes can be general)
  note_name: string; // Formerly title
  note_details: string; // Formerly content
  attachment_url?: string;
  created_by?: string; // uuid
  created_at: string; // timestamp with time zone
  updated_by?: string; // uuid
  updated_at: string; // timestamp with time zone
}

export interface Bookmark { // Based on 'bookmarks' table
  id: number; // bigint, PK
  bookmark_name: string; // Formerly title
  bookmark_link: string; // Formerly url
  created_by?: string; // uuid
  created_at: string; // timestamp with time zone
  updated_by?: string; // uuid
  updated_at: string; // timestamp with time zone
}

// This local Document type might be used for handling file uploads before they get a URL from Supabase storage
export interface Document {
  id: string; // Could be a temporary client-side ID
  name: string;
  type: string;
  size: number;
  uploadedAt: string; // or Date
  // equipmentId?: string; // This was for local mock linking
}

export interface ActivityLog {
  id: number; // bigint
  user_id?: string; // uuid
  action: string; // text
  table_name: string; // text, e.g., "tickets", "equipment"
  record_id?: number; // bigint, refers to PK of the record in table_name
  metadata?: any; // jsonb
  created_at: string; // timestamp with time zone
}


// To be removed or updated after Supabase integration for reports
export interface Report {
  id: string;
  title: string;
  generatedAt: Date; // Or string
  data: any;
}

// Constants (will be updated in placeholder-data.ts to reflect new enum names/values)
// problemTypes, urgencies, ticketStatuses, equipmentStatuses, commonEquipmentTypes
// are now defined as string literal types above and their array counterparts for dropdowns etc.
// will be in placeholder-data.ts

// Make sure these array constants are updated in placeholder-data.ts
// to reflect the new string literal types.
export const problemTypesArray: ProblemType[] = ["Hardware", "Software", "Network", "Account", "Other"];
export const urgencyLevelsArray: UrgencyLevel[] = ["Low", "Medium", "High", "Critical"];
export const ticketStatusEnumArray: TicketStatusEnum[] = ["Open", "In Progress", "Waiting on User", "Closed", "Deleted"];
export const equipmentStatusEnumArray: EquipmentStatusEnum[] = ["Operational", "Maintenance", "Decommissioned", "In Repair", "Missing"];
export const userRoleEnumArray: UserRoleEnum[] = ["Admin", "IT_Support", "User", "Manager"];
export const businessUnitEnumArray: BusinessUnitEnum[] = ["Lofty Building Group", "Lofty Homes", "Lofty Developments", "Corporate", "Other"];

export const commonEquipmentTypes: string[] = ["Laptop", "Desktop", "Monitor", "Printer", "Scanner", "Router", "Switch", "Keyboard", "Mouse", "Other"];


    