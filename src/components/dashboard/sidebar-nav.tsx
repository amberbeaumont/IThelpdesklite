
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  HardDrive,
  BarChartBig,
  LogOut,
  LifeBuoy,
  NotebookText,
  ClipboardEdit, // Added icon for Snippets
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/tickets", label: "Tickets", icon: ClipboardList },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/equipment", label: "IT Equipment", icon: HardDrive },
  { href: "/dashboard/reports", label: "Reports", icon: BarChartBig },
  { href: "/dashboard/notes-docs", label: "Notes & Docs", icon: NotebookText },
  { href: "/dashboard/snippets", label: "Snippets", icon: ClipboardEdit }, // New item for Snippets
];

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    // Simulate logout
    await new Promise(resolve => setTimeout(resolve, 500));
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push("/login");
  };

  return (
    <>
      <SidebarHeader className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
            <LifeBuoy className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">Lofty IT Support</h1>
        </div>
      </SidebarHeader>
      
      <SidebarMenu className="flex-1 p-2">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                tooltip={{ children: item.label, className:"bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border" }}
                className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
              >
                <item.icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarSeparator />

      <SidebarFooter className="p-3 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 p-2 h-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </Button>
        <div className="flex items-center gap-3 pt-2 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-9 w-9 border-2 border-sidebar-accent">
                <AvatarImage src="https://picsum.photos/seed/itstaff/100/100" alt="IT Staff" data-ai-hint="profile person" />
                <AvatarFallback>IT</AvatarFallback>
            </Avatar>
            <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium text-sidebar-foreground">IT Staff</p>
                <p className="text-xs text-sidebar-foreground/70">it@example.com</p>
            </div>
        </div>
      </SidebarFooter>
    </>
  );
}
