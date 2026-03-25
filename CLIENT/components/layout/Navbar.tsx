"use client";

import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Search, 
  Bell, 
  Menu, 
  X, 
  LayoutDashboard, 
  PlaySquare, 
  FileEdit, 
  Video, 
  CheckSquare, 
  ShieldAlert, 
  Users, 
  BookOpen, 
  MonitorPlay, 
  CalendarDays, 
  GraduationCap,
  ChevronDown
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const studentLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Courses", href: "/classes", icon: BookOpen },
    { name: "Video Gallery", href: "/classes", icon: PlaySquare },
    { name: "Exams & Quiz", href: "/exams", icon: FileEdit },
    { name: "Live Hall", href: "/live", icon: Video },
    { name: "My Progress", href: "/progress", icon: CheckSquare },
  ];

  const adminLinks = [
    { name: "Admin Home", href: "/admin", icon: ShieldAlert },
    { name: "Student Roster", href: "/admin/users", icon: Users },
    { name: "Curriculum", href: "/admin/courses", icon: BookOpen },
    { name: "Content Manager", href: "/admin/lessons", icon: MonitorPlay },
    { name: "Exam Manager", href: "/admin/exams", icon: CheckSquare },
    { name: "Schedule Meetings", href: "/admin/meetings", icon: CalendarDays },
  ];

  const links = isAdmin ? [...studentLinks, ...adminLinks] : studentLinks;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const currentPathName = links.find(l => pathname.startsWith(l.href))?.name || "LMS Platform";

  return (
    <>
      <header className="flex h-20 items-center justify-between px-6 md:px-10 bg-white border-b border-gray-100 w-full z-40 shrink-0 sticky top-0 transition-all duration-300">
        
        {/* Mobile Hamburger + Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="md:hidden p-2.5 bg-emerald-50 rounded-xl text-emerald-600 hover:bg-emerald-100 transition-all active:scale-95"
          >
            <Menu className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{currentPathName}</h1>
            <div className="flex items-center gap-1.5 md:hidden">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                 <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Darul-Quran</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-7">
           {/* Modern Search Field */}
           <div className="relative hidden md:flex items-center group">
             <Search className="absolute left-4 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
             <input 
                type="text" 
                placeholder="Search modules..." 
                className="pl-11 pr-5 py-2.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-[14px] text-gray-700 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 w-[240px] lg:w-[320px] transition-all shadow-inner placeholder:text-gray-400 font-medium" 
             />
             <div className="absolute right-3 hidden lg:flex items-center gap-1 border border-gray-200 px-1.5 py-0.5 rounded-md bg-white shadow-sm">
                <span className="text-[10px] font-bold text-gray-400">⌘</span>
                <span className="text-[10px] font-bold text-gray-400">K</span>
             </div>
           </div>
           
           {/* Premium Notifications */}
           <button className="relative w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-all group hidden sm:flex active:scale-95">
             <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" strokeWidth={2} />
             <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
           </button>
           
           {/* Premium User Trigger */}
           <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-gray-100 group cursor-pointer">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[14px] font-black text-gray-900 tracking-tight leading-none mb-1">{user?.name}</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.15em]">{user?.role}</span>
                </div>
                
                <div className="relative">
                    <div className="w-11 h-11 rounded-1.5rem rounded-xl bg-emerald-500 border-2 border-white shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=10b981&color=fff&bold=true`} 
                            alt="Avatar" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>

                <div className="w-9 h-9 ml-1 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all cursor-pointer active:scale-90 shadow-sm" onClick={handleLogout} title="Logout">
                  <LogOut className="h-4 w-4 ml-0.5" strokeWidth={2.5} />
                </div>
           </div>
        </div>
      </header>

      {/* Modern Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#011c18]/98 backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 z-0 opacity-10">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500 rounded-full blur-[100px]"></div>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="absolute top-8 right-8 p-3 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-all active:scale-90 border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative z-10 w-full max-w-sm flex flex-col justify-center space-y-2 pb-10">
             <div className="mb-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-5">
                  <GraduationCap className="text-white w-8 h-8" strokeWidth={2} />
                </div>
                <h2 className="text-white text-3xl font-black tracking-tighter uppercase mb-1">Darul-Quran</h2>
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">Institute LMS</span>
             </div>

             <div className="space-y-2 h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {links.map((link, idx) => {
                    const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                    const Icon = link.icon;
                    return (
                        <Link
                            key={`${link.href}-${idx}`}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center gap-4 rounded-[1.25rem] px-7 py-4.5 transition-all duration-300 border",
                                isActive 
                                    ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 font-black border-emerald-500" 
                                    : "text-emerald-100/40 border-transparent hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className={cn("w-6 h-6", isActive ? "text-white" : "text-emerald-500/30")} strokeWidth={2.5} />
                            <span className="text-[18px] tracking-tight">{link.name}</span>
                        </Link>
                    );
                })}
             </div>

             <div className="mt-8 pt-8 border-t border-white/10 w-full">
               <button onClick={handleLogout} className="flex w-full items-center gap-4 rounded-[1.25rem] px-7 py-5 transition-all duration-300 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white group border border-rose-500/20 active:scale-95 shadow-lg">
                 <LogOut className="w-6 h-6 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
                 <span className="text-[18px] font-black tracking-tight">System Logout</span>
               </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
