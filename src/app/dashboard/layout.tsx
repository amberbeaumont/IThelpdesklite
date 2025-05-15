import { SidebarProvider, Sidebar, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav"; // Added import

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border shadow-md">
        <SidebarNav /> {/* Added SidebarNav component back */}
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
