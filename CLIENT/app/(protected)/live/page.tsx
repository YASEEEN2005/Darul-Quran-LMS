"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, CalendarDays, ExternalLink, Clock, UserCheck, VideoIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px]">
                <VideoIcon size={14} />
                Synchronous Education
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900">Live Hall</h1>
            <p className="text-gray-500 font-medium max-w-lg">
                Join our premium interactive sessions with scholars and fellow students.
            </p>
        </div>
        
        {/* Placeholder for timezone */}
        <div className="bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100/50 flex items-center gap-3">
            <Clock size={16} className="text-emerald-600" />
            <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">Active Timezone: UTC (+05:30)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
        {isLoading ? (
          [1, 2].map(i => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-[2.5rem]" />)
        ) : meetings.length === 0 ? (
          <div className="col-span-full py-24 bg-gray-50 border border-dashed border-gray-200 rounded-[3rem] text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <VideoIcon size={32} strokeWidth={1} />
            </div>
            <p className="text-gray-400 font-medium">No upcoming live sessions found in your hall.</p>
          </div>
        ) : (
          <AnimatePresence>
            {meetings.map((meeting, idx) => (
              <motion.div 
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="flex flex-col h-full bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-700 overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                  
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <Video className="h-6 w-6" strokeWidth={2.5} />
                        </div>
                        <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full flex items-center gap-1.5 shadow-sm">
                            <CalendarDays className="h-3 w-3" strokeWidth={2.5} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{new Date(meeting.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors uppercase">{meeting.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-gray-400 font-bold uppercase tracking-widest mt-2">
                        <Clock size={12} className="text-emerald-500/50" />
                        Scheduled for {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-8 pt-0 flex-1">
                    <div className="flex items-center gap-4 text-gray-500">
                        <div className="flex -space-x-2">
                             {[1,2,3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                    <img src={`https://i.pravatar.cc/100?u=${meeting.id}${i}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] font-black uppercase text-emerald-600/50 tracking-widest">+12 Attending</span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-8 pt-0">
                    <Button 
                        asChild 
                        className="w-full h-14 rounded-2xl bg-[#011c18] hover:bg-emerald-600 text-white font-black shadow-xl shadow-emerald-500/10 transition-all flex items-center justify-center gap-3"
                    >
                      <Link href={meeting.meetLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={18} />
                        Join Virtual Hall
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
