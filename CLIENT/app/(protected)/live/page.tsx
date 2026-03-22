"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, CalendarDays } from "lucide-react";
import Link from "next/link";

interface Meeting {
  id: string;
  title: string;
  meetLink: string;
  date: string;
}

export default function LiveClassesPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get("/meetings").then(res => {
      if (res.success) {
        setMeetings(res.data);
      }
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Sessions</h1>
        <p className="text-muted-foreground">Join scheduled Google Meet classes with your instructors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2].map(i => <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />)
        ) : meetings.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12 bg-muted/30 rounded-xl border border-dashed">
            No upcoming live sessions scheduled.
          </div>
        ) : (
          meetings.map((meeting) => (
            <Card key={meeting.id} className="flex flex-col group hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="bg-blue-500/10 w-fit p-3 rounded-lg mb-4 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Video className="h-6 w-6" />
                  </div>
                  <div className="text-xs bg-muted px-2 py-1 rounded-full flex items-center gap-1 text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(meeting.date).toLocaleDateString()}
                  </div>
                </div>
                <CardTitle className="text-xl">{meeting.title}</CardTitle>
                <CardDescription>
                  {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href={meeting.meetLink} target="_blank" rel="noopener noreferrer">
                    Join via Google Meet
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
