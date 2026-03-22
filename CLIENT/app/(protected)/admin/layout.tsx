"use client";

import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAdmin={true}>
      {children}
    </ProtectedRoute>
  );
}
