"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlayCircle, 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  Info, 
  Clock, 
  Play,
  Share2,
  FileText
} from "lucide-react";
import { useProgressStore } from "@/store/progressStore";
import { useToast } from "@/lib/toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  videoUrl: string;
  orderIndex: number;
}

export default function ClassesPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { markLessonComplete } = useProgressStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/courses");
      if (res.success && res.data.length > 0) {
        setCourses(res.data);
        setSelectedCourse(res.data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      setIsLoading(true);
      api.get(`/lessons/${selectedCourse}`).then(res => {
        if (res.success) {
          setLessons(res.data);
          if (res.data.length > 0 && !activeVideoId) {
            setActiveVideoId(res.data[0].id);
          }
        }
      }).finally(() => setIsLoading(false));
    }
  }, [selectedCourse]);

  const activeLesson = lessons.find(l => l.id === activeVideoId);

  const handleVideoComplete = async () => {
    if (activeVideoId) {
      await markLessonComplete(activeVideoId);
      toast({
        title: "Spiritually Rewarding!",
        description: "You've successfully completed this lesson. Your progress is saved.",
      });
      // Refresh lessons
      if (selectedCourse) {
        api.get(`/lessons/${selectedCourse}`).then(res => setLessons(res.data));
      }
    }
  };

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px]">
                <BookOpen size={14} />
                University Curriculum
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900">Virtual Classroom</h1>
            <p className="text-gray-500 font-medium max-w-lg">
                Engage with premium Quranic scholarship through structured video modules.
            </p>
        </div>
        
        {/* Course Selector Tabs */}
        <div className="flex bg-gray-100/50 p-1.5 rounded-[1.5rem] border border-gray-100 overflow-x-auto scrollbar-hide max-w-full">
            {courses.map(course => (
                <button 
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[13px] font-black transition-all duration-300 ${selectedCourse === course.id ? 'bg-white text-emerald-700 shadow-xl shadow-emerald-900/5' : 'text-gray-400 hover:text-gray-600 cursor-pointer'}`}
                >
                    {course.title}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Video Player Column */}
        <div className="xl:col-span-2 space-y-8">
            <motion.div 
                layoutId="player"
                className="aspect-video bg-[#011c18] rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/5 relative group"
            >
                {activeLesson ? (
                    <div className="w-full h-full">
                        <iframe 
                            className="w-full h-full border-none shadow-2xl"
                            src={`${activeLesson.videoUrl}?autoplay=0&rel=0&modestbranding=1&controls=1`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500/30">
                            <PlayCircle size={48} strokeWidth={1} />
                        </div>
                        <h3 className="text-xl font-bold text-white/40">Select a lesson to begin</h3>
                    </div>
                )}
            </motion.div>

            {/* Video Info Card */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeVideoId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm"
                >
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                    Module {activeLesson?.orderIndex || 1}
                                </span>
                                <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs uppercase tracking-widest">
                                    <Clock size={12} />
                                    15:00 Duration
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                                {activeLesson?.title || "Choose a lesson"}
                            </h2>
                            <p className="text-gray-500 text-lg leading-relaxed font-medium">
                                In this lesson, we explore the deep linguistic nuances and spiritual teachings of the Quran. Take notes and ensure your environment is quiet for optimal concentration.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button variant="outline" className="h-12 rounded-xl border-gray-100 px-6 font-bold text-gray-700 hover:bg-gray-50 flex gap-2">
                                    <FileText size={18} className="text-emerald-600" />
                                    Lesson Notes (PDF)
                                </Button>
                                <Button variant="outline" className="h-12 rounded-xl border-gray-100 px-6 font-bold text-gray-700 hover:bg-gray-50 flex gap-2">
                                    <Share2 size={18} className="text-emerald-600" />
                                    Share Progress
                                </Button>
                                <Button 
                                    onClick={handleVideoComplete}
                                    className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 shadow-xl shadow-emerald-500/10"
                                >
                                    Mark as Complete
                                </Button>
                            </div>
                        </div>

                        <div className="w-full md:w-64 space-y-6">
                            <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100/50">
                                <div className="flex items-center gap-2 mb-4">
                                    <Info className="text-emerald-600" size={18} />
                                    <span className="text-xs font-black uppercase tracking-widest text-emerald-700">Student Guide</span>
                                </div>
                                <p className="text-[13px] text-emerald-900/60 font-medium leading-relaxed">
                                    Watching this lesson entirely will automatically unlock the next session and your assessment quiz.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Sidebar Lesson List */}
        <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 px-2 tracking-tight">Curriculum Breakdown</h3>
            <div className="space-y-3">
                {isLoading ? (
                    [1,2,3,4].map(i => (
                        <div key={i} className="h-24 w-full bg-gray-100 rounded-3xl animate-pulse"></div>
                    ))
                ) : lessons.length === 0 ? (
                    <div className="p-8 bg-gray-50 border border-dashed border-gray-200 rounded-[2rem] text-center text-gray-400 font-medium">
                        No lessons assigned to this course.
                    </div>
                ) : (
                    lessons.map((lesson, idx) => {
                        const isActive = activeVideoId === lesson.id;
                        return (
                            <motion.div 
                                key={lesson.id}
                                whileHover={{ x: 5 }}
                                onClick={() => setActiveVideoId(lesson.id)}
                                className={cn(
                                    "p-6 rounded-[2rem] cursor-pointer transition-all duration-400 group relative border",
                                    isActive 
                                        ? "bg-white border-emerald-100 shadow-xl shadow-emerald-900/5" 
                                        : "bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-100"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-emerald-600 rounded-r-full shadow-emerald-500 shadow-lg"></div>
                                )}
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                                        isActive ? "bg-emerald-600 text-white" : "bg-white border border-gray-100 text-gray-400 group-hover:text-emerald-500"
                                    )}>
                                        {isActive ? <Play size={18} fill="currentColor" /> : <PlayCircle size={20} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={cn(
                                            "text-sm font-black tracking-tight mb-1 truncate",
                                            isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"
                                        )}>
                                            {lesson.title}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Module {lesson.orderIndex}</span>
                                            <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                                            <span className="text-[10px] font-bold text-gray-300">15 min</span>
                                        </div>
                                    </div>
                                    {isActive && (
                                        <ChevronRight size={18} className="text-emerald-200" />
                                    )}
                                </div>
                            </motion.div>
                        );
                    })
                )}

                {/* Locked State Preview */}
                <div className="p-6 rounded-[2rem] bg-gray-50/20 border border-dashed border-gray-100 opacity-40 grayscale flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                        <Lock size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black tracking-tight text-gray-400 uppercase">Assessment Quiz</h4>
                        <span className="text-[10px] font-bold text-gray-300 tracking-widest">LOCKED UNTIL COMPLETION</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
