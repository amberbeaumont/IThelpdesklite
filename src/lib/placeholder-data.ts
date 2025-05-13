import type { Ticket, User, Snippet, ProblemType, Urgency, TicketStatus, Equipment, Report } from './types';

export const mockUsers: User[] = [
  { id: 'user1', name: 'Alice Wonderland', email: 'alice@example.com', role: 'User' },
  { id: 'user2', name: 'Bob The Builder', email: 'bob@example.com', role: 'User' },
  { id: 'it1', name: 'Charlie Root', email: 'charlie@support.com', role: 'IT_Support' },
  { id: 'it2', name: 'Diana Prince', email: 'diana@support.com', role: 'IT_Support' },
];

export const problemTypes: ProblemType[] = ["Hardware", "Software", "Network", "Account", "Other"];
export const urgencies: Urgency[] = ["Low", "Medium", "High", "Critical"];
export const ticketStatuses: TicketStatus[] = ["Open", "In Progress", "Waiting on User", "Closed"];

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
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    comments: [
      { id: 'c1', userId: 'it1', userName: 'Charlie Root', comment: 'Looking into this now.', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
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
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    comments: [
      { id: 'c2', userId: 'it2', userName: 'Diana Prince', comment: 'Scheduled a technician visit for tomorrow morning.', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) }
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
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    comments: [
      { id: 'c3', userId: 'it1', userName: 'Charlie Root', comment: 'Could you please run a speed test next time this happens and share the results?', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
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
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    comments: [
      { id: 'c4_1', userId: 'it2', userName: 'Diana Prince', comment: 'Password reset initiated. Please check your email.', createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000) },
      { id: 'c4_2', userId: 'user2', userName: 'Bob The Builder', comment: 'Got it, thanks! I can log in now.', createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000) }
    ],
  },
];

export const mockSnippets: Snippet[] = [
  { id: 'snip1', title: 'Password Reset Instructions', content: 'To reset your password, please visit [link] and follow the on-screen instructions. If you continue to experience issues, please let us know.' },
  { id: 'snip2', title: 'Software Reinstall Guide', content: 'We recommend trying to reinstall the software. Please follow these steps: 1. Uninstall the current version. 2. Restart your computer. 3. Download the latest version from [link]. 4. Install the software. Let us know if this resolves the issue.' },
  { id: 'snip3', title: 'Network Troubleshooting Steps', content: 'Please try the following network troubleshooting steps: 1. Restart your modem and router. 2. Check your network cable connections. 3. Try connecting to a different network if possible to isolate the issue. If the problem persists, provide us with details about your network setup.' },
];

export const mockEquipment: Equipment[] = [
    { id: 'EQP001', name: 'Dell XPS 15', type: 'Laptop', serialNumber: 'DXPS15-001', assignedTo: 'user1', purchaseDate: new Date('2023-01-15'), status: 'Operational' },
    { id: 'EQP002', name: 'HP LaserJet Pro M404dn', type: 'Printer', serialNumber: 'HPLJP-002', purchaseDate: new Date('2022-06-20'), status: 'Operational' },
    { id: 'EQP003', name: 'Cisco Catalyst 2960', type: 'Switch', serialNumber: 'CISCO-003', purchaseDate: new Date('2021-11-05'), status: 'Maintenance' },
];

export const mockReports: Report[] = [
    { id: 'REP001', title: 'Monthly Ticket Resolution Times', generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), data: { averageResolutionTime: '4.5 hours', totalTicketsClosed: 150 } },
    { id: 'REP002', title: 'Hardware Failure Rates Q1', generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), data: { laptops: '2%', desktops: '1%', printers: '5%' } },
];
