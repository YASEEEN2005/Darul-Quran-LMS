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
  CheckSquare,
  Layers
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isAdmin = user?.role === "ADMIN";

  const studentLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Video Classes", href: "/classes", icon: PlaySquare },
    { name: "Exams", href: "/exams", icon: FileEdit },
    { name: "Live Classes", href: "/live", icon: Video },
    { name: "Progress", href: "/progress", icon: CheckSquare },
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
    <div className={cn("bg-[#0d1424] flex flex-col h-screen text-gray-400 font-medium border-r border-[#1a2335] shadow-2xl", className)}>
      {/* Brand Header */}
      <div className="h-28 flex items-center px-8 mb-4">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Layers className="text-white w-6 h-6" fill="currentColor" strokeWidth={1} />
        </div>
      </div>

      {/* Primary Links */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-2 layout-scrollbar">
        {links.map((link, index) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          const isFirstAdminLink = isAdmin && index === studentLinks.length;

          return (
            <div key={link.href}>
              {isFirstAdminLink && (
                <div className="my-6 px-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                  Admin Panel
                </div>
              )}
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-4 rounded-2xl px-5 py-3.5 transition-all duration-300 hover:text-white hover:bg-white/5",
                  isActive && "bg-[#184e55] text-white shadow-xl shadow-[#184e55]/30 font-semibold"
                )}
              >
                <Icon className={cn("w-[22px] h-[22px]", isActive ? "text-emerald-300" : "text-gray-500")} strokeWidth={1.5} />
                <span className="text-[15px] tracking-wide">{link.name}</span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Settings Bottom Footer */}
      <div className="p-5 mt-auto border-t border-[#1a2335]">
        <Link href="/settings" className="flex items-center gap-4 rounded-2xl px-5 py-3.5 transition-all duration-300 hover:text-white hover:bg-white/5 mb-2">
          <Settings className="w-[22px] h-[22px] text-gray-500" strokeWidth={1.5} />
          <span className="text-[15px] tracking-wide">Settings</span>
        </Link>
      </div>
    </div>
  );
}
