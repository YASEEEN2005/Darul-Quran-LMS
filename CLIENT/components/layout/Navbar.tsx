"use client";

import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { LogOut, Search, Bell, Menu, X, LayoutDashboard, PlaySquare, FileEdit, Video, CheckSquare, ShieldAlert, Users, BookOpen, MonitorPlay, CalendarDays, Layers } from "lucide-react";
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

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <header className="flex h-24 items-center justify-between md:justify-end px-6 md:px-10 bg-[#f8fafc] w-full z-10 shrink-0">
        
        {/* Mobile Hamburger + Title */}
        <div className="flex md:hidden items-center gap-4">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 bg-white rounded-[1rem] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 text-[#184e55] hover:bg-gray-50 transition-colors">
            <Menu className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-bold text-[#111827] tracking-tight">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
           {/* Search Bar */}
           <div className="relative hidden lg:flex items-center group">
             <Search className="absolute left-4 w-4 h-4 text-gray-400 group-focus-within:text-[#184e55] transition-colors" />
             <input type="text" placeholder="Search" className="pl-11 pr-5 py-2.5 bg-white/70 border border-gray-200/60 rounded-full text-[15px] text-gray-700 outline-none focus:bg-white focus:ring-4 focus:ring-[#184e55]/10 focus:border-[#184e55]/30 w-[280px] transition-all shadow-sm placeholder:text-gray-400 font-medium" />
           </div>
           
           {/* Notification Bell */}
           <button className="relative w-11 h-11 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-[#184e55] hover:bg-gray-50 transition-all shadow-sm hidden sm:flex">
             <Bell className="w-5 h-5" strokeWidth={2} />
             <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
           </button>
           
           {/* User Controls */}
           <div className="flex items-center gap-3">
              {isAuthenticated && user && (
                <div className="hidden md:flex flex-col items-end mr-1">
                  <span className="text-[14px] font-bold text-gray-800 tracking-tight leading-none mb-1">{user?.name?.split(' ')[0]}</span>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{user.role}</span>
                </div>
              )}
              
              <div className="w-11 h-11 rounded-full bg-gray-100 border-2 border-white shadow-sm flex-shrink-0 cursor-pointer overflow-hidden">
                 <img src={`https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=184e55&color=fff&bold=true`} alt="Avatar" className="w-full h-full object-cover" />
              </div>

              {isAuthenticated && (
                <div className="w-9 h-9 ml-1 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm cursor-pointer" onClick={handleLogout} title="Logout">
                  <LogOut className="h-4 w-4 ml-0.5" strokeWidth={2.5} />
                </div>
              )}
           </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0d1424]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-8 right-8 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex-1 w-full max-w-sm flex flex-col justify-center space-y-2 overflow-y-auto pb-10">
             <div className="mb-10 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-[1rem] bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-4">
                  <Layers className="text-white w-7 h-7" fill="currentColor" strokeWidth={1} />
                </div>
                <h2 className="text-white text-2xl font-bold tracking-tight">Darul Quran LMS</h2>
             </div>

             {links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 rounded-[1.25rem] px-6 py-4 transition-all duration-300 hover:bg-white/5",
                      isActive ? "bg-[#184e55] text-white shadow-lg shadow-[#184e55]/20 font-bold" : "text-gray-400"
                    )}
                  >
                     <Icon className={cn("w-6 h-6", isActive ? "text-emerald-300" : "text-gray-500")} strokeWidth={1.5} />
                     <span className="text-[17px] tracking-wide">{link.name}</span>
                  </Link>
                );
             })}

             <div className="mt-8 border-t border-white/10 pt-8 w-full">
               <button onClick={handleLogout} className="flex w-full items-center gap-4 rounded-[1.25rem] px-6 py-4 transition-all duration-300 text-rose-400 hover:bg-white/5 font-semibold">
                 <LogOut className="w-6 h-6" strokeWidth={2} />
                 <span className="text-[17px] tracking-wide mt-0.5">Secure Logout</span>
               </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
