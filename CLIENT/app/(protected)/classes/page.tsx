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
  FileText,
  Timer,
  AlertCircle,
  FileEdit,
  GraduationCap
} from "lucide-react";
import { useProgressStore } from "@/store/progressStore";
import { useToast } from "@/lib/toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import YouTubeLMSPlayer from "@/components/video/YouTubeLMSPlayer";

interface CurriculumItem {
  id: string;
  courseId: string;
  title: string;
  videoUrl?: string;
  orderIndex: number;
  type: 'LESSON' | 'EXAM';
  isCompleted: boolean;
  isLocked: boolean;
  moduleNumber?: number;
  questions?: any[];
  score?: number;
}

export default function ClassesPage() {
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);
  
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

  const fetchCurriculum = async (courseId: string) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/lessons/${courseId}`);
      if (res.success) {
        setCurriculum(res.data);
        const nextItem = res.data.find((l: CurriculumItem) => !l.isCompleted && !l.isLocked) || res.data[0];
        if (nextItem && !activeItemId) {
          setActiveItemId(nextItem.id);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      fetchCurriculum(selectedCourse);
    }
  }, [selectedCourse]);

  const activeItem = curriculum.find(item => item.id === activeItemId);

  const handleProgress = (time: number, duration: number) => {
    if (duration > 0 && currentDuration !== duration) {
        setCurrentDuration(duration);
    }
  };

  const handleVideoComplete = async () => {
    if (activeItemId && activeItem?.type === 'LESSON') {
      await markLessonComplete(activeItemId);
      toast({
        title: "Lesson Accomplished!",
        description: "Your progress has been synchronized with our database.",
      });
      
      if (selectedCourse) {
          const res = await api.get(`/lessons/${selectedCourse}`);
          if (res.success) {
              setCurriculum(res.data);
              const nextIdx = curriculum.findIndex(l => l.id === activeItemId) + 1;
              if (nextIdx < res.data.length && !res.data[nextIdx].isLocked) {
                  setActiveItemId(res.data[nextIdx].id);
              }
          }
      }
    }
  };

  const handleSubmitExam = async () => {
    if (!activeItem || activeItem.type !== 'EXAM') return;
    setIsSubmitting(true);
    
    // Format answers for API
    const formattedAnswers = Object.keys(answers).map(qIdx => ({
        questionId: activeItem.questions?.[parseInt(qIdx)]._id || qIdx,
        selectedOptionIndex: answers[qIdx]
    }));

    try {
        const res = await api.post(`/exams/${activeItem.id}/submit`, { answers: formattedAnswers });
        const passed = (res.score ?? 0) >= 70;
        
        toast({
            title: passed ? "Examination Passed!" : "Threshold Not Met",
            description: `You scored ${res.score ?? 0}%. ${passed ? "Next module unlocked!" : "Score 70% to advance."}`,
            variant: passed ? "default" : "destructive"
        });

        if (selectedCourse) fetchCurriculum(selectedCourse);
        setAnswers({});

        // If passed, we can automatically help the user navigate to next module
        if (passed) {
            const nextModuleNum = (activeItem.moduleNumber || activeModule) + 1;
            const hasNextModule = curriculum.some(i => i.moduleNumber === nextModuleNum);
            if (hasNextModule) {
               setActiveModule(nextModuleNum);
            }
        }
    } catch (e) {
        toast({ variant: "destructive", title: "Assessment Error", description: "Submission failed." });
    } finally {
        setIsSubmitting(false);
    }
  };

  const selectItem = (item: CurriculumItem) => {
    if (item.isLocked) {
        toast({
            variant: "destructive",
            title: "Access Restricted",
            description: "Complete preceding requirements to unlock this.",
        });
        return;
    }
    setActiveItemId(item.id);
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleDownloadNotes = () => {
    toast({
        title: "Generating PDF...",
        description: `Preparing study notes for: ${activeItem?.title}`,
    });
    setTimeout(() => {
        window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
    }, 1500);
  };

  const handleShareProgress = () => {
    const text = `I'm mastering "${activeItem?.title}" on Darul-Quran!`;
    if (navigator.share) {
        navigator.share({ title: 'My Progress', text, url: window.location.href });
    } else {
        navigator.clipboard.writeText(`${text} ${window.location.href}`);
        toast({ title: "Link Copied!", description: "Link copied to clipboard." });
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-4 md:px-8 space-y-8">
      
      {/* Dynamic Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-8 md:pt-12 border-b border-gray-100 pb-10">
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.25em] text-[10px] md:text-xs">
                <GraduationCap size={16} />
                LMS Environment
            </div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter text-gray-900 leading-tight">Virtual Classroom</h1>
            <p className="text-gray-500 font-medium text-xs md:text-base max-w-xl">
                Engage with immersive university-standard scholarship through our modular academic framework.
            </p>
        </div>
        
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 overflow-x-auto scrollbar-hide">
            {courses.map(course => (
                <button 
                    key={course.id}
                    onClick={() => { setSelectedCourse(course.id); setActiveItemId(null); }}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-400 ${selectedCourse === course.id ? 'bg-white text-emerald-800 shadow-xl shadow-emerald-900/5' : 'text-gray-400 hover:text-gray-600 cursor-pointer'}`}
                >
                    {course.title}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
        
        {/* Main Instruction Area */}
        <div className="lg:col-span-8 space-y-8">
            <motion.div 
                layoutId="player"
                className="w-full aspect-video bg-black rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/10 border border-gray-100 relative group"
            >
                {activeItem?.type === 'LESSON' ? (
                    <div className="relative w-full h-full overflow-hidden">
                        <YouTubeLMSPlayer 
                            videoId={getYouTubeId(activeItem.videoUrl || "") || ""} 
                            onComplete={handleVideoComplete}
                            onProgress={handleProgress}
                            title={activeItem.title}
                        />
                    </div>
                ) : activeItem?.type === 'EXAM' ? (
                    <div className="w-full h-full p-6 md:p-12 lg:p-16 flex flex-col bg-[#011c18] text-white overflow-y-auto custom-scrollbar">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 md:mb-16">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2">Phase Assessment</h3>
                                <h2 className="text-2xl md:text-4xl font-black tracking-tighter leading-none">{activeItem.title}</h2>
                                <p className="text-emerald-100/40 text-xs md:text-sm mt-3 font-medium">Requirement: 70% Score to Advance</p>
                            </div>
                            <div className="w-full md:w-auto bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-md flex items-center gap-4">
                                <div className="bg-emerald-500/20 p-2 rounded-full"><Timer size={20} className="text-emerald-400" /></div>
                                <div>
                                    <span className="block text-[8px] font-black uppercase tracking-widest text-emerald-100/40">Evaluation Mode</span>
                                    <span className="text-sm md:text-base font-bold tracking-tight">Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            {activeItem.questions?.map((q: any, i: number) => (
                                <div key={i} className="space-y-5">
                                    <h4 className="text-lg md:text-xl font-bold text-gray-50 flex gap-3">
                                        <span className="opacity-30 font-black italic text-emerald-500">#{i+1}</span>
                                        {q.text}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {q.options.map((opt: string, optIdx: number) => (
                                            <div 
                                                key={optIdx}
                                                onClick={() => setAnswers({ ...answers, [i]: optIdx })}
                                                className={cn(
                                                    "p-5 rounded-xl border transition-all cursor-pointer flex items-center gap-4",
                                                    answers[i] === optIdx 
                                                        ? "bg-emerald-500 border-emerald-400 shadow-xl shadow-emerald-500/10" 
                                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                                                    answers[i] === optIdx ? "bg-white border-white" : "border-white/20"
                                                )}>
                                                    {answers[i] === optIdx && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                                </div>
                                                <span className={cn("text-xs md:text-sm font-bold", answers[i] === optIdx ? "text-[#011c18]" : "text-emerald-50/60")}>
                                                    {opt}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 md:mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-3 text-emerald-100/30 text-center sm:text-left">
                                <AlertCircle size={18} />
                                <p className="text-[11px] font-medium leading-tight">By submitting, you confirm these are your original responses.</p>
                            </div>
                            <Button 
                                onClick={handleSubmitExam}
                                disabled={isSubmitting || Object.keys(answers).length < (activeItem.questions?.length || 0)}
                                className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#011c18] font-black shadow-2xl shadow-emerald-500/20 transition-all flex gap-3"
                            >
                                {isSubmitting ? "Processing..." : "Submit Assessment"}
                                <ChevronRight size={18} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-50 relative overflow-hidden group-hover:scale-110 transition-transform">
                            <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
                            <div className="relative w-full h-full flex items-center justify-center text-emerald-500">
                                <PlayCircle size={32} strokeWidth={1.5} />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-400">Select a unit to begin learning</h3>
                    </div>
                )}
            </motion.div>

            {/* Content Details Mobile Toggle / Header */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeItemId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm"
                >
                    <div className="flex flex-col lg:flex-row justify-between gap-10">
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                    {activeItem?.type === 'EXAM' ? 'Internal Assessment' : `Academic Module ${activeItem?.orderIndex || 1}`}
                                </span>
                                {activeItem?.isCompleted && (
                                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-1.5">
                                        <CheckCircle2 size={10} />
                                        Certified
                                    </span>
                                )}
                                {activeItem?.type === 'LESSON' && (
                                    <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[9px] uppercase tracking-widest">
                                        <Clock size={10} />
                                        {currentDuration > 0 ? `${Math.floor(currentDuration / 60)}:${Math.floor(currentDuration % 60).toString().padStart(2, '0')}` : "Reading"}
                                    </div>
                                )}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter leading-tight">
                                {activeItem?.title || "Classroom Empty"}
                            </h2>
                            <p className="text-gray-500 text-base md:text-lg leading-relaxed font-medium">
                                {courses.find(c => c.id === selectedCourse)?.description || "Complete this phase with focused attention to unlock the next instructional module."}
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button 
                                    onClick={handleDownloadNotes}
                                    variant="outline" className="h-11 rounded-xl border-gray-100 px-5 font-bold text-xs text-gray-600 hover:bg-gray-50 flex gap-2"
                                >
                                    <FileText size={16} className="text-emerald-600" />
                                    Phase Notes
                                </Button>
                                <Button 
                                    onClick={handleShareProgress}
                                    variant="outline" className="h-11 rounded-xl border-gray-100 px-5 font-bold text-xs text-gray-600 hover:bg-gray-50 flex gap-2"
                                >
                                    <Share2 size={16} className="text-emerald-600" />
                                    Share Milestone
                                </Button>
                            </div>

                            {/* Dynamic Progression CTA */}
                            {(() => {
                                const currentIndex = curriculum.findIndex(i => i.id === activeItemId);
                                const nextItem = currentIndex !== -1 && currentIndex < curriculum.length - 1 ? curriculum[currentIndex + 1] : null;
                                
                                if (!nextItem) return null;

                                return (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "mt-10 p-8 rounded-[2rem] border transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6",
                                            nextItem.isLocked 
                                                ? "bg-gray-50 border-gray-100 grayscale-[0.8]" 
                                                : nextItem.type === 'EXAM'
                                                    ? "bg-amber-50/50 border-amber-100 shadow-xl shadow-amber-900/5"
                                                    : "bg-emerald-50/50 border-emerald-100 shadow-xl shadow-emerald-900/5"
                                        )}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={cn(
                                                "w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-lg transition-transform hover:scale-105",
                                                nextItem.isLocked 
                                                    ? "bg-gray-200 text-gray-400"
                                                    : nextItem.type === 'EXAM' 
                                                        ? "bg-amber-500 text-white shadow-amber-500/20" 
                                                        : "bg-emerald-600 text-white shadow-emerald-500/20"
                                            )}>
                                                {nextItem.isLocked ? <Lock size={24} /> : nextItem.type === 'EXAM' ? <GraduationCap size={28} /> : <PlayCircle size={28} strokeWidth={2} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Next Activity</span>
                                                    {nextItem.isLocked && <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-tighter">Locked</span>}
                                                </div>
                                                <h4 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter leading-none">{nextItem.title}</h4>
                                                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-2">
                                                    {nextItem.type === 'EXAM' ? "PHASE ASSESSMENT PENDING" : `VOLUMETRIC UNIT ${nextItem.orderIndex}`}
                                                </p>
                                            </div>
                                        </div>
                                        <Button 
                                            onClick={() => selectItem(nextItem)}
                                            disabled={nextItem.isLocked}
                                            className={cn(
                                                "h-14 px-10 rounded-2xl font-black transition-all shadow-xl flex gap-3 group w-full md:w-auto",
                                                nextItem.isLocked 
                                                    ? "bg-gray-100 text-gray-400 border-gray-200"
                                                    : nextItem.type === 'EXAM'
                                                        ? "bg-amber-500 hover:bg-amber-600 text-white hover:scale-105 active:scale-95"
                                                        : "bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105 active:scale-95"
                                            )}
                                        >
                                            {nextItem.type === 'EXAM' ? "Start Assessment" : "Move to Next Unit"}
                                            <ChevronRight className="transition-transform group-hover:translate-x-1" size={20} />
                                        </Button>
                                    </motion.div>
                                );
                            })()}
                        </div>

                        <div className="w-full lg:w-72">
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <Info className="text-emerald-600" size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800">Phase Gating</span>
                                </div>
                                <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                                    {activeItem?.type === 'EXAM' 
                                        ? "A score of 70% or higher is mandatory for curriculum progression." 
                                        : "Full engagement with this unit is required to qualify for the phase assessment."}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Sidebar Curriculum */}
        <div className="lg:col-span-4 space-y-6">
            <div className="flex flex-col gap-5 px-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-gray-900 tracking-tighter">Academic Path</h3>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {[1, 2].map(m => {
                            const isModuleLocked = m > 1 && !curriculum.some(i => i.moduleNumber === m-1 && i.type === 'EXAM' && i.isCompleted);
                            return (
                                <button 
                                    key={m}
                                    onClick={() => !isModuleLocked && setActiveModule(m)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all",
                                        activeModule === m ? "bg-white text-emerald-800 shadow-sm" : "text-gray-400 cursor-pointer hover:text-gray-600",
                                        isModuleLocked && "opacity-30 cursor-not-allowed grayscale"
                                    )}
                                >
                                    MOD {m}
                                </button>
                            );
                        })}
                    </div>
                </div>
                
                <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black text-emerald-700/60 uppercase tracking-[0.2em] block mb-0.5">Focus Area</span>
                        <span className="text-xs font-black text-emerald-900">Module {activeModule}: {activeModule === 1 ? 'OS Fundamentals' : 'Process Control'}</span>
                    </div>
                    <div className="px-3 py-1 bg-white rounded-full text-[10px] font-black text-emerald-600 border border-emerald-100 shadow-sm">
                        {curriculum.filter(i => i.moduleNumber === activeModule && i.isCompleted).length} / {curriculum.filter(i => i.moduleNumber === activeModule).length}
                    </div>
                </div>
            </div>
            
            <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                    [1,2,3,4,5].map(i => (
                        <div key={i} className="h-24 w-full bg-gray-50 rounded-2xl animate-pulse" />
                    ))
                ) : curriculum.length === 0 ? (
                    <div className="p-10 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl text-center">
                        <PlayCircle className="mx-auto text-gray-300 mb-3" size={32} />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No Curriculum Found</p>
                    </div>
                ) : (
                    curriculum
                      .filter(item => item.moduleNumber === activeModule || (!item.moduleNumber && activeModule === 1))
                      .map((item) => {
                        const isActive = activeItemId === item.id;
                        return (
                            <motion.div 
                                key={item.id}
                                whileHover={!item.isLocked ? { scale: 1.01, x: 5 } : {}}
                                onClick={() => selectItem(item)}
                                className={cn(
                                    "p-4 md:p-5 rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-300 group relative border",
                                    isActive 
                                        ? "bg-white border-emerald-200 shadow-xl shadow-emerald-900/5 ring-1 ring-emerald-100" 
                                        : item.isLocked 
                                          ? "bg-gray-50/30 opacity-40 grayscale cursor-not-allowed border-transparent"
                                          : "bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-200"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-600 rounded-r-full" />
                                )}
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
                                        isActive ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30" : "bg-white border border-gray-100 text-gray-400 group-hover:text-emerald-500"
                                    )}>
                                        {item.isLocked ? <Lock size={14} /> : item.type === 'EXAM' ? <GraduationCap size={16} /> : item.isCompleted ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Play size={16} fill="currentColor" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={cn(
                                            "text-xs font-black tracking-tight mb-0.5 truncate",
                                            isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"
                                        )}>
                                            {item.title}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600/60">
                                                {item.type === 'EXAM' ? 'PHASE-GATE' : `UNIT ${item.orderIndex}`}
                                            </span>
                                            {item.isCompleted && <span className="text-[8px] font-black text-green-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">Completed</span>}
                                            {item.isLocked && <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">Locked</span>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
            
            <div className="mt-4 p-5 bg-amber-50 rounded-3xl border border-amber-100/50">
                <div className="flex items-center gap-2 mb-2 text-amber-800">
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Requirement</span>
                </div>
                <p className="text-[11px] text-amber-900/60 font-medium leading-relaxed">
                    Complete all units and pass the assessment with 70% to unlock Module {activeModule + 1}.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}
