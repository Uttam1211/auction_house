import {
  Users,
  Gavel,
  LayoutDashboard,
  Package,
  History,
  Settings,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

// Menu items.
const items = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    color: "text-sky-500",
  },
  {
    label: "Users",
    icon: Users,
    href: "/admin/users",
    color: "text-violet-500",
  },
  {
    label: "Auctions",
    icon: Gavel,
    href: "/admin/auctions",
    color: "text-pink-700",
  },
  {
    label: "Items",
    icon: Package,
    href: "/admin/items",
    color: "text-orange-700",
  },
  {
    label: "Transactions",
    icon: History,
    href: "/admin/transactions",
    color: "text-emerald-500",
  },
  {
    label: "Approvals",
    icon: CheckCircle,
    href: "/admin/approvals",
    color: "text-blue-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
    color: "text-gray-500",
  },
];

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <Sidebar variant="sidebar" side="left" collapsible="icon">
        <SidebarHeader>
          <Link href="/admin">
            <Image
              className="my-3 mx-6"
              src="/brand_logo.jpg"
              width={200}
              height={200}
              alt="logo"
            />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin Panel </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-all",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        <item.icon className={cn("h-25 w-25", item.color)} />
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
