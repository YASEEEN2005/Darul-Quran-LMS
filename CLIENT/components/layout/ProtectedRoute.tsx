"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requireAdmin && user?.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router, requireAdmin, pathname, isClient]);

  if (!isClient || !isAuthenticated || (requireAdmin && user?.role !== "ADMIN")) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
}
