
import type {
  Ticket,
  User,
  Snippet,
  ProblemType,
  UrgencyLevel,
  TicketStatusEnum,
  EquipmentStatusEnum,
  UserRoleEnum,
  BusinessUnitEnum,
  Equipment,
  Report,
  Note,
  Bookmark,
  Document,
  // Import new enum arrays
  problemTypesArray,
  urgencyLevelsArray,
  ticketStatusEnumArray,
  equipmentStatusEnumArray,
  userRoleEnumArray,
  businessUnitEnumArray,
  commonEquipmentTypes
} from './types';

// --- Enums for UI (dropdowns, filters, etc.) ---
// These should now directly use the imported arrays from types.ts
export const problemTypes: ProblemType[] = problemTypesArray;
export const urgencies: UrgencyLevel[] = urgencyLevelsArray; // Renamed from Urgency to UrgencyLevel
export const ticketStatuses: TicketStatusEnum[] = ticketStatusEnumArray;
export const equipmentStatuses: EquipmentStatusEnum[] = equipmentStatusEnumArray;
export const userRoles: UserRoleEnum[] = userRoleEnumArray;
export const businessUnits: BusinessUnitEnum[] = businessUnitEnumArray;
// commonEquipmentTypes is already imported and exported from types.ts

// --- Mock Data (To be phased out with Supabase integration) ---

export const mockUsers: User[] = [
  {
    user_id: 'auth-uuid-user1', // Example UUID
    first_name: 'Alice',
    last_name: 'Wonderland',
    email: 'alice@example.com',
    phone: '555-0101',
    user_level: 'User',
    business_unit: 'Lofty Building Group',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    user_id: 'auth-uuid-user2',
    first_name: 'Bob',
    last_name: 'The Builder',
    email: 'bob@example.com',
    phone: '555-0102',
    user_level: 'User',
    business_unit: 'Lofty Homes',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    user_id: 'auth-uuid-it1',
    first_name: 'Charlie',
    last_name: 'Root',
    email: 'charlie@support.com',
    phone: '555-0201',
    user_level: 'IT_Support',
    business_unit: 'Corporate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    user_id: 'auth-uuid-it2',
    first_name: 'Diana',
    last_name: 'Prince',
    email: 'diana@support.com',
    phone: '555-0202',
    user_level: 'Admin', // Example Admin
    business_unit: 'Corporate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];


export const mockTickets: Omit<Ticket, 'comments'>[] = [ // comments will be handled by a separate table
  {
    ticket_id: 1, // bigint
    requester_name: 'Alice Wonderland',
    requester_email: 'alice@example.com',
    issue_type: 'Software',
    urgency: 'High',
    ticket_name: 'Application keeps crashing on startup',
    message: 'My main work application crashes every time I try to open it. I have tried restarting my computer but the issue persists. This is blocking my work.',
    attachment_url: undefined,
    status: 'Open',
    assigned_to: 'auth-uuid-it1',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'auth-uuid-user1', // Creator
  },
  {
    ticket_id: 2,
    requester_name: 'Bob The Builder',
    requester_email: 'bob@example.com',
    issue_type: 'Hardware',
    urgency: 'Medium',
    ticket_name: 'Printer not working',
    message: 'The office printer on the 2nd floor is not responding. It shows an error "Paper Jam" but there is no visible paper jam.',
    attachment_url: 'https://placehold.co/200x300.png',
    attachment_name: 'printer_error.jpg',
    status: 'In Progress',
    assigned_to: 'auth-uuid-it2',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user_id: 'auth-uuid-user2',
  },
  // Add more mock tickets if needed, aligning with new Ticket type
];

export const initialMockSnippets: Snippet[] = [
  { id: 1, ticket_id: 1, snippet_name: 'Password Reset Instructions', snippet_text: 'To reset your password, please visit [link] and follow the on-screen instructions. If you continue to experience issues, please let us know.', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), created_by: 'auth-uuid-it1' },
  { id: 2, ticket_id: 1, snippet_name: 'Software Reinstall Guide', snippet_text: 'We recommend trying to reinstall the software. Please follow these steps: 1. Uninstall the current version. 2. Restart your computer. 3. Download the latest version from [link]. 4. Install the software. Let us know if this resolves the issue.', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), created_by: 'auth-uuid-it1' },
];

export const mockEquipment: Equipment[] = [
    { id: 1, item_name: 'Dell XPS 15', type: 'Laptop', serial_number: 'DXPS15-001', assigned_to: 'auth-uuid-user1', acquired_at: new Date('2023-01-15').toISOString(), status: 'Operational', created_at: new Date('2023-01-15').toISOString(), updated_at: new Date('2023-01-15').toISOString() },
    { id: 2, item_name: 'HP LaserJet Pro M404dn', type: 'Printer', serial_number: 'HPLJP-002', acquired_at: new Date('2022-06-20').toISOString(), status: 'Operational', created_at: new Date('2022-06-20').toISOString(), updated_at: new Date('2022-06-20').toISOString() },
    { id: 3, item_name: 'Cisco Catalyst 2960', type: 'Switch', serial_number: 'CISCO-003', acquired_at: new Date('2021-11-05').toISOString(), status: 'Maintenance', created_at: new Date('2021-11-05').toISOString(), updated_at: new Date('2021-11-05').toISOString(), business_unit: "Corporate" },
];

// Reports are dynamic, mock data might not be as relevant post-Supabase.
export const mockReports: Report[] = [
    { id: 'REP001', title: 'Monthly Ticket Resolution Times', generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), data: { averageResolutionTime: '4.5 hours', totalTicketsClosed: 150 } },
];


// --- LocalStorage interaction functions (TO BE REPLACED with Supabase calls) ---
// For now, these will be commented out or modified to be no-ops,
// as we will fetch directly from Supabase.

export const getStoredTickets = (): Ticket[] => {
  console.warn("getStoredTickets is deprecated. Fetch from Supabase instead.");
  return []; // Return empty or mock if absolutely needed during transition
};

export const storeSubmittedTickets = (ticketsToStore: Ticket[]): void => {
  console.warn("storeSubmittedTickets is deprecated. Save to Supabase instead.");
};

export const getAllTickets = (): Ticket[] => {
  console.warn("getAllTickets is deprecated. Fetch from Supabase instead.");
  // Fallback to mock data for now, but this should be replaced by a Supabase call.
  // This function will likely be removed or its internals replaced entirely.
  return mockTickets.map(t => ({
    ...t,
    // Ensure mock tickets have comments array for type consistency, even if empty
    // This is tricky because the full Ticket type expects comments, but mockTickets here is Omit<Ticket, 'comments'>
    // For now, let's cast, but this highlights the need for Supabase to be the source of truth.
    comments: [],
  } as Ticket));
};

const NOTES_STORAGE_KEY = 'helpdeskLiteNotes';
const BOOKMARKS_STORAGE_KEY = 'helpdeskLiteBookmarks';
const DOCUMENTS_STORAGE_KEY = 'helpdeskLiteDocuments'; // This might relate to file uploads.
const SNIPPETS_STORAGE_KEY = 'helpdeskLiteSnippets';

// For Notes, Bookmarks, Snippets - we'll keep localStorage for now unless specified to move them too.
// Update their types to use numeric IDs if their Supabase tables use bigint.

export const getStoredNotes = (): Note[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(NOTES_STORAGE_KEY);
  try {
    return stored ? JSON.parse(stored).map((n: any) => ({...n, id: Number(n.id)})) : [];
  } catch (e) { return []; }
};

export const storeNotes = (notes: Note[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
};

export const getStoredBookmarks = (): Bookmark[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
  try {
    return stored ? JSON.parse(stored).map((b: any) => ({...b, id: Number(b.id)})) : [];
  } catch (e) { return []; }
};

export const storeBookmarks = (bookmarks: Bookmark[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
};

export const getStoredDocuments = (): Document[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const storeDocuments = (documents: Document[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
};


export const getStoredSnippets = (): Snippet[] => {
  if (typeof window === 'undefined') return initialMockSnippets.map(s => ({...s, id: Number(s.id)}));
  const stored = localStorage.getItem(SNIPPETS_STORAGE_KEY);
  if (stored) {
    try {
        const parsedSnippets: Snippet[] = JSON.parse(stored);
        return parsedSnippets.map((s: any) => ({
            ...s,
            id: Number(s.id || Date.now()), // Ensure ID is a number
            created_at: s.created_at || new Date(0).toISOString(),
            updated_at: s.updated_at || new Date(0).toISOString()
        }));
    } catch(e) {
        console.error("Error parsing snippets from localStorage:", e);
        return initialMockSnippets.map(s => ({
             ...s,
            id: Number(s.id),
            created_at: s.created_at || new Date(0).toISOString(),
            updated_at: s.updated_at || new Date(0).toISOString()
        }));
    }
  }
  const snippetsToStore = initialMockSnippets.map(s => ({
       ...s,
      id: Number(s.id),
      created_at: s.created_at || new Date(0).toISOString(),
      updated_at: s.updated_at || new Date(0).toISOString()
  }));
  storeSnippets(snippetsToStore); // Store initial mocks if nothing found
  return snippetsToStore;
};

export const storeSnippets = (snippets: Snippet[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SNIPPETS_STORAGE_KEY, JSON.stringify(snippets));
};

    