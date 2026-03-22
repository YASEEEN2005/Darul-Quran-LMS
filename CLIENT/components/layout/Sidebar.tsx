"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlaySquare,
  FileEdit,
  Video,
  Settings,
  ShieldAlert,
  Users,
  BookOpen,
  MonitorPlay,
  CalendarDays,
  CheckSquare
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isAdmin = user?.role === "ADMIN";

  const studentLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Classes", href: "/classes", icon: PlaySquare },
    { name: "Exams", href: "/exams", icon: FileEdit },
    { name: "Live Sessions", href: "/live", icon: Video },
  ];

  const adminLinks = [
    { name: "Overview", href: "/admin", icon: ShieldAlert },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Lessons", href: "/admin/lessons", icon: MonitorPlay },
    { name: "Exams", href: "/admin/exams", icon: CheckSquare },
    { name: "Meetings", href: "/admin/meetings", icon: CalendarDays },
  ];

  const links = isAdmin ? [...studentLinks, ...adminLinks] : studentLinks;

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium space-y-1">
            {links.map((link, index) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              
              // Add a subtle divider before admin links
              const isFirstAdminLink = isAdmin && index === studentLinks.length;

              return (
                <div key={link.href}>
                  {isFirstAdminLink && (
                    <div className="my-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Admin Panel
                    </div>
                  )}
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 text-muted-foreground hover:text-primary hover:bg-muted hover:scale-[1.02]",
                      isActive && "bg-primary/10 text-primary font-bold hover:bg-primary/15 shadow-sm"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
