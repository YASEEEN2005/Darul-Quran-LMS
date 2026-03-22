"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/lib/toast";

export default function AdminLessonsPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    api.get("/courses").then(res => {
      if (res.success) setCourses(res.data);
    });
  }, []);

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/lessons", { 
        courseId, 
        title, 
        videoUrl, 
        orderIndex: Number(orderIndex) 
      });
      toast({ title: "Success", description: "Lesson created!" });
      setTitle("");
      setVideoUrl("");
      setOrderIndex("");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Failed to create lesson." });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Lesson</h1>
        <p className="text-muted-foreground">Attach video lessons to specific courses.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateLesson} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Course</label>
              <select 
                title="Course Selection"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={courseId} onChange={e => setCourseId(e.target.value)} required
              >
                <option value="" disabled>Select a course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Lesson Title</label>
              <Input required value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL (HTTPS)</label>
              <Input type="url" required value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Order Index (Sequence ID)</label>
              <Input type="number" required min="1" value={orderIndex} onChange={e => setOrderIndex(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Save Lesson</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
