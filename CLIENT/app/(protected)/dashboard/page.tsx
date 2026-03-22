"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/store/progressStore";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaySquare, FileEdit, Video, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { progress, fetchProgress, isLoading } = useProgressStore();

  useEffect(() => {
    if (user?.id) {
      fetchProgress(user.id);
    }
  }, [user, fetchProgress]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-1 shadow-sm sm:col-span-2 lg:col-span-4 bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" /> Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || !progress ? (
              <div className="h-10 animate-pulse bg-primary/10 rounded my-2"></div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{progress.completionPercentage}% Completed</span>
                  <span className="text-muted-foreground">
                    {progress.completedLessons} / {progress.totalLessons} Lessons
                  </span>
                </div>
                {/* Custom Progress Bar */}
                <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out"
                    style={{ width: `${progress.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <PlaySquare className="h-4 w-4" /> Video Classes
            </CardTitle>
            <CardDescription>Watch recorded lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full mt-4" variant="secondary">
              <Link href="/classes">Resume Learning</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileEdit className="h-4 w-4" /> Exams
            </CardTitle>
            <CardDescription>Test your knowledge</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full mt-4" variant="secondary">
              <Link href="/exams">View Exams</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow sm:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="h-4 w-4" /> Live Sessions
            </CardTitle>
            <CardDescription>Join upcoming Google Meets</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full mt-4" variant="outline">
              <Link href="/live">Browse Schedule</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
