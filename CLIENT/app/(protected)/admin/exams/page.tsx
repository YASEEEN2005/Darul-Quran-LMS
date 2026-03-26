"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/lib/toast";
import { PlusCircle, Trash2, Search, Users, Trophy as TrophyIcon, User as UserIcon, Mail, CheckCircle2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function AdminExamsPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [orderIndex, setOrderIndex] = useState("");
  
  const [questions, setQuestions] = useState([{ text: "", options: ["", ""], correctOptionIndex: 0 }]);
  const { toast } = useToast();

  const [view, setView] = useState<"create" | "results">("create");
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  useEffect(() => {
    api.get("/courses").then(res => {
      if (res.success) setCourses(res.data);
    });
  }, []);

  useEffect(() => {
    if (view === "results") {
      setIsLoadingResults(true);
      api.get("/admin/student-stats").then(res => {
        if (res.success) setStudents(res.data);
      }).finally(() => setIsLoadingResults(false));
    }
  }, [view]);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/exams", {
        courseId,
        title,
        orderIndex: Number(orderIndex),
        questions
      });
      toast({ title: "Success", description: "Exam created with questions!" });
      setTitle("");
      setOrderIndex("");
      setQuestions([{ text: "", options: ["", ""], correctOptionIndex: 0 }]);
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to create exam." });
    }
  };

  const addQuestion = () => setQuestions([...questions, { text: "", options: ["", ""], correctOptionIndex: 0 }]);
  
  const addOption = (qIdx: number) => {
    const newQ = [...questions];
    newQ[qIdx].options.push("");
    setQuestions(newQ);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Examination Management</h1>
          <p className="text-muted-foreground">Configure curriculum assessments or monitor student performance.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
           <button 
              onClick={() => setView("create")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                view === "create" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
           >
              Create Exam
           </button>
           <button 
              onClick={() => setView("results")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                view === "results" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
           >
              Student Results
           </button>
        </div>
      </div>

      {view === "create" ? (
      <form onSubmit={handleCreateExam} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
        <Card>
          <CardHeader>
            <CardTitle>Exam Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <label className="text-sm font-medium">Select Course</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={courseId} onChange={e => setCourseId(e.target.value)} required
                title="Select Course"
              >
                <option value="" disabled>Select a course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Exam Title</label>
                <Input required value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order Index</label>
                <Input type="number" required min="1" value={orderIndex} onChange={e => setOrderIndex(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {questions.map((q, qIdx) => (
          <Card key={qIdx}>
             <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Question {qIdx + 1}</CardTitle>
                {questions.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question Text</label>
                  <Input required value={q.text} onChange={e => {
                    const newQs = [...questions];
                    newQs[qIdx].text = e.target.value;
                    setQuestions(newQs);
                  }} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Options</label>
                    <Button type="button" variant="link" size="sm" onClick={() => addOption(qIdx)}>
                      <PlusCircle className="mr-1 h-3 w-3" /> Add Option
                    </Button>
                  </div>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name={`correct-${qIdx}`} 
                        checked={q.correctOptionIndex === optIdx}
                        onChange={() => {
                          const newQs = [...questions];
                          newQs[qIdx].correctOptionIndex = optIdx;
                          setQuestions(newQs);
                        }}
                        className="w-4 h-4 cursor-pointer"
                        title={"Mark as correct answer"}
                      />
                      <Input 
                        required 
                        value={opt} 
                        onChange={e => {
                          const newQs = [...questions];
                          newQs[qIdx].options[optIdx] = e.target.value;
                          setQuestions(newQs);
                        }} 
                        placeholder={`Option ${optIdx + 1}`}
                      />
                      {q.options.length > 2 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => {
                          const newQs = [...questions];
                          newQs[qIdx].options = newQs[qIdx].options.filter((_, i) => i !== optIdx);
                          if (newQs[qIdx].correctOptionIndex >= newQs[qIdx].options.length) {
                             newQs[qIdx].correctOptionIndex = 0;
                          }
                          setQuestions(newQs);
                        }}>
                           <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <div className="text-xs text-muted-foreground mt-2">Select the radio button next to the correct answer.</div>
                </div>
             </CardContent>
          </Card>
        ))}

        <div className="flex justify-between">
           <Button type="button" variant="secondary" onClick={addQuestion}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Another Question
           </Button>
           <Button type="submit">Save Exam</Button>
        </div>
      </form>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
           <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Academic Results Ledger</CardTitle>
                  <CardDescription>Comprehensive log of all student assessment attempts and performance metrics.</CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                     placeholder="Search student..." 
                     className="pl-9 h-10 border-gray-200"
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
             <CardContent>
                <div className="overflow-x-auto">
                  <Table className="min-w-[700px]">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-gray-100">
                        <TableHead className="font-bold text-gray-900">Student</TableHead>
                        <TableHead className="font-bold text-gray-900">Course / Exam</TableHead>
                        <TableHead className="font-bold text-gray-900 text-center">Score</TableHead>
                        <TableHead className="font-bold text-gray-900 text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingResults ? (
                        [1,2,3].map(i => (
                          <TableRow key={i}>
                            <TableCell><div className="h-10 bg-gray-50 animate-pulse rounded-lg" /></TableCell>
                            <TableCell><div className="h-10 bg-gray-50 animate-pulse rounded-lg" /></TableCell>
                            <TableCell><div className="h-10 bg-gray-50 animate-pulse rounded-lg" /></TableCell>
                            <TableCell><div className="h-10 bg-gray-50 animate-pulse rounded-lg" /></TableCell>
                          </TableRow>
                        ))
                      ) : students.length === 0 ? (
                         <TableRow>
                            <TableCell colSpan={4} className="text-center py-12 text-gray-400">No student records found.</TableCell>
                         </TableRow>
                      ) : (
                        students
                          .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(student => (
                            <React.Fragment key={student.id}>
                              {student.courses.map((course: any) => 
                                course.examScores.map((exam: any, eIdx: number) => (
                                  <TableRow key={`${student.id}-${course.courseId}-${eIdx}`} className="border-gray-50 hover:bg-emerald-50/30 transition-colors">
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-black text-gray-600 border border-gray-200 shadow-sm">
                                            {student.name.substring(0,2).toUpperCase()}
                                         </div>
                                         <div>
                                            <div className="font-bold text-gray-900">{student.name}</div>
                                            <div className="text-[10px] font-medium text-gray-400 italic">{student.email}</div>
                                         </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                       <div className="font-bold text-emerald-900">{exam.title}</div>
                                       <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{course.title}</div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                       <div className="inline-flex flex-col items-center">
                                          <span className={cn(
                                            "text-lg font-black tracking-tighter",
                                            exam.score >= 80 ? "text-emerald-600" : exam.score >= 50 ? "text-blue-600" : "text-amber-600"
                                          )}>{exam.score}%</span>
                                          <div className="w-12 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                             <div className={cn(
                                                "h-full rounded-full transition-all duration-1000",
                                                exam.score >= 80 ? "bg-emerald-500" : exam.score >= 50 ? "bg-blue-500" : "bg-amber-500"
                                             )} style={{ width: `${exam.score}%` }}></div>
                                          </div>
                                       </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tighter border border-emerald-100">
                                          <CheckCircle2 size={12} />
                                          Completed
                                       </span>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </React.Fragment>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
             </CardContent>
           </Card>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#011c18] p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                 <Users className="w-8 h-8 text-emerald-400 mb-4" />
                 <div className="text-4xl font-black tracking-tighter mb-1">
                    {new Set(students.flatMap(s => s.courses.flatMap((c: any) => c.examScores.length > 0 ? [s.id] : []))).size}
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60">Students Evaluated</div>
              </div>
              
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl relative overflow-hidden group">
                 <TrophyIcon className="w-8 h-8 text-emerald-600 mb-4" />
                 <div className="text-4xl font-black tracking-tighter mb-1">
                    {Math.round(students.reduce((acc, s) => {
                      const scores = s.courses.flatMap((c: any) => c.examScores.map((e: any) => e.score));
                      return acc + (scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0);
                    }, 0) / (students.filter(s => s.courses.some((c: any) => c.examScores.length > 0)).length || 1))}%
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Mean Pass Rate</div>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl relative overflow-hidden group col-span-1 sm:col-span-2 lg:col-span-1">
                 <Mail className="w-8 h-8 text-emerald-600 mb-4" />
                 <div className="text-4xl font-black tracking-tighter mb-1">
                    {students.reduce((acc, s) => acc + s.courses.reduce((a: number, c: any) => a + c.examScores.length, 0), 0)}
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Total Assessments</div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
