"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/lib/toast";

export default function AdminMeetingsPage() {
  const [title, setTitle] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const { toast } = useToast();

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Combine date and time into ISO string
      const dateTime = new Date(`${date}T${time}`).toISOString();
      
      await api.post("/meetings", { title, meetLink, date: dateTime });
      toast({ title: "Success", description: "Meeting scheduled!" });
      setTitle("");
      setMeetLink("");
      setDate("");
      setTime("");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: "Failed to schedule meeting." });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Schedule Live Class</h1>
        <p className="text-muted-foreground">Students will see this in their Live Sessions tab.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Google Meet Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateMeeting} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Title</label>
              <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Q&A Session 1" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Google Meet URL</label>
              <Input type="url" required value={meetLink} onChange={e => setMeetLink(e.target.value)} placeholder="https://meet.google.com/xyz" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" required value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input type="time" required value={time} onChange={e => setTime(e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-full">Schedule Meeting</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
