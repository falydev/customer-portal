"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  FolderKanban
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: <FolderKanban className="h-5 w-5" />,
      label: "Projects",
      href: "/projects",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Customers",
      href: "/customers",
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Orders",
      href: "/orders",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Invoices",
      href: "/invoices",
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: "Notifications",
      href: "/notifications",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <aside
      className={cn(
        "bg-white dark:bg-zinc-900 h-full border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-16 items-center border-b border-zinc-200 dark:border-zinc-800 px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary" />
          {isOpen && <span className="font-semibold">Customer Portal</span>}
        </div>
      </div>
      <div className="py-4">
        <nav className="space-y-1 px-2">
          {routes.map((route) => (
            <SidebarItem
              key={route.href}
              icon={route.icon}
              label={route.label}
              href={route.href}
              isActive={pathname === route.href}
            />
          ))}
        </nav>
      </div>
      <div className="absolute bottom-4 px-2 w-full">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50",
            isOpen ? "px-3" : "px-0"
          )}
          size="sm"
        >
          <LogOut className="h-5 w-5" />
          {isOpen && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, href, isActive }: SidebarItemProps) {
  return (
    <Link href={href} passHref>
      <div
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md",
          isActive
            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800"
        )}
      >
        {icon}
        <span className="ml-3">{label}</span>
        {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
      </div>
    </Link>
  );
}
