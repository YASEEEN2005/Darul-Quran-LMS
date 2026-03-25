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

import YouTubeLMSPlayer from "@/components/video/YouTubeLMSPlayer";

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  videoUrl: string;
  orderIndex: number;
  isCompleted: boolean;
  isLocked: boolean;
}

export default function ClassesPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDuration, setCurrentDuration] = useState<number>(0);
  
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

  const fetchLessons = async (courseId: string) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/lessons/${courseId}`);
      if (res.success) {
        setLessons(res.data);
        const nextLesson = res.data.find((l: Lesson) => !l.isCompleted && !l.isLocked) || res.data[0];
        if (nextLesson && !activeVideoId) {
          setActiveVideoId(nextLesson.id);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      fetchLessons(selectedCourse);
    }
  }, [selectedCourse]);

  const activeLesson = lessons.find(l => l.id === activeVideoId);

  const handleProgress = (time: number, duration: number) => {
    if (duration > 0 && currentDuration !== duration) {
        setCurrentDuration(duration);
    }
  };

  const handleVideoComplete = async () => {
    if (activeVideoId) {
      await markLessonComplete(activeVideoId);
      toast({
        title: "Lesson Accomplished!",
        description: "Your progress has been synchronized with our database.",
      });
      
      if (selectedCourse) {
          const res = await api.get(`/lessons/${selectedCourse}`);
          if (res.success) {
              setLessons(res.data);
              const nextIdx = lessons.findIndex(l => l.id === activeVideoId) + 1;
              if (nextIdx < res.data.length && !res.data[nextIdx].isLocked) {
                  setActiveVideoId(res.data[nextIdx].id);
              }
          }
      }
    }
  };

  const selectLesson = (lesson: Lesson) => {
    if (lesson.isLocked) {
        toast({
            variant: "destructive",
            title: "Access Restricted",
            description: "Complete preceding lessons to unlock this.",
        });
        return;
    }
    setActiveVideoId(lesson.id);
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleDownloadNotes = () => {
    toast({
        title: "Generating PDF...",
        description: `Preparing study notes for: ${activeLesson?.title}`,
    });
    setTimeout(() => {
        window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
    }, 1500);
  };

  const handleShareProgress = () => {
    const text = `I'm mastering "${activeLesson?.title}" on Darul-Quran!`;
    if (navigator.share) {
        navigator.share({ title: 'My Progress', text, url: window.location.href });
    } else {
        navigator.clipboard.writeText(`${text} ${window.location.href}`);
        toast({ title: "Link Copied!", description: "Link copied to clipboard." });
    }
  };

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-20">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px]">
                <BookOpen size={14} />
                University Curriculum
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900">Virtual Classroom</h1>
            <p className="text-gray-500 font-medium max-w-lg">
                Engage with premium scholarship through structured video modules.
            </p>
        </div>
        
        <div className="flex bg-gray-100/50 p-1.5 rounded-[1.5rem] border border-gray-100 overflow-x-auto scrollbar-hide max-w-full">
            {courses.map(course => (
                <button 
                    key={course.id}
                    onClick={() => { setSelectedCourse(course.id); setActiveVideoId(null); }}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[13px] font-black transition-all duration-300 ${selectedCourse === course.id ? 'bg-white text-emerald-700 shadow-xl shadow-emerald-900/5' : 'text-gray-400 hover:text-gray-600 cursor-pointer'}`}
                >
                    {course.title}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        <div className="xl:col-span-2 space-y-8">
            <motion.div 
                layoutId="player"
                className="aspect-video bg-[#011c18] rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/5 relative group"
            >
                {activeLesson ? (
                    <div className="relative w-full h-full overflow-hidden scale-[1.01]">
                        <YouTubeLMSPlayer 
                            videoId={getYouTubeId(activeLesson.videoUrl) || ""} 
                            onComplete={handleVideoComplete}
                            onProgress={handleProgress}
                            title={activeLesson.title}
                        />
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
                                {activeLesson?.isCompleted && (
                                    <span className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-1.5">
                                        <CheckCircle2 size={12} />
                                        Completed
                                    </span>
                                )}
                                <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs uppercase tracking-widest">
                                    <Clock size={12} />
                                    {currentDuration > 0 ? `${Math.floor(currentDuration / 60)}:${Math.floor(currentDuration % 60).toString().padStart(2, '0')}` : "Loading..."} Duration
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                                {activeLesson?.title || "Choose a lesson"}
                            </h2>
                            <p className="text-gray-500 text-lg leading-relaxed font-medium">
                                {courses.find(c => c.id === selectedCourse)?.description || "In this lesson, we explore the deep linguistic nuances and spiritual teachings of the Quran."}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button 
                                    onClick={handleDownloadNotes}
                                    variant="outline" className="h-12 rounded-xl border-gray-100 px-6 font-bold text-gray-700 hover:bg-gray-50 flex gap-2"
                                >
                                    <FileText size={18} className="text-emerald-600" />
                                    Lesson Notes (PDF)
                                </Button>
                                <Button 
                                    onClick={handleShareProgress}
                                    variant="outline" className="h-12 rounded-xl border-gray-100 px-6 font-bold text-gray-700 hover:bg-gray-50 flex gap-2"
                                >
                                    <Share2 size={18} className="text-emerald-600" />
                                    Share Progress
                                </Button>
                                {!activeLesson?.isCompleted && (
                                    <Button 
                                        disabled
                                        className="h-12 rounded-xl bg-gray-100 text-gray-400 font-bold px-8 shadow-none"
                                    >
                                        Watching Required
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-64 space-y-6">
                            <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100/50">
                                <div className="flex items-center gap-2 mb-4">
                                    <Info className="text-emerald-600" size={18} />
                                    <span className="text-xs font-black uppercase tracking-widest text-emerald-700">Guide</span>
                                </div>
                                <p className="text-[13px] text-emerald-900/60 font-medium leading-relaxed">
                                    Watching this session until the end will automatically unlock the next phase of your curriculum. Skipping is restricted.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>

        <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 px-2 tracking-tight">Curriculum Breakdown</h3>
            <div className="space-y-3">
                {isLoading ? (
                    [1,2,3,4].map(i => (
                        <div key={i} className="h-24 w-full bg-gray-100 rounded-3xl animate-pulse"></div>
                    ))
                ) : lessons.length === 0 ? (
                    <div className="p-8 bg-gray-50 border border-dashed border-gray-200 rounded-[2rem] text-center text-gray-400 font-medium">
                        No lessons assigned.
                    </div>
                ) : (
                    lessons.map((lesson) => {
                        const isActive = activeVideoId === lesson.id;
                        return (
                            <motion.div 
                                key={lesson.id}
                                whileHover={!lesson.isLocked ? { x: 5 } : {}}
                                onClick={() => selectLesson(lesson)}
                                className={cn(
                                    "p-6 rounded-[2rem] cursor-pointer transition-all duration-400 group relative border",
                                    isActive 
                                        ? "bg-white border-emerald-100 shadow-xl shadow-emerald-900/5" 
                                        : lesson.isLocked 
                                          ? "bg-gray-50/50 opacity-40 grayscale cursor-not-allowed border-transparent"
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
                                        {lesson.isLocked ? <Lock size={16} /> : lesson.isCompleted ? <CheckCircle2 size={18} className="text-emerald-600" /> : <Play size={18} fill="currentColor" />}
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
                                            {lesson.isLocked && <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded">Locked</span>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
