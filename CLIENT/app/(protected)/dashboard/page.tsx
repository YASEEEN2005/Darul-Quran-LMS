"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/store/progressStore";
import { useAuthStore } from "@/store/authStore";
import { PlaySquare, FileEdit, Video, Target, PieChart, BookOpen, Calendar, Users, Lock, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { progress, fetchProgress, isLoading } = useProgressStore();

  useEffect(() => {
    if (user?.id) {
      fetchProgress(user.id);
    }
  }, [user, fetchProgress]);

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Dashboard</h1>
      </div>

      {/* Top Welcome Banner */}
      <div className="bg-[#184e55] text-white rounded-[2rem] p-8 md:p-10 flex flex-col lg:flex-row justify-between items-center shadow-xl shadow-[#184e55]/20 relative overflow-hidden">
        <div className="z-10 w-full lg:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-white/70 text-sm md:text-base max-w-md leading-relaxed">
            Ultra-modern interface inspired by Stripe, Linear, and Notion. Track your progress below.
          </p>
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-10 mt-8 lg:mt-0 z-10 bg-white/5 p-5 md:p-6 rounded-3xl backdrop-blur-md border border-white/10">
          <div className="flex flex-col items-center justify-center px-2">
            <span className="text-3xl font-bold mb-1">{progress?.completionPercentage || 0}%</span>
            <span className="text-white/60 text-xs uppercase tracking-wider font-semibold">Completed</span>
          </div>
          <div className="hidden md:block w-px h-14 bg-white/10 self-center"></div>
          <div className="flex flex-col items-center justify-center px-2">
            <span className="text-3xl font-bold mb-1">{progress?.completedLessons || 0}</span>
            <span className="text-white/60 text-xs uppercase tracking-wider font-semibold">Lessons</span>
          </div>
          <div className="hidden md:block w-px h-14 bg-white/10 self-center"></div>
          <div className="flex flex-col items-center justify-center px-2">
            <span className="text-3xl font-bold mb-1">10+</span>
            <span className="text-white/60 text-xs uppercase tracking-wider font-semibold">Stats</span>
          </div>
        </div>

        {/* Abstract Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-20 w-[300px] h-[300px] bg-black/20 rounded-full blur-[80px] -mb-40 pointer-events-none"></div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: 'Courses Progress (%)', value: `${progress?.completionPercentage || 0}%`, icon: PieChart },
          { title: 'Completed Lessons', value: progress?.completedLessons || 0, icon: BookOpen },
          { title: 'Upcoming Exams', value: progress?.totalExams || 0, icon: Calendar },
          { title: 'Live Classes Today', value: '12', icon: Users },
        ].map((stat, i) => (
          <div key={i} className="bg-[#184e55] rounded-[1.5rem] p-6 text-white shadow-lg shadow-[#184e55]/10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
             <div className="flex justify-between items-start mb-6">
               <span className="text-white/80 text-sm font-medium tracking-wide">{stat.title}</span>
               <stat.icon className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" strokeWidth={1.5} />
             </div>
             <div className="text-4xl font-bold tracking-tight">{stat.value}</div>
             {/* Glow Element */}
             <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500"></div>
          </div>
        ))}
      </div>

      {/* Content Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Video Classes (Takes up 3/3 fully spanning top, but let's arrange like image) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-end mb-2 px-1">
            <h2 className="text-xl font-bold text-[#111827] tracking-tight">Video Classes</h2>
            <Link href="/classes" className="text-sm font-semibold text-[#184e55] hover:text-[#0f3439] flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1,2,3,4].map(i => (
               <div key={i} className="bg-white rounded-[1.5rem] p-3 shadow-md shadow-gray-200/50 border border-gray-100 group cursor-pointer hover:shadow-lg transition-all duration-300">
                 <div className="w-full h-36 bg-gray-100 rounded-2xl mb-4 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent mix-blend-multiply z-10"></div>
                   <img src={`https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80&crop=faces&fit=crop&h=400`} alt="Video" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                   <div className="absolute inset-0 flex items-center justify-center z-20">
                     <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors">
                       <PlaySquare className="text-white w-5 h-5 ml-1" fill="currentColor" />
                     </div>
                   </div>
                 </div>
                 <div className="px-2 pb-1">
                   <div className="flex justify-between items-center mb-3">
                     <h3 className="font-semibold text-[15px] text-gray-800">Learning Video {i}</h3>
                     <div className="w-7 h-7 bg-gray-50 rounded-full flex items-center justify-center">
                       <Lock className="w-3.5 h-3.5 text-gray-400" />
                     </div>
                   </div>
                   <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                     <div className="w-3/4 h-full bg-[#184e55] rounded-full"></div>
                   </div>
                 </div>
               </div>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          
          {/* Exams Mini Section */}
          <div className="bg-white rounded-[2rem] p-6 shadow-md shadow-gray-200/50 border border-gray-100">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#111827] tracking-tight">Exams</h2>
                <Link href="/exams" className="text-sm font-semibold text-[#184e55] hover:text-[#0f3439]">View all</Link>
             </div>
             <div className="flex gap-3 mb-6">
               <div className="bg-[#184e55] text-white py-3 px-5 rounded-2xl flex-1 flex flex-col justify-center items-start shadow-md shadow-[#184e55]/20">
                 <span className="text-[10px] uppercase tracking-wider font-bold bg-white/20 px-2 py-0.5 rounded-full mb-2">Completed</span>
                 <span className="font-semibold text-sm">Exam 1</span>
               </div>
               <div className="bg-[#113a40] text-white py-3 px-5 rounded-2xl flex-1 flex flex-col justify-center items-start relative overflow-hidden">
                 <span className="text-[10px] uppercase tracking-wider font-bold bg-black/20 px-2 py-0.5 rounded-full mb-2 flex items-center gap-1">
                   Locked <Lock className="w-2.5 h-2.5" />
                 </span>
                 <span className="font-semibold text-sm text-white/50">Details</span>
               </div>
             </div>
             <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
               <div className="w-1/2 h-full bg-[#184e55]"></div>
               <div className="w-1/4 h-full bg-emerald-400"></div>
             </div>
          </div>

          {/* Live Classes Accent Card */}
          <div className="bg-[#184e55] rounded-[2rem] p-8 shadow-xl shadow-[#184e55]/20 border border-[#184e55] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
            <div className="z-10">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white tracking-tight">Live Classes</h2>
                <span className="bg-emerald-400/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-8">
                Join your scheduled live light and pulsating interactive sessions right now.
              </p>
            </div>
            <Button className="w-32 bg-white text-[#184e55] hover:bg-gray-100 rounded-full font-bold z-10 transition-transform active:scale-95">
              Join Now
            </Button>
          </div>

          {/* Progress Chart Mockup */}
          <div className="bg-white rounded-[2rem] p-6 shadow-md shadow-gray-200/50 border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-[#111827] tracking-tight">Progress</h2>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[140px] relative">
              {/* Fake Donut Chart via CSS CSS */}
              <div className="relative w-32 h-32 rounded-full border-[12px] border-gray-100 flex items-center justify-center">
                 <svg className="absolute inset-0 w-full h-full -rotate-90">
                   <circle cx="64" cy="64" r="52" fill="none" stroke="#184e55" strokeWidth="12" strokeDasharray="326" strokeDashoffset="65" strokeLinecap="round" className="drop-shadow-md" />
                 </svg>
                 <div className="text-center flex flex-col items-center">
                   <span className="text-2xl font-bold text-[#184e55]">80%</span>
                   <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mt-0.5">Progress</span>
                 </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
