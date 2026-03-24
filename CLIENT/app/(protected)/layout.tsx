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
      <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden">
        {/* Isolated Full-Height Dark Premium Sidebar */}
        <Sidebar className="hidden md:flex w-64 lg:w-[280px] flex-shrink-0 z-20" />
        
        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col h-screen relative z-10">
          <Navbar />
          
          <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full custom-scrollbar pb-24">
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
