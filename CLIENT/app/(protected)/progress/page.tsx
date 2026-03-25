"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trophy, 
  Target, 
  Activity, 
  CheckCircle2, 
  Clock, 
  GraduationCap,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  BookOpen,
  Award,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function MyProgressPage() {
  const [stats, setStats] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch stats and curriculum
    const fetchData = async () => {
      try {
        const coursesRes = await api.get("/courses");
        if (!coursesRes.success || coursesRes.data.length === 0) return;
        
        const courseId = coursesRes.data[0].id;
        const [progressRes, curriculumRes] = await Promise.all([
          api.get(`/progress`), // Use the new student-specific endpoint
          api.get(`/lessons/${courseId}`)
        ]);

        if (curriculumRes.success) {
          const items = curriculumRes.data;
          const grouped = items.reduce((acc: any, item: any) => {
            const m = item.moduleNumber || 1;
            if (!acc[m]) acc[m] = { number: m, items: [], total: 0, completed: 0 };
            acc[m].items.push(item);
            acc[m].total++;
            if (item.isCompleted) acc[m].completed++;
            return acc;
          }, {});
          setModules(Object.values(grouped));
        }

        if (progressRes.success) {
           setStats(progressRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-64 bg-gray-100 rounded-[3rem]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-gray-100 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  const overallProgress = modules.length > 0 ? (modules.reduce((a, b) => a + b.completed, 0) / modules.reduce((a, b) => a + b.total, 0)) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* Premium Header Dashboard */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#011c18] rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px] -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-full backdrop-blur-md">
                   <Activity size={14} className="text-emerald-400" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">Performance Snapshot</span>
                </div>
                <div>
                   <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-tight">Your Academic<br/>Excellence Journey</h1>
                   <p className="text-emerald-100/40 font-medium max-w-xl text-lg md:text-xl leading-relaxed">
                      Tracking your progression through the Operating Systems curriculum with institute-standard precision.
                   </p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-md">
                        <span className="block text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Pass Rate</span>
                        <span className="text-3xl font-black tabular-nums">{stats?.averageScore || 0}%</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-md">
                        <span className="block text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Assessments</span>
                        <span className="text-3xl font-black tabular-nums">{modules.length} Modules</span>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-full border-[12px] border-white/5 flex items-center justify-center relative shadow-2xl">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle 
                            cx="50%" cy="50%" r="45%" 
                            className="stroke-emerald-500/10 fill-none" 
                            strokeWidth="12" 
                        />
                        <circle 
                            cx="50%" cy="50%" r="45%" 
                            className="stroke-emerald-500 fill-none transition-all duration-1000" 
                            strokeWidth="12" 
                            strokeDasharray="100"
                            strokeDashoffset={100 - (stats?.overallCompletion || 0)}
                            style={{ strokeDasharray: '283', strokeDashoffset: 283 - (283 * (stats?.overallCompletion || 0) / 100) }}
                        />
                    </svg>
                    <div className="text-center group cursor-default">
                        <span className="text-5xl md:text-7xl font-black tracking-tighter block group-hover:scale-110 transition-transform">{stats?.overallCompletion || 0}%</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100/30">Course Unified</span>
                    </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-emerald-500 p-4 rounded-3xl shadow-xl animate-bounce-slow">
                    <Trophy className="text-white" size={24} />
                </div>
            </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0">
          <StatCard 
            icon={<Target className="text-emerald-600" />} 
            label="Module Goals" 
            value={`${modules.filter(m => m.completed === m.total).length}`}
            sub="Completed Chapters"
            theme="emerald"
          />
          <StatCard 
            icon={<BookOpen className="text-amber-600" />} 
            label="Curriculum Units" 
            value={`${stats?.completedLessons || 0}`}
            sub={`Out of ${stats?.totalLessons || 0} total`}
            theme="amber"
          />
          <StatCard 
            icon={<GraduationCap className="text-blue-600" />} 
            label="Gated Exams" 
            value={`${stats?.completedExams || 0}`}
            sub="Phase-Gate Verified"
            theme="blue"
          />
          <StatCard 
            icon={<Award className="text-purple-600" />} 
            label="Rank" 
            value={stats?.overallCompletion >= 70 ? "Alpha" : "Beta"}
            sub="Academic Standing"
            theme="purple"
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between px-4 md:px-0">
                  <h2 className="text-3xl font-black tracking-tighter text-gray-900 flex items-center gap-3">
                     <TrendingUp className="text-emerald-600" />
                     Learning Path Analysis
                  </h2>
                  <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" /> Complete
                      <div className="w-2 h-2 rounded-full bg-gray-200 ml-3" /> Remaining
                  </div>
              </div>

              <div className="space-y-6 px-4 md:px-0">
                 {modules.map((m, idx) => (
                   <motion.div 
                     key={m.number}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: idx * 0.1 }}
                     className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all group"
                   >
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                         <div className="flex items-center gap-5">
                             <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-xl text-emerald-950 shadow-inner group-hover:bg-emerald-50 transition-colors">
                                {m.number}
                             </div>
                             <div>
                                <h4 className="text-xl font-black tracking-tight text-gray-900">Module {m.number} Distribution</h4>
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest text-[10px]">Gated Phase Content</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="text-right">
                               <span className="block text-2xl font-black tabular-nums text-gray-900">{Math.round((m.completed / m.total) * 100)}%</span>
                               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Proficiency</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                               {m.completed === m.total ? <CheckCircle2 className="text-emerald-600" size={18} /> : <Clock className="text-emerald-400 animate-spin-slow" size={18} />}
                            </div>
                         </div>
                     </div>

                     <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden flex shadow-inner">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-1000" 
                          style={{ width: `${(m.completed / m.total) * 100}%` }} 
                        />
                     </div>
                     
                     <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                            <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Units</span>
                            <span className="text-lg font-bold text-gray-900">{m.total}</span>
                        </div>
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                            <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Completed</span>
                            <span className="text-lg font-bold text-emerald-600">{m.completed}</span>
                        </div>
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                            <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Next Step</span>
                            <span className="text-lg font-bold text-gray-400">Locked</span>
                        </div>
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                            <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Weightage</span>
                            <span className="text-lg font-bold text-gray-900">50%</span>
                        </div>
                     </div>
                   </motion.div>
                 ))}
              </div>
          </div>

          <div className="space-y-10 px-4 md:px-0">
             <div className="bg-[#022c26] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-400/10 rounded-full -ml-16 -mt-16"></div>
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                        <Award size={32} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight mb-2">Alpha Graduate Status</h3>
                        <p className="text-emerald-100/40 text-sm font-medium leading-relaxed">
                            Maintain a 70%+ average across all module exams to secure your certificate.
                        </p>
                    </div>
                    <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Verification Status</span>
                            <Lock size={12} className="text-emerald-500/50" />
                        </div>
                        <div className="text-left py-2 border-b border-white/5 flex justify-between">
                            <span className="text-xs text-white/40">Credential ID</span>
                            <span className="text-xs font-mono font-bold">DQ-2024-OS-001</span>
                        </div>
                        <div className="text-left py-2 flex justify-between">
                            <span className="text-xs text-white/40">Eligibility</span>
                            <span className="text-xs font-bold text-amber-400">PENDING</span>
                        </div>
                    </div>
                </div>
             </div>

             <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                   <div className="p-3 bg-gray-50 rounded-2xl">
                      <BarChart3 size={20} className="text-emerald-600" />
                   </div>
                   <h3 className="text-xl font-black tracking-tight">Active Tasks</h3>
                </div>
                <div className="space-y-4">
                    <TaskItem label="Complete Module 1 Exam" status="done" color="emerald" />
                    <TaskItem label="Watch Process States" status="active" color="emerald" />
                    <TaskItem label="Module 2 Assessment" status="locked" color="gray" />
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, theme }: any) {
    const themes: any = {
        emerald: "bg-emerald-50 border-emerald-100 text-emerald-950",
        amber: "bg-amber-50 border-amber-100 text-amber-950",
        blue: "bg-blue-50 border-blue-100 text-blue-950",
        purple: "bg-purple-50 border-purple-100 text-purple-950"
    };

    return (
        <Card className={cn("rounded-[2rem] border-none shadow-sm flex items-center p-8 gap-6 group hover:scale-[1.02] transition-transform", themes[theme])}>
            <div className="bg-white p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">{label}</span>
                <div className="text-2xl font-black tracking-tighter tabular-nums mb-0.5">{value}</div>
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest leading-none">{sub}</p>
            </div>
        </Card>
    );
}

function TaskItem({ label, status, color }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white transition-all group">
            <div className="flex items-center gap-3">
               <div className={cn(
                   "w-2 h-2 rounded-full",
                   status === 'done' ? 'bg-emerald-500' : status === 'active' ? 'bg-amber-500 animate-pulse' : 'bg-gray-300'
               )} />
               <span className={cn(
                   "text-sm font-bold",
                   status === 'locked' ? 'text-gray-400' : 'text-gray-700'
               )}>{label}</span>
            </div>
            {status === 'done' && <ArrowUpRight size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </div>
    );
}
