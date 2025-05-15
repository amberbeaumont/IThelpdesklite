import { SidebarProvider, Sidebar, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
// import { SidebarNav } from "@/components/dashboard/sidebar-nav"; // Removed import

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border shadow-md">
        {/* <SidebarNav /> */} {/* Removed SidebarNav component */}
        {/* You might want to add alternative sidebar content or structure here */}
      </Sidebar>
      <SidebarRail />
      <SidebarInset className="bg-background">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
