"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Search, 
  ChevronRight, 
  Trophy,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseStat {
  courseId: string;
  title: string;
  lessonsTotal: number;
  lessonsCompleted: number;
  examsTotal: number;
  examsCompleted: number;
  completionPercent: number;
  examScores: {
    examId: string;
    score: number;
    title: string;
  }[];
}

interface StudentStat {
  id: string;
  name: string;
  email: string;
  approved: boolean;
  overallProgress: number;
  courses: CourseStat[];
}

export default function AdminProgressPage() {
  const [students, setStudents] = useState<StudentStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentStat | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/admin/student-stats");
      if (res.success) {
        setStudents(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch student stats", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudents = students.length;
  const avgCompletion = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + s.overallProgress, 0) / students.length) 
    : 0;
  const activeStudents = students.filter(s => s.overallProgress > 0).length;

  if (selectedStudent) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedStudent(null)}
              className="mb-2 -ml-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              ← Back to Student List
            </Button>
            <h1 className="text-3xl font-black text-emerald-950 tracking-tight">{selectedStudent.name}</h1>
            <p className="text-emerald-600/70 font-medium">{selectedStudent.email}</p>
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-end">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Overall Success</span>
                <span className="text-2xl font-black text-emerald-900">{selectedStudent.overallProgress}%</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-emerald-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
             <div className="h-1 bg-emerald-500 w-full"></div>
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-emerald-600 uppercase tracking-wider flex items-center justify-between">
                   Courses Started
                   <BookOpen className="w-4 h-4 text-emerald-200 group-hover:text-emerald-500 transition-colors" />
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-3xl font-black text-emerald-950">
                   {selectedStudent.courses.filter(c => c.lessonsCompleted > 0).length} / {selectedStudent.courses.length}
                </div>
             </CardContent>
          </Card>

          <Card className="border-emerald-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
             <div className="h-1 bg-blue-500 w-full"></div>
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center justify-between">
                   Exams Taken
                   <Trophy className="w-4 h-4 text-blue-200 group-hover:text-blue-500 transition-colors" />
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-3xl font-black text-emerald-950">
                   {selectedStudent.courses.reduce((acc, c) => acc + c.examsCompleted, 0)} Total
                </div>
             </CardContent>
          </Card>

          <Card className="border-emerald-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
             <div className="h-1 bg-purple-500 w-full"></div>
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-purple-600 uppercase tracking-wider flex items-center justify-between">
                   Avg. Exam Score
                   <CheckCircle2 className="w-4 h-4 text-purple-200 group-hover:text-purple-500 transition-colors" />
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-3xl font-black text-emerald-950">
                   {(() => {
                      const scores = selectedStudent.courses.flatMap(c => c.examScores.map(s => s.score));
                      return scores.length > 0 ? `${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}%` : "N/A";
                   })()}
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            Detailed Course Progress
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {selectedStudent.courses.map((course) => (
              <Card key={course.courseId} className="border-emerald-100 hover:border-emerald-200 transition-all overflow-hidden bg-white shadow-xs">
                <div className="flex flex-col md:flex-row p-6 items-start md:items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-emerald-950 truncate">{course.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-emerald-600/70 font-medium">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.lessonsCompleted} / {course.lessonsTotal} Lessons</span>
                      <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4" /> {course.examsCompleted} Exams</span>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-64 flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-emerald-900 uppercase">
                        <span>Progress</span>
                        <span>{course.completionPercent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-emerald-50 rounded-full overflow-hidden border border-emerald-100">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                        style={{ width: `${course.completionPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                     {course.examScores.map((exam, idx) => (
                        <div key={idx} className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex flex-col items-center">
                           <span className="text-[9px] font-black text-emerald-600 uppercase mb-0.5">{exam.title}</span>
                           <span className="text-sm font-black text-emerald-900">{exam.score}%</span>
                        </div>
                     ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-emerald-950 tracking-tight">Student Progress</h1>
          <p className="text-emerald-600/70 font-medium mt-1">Monitor and analyze student performance across all modules.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <Input 
                  placeholder="Search students..." 
                  className="pl-10 w-full md:w-80 bg-white border-emerald-100 focus-visible:ring-emerald-500 h-11 rounded-xl shadow-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Button variant="outline" className="h-11 rounded-xl border-emerald-100 text-emerald-700 bg-white hover:bg-emerald-50 shadow-xs">
                <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#011c18] p-6 rounded-3xl border border-emerald-800 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
             <p className="text-emerald-400/60 font-bold uppercase tracking-widest text-[10px] mb-1">Total Enrolled</p>
             <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-white">{totalStudents}</h3>
                <span className="text-emerald-400 font-bold text-sm">Learners</span>
             </div>
             <div className="mt-4 flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                   <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-xs text-white/40 font-medium">Currently active in platform</div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-md relative overflow-hidden group">
             <p className="text-emerald-600/60 font-bold uppercase tracking-widest text-[10px] mb-1">Average Completion</p>
             <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-emerald-950">{avgCompletion}%</h3>
                <span className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" /> Global
                </span>
             </div>
             <div className="mt-4 flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                   <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-xs text-emerald-950/40 font-medium">Platform-wide average progress</div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-md relative overflow-hidden group">
             <p className="text-emerald-600/60 font-bold uppercase tracking-widest text-[10px] mb-1">Active Now</p>
             <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-emerald-950">{activeStudents}</h3>
                <span className="text-blue-600 font-bold text-sm">Students</span>
             </div>
             <div className="mt-4 flex items-center gap-2">
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">ST</div>
                   ))}
                </div>
                <div className="text-xs text-emerald-950/40 font-medium ml-4">Students started learning</div>
             </div>
          </div>
      </div>

      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-emerald-50 bg-emerald-50/30 flex items-center justify-between">
            <h2 className="font-bold text-emerald-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                Roster of Learners
            </h2>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
                {filteredStudents.length} Results
            </div>
        </div>
        <Table>
          <TableHeader className="bg-emerald-50/20">
            <TableRow className="border-emerald-50 hover:bg-transparent">
              <TableHead className="font-bold text-emerald-900 uppercase text-[11px] tracking-widest py-5">Full Name</TableHead>
              <TableHead className="font-bold text-emerald-900 uppercase text-[11px] tracking-widest py-5">Email Address</TableHead>
              <TableHead className="font-bold text-emerald-900 uppercase text-[11px] tracking-widest py-5">Platform Progress</TableHead>
              <TableHead className="font-bold text-emerald-900 uppercase text-[11px] tracking-widest py-5">Access Level</TableHead>
              <TableHead className="text-right font-bold text-emerald-900 uppercase text-[11px] tracking-widest py-5">Detailed Info</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-emerald-50/50">
                  <TableCell><Skeleton className="h-5 w-32 bg-emerald-50" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48 bg-emerald-50" /></TableCell>
                  <TableCell><Skeleton className="h-2 w-full bg-emerald-50" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full bg-emerald-50" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-9 w-24 rounded-lg ml-auto bg-emerald-50" /></TableCell>
                </TableRow>
              ))
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                  <div className="flex flex-col items-center gap-3">
                     <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center">
                        <Users className="w-8 h-8 text-emerald-200" />
                     </div>
                     <p className="text-emerald-950/40 font-bold">No students matched your search criteria.</p>
                     <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="rounded-xl border-emerald-100">Clear Search</Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((s) => (
                <TableRow key={s.id} className="border-emerald-50 hover:bg-emerald-50/10 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-xs font-black text-emerald-700 shadow-sm border border-emerald-200/50">
                          {s.name.substring(0, 2).toUpperCase()}
                       </div>
                       <span className="font-bold text-emerald-950">{s.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-emerald-600/70 py-4 font-medium">{s.email}</TableCell>
                  <TableCell className="w-[30%] py-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-black text-emerald-900 uppercase">
                        <span>LMS Mastery</span>
                        <span>{s.overallProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-emerald-50 rounded-full overflow-hidden border border-emerald-100/50">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                          style={{ width: `${s.overallProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {s.approved ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                         <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                         Active Learner
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full uppercase tracking-tighter">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <Button 
                        size="sm" 
                        onClick={() => setSelectedStudent(s)}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10 text-[11px] font-black uppercase tracking-wider h-9"
                    >
                      View Report <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
