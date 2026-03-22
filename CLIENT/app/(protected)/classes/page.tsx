"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Lock, CheckCircle2 } from "lucide-react";
import { useProgressStore } from "@/store/progressStore";
import { useToast } from "@/lib/toast";

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
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { markLessonComplete } = useProgressStore();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch courses first
    api.get("/courses").then(res => {
      if (res.success && res.data.length > 0) {
        setCourses(res.data);
        setSelectedCourse(res.data[0].id); // Auto select first course
      }
    }).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      setIsLoading(true);
      api.get(`/lessons/${selectedCourse}`).then(res => {
        if (res.success) {
          setLessons(res.data);
        }
      }).finally(() => setIsLoading(false));
    }
  }, [selectedCourse]);

  const handleVideoEnd = async (lessonId: string) => {
    await markLessonComplete(lessonId);
    toast({
      title: "Lesson Completed",
      description: "Progress saved. Next lesson unlocked!",
    });
    // Re-fetch lessons to get the newly unlocked one
    if (selectedCourse) {
      api.get(`/lessons/${selectedCourse}`).then(res => setLessons(res.data));
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Video Classes</h1>
        <p className="text-muted-foreground">Continue where you left off. Lessons must be watched sequentially.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson List Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Course Content</h2>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />)}
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-muted-foreground p-4 bg-muted/50 rounded-lg text-center">No lessons found.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {lessons.map((lesson, idx) => {
                const isHighestIndex = idx === lessons.length - 1; // Last item returned is the current active/unlocked max
                
                // If we hypothetically knew the total list of lessons globally, we'd map over all and blur locked ones.
                // Since our API only returns UNLOCKED lessons (up to max+1), they are all playable!
                // Wait, if backend only returns unlocked + 1, then these are all accessible! We can display them all.

                return (
                  <Card 
                    key={lesson.id} 
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${activeVideo === lesson.id ? 'border-primary' : ''}`}
                    onClick={() => setActiveVideo(lesson.id)}
                  >
                    <CardHeader className="p-4 flex flex-row items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                         <PlayCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">Lesson {lesson.orderIndex}</CardTitle>
                        <CardDescription className="text-xs truncate max-w-[150px]">{lesson.title}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
              
              {/* Dummy locked lesson card for visual representation of the locked UI */}
              <Card className="opacity-50 cursor-not-allowed bg-muted/50">
                 <CardHeader className="p-4 flex flex-row items-center gap-3">
                  <div className="bg-muted p-2 rounded-full">
                     <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-sm text-muted-foreground">Locked Lesson</CardTitle>
                    <CardDescription className="text-xs">Complete previous to unlock</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>
          )}
        </div>

        {/* Video Player Area */}
        <div className="lg:col-span-2">
           {activeVideo ? (
             <div className="space-y-4">
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border relative group">
                  {/* Fake video player using HTML5 audio/video event structure */}
                  <video 
                    controls 
                    className="w-full h-full object-cover"
                    src={lessons.find(l => l.id === activeVideo)?.videoUrl}
                    onEnded={() => handleVideoEnd(activeVideo)}
                    poster="https://images.unsplash.com/photo-1610484826967-09c5720778c7?q=80&w=1000&auto=format&fit=crop"
                  >
                    Your browser doesn't support HTML5 video.
                  </video>
                </div>
                <div className="p-4 bg-card rounded-xl border shadow-sm">
                  <h2 className="text-xl font-bold">{lessons.find(l => l.id === activeVideo)?.title}</h2>
                  <p className="text-muted-foreground mt-2">Watch the video entirely to unlock the next assignment.</p>
                </div>
             </div>
           ) : (
             <div className="aspect-video bg-muted/50 rounded-xl border border-dashed flex items-center justify-center text-muted-foreground flex-col gap-2">
                <PlayCircle className="h-8 w-8 opacity-50" />
                <p>Select a lesson from the sidebar to begin watching</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
