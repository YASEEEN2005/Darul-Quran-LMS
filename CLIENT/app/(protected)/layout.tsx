"use client";

import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

import { motion } from "framer-motion";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/20">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto h-[calc(100vh-4rem)]">
            <motion.div 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4, ease: "easeOut" }}
            >
               {children}
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
