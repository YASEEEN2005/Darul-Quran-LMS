"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/store/progressStore";
import { useCourseStore } from "@/store/courseStore";
import { useAuthStore } from "@/store/authStore";
import { 
  PlaySquare, 
  FileEdit, 
  Video, 
  Target, 
  PieChart, 
  BookOpen, 
  Calendar, 
  Users, 
  Lock, 
  ChevronRight, 
  Activity,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Play
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { progress, fetchProgress, isLoading: isProgressLoading } = useProgressStore();
  const { courses, fetchCourses, isLoading: isCoursesLoading } = useCourseStore();

  useEffect(() => {
    if (user?.id) {
      fetchProgress(user.id);
      fetchCourses();
    }
  }, [user, fetchProgress, fetchCourses]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-20 px-4 md:px-0">
      
      {/* Upper Section: Welcome & Global Progress */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group min-h-[300px] md:min-h-[350px] py-12 w-full bg-[#011c18] rounded-[2.5rem] overflow-hidden flex items-center shadow-2xl transition-all duration-700 hover:shadow-emerald-900/10"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[150%] bg-linear-to-br from-emerald-500/20 via-teal-500/5 to-transparent rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[5%] w-[40%] h-[80%] bg-emerald-900/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 px-10 md:px-10 w-full flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-xl text-center md:text-left">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6"
            >
                <Sparkles size={14} className="animate-spin-slow" />
                Spiritual Excellence
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                Welcome to your <br className="hidden md:block" />
                <span className="text-emerald-400 underline decoration-emerald-500/30 decoration-8 underline-offset-4">Digital Madrasa</span>
            </h1>
            <p className="text-emerald-100/60 text-lg font-medium leading-relaxed mb-8">
                Continue your journey of mastering the Quran. Your next lesson is ready.
            </p>
            <Link href="/classes">
                <Button className="h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95">
                    Resume Curriculum
                    <ArrowUpRight className="ml-2 w-5 h-5" />
                </Button>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-8 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                          <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                          <circle 
                            cx="48" cy="48" r="42" 
                            fill="none" stroke="#10b981" 
                            strokeWidth="8" 
                            strokeDasharray="264" 
                            strokeDashoffset={264 - (264 * (Number(progress?.completionPercentage) || 0) / 100)} 
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                      </svg>
                      <span className="absolute text-2xl font-black text-white">{progress?.completionPercentage || 0}%</span>
                  </div>
                  <span className="text-[10px] text-emerald-100/40 uppercase tracking-[0.2em] font-black mt-4">Total Completion</span>
              </div>
              <div className="h-20 w-px bg-white/10"></div>
              <div className="flex flex-col items-center">
                  <span className="text-4xl font-black text-white">{progress?.completedLessons || 0}</span>
                  <span className="text-[10px] text-emerald-100/40 uppercase tracking-[0.2em] font-black mt-2">Lessons Done</span>
              </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Quick Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: "Active Courses", value: courses.length || 0, icon: BookOpen, color: "emerald", trend: "+2 this month" },
          { label: "Live Hours", value: "24.5", icon: Video, color: "teal", trend: "Top 5% Student" },
          { label: "Exam Average", value: "98%", icon: Target, color: "emerald", trend: "Excellent" },
          { label: "Global Rank", value: "#14", icon: Users, color: "teal", trend: "Up 2 spots" },
        ].map((stat, i) => (
          <motion.div 
            variants={item}
            key={i} 
            className="bg-white rounded-[2rem] p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                        <stat.icon size={22} strokeWidth={2.5} />
                    </div>
                </div>
                <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</span>
                </div>
                <div className="mt-4 flex items-center text-[10px] font-bold text-emerald-600 gap-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
                    <TrendingUp size={10} />
                    {stat.trend}
                </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Left Column: Recent Course Units */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Curriculum</h2>
            <Link href="/classes" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group">
                Browse Library <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(isCoursesLoading ? [1, 2] : courses).map((course: any, i) => (
               <motion.div 
                key={course.id || i}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group cursor-pointer"
               >
                 <div className="h-48 w-full bg-gray-50 relative overflow-hidden">
                    <img 
                        src={i === 0 ? "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80" : "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"} 
                        alt={course.title} 
                        className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Primary</span>
                            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">6 Lessons</span>
                        </div>
                        <h3 className="text-xl font-black text-white leading-tight">{course.title}</h3>
                    </div>
                    <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={20} className="text-white fill-white ml-0.5" />
                    </div>
                 </div>
                 <div className="p-8 flex-1 flex flex-col justify-between">
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
                        {course.description}
                    </p>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
                            <span>Your Progress</span>
                            <span className="text-emerald-600">40%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "40%" }}
                                className="h-full bg-emerald-500 rounded-full"
                            />
                        </div>
                    </div>
                 </div>
               </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Sidebar Widgets */}
        <div className="space-y-8">
            
            {/* Live Class Widget */}
            <div className="bg-[#022c22] rounded-[2.5rem] p-8 mt-2 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative z-10 flex flex-col h-full justify-between min-h-[250px]">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Now</span>
                        </div>
                        <h3 className="text-2xl font-black text-white leading-tight mb-4">Intermediate Tajweed <br />Group Session</h3>
                        <p className="text-emerald-100/50 text-sm font-medium leading-relaxed">
                            Ustadh Muhammad is explaining the rules of Idgham. Don't miss out!
                        </p>
                    </div>
                    <div className="flex items-center gap-4 mt-8">
                        <div className="flex -space-x-3">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#022c22] overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-[#022c22] bg-emerald-900 border-none flex items-center justify-center text-[10px] font-bold text-emerald-400">
                                +12
                            </div>
                        </div>
                        <Button className="flex-1 h-12 rounded-xl bg-white text-emerald-900 font-bold hover:bg-emerald-50 transition-colors">
                            Join Session
                        </Button>
                    </div>
                </div>
            </div>

            {/* Achievement / Goal Mini Widget */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Today's Goal</h3>
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <Target size={18} />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group-hover:border-emerald-200 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                <Play size={12} fill="currentColor" />
                            </div>
                            <span className="text-sm font-bold text-gray-700">Watch Item 2</span>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <FileEdit size={12} />
                            </div>
                            <span className="text-sm font-bold text-gray-700">Submit Quiz 1</span>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>
                    </div>
                </div>
            </div>

        </div>
      </div>

    </div>
  );
}
