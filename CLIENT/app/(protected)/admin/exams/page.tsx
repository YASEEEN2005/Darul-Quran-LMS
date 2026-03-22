"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/lib/toast";
import { PlusCircle, Trash2 } from "lucide-react";

export default function AdminExamsPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [orderIndex, setOrderIndex] = useState("");
  
  const [questions, setQuestions] = useState([{ text: "", options: ["", ""], correctOptionIndex: 0 }]);
  const { toast } = useToast();

  useEffect(() => {
    api.get("/courses").then(res => {
      if (res.success) setCourses(res.data);
    });
  }, []);

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Examination</h1>
        <p className="text-muted-foreground">Add interactive quizzes required for course progression.</p>
      </div>

      <form onSubmit={handleCreateExam} className="space-y-6">
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
            <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
}
