"use client";

import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileEdit, BookOpen, UserCheck, CalendarDays, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
           <ShieldAlert className="h-8 w-8" /> Admin Console
        </h1>
        <p className="text-muted-foreground">Manage your LMS platform, {user?.name}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" /> User Management
            </CardTitle>
            <CardDescription>Approve or manage students</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Courses & Lessons
            </CardTitle>
            <CardDescription>Create educational content</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="mt-4 mr-2" variant="outline">
              <Link href="/admin/courses">Courses</Link>
            </Button>
             <Button asChild className="mt-4" variant="outline">
              <Link href="/admin/lessons">Lessons</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileEdit className="h-5 w-5" /> Examinations
            </CardTitle>
            <CardDescription>Create quizzes and rules</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/admin/exams">Manage Exams</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5" /> Live Meetings
            </CardTitle>
            <CardDescription>Schedule Google Meets</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/admin/meetings">Schedule Meeting</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-emerald-900 text-lg flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-600" /> Performance Tracking
            </CardTitle>
            <CardDescription>View detailed student progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="mt-4 bg-emerald-600 hover:bg-emerald-700" variant="default">
              <Link href="/admin/progress">View Student Progress</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
