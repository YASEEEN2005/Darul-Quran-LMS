"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/lib/toast";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      if (res.success) setCourses(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/courses", { title, description });
      toast({ title: "Success", description: "Course created successfully!" });
      setTitle("");
      setDescription("");
      fetchCourses();
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to create course." });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Courses</h1>
        <p className="text-muted-foreground">Create and view educational courses.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course Title</label>
              <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Advanced Next.js" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Course description..." />
            </div>
            <Button type="submit">Create Course</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4 mt-8">
        <h3 className="text-xl font-bold">Existing Courses</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map(course => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                <div className="flex gap-4 text-sm font-medium">
                  <span>{course._count?.lessons || 0} Lessons</span>
                  <span>{course._count?.exams || 0} Exams</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {courses.length === 0 && <p className="text-muted-foreground">No courses created yet.</p>}
        </div>
      </div>
    </div>
  );
}
