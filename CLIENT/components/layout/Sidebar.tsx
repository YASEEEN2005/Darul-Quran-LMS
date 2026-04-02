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
  GraduationCap
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isAdmin = user?.role === "ADMIN";

  const studentLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Courses", href: "/classes", icon: BookOpen },
    { name: "Exams & Quiz", href: "/exams", icon: FileEdit },
    { name: "Live Hall", href: "/live", icon: Video },
    { name: "My Progress", href: "/progress", icon: CheckSquare },
  ];

  const adminLinks = [
    { name: "Admin Home", href: "/admin", icon: ShieldAlert },
    { name: "Student Roster", href: "/admin/users", icon: Users },
    { name: "Performance Track", href: "/admin/progress", icon: CheckSquare },
    { name: "Curriculum", href: "/admin/courses", icon: BookOpen },
    { name: "Content Manager", href: "/admin/lessons", icon: MonitorPlay },
    { name: "Exam Manager", href: "/admin/exams", icon: CheckSquare },
    { name: "Schedule Meetings", href: "/admin/meetings", icon: CalendarDays },
  ];

  const links = isAdmin ? [...studentLinks, ...adminLinks] : studentLinks;

  return (
    <div className={cn("bg-[#011c18] flex flex-col h-screen text-emerald-100/60 font-medium border-r border-emerald-900/30 shadow-2xl relative z-30", className)}>
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-px h-full bg-linear-to-b from-transparent via-emerald-500/20 to-transparent"></div>
      
      {/* Brand Header */}
      <div className="h-20 flex items-center px-8 mb-4 shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <GraduationCap className="text-white w-6 h-6" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
                <span className="text-white font-black tracking-tight text-lg leading-tight uppercase">Darul-Quran</span>
                <span className="text-emerald-500/60 text-[10px] uppercase tracking-[0.2em] font-bold">Institute LMS</span>
            </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-1.5 custom-scrollbar">
        {links.map((link, index) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          const isFirstAdminLink = isAdmin && index === studentLinks.length;

          return (
            <div key={`${link.name}-${index}`}>
              {isFirstAdminLink && (
                <div className="my-6 px-4 flex items-center gap-2">
                  <div className="h-px flex-1 bg-emerald-900/50"></div>
                  <span className="text-[10px] font-black text-emerald-500/40 uppercase tracking-[0.2em]">Administration</span>
                  <div className="h-px flex-1 bg-emerald-900/50"></div>
                </div>
              )}
              <Link
                href={link.href}
                className={cn(
                  "group flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all duration-300 relative overflow-hidden",
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
                    : "hover:bg-white/5 hover:text-emerald-100"
                )}
              >
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                )}
                <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-emerald-400" : "text-emerald-100/30 group-hover:text-emerald-400")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[14px] tracking-tight">{link.name}</span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Footer / User Profile Toggle Placeholder */}
      <div className="p-5 mt-auto bg-emerald-950/20 border-t border-emerald-900/30">
        <Link href="/settings" className="flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all duration-300 hover:bg-white/5 group">
          <Settings className="w-5 h-5 text-emerald-100/30 group-hover:text-emerald-400 group-hover:rotate-45 transition-all" strokeWidth={2} />
          <span className="text-[14px] tracking-tight text-emerald-100/60 group-hover:text-emerald-100">Settings & Profile</span>
        </Link>
      </div>
    </div>
  );
}
