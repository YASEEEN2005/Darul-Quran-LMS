import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import User from "@/models/User";
import Exam from "@/models/Exam";

export async function GET() {
  try {
    await dbConnect();

    // 1. Wipe all existing data for a clean slate
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Exam.deleteMany({});
    // We keep existing users for login persistence

    // 2. Create the production-grade OS Course
    const osCourse = await Course.create({
        title: "Operating Systems (BMS/BCA 6th Sem)",
        description: "Official Calicut University curriculum covering OS fundamentals, Process Management, Memory, and File Systems. Taught by industry experts via Gate Smashers series.",
    });

    // Module 1 Contents (Intro & Types)
    const module1 = [
        { title: "Definition & Objectives of OS", id: "FYmHy0St6G4", order: 1 },
        { title: "Primary Functions of OS", id: "-gdvC1th8PU", order: 2 },
        { title: "Serial Processing Systems", id: "YDrxwum0VTE", order: 3 },
        { title: "Batch Processing Systems", id: "xnqxjdGoYW4", order: 4 },
        { title: "Multiprogramming & CPU Utilization", id: "rxUHUcYjA-A", order: 5 },
        { title: "Time Sharing Systems", id: "tkqFOtXOGI8", order: 6 },
        { title: "Parallel Processing (Symmetric/Asymmetric)", id: "fOC8ObALUnw", order: 7 },
        { title: "Distributed Operating Systems", id: "zSY-K2B7Erc", order: 8 },
        { title: "Real-Time OS (Hard vs Soft)", id: "nETI5zUve8g", order: 9 }
    ];

    for (const l of module1) {
        await Lesson.create({
            courseId: osCourse._id,
            title: l.title,
            videoUrl: `https://www.youtube.com/embed/${l.id}`,
            orderIndex: l.order,
            moduleNumber: 1
        });
    }

    // Module 1 Phase-Gate Exam
    await Exam.create({
        courseId: osCourse._id,
        title: "Module 1: Fundamental Assessment",
        orderIndex: 1, 
        moduleNumber: 1,
        questions: [
            { 
                text: "What are the three primary objectives of an Operating System?", 
                options: ["Speed, Cost, Storage", "Convenience, Efficiency, Evolvability", "Gaming, Browsing, Typing", "None of the above"], 
                correctOptionIndex: 1 
            },
            { 
                text: "In Multiprogramming, what happens when the current job waits for I/O?", 
                options: ["CPU remains idle", "System crashes", "CPU switches to another job", "Computer restarts"], 
                correctOptionIndex: 2 
            },
            { 
                text: "Which system has absolute deadlines and zero tolerance for delay?", 
                options: ["Soft Real-Time", "Hard Real-Time", "Time Sharing", "Parallel Processing"], 
                correctOptionIndex: 1 
            }
        ]
    });

    // Module 2 Contents (Process Management)
    const module2 = [
        { title: "Process: Definition & Structure", id: "w0w8b97fPDY", order: 10 },
        { title: "The 5-State Process Model", id: "NoU19Bfp0s0", order: 11 },
        { title: "Process Control Block (PCB)", id: "Lh_j7ZatpY0", order: 12 },
        { title: "Intro to CPU Scheduling", id: "zF9G824S8uU", order: 13 }
    ];

    for (const l of module2) {
        await Lesson.create({
            courseId: osCourse._id,
            title: l.title,
            videoUrl: `https://www.youtube.com/embed/${l.id}`,
            orderIndex: l.order,
            moduleNumber: 2
        });
    }

    // Module 2 Advance Exam
    await Exam.create({
        courseId: osCourse._id,
        title: "Module 2: Process Control Quiz",
        orderIndex: 2,
        moduleNumber: 2,
        questions: [
            { text: "Which state follows 'Running' when a time slice expires?", options: ["Terminated", "Waiting", "Ready", "New"], correctOptionIndex: 2 },
            { text: "What is stored in the Process Control Block?", options: ["Process ID & State", "User Password", "HTML Code", "Nothing"], correctOptionIndex: 0 }
        ]
    });

    return NextResponse.json({ 
        success: true, 
        message: "Production OS Curriculum (Calicut University) Seeded Successfully!",
        summary: {
            course: osCourse.title,
            lessons: module1.length + module2.length,
            exams: 2
        }
    });

  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
