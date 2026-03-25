"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
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
  Play,
  Trophy, 
  ActivityIcon,
  Timer,
  CheckCircle2,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, coursesRes] = await Promise.all([
          api.get("/progress"),
          api.get("/courses")
        ]);

        if (progressRes.success) setStats(progressRes.data);
        if (coursesRes.success) setCourses(coursesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

        <div className="relative z-10 px-10 md:px-14 w-full flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-xl text-center md:text-left">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em] mb-6 backdrop-blur-md"
            >
                <Sparkles size={12} className="animate-spin-slow" />
                Institute Performance Tier
            </motion.div>
            <h1 className="text-2xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
                Salaam, <span className="text-emerald-400">{user?.name?.split(' ')[0]}</span>. <br className="hidden md:block" />
                Ready for <span className="underline decoration-emerald-500/30 decoration-8 underline-offset-4">Module {stats?.completedExams + 1 || 1}</span>?
            </h1>
            <p className="text-emerald-100/40 text-sm md:text-lg font-medium leading-relaxed mb-8 max-w-lg">
                Your academic journey through Operating Systems is being recorded with secure verification.
            </p>
            <Link href="/classes">
                <Button className="h-12 md:h-16 px-8 md:px-10 rounded-[1.25rem] md:rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm md:text-lg shadow-[0_20px_40px_rgba(16,185,129,0.2)] transition-all">
                    Enter Classroom
                    <ArrowUpRight className="ml-2 w-5 h-5" />
                </Button>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-10 bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative">
              <div className="absolute inset-0 bg-emerald-500/5 rounded-[3rem] animate-pulse"></div>
              <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                          <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                          <circle 
                            cx="64" cy="64" r="58" 
                            fill="none" stroke="#10b981" 
                            strokeWidth="10" 
                            strokeDasharray="364" 
                            strokeDashoffset={364 - (364 * (stats?.overallCompletion || 0) / 100)} 
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                          />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-3xl font-black text-white block leading-none">{stats?.overallCompletion || 0}%</span>
                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mt-1">Audit</span>
                      </div>
                  </div>
                  <span className="text-[10px] text-emerald-100/30 uppercase tracking-[0.2em] font-black mt-6">Course Integrity</span>
              </div>
              <div className="h-24 w-px bg-white/10"></div>
              <div className="relative z-10 flex flex-col items-center">
                  <span className="text-5xl font-black text-white tracking-tighter tabular-nums">{stats?.completedLessons || 0}</span>
                  <span className="text-[10px] text-emerald-100/30 uppercase tracking-[0.2em] font-black mt-3">Units Verified</span>
                  <div className="mt-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                     <CheckCircle2 size={10} className="text-emerald-400" />
                     <span className="text-[8px] font-black text-emerald-200">Phase 1 Secure</span>
                  </div>
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
        <StatItem label="Gated Modules" value={courses.length} icon={BookOpen} trend={`${stats?.completedExams || 0} Passed`} theme="emerald" />
        <StatItem label="Verification Avg" value={`${stats?.averageScore || 0}%`} icon={Target} trend="High Fidelity" theme="emerald" />
        <StatItem label="Syllabus Mastery" value={`${stats?.overallCompletion || 0}%`} icon={Trophy} trend="Course Progress" theme="emerald" />
        <StatItem label="Curriculum Units" value={`${stats?.completedLessons || 0}`} icon={Users} trend={`From ${stats?.totalLessons || 0}`} theme="emerald" />
      </motion.div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Left Column: Recent Course Units */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <ActivityIcon className="text-emerald-600" size={24} />
                Focus Path
            </h2>
            <Link href="/classes" className="text-sm font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-2 group bg-emerald-50 px-5 py-2 rounded-xl transition-all">
                Access All Modules <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {isLoading ? (
                [1, 2].map(i => <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-[2.5rem]" />)
            ) : courses.map((course: any, i) => (
               <motion.div 
                key={course.id || i}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500"
               >
                 <div className="h-56 w-full bg-gray-50 relative overflow-hidden">
                    <img 
                        src={course.image || (i === 0 ? "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80" : "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80")} 
                        alt={course.title} 
                        className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-8 right-8">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg">Verified Path</span>
                            <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border border-white/10">BCA SEM 6</span>
                        </div>
                        <h3 className="text-2xl font-black text-white leading-tight tracking-tight">{course.title}</h3>
                    </div>
                    <Link href="/classes" className="absolute top-6 right-6 w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-6">
                        <Play size={24} className="text-white fill-white ml-1" />
                    </Link>
                 </div>
                 <div className="p-8 pb-10 flex-1 flex flex-col justify-between">
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-8 font-medium">
                        Explore the intricate layers of {course.title} with university-standard precision and gated verification.
                    </p>
                    <div className="space-y-5">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            <span>Syllabus Progress</span>
                            <span className="text-emerald-600">{stats?.overallCompletion || 0}%</span>
                        </div>
                        <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${stats?.overallCompletion || 0}%` }}
                                className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
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
            
            {/* Phase Tracking Component */}
            <div className="bg-[#022c26] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="relative z-10 flex flex-col h-full justify-between min-h-[300px]">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-emerald-500/20 shadow-xl">
                                <GraduationCap size={24} className="text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-1">Graduation Track</h4>
                                <h3 className="text-2xl font-black text-white leading-none">OS Mastery</h3>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <TrackItem label="Phase-Gate 1: Fundamentals" completed={stats?.completedExams >= 1} current={stats?.completedExams === 0} />
                            <TrackItem label="Phase-Gate 2: Process Control" completed={stats?.completedExams >= 2} current={stats?.completedExams === 1} />
                            <TrackItem label="Final Assessment Audit" completed={stats?.completedExams >= 3} current={false} />
                        </div>
                    </div>
                    <Link href="/exams" className="mt-10">
                        <Button className="w-full h-14 rounded-2xl bg-white text-emerald-950 font-black text-sm hover:bg-emerald-50 transition-all shadow-2xl shadow-black/20">
                            View Locked Assessments
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Achievement / Goal Mini Widget */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">Today's Focus</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Priority Gated Tasks</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 transition-transform group-hover:rotate-12">
                        <Target size={22} />
                    </div>
                </div>
                <div className="space-y-4">
                    <TaskMiniItem label="Watch Module Next Unit" icon={<Play size={12} fill="currentColor" />} status="pending" />
                    <TaskMiniItem label="Sync Exam Progress" icon={<FileEdit size={12} />} status="pending" />
                </div>
            </div>

        </div>
      </div>

    </div>
  );
}

function StatItem({ label, value, icon: Icon, trend, theme }: any) {
    return (
        <motion.div 
            variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
            className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm transition-all duration-500 group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-emerald-50 rounded-full -mr-12 md:-mr-16 -mt-12 md:-mt-16"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4 md:mb-8">
                    <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
                        <Icon size={20} className="md:w-6 md:h-6" strokeWidth={2.5} />
                    </div>
                </div>
                <h3 className="text-gray-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">{label}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter tabular-nums">{value}</span>
                </div>
                <div className="mt-4 md:mt-6 flex items-center text-[9px] font-black text-emerald-600 gap-2 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100/50">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    {trend}
                </div>
            </div>
        </motion.div>
    );
}

function TrackItem({ label, completed, current }: any) {
    return (
        <div className={cn(
            "flex items-center gap-4 transition-opacity",
            !completed && !current && "opacity-30"
        )}>
            <div className={cn(
                "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                completed ? "bg-emerald-500 border-emerald-500" : current ? "border-emerald-500 animate-pulse" : "border-emerald-950"
            )}>
                {completed && <CheckCircle2 size={10} className="text-white" />}
                {current && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
            </div>
            <span className={cn(
                "text-xs font-bold leading-tight",
                completed ? "text-emerald-100" : current ? "text-white" : "text-emerald-950"
            )}>{label}</span>
        </div>
    );
}

function TaskMiniItem({ label, icon, status }: any) {
    return (
        <div className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100 flex items-center justify-between group-hover:bg-white group-hover:border-emerald-100 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-inner">
                    {icon}
                </div>
                <span className="text-sm font-bold text-gray-700 tracking-tight">{label}</span>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center">
                {status === 'done' && <div className="w-3 h-3 bg-emerald-500 rounded-full" />}
            </div>
        </div>
    );
}
