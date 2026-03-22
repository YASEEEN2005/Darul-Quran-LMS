"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, FileEdit, CheckCircle2 } from "lucide-react";
import { useProgressStore } from "@/store/progressStore";
import { useToast } from "@/lib/toast";

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [activeExam, setActiveExam] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  
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

    // Format answers for backend: { answers: [ { questionId, selectedOptionIndex } ] }
    const formattedAnswers = Object.keys(answers).map(questionId => ({
      questionId,
      selectedOptionIndex: answers[questionId]
    }));

    try {
      const res = await api.post(`/exams/${activeExam.id}/submit`, { answers: formattedAnswers });
      toast({
        title: "Exam Submitted!",
        description: `You scored ${res.score}%.`,
      });
      setActiveExam(null);
      setAnswers({});
      
      // Refresh exams to unlock next
      if (selectedCourse) {
        api.get(`/exams/${selectedCourse}`).then(r => setExams(r.success ? r.data : []));
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "An error occurred while grading your exam.",
      });
    }
  };

  if (activeExam) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{activeExam.title}</h1>
          <p className="text-muted-foreground">Answer all questions before submitting.</p>
        </div>
        
        <div className="space-y-6">
          {activeExam.questions.map((q: any, i: number) => (
            <Card key={q.id}>
              <CardHeader>
                <CardTitle className="text-lg">Question {i + 1}</CardTitle>
                <CardDescription className="text-base text-foreground mt-2">{q.text}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {q.options.map((opt: string, optIdx: number) => (
                  <div 
                    key={optIdx}
                    onClick={() => setAnswers({...answers, [q.id]: optIdx})}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${answers[q.id] === optIdx ? 'bg-primary/20 border-primary' : 'hover:bg-muted'}`}
                  >
                    {opt}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" onClick={() => setActiveExam(null)}>Cancel</Button>
          <Button onClick={handleSubmitExam}>Submit Exam</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Examinations</h1>
        <p className="text-muted-foreground">Test your knowledge. Exams unlock sequentially.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />)
        ) : exams.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12 bg-muted/30 rounded-xl">
            No exams available for this course.
          </div>
        ) : (
          <>
            {exams.map((exam, idx) => (
              <Card key={exam.id} className="flex flex-col">
                <CardHeader>
                  <div className="bg-primary/10 w-fit p-3 rounded-lg mb-4">
                    <FileEdit className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{exam.title}</CardTitle>
                  <CardDescription>Module {exam.orderIndex}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">Contains {exam.questions?.length || 0} multiple choice questions.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => setActiveExam(exam)}>Start Exam</Button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Visual locked placeholder */}
            <Card className="flex flex-col opacity-50 bg-muted/50 cursor-not-allowed">
              <CardHeader>
                <div className="bg-muted w-fit p-3 rounded-lg mb-4">
                  <Lock className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-muted-foreground">Locked Exam</CardTitle>
                <CardDescription>Complete previous exams to unlock</CardDescription>
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter>
                <Button className="w-full" variant="secondary" disabled>Locked</Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
