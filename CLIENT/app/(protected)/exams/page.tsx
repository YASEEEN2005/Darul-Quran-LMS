"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Lock, 
  FileEdit, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  Timer,
  AlertCircle,
  ShieldAlert,
  GraduationCap,
  ArrowRight,
  Trophy,
  Sparkles
} from "lucide-react";
import { useProgressStore } from "@/store/progressStore";
import { useToast } from "@/lib/toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [activeExam, setActiveExam] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { fetchProgress } = useProgressStore();
  const { toast } = useToast();

  useEffect(() => {
    api.get("/courses").then(res => {
      if (res.success && res.data.length > 0) {
        setCourses(res.data);
        setSelectedCourse(res.data[0].id);
      }
    }).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      setIsLoading(true);
      api.get(`/exams/${selectedCourse}`).then(res => {
        if (res.success) {
          setExams(res.data);
        }
      }).finally(() => setIsLoading(false));
    }
  }, [selectedCourse]);

  const handleSubmitExam = async () => {
    if (!activeExam) return;
    setIsSubmitting(true);

    const formattedAnswers = Object.keys(answers).map(questionId => ({
      questionId,
      selectedOptionIndex: answers[questionId]
    }));

    try {
      const res = await api.post(`/exams/${activeExam.id}/submit`, { answers: formattedAnswers });
      toast({
        title: "Submission Successful!",
        description: `Your spiritual depth assessment results: ${res.score}% correct.`,
      });
      setActiveExam(null);
      setAnswers({});
      
      if (selectedCourse) {
        api.get(`/exams/${selectedCourse}`).then(r => setExams(r.success ? r.data : []));
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Assessment Failed",
        description: "An error occurred during grading. Please contact the administrator.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (activeExam) {
    const isCompleted = activeExam.result?.completed;
    const score = activeExam.result?.score;

    if (isCompleted) {
      return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#011c18] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden text-center"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="inline-flex bg-emerald-500/20 border border-emerald-500/30 px-6 py-2 rounded-full items-center gap-2 mb-4">
                 <CheckCircle2 size={18} className="text-emerald-400" />
                 <span className="text-[12px] font-black uppercase tracking-widest text-emerald-100">Assessment Validated</span>
              </div>
              
              <div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-none">
                  {activeExam.title}
                </h1>
                <p className="text-emerald-100/60 text-lg font-medium max-w-xl mx-auto italic">
                  "Knowledge is the light of the heart; you have successfully illuminated your path through this module."
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-center items-center gap-8 py-8">
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl w-full md:w-64 transform hover:scale-105 transition-transform duration-500 underline-offset-8">
                   <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/60 mb-2">Achieved Mastery</span>
                   <span className="text-6xl font-black tracking-tighter">{Math.round(score)}%</span>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 rounded-[2.5rem] backdrop-blur-xl w-full md:w-64 transform hover:scale-105 transition-transform duration-500">
                   <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400/60 mb-2">Prestige Earned</span>
                   <div className="flex items-center justify-center gap-2">
                      <Sparkles size={24} className="text-emerald-400" />
                      <span className="text-5xl font-black tracking-tighter">+{activeExam.questions.length * 10}</span>
                   </div>
                </div>
                
                <div className="space-y-4 text-left">
                   <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                         <Trophy size={20} />
                      </div>
                      <div>
                         <h4 className="font-black text-sm uppercase tracking-wider">Honor Status</h4>
                         <p className="text-emerald-100/50 text-xs font-bold uppercase">{score >= 80 ? 'Gold Distinction' : score >= 50 ? 'Silver Proficiency' : 'Standard Completion'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                         <Timer size={20} />
                      </div>
                      <div>
                         <h4 className="font-black text-sm uppercase tracking-wider">Attempt Cycle</h4>
                         <p className="text-emerald-100/50 text-xs font-bold uppercase">Final Record Locked</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="pt-8 flex justify-center gap-4">
                 <Button 
                    onClick={() => setActiveExam(null)}
                    className="h-16 px-12 rounded-2xl bg-white text-[#011c18] hover:bg-emerald-50 font-black text-lg shadow-2xl transition-all"
                 >
                    Return to Dashboard
                 </Button>
              </div>
            </div>
          </motion.div>

          <Card className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 p-8 text-center max-w-2xl mx-auto">
             <div className="flex items-center justify-center gap-3 text-emerald-600 mb-2">
                <ShieldAlert size={20} />
                <span className="font-black uppercase tracking-[0.2em] text-xs">Administrative Notice</span>
             </div>
             <p className="text-gray-500 font-medium text-sm">
                This assessment follows a strict single-attempt policy. Your results have been permanently logged in the curriculum registry. You may review your score, but the test content remains confidential to preserve evaluation integrity.
             </p>
          </Card>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#011c18] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tighter mb-2">{activeExam.title}</h1>
                  <p className="text-emerald-100/50 text-xs font-medium uppercase tracking-widest">Digital Phase-Gate Assessment</p>
              </div>
              <div className="flex bg-white/5 border border-white/10 px-5 py-3.5 rounded-2xl backdrop-blur-md items-center gap-4">
                  <div className="bg-emerald-500/20 p-2 rounded-full">
                    <Timer size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <span className="block text-[8px] font-black uppercase tracking-widest text-emerald-100/40">Evaluation Duration</span>
                    <span className="text-lg font-bold tracking-tight leading-none">15:00 Mins</span>
                  </div>
              </div>
          </div>
        </motion.div>
        
        <div className="space-y-6">
          {activeExam.questions.map((q: any, i: number) => {
            const qId = q.id || q._id || i;
            return (
              <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={qId}
              >
                  <Card className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500">
                    <CardHeader className="p-8 pb-4">
                      <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600/50">Curriculum Point {i + 1}</span>
                          <HelpCircle size={16} className="text-gray-300" />
                      </div>
                      <CardTitle className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-tight">{q.text}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 space-y-3">
                      {q.options.map((opt: string, optIdx: number) => (
                        <div 
                          key={`${qId}-opt-${optIdx}`}
                          onClick={() => setAnswers({...answers, [qId]: optIdx})}
                          className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-center gap-4 overflow-hidden ${answers[qId] === optIdx ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-900/5' : 'bg-gray-50/50 border-transparent hover:border-emerald-100 hover:bg-white'}`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${answers[qId] === optIdx ? 'bg-emerald-500 border-emerald-500 text-white scale-110' : 'border-gray-200 group-hover:border-emerald-200'}`}>
                              {answers[qId] === optIdx && <div className="w-2 h-2 rounded-full bg-white"></div>}
                          </div>
                          <span className={`text-[15px] font-bold ${answers[qId] === optIdx ? 'text-emerald-900' : 'text-gray-500 group-hover:text-gray-800'}`}>
                              {opt}
                          </span>
                          {answers[qId] === optIdx && (
                              <div className="absolute top-0 right-0 h-full w-12 bg-emerald-500/10 flex items-center justify-center">
                                  <CheckCircle2 size={16} className="text-emerald-600" />
                              </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl gap-6">
          <div className="flex items-center gap-4 text-gray-500">
              <AlertCircle size={20} className="text-emerald-500" />
              <p className="text-sm font-medium">Please review all your answers before submitting the final assessment.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="outline" className="h-14 px-8 rounded-2xl border-gray-100 font-bold text-gray-400 hover:text-gray-600 flex-1 md:flex-none" onClick={() => setActiveExam(null)}>Discard</Button>
            <Button 
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="h-14 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-xl shadow-emerald-500/10 flex-1 md:flex-none"
            >
                {isSubmitting ? "Submitting..." : "Submit Answers"}
                {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px]">
                <GraduationCap size={14} />
                Knowledge Evaluation
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-gray-900 leading-tight">Examinations</h1>
            <p className="text-gray-500 font-medium text-xs md:text-base max-w-lg">
                Complete your course modules to unlock advanced quizzes and certifications.
            </p>
        </div>

        {/* Global tab placeholder */}
        <div className="flex gap-2">
            {courses.map(course => (
                <button 
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-[12px] font-black transition-all ${selectedCourse === course.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                >
                    {course.title.split(' ')[0]}...
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-[2.5rem]" />)
        ) : exams.length === 0 ? (
          <div className="col-span-full text-center py-24 bg-gray-50 border border-dashed border-gray-200 rounded-[3rem]">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <ShieldAlert size={32} strokeWidth={1} />
            </div>
            <p className="text-gray-400 font-medium">No assessments found for this course tracking ID.</p>
          </div>
        ) : (
          <AnimatePresence>
            {exams.map((exam, idx) => {
              const isLocked = exam.isLocked;
              const isCompleted = exam.result?.completed;
              const score = exam.result?.score;
              return (
              <motion.div 
                key={exam.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={!isLocked && !isCompleted ? { y: -8 } : {}}
              >
                <Card className={cn(
                    "flex flex-col h-full bg-white rounded-[2.5rem] border transition-all duration-700 overflow-hidden relative group",
                    isLocked ? "border-gray-100 opacity-60 grayscale cursor-not-allowed" : isCompleted ? "border-emerald-200/50 shadow-sm" : "border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/10"
                )}>
                  {isLocked && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/5 backdrop-blur-[1px]">
                        <div className="bg-white/80 p-4 rounded-full shadow-2xl border border-gray-100">
                             <Lock className="h-8 w-8 text-gray-400" />
                        </div>
                    </div>
                  )}
                  {!isLocked && !isCompleted && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all duration-700"></div>}
                  {isCompleted && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16"></div>}
                  
                  <CardHeader className="p-8 pb-4 relative z-10">
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform shadow-inner border",
                        isLocked ? "bg-gray-100 border-gray-200" : isCompleted ? "bg-emerald-500 border-emerald-600 text-white" : "bg-emerald-50 border-emerald-100/50 group-hover:scale-110"
                    )}>
                      {isLocked ? <Lock className="h-6 w-6 text-gray-300" /> : isCompleted ? <CheckCircle2 className="h-6 w-6 text-white" /> : <FileEdit className="h-6 w-6 text-emerald-600" strokeWidth={2.5} />}
                    </div>
                    <CardTitle className="text-2xl font-black text-gray-900 tracking-tight leading-tight mb-2">{exam.title}</CardTitle>
                    <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/50">Module {exam.orderIndex || idx + 1}</span>
                         <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                         <span className={cn("text-[10px] font-bold uppercase tracking-widest", isCompleted ? "text-emerald-500" : "text-gray-400")}>{isLocked ? 'Locked' : isCompleted ? 'Completed' : 'Available'} Assessment</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 flex-1 relative z-10">
                    {isCompleted ? (
                      <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100/50 text-center">
                          <div className="text-[10px] font-black uppercase text-emerald-600/60 tracking-widest mb-1">Final Score</div>
                          <div className="text-3xl font-black text-emerald-700">{Math.round(score)}%</div>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="flex justify-between items-center text-[11px] font-black uppercase text-gray-400 tracking-widest mb-1">
                               <span>Complexity</span>
                               <span className="text-emerald-600">Standard</span>
                           </div>
                           <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                               <div className="h-full w-[100%] bg-emerald-500 rounded-full"></div>
                           </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-8 pt-0 relative z-10">
                    <Button 
                        disabled={isLocked}
                        className={cn(
                            "w-full h-14 rounded-2xl font-black shadow-lg transition-all flex gap-3",
                            isLocked
                                ? "bg-gray-100 text-gray-400 border-gray-200 shadow-none" 
                                : isCompleted 
                                  ? "bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50"
                                  : "bg-emerald-600 hover:bg-[#011c18] text-white shadow-emerald-500/10 group-hover:shadow-emerald-500/20"
                        )}
                        onClick={() => setActiveExam(exam)}
                    >
                        {isLocked ? 'Access Restricted' : isCompleted ? 'View Assessment Result' : 'Initiate Assessment'}
                        {!isLocked && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )})}
            
            {/* Visual locked placeholder */}
            <div className="bg-gray-50/30 rounded-[2.5rem] border border-dashed border-gray-200 p-8 flex flex-col justify-center items-center text-center opacity-60 grayscale scale-95 pointer-events-none">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                <Lock className="h-6 w-6 text-gray-300" />
              </div>
              <h4 className="text-xl font-black text-gray-400 mb-2">Advance Assessment</h4>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em]">COMPLETE MODULE 2 TO UNLOCK</p>
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
