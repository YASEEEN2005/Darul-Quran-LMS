"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span>Darul <span className="text-primary">Quran</span></span>
      </Link>
      
      <div className="ml-auto flex items-center gap-4">
        {isAuthenticated && user && (
          <>
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-sm font-medium leading-none">{user.name}</span>
              <span className="text-xs text-muted-foreground mt-1">{user.role}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
