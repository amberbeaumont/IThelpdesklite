
import type { Ticket, User, Snippet, ProblemType, Urgency, TicketStatus, Equipment, Report, Note, Bookmark, Document } from './types';

export const mockUsers: User[] = [
  { id: 'user1', name: 'Alice Wonderland', email: 'alice@example.com', role: 'User' },
  { id: 'user2', name: 'Bob The Builder', email: 'bob@example.com', role: 'User' },
  { id: 'it1', name: 'Charlie Root', email: 'charlie@support.com', role: 'IT_Support' },
  { id: 'it2', name: 'Diana Prince', email: 'diana@support.com', role: 'IT_Support' },
];

export const problemTypes: ProblemType[] = ["Hardware", "Software", "Network", "Account", "Other"];
export const urgencies: Urgency[] = ["Low", "Medium", "High", "Critical"];
export const ticketStatuses: TicketStatus[] = ["Open", "In Progress", "Waiting on User", "Closed"];

// Note: Dates are now stored as ISO strings for easier localStorage handling.
// They should be converted back to Date objects when read for display/logic.
export const mockTickets: Ticket[] = [
  {
    id: 'TKT001',
    requesterName: 'Alice Wonderland',
    requesterEmail: 'alice@example.com',
    problemType: 'Software',
    urgency: 'High',
    subject: 'Application keeps crashing on startup',
    message: 'My main work application crashes every time I try to open it. I have tried restarting my computer but the issue persists. This is blocking my work.',
    attachmentUrl: undefined,
    status: 'Open',
    assignedTo: 'it1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      { id: 'c1', userId: 'it1', userName: 'Charlie Root', comment: 'Looking into this now.', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
    ],
  },
  {
    id: 'TKT002',
    requesterName: 'Bob The Builder',
    requesterEmail: 'bob@example.com',
    problemType: 'Hardware',
    urgency: 'Medium',
    subject: 'Printer not working',
    message: 'The office printer on the 2nd floor is not responding. It shows an error "Paper Jam" but there is no visible paper jam.',
    attachmentUrl: 'https://picsum.photos/seed/printererror/200/300',
    status: 'In Progress',
    assignedTo: 'it2',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    comments: [
      { id: 'c2', userId: 'it2', userName: 'Diana Prince', comment: 'Scheduled a technician visit for tomorrow morning.', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
    ],
  },
  {
    id: 'TKT003',
    requesterName: 'Alice Wonderland',
    requesterEmail: 'alice@example.com',
    problemType: 'Network',
    urgency: 'Low',
    subject: 'Slow internet connection in the afternoon',
    message: 'The internet seems to be very slow every day after 2 PM. It makes video calls difficult.',
    status: 'Waiting on User',
    assignedTo: 'it1',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      { id: 'c3', userId: 'it1', userName: 'Charlie Root', comment: 'Could you please run a speed test next time this happens and share the results?', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
    ],
  },
  {
    id: 'TKT004',
    requesterName: 'Bob The Builder',
    requesterEmail: 'bob@example.com',
    problemType: 'Account',
    urgency: 'Critical',
    subject: 'Cannot log in to system - Urgent deadline',
    message: 'I am locked out of my account and I have an urgent deadline today. Please help ASAP!',
    status: 'Closed',
    assignedTo: 'it2',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    comments: [
      { id: 'c4_1', userId: 'it2', userName: 'Diana Prince', comment: 'Password reset initiated. Please check your email.', createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString() },
      { id: 'c4_2', userId: 'user2', userName: 'Bob The Builder', comment: 'Got it, thanks! I can log in now.', createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() }
    ],
  },
];

export const initialMockSnippets: Snippet[] = [ // Renamed to avoid conflict if localStorage is empty
  { id: 'snip1', title: 'Password Reset Instructions', content: 'To reset your password, please visit [link] and follow the on-screen instructions. If you continue to experience issues, please let us know.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'snip2', title: 'Software Reinstall Guide', content: 'We recommend trying to reinstall the software. Please follow these steps: 1. Uninstall the current version. 2. Restart your computer. 3. Download the latest version from [link]. 4. Install the software. Let us know if this resolves the issue.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'snip3', title: 'Network Troubleshooting Steps', content: 'Please try the following network troubleshooting steps: 1. Restart your modem and router. 2. Check your network cable connections. 3. Try connecting to a different network if possible to isolate the issue. If the problem persists, provide us with details about your network setup.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const mockEquipment: Equipment[] = [
    { id: 'EQP001', name: 'Dell XPS 15', type: 'Laptop', serialNumber: 'DXPS15-001', assignedTo: 'user1', purchaseDate: new Date('2023-01-15').toISOString(), status: 'Operational' },
    { id: 'EQP002', name: 'HP LaserJet Pro M404dn', type: 'Printer', serialNumber: 'HPLJP-002', purchaseDate: new Date('2022-06-20').toISOString(), status: 'Operational' },
    { id: 'EQP003', name: 'Cisco Catalyst 2960', type: 'Switch', serialNumber: 'CISCO-003', purchaseDate: new Date('2021-11-05').toISOString(), status: 'Maintenance' },
];

export const mockReports: Report[] = [
    { id: 'REP001', title: 'Monthly Ticket Resolution Times', generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), data: { averageResolutionTime: '4.5 hours', totalTicketsClosed: 150 } },
    { id: 'REP002', title: 'Hardware Failure Rates Q1', generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), data: { laptops: '2%', desktops: '1%', printers: '5%' } },
];

// Helper to parse stored tickets from localStorage
export const getStoredTickets = (): Ticket[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('submittedTickets');
  if (stored) {
    try {
      return JSON.parse(stored).map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
        comments: Array.isArray(t.comments) ? t.comments.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        })) : [],
      }));
    } catch (e) {
      console.error("Error parsing stored tickets:", e);
      return [];
    }
  }
  return [];
};

// Helper to combine mock tickets and stored tickets
export const getAllTickets = (): Ticket[] => {
  const storedTickets = getStoredTickets();
  const allMockTickets = mockTickets.map(t => ({
    ...t,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
    comments: t.comments.map(c => ({...c, createdAt: new Date(c.createdAt)})),
  }));
  
  const combinedTickets = [...storedTickets];
  allMockTickets.forEach(mockTicket => {
    if (!storedTickets.find(st => st.id === mockTicket.id)) {
      combinedTickets.push(mockTicket);
    }
  });
  return combinedTickets.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

// --- Notes & Docs localStorage Helpers ---

const NOTES_STORAGE_KEY = 'helpdeskLiteNotes';
const BOOKMARKS_STORAGE_KEY = 'helpdeskLiteBookmarks';
const DOCUMENTS_STORAGE_KEY = 'helpdeskLiteDocuments';
const SNIPPETS_STORAGE_KEY = 'helpdeskLiteSnippets';


// Notes
export const getStoredNotes = (): Note[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(NOTES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const storeNotes = (notes: Note[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
};

// Bookmarks
export const getStoredBookmarks = (): Bookmark[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const storeBookmarks = (bookmarks: Bookmark[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
};

// Documents
export const getStoredDocuments = (): Document[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const storeDocuments = (documents: Document[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
};

// Snippets
export const getStoredSnippets = (): Snippet[] => {
  if (typeof window === 'undefined') return initialMockSnippets; // Return default if no window
  const stored = localStorage.getItem(SNIPPETS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // If nothing in localStorage, initialize with mock snippets and store them
  storeSnippets(initialMockSnippets);
  return initialMockSnippets;
};

export const storeSnippets = (snippets: Snippet[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SNIPPETS_STORAGE_KEY, JSON.stringify(snippets));
};
