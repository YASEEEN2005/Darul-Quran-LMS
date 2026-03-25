import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import User from "@/models/User";
import Exam from "@/models/Exam";

export async function GET() {
  try {
    await dbConnect();

    // Clear existing data
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Exam.deleteMany({});
    await User.deleteMany({});

    // 0. Create Users
    const demoUser = await User.create({
        email: "navaneethpv550@gmail.com",
        name: "Navaneeth PV",
        role: "ADMIN",
        approved: true,
        googleId: "123456789", // Mock ID
    });

    const demoStudent = await User.create({
        email: "student@example.com",
        name: "Demo Student",
        role: "STUDENT",
        approved: true,
    });

    // 1. Create the User's C Programming Course (from playlist)
    const cCourse = await Course.create({
        title: "C Programming Malayalam Tutorial",
        description: "A comprehensive guide to C programming in Malayalam. Covers fundamentals, variables, loops, and more.",
    });

    const playlist = [
        { title: "Introduction To Programming", id: "mPCzY7b_-YY" },
        { title: "Linux Installation | Eclipse IDE", id: "mPCzY7b_-YY" },
        { title: "Variables Datatypes & I/O", id: "mPCzY7b_-YY" },
        { title: "Conditional Statements", id: "mPCzY7b_-YY" },
        { title: "Loops: FOR Loop explained", id: "mPCzY7b_-YY" },
        { title: "Arrays & Data Structures", id: "mPCzY7b_-YY" },
        { title: "Functions & Scope", id: "mPCzY7b_-YY" },
    ];

    for (let i = 0; i < playlist.length; i++) {
        await Lesson.create({
            courseId: cCourse._id,
            title: `Chapter ${i + 1}: ${playlist[i].title}`,
            videoUrl: `https://www.youtube.com/embed/${playlist[i].id}`,
            orderIndex: i + 1,
        });
    }

    // 2. Create Quran Course
    const quranCourse = await Course.create({
      title: "Mastering Quranic Tajweed",
      description: "Learn the proper pronunciation and rules of Quran recitation from basics to advanced levels. Master the Makhaarij and rules of Noon/Meem Sakinah.",
    });

    const quranLessons = [
        { title: "Basics of Makharij", id: "hHldb-vfnQk" },
        { title: "Rules of Noon Sakinah", id: "hHldb-vfnQk" },
        { title: "Meem Sakinah & Madd", id: "hHldb-vfnQk" },
    ];

    for (let i = 0; i < quranLessons.length; i++) {
        await Lesson.create({
            courseId: quranCourse._id,
            title: quranLessons[i].title,
            videoUrl: `https://www.youtube.com/embed/${quranLessons[i].id}`,
            orderIndex: i + 1,
        });
    }

    // 4. Fiqh Course
    const fiqhCourse = await Course.create({
        title: "Foundations of Islamic Fiqh",
        description: "An introduction to the practical rules of Islamic living, focusing on Taharah (purification) and Salah (prayer).",
    });

    const fiqhLessons = [
        { title: "Understanding Fiqh & Its Sources", id: "hV9vPj_9Z6g" },
        { title: "Rules of Taharah (Purification)", id: "hV9vPj_9Z6g" },
        { title: "The Pillar of Salah", id: "hV9vPj_9Z6g" },
    ];

    for (let i = 0; i < fiqhLessons.length; i++) {
        await Lesson.create({
            courseId: fiqhCourse._id,
            title: fiqhLessons[i].title,
            videoUrl: `https://www.youtube.com/embed/${fiqhLessons[i].id}`,
            orderIndex: i + 1,
        });
    }

    // 5. Seerah Course
    const seerahCourse = await Course.create({
        title: "Life of the Prophet Muhammad (ﷺ)",
        description: "A chronological journey through the life of the final Messenger, exploring his character, mission, and legacy.",
    });

    const seerahLessons = [
        { title: "The Pre-Islamic World", id: "VO3f_f45yO8" },
        { title: "Early Life in Makkah", id: "VO3f_f45yO8" },
        { title: "The Revelation & Da'wah", id: "VO3f_f45yO8" },
    ];

    for (let i = 0; i < seerahLessons.length; i++) {
        await Lesson.create({
            courseId: seerahCourse._id,
            title: seerahLessons[i].title,
            videoUrl: `https://www.youtube.com/embed/${seerahLessons[i].id}`,
            orderIndex: i + 1,
        });
    }

    // 6. Create Operating System BCA 6th Sem Course (3 Modules)
    const osCourse = await Course.create({
        title: "Operating Systems (Calicut University - BCA)",
        description: "In-depth study of OS concepts including process synchronization, memory management, and file systems. Modular curriculum with mandatory grading.",
    });

    // Module 1: Introduction (3 lessons)
    const osModule1 = [
        { title: "Introduction to Operating Systems", id: "79PXp_t8hkU", order: 1 },
        { title: "OS Structures & System Calls", id: "mPCzY7b_-YY", order: 2 },
        { title: "Evolution of OS & Multiprogramming", id: "KJgsSFOSQv0", order: 3 }
    ];

    for (const l of osModule1) {
        await Lesson.create({
            courseId: osCourse._id,
            title: `Module 1: ${l.title}`,
            videoUrl: `https://www.youtube.com/embed/${l.id}`,
            orderIndex: l.order,
            moduleNumber: 1
        });
    }

    // Exam for Module 1
    await Exam.create({
        courseId: osCourse._id,
        title: "Module 1 Phase-Gate Exam",
        orderIndex: 1, // Represents module 1's gate
        questions: [
            { text: "What is the primary purpose of an Operating System?", options: ["Compiling code", "Bridging User and Hardware", "Storing Photos", "None"], correctOptionIndex: 1 },
            { text: "Which system call is used to create a new process?", options: ["fork()", "exit()", "wait()", "read()"], correctOptionIndex: 0 },
            { text: "Multiprogramming allows for what benefit?", options: ["Single Tasking", "Higher CPU Utilization", "Slow context switching", "Deleting files"], correctOptionIndex: 1 }
        ]
    });

    // Module 2: Process Management (3 lessons)
    const osModule2 = [
        { title: "Process Scheduling Algorithms", id: "4-V0JvN7fO4", order: 4 },
        { title: "Critical Section Problem & Semaphores", id: "4-V0JvN7fO4", order: 5 },
        { title: "CPU Scheduling Implementation", id: "4-V0JvN7fO4", order: 6 }
    ];

    for (const l of osModule2) {
        await Lesson.create({
            courseId: osCourse._id,
            title: `Module 2: ${l.title}`,
            videoUrl: `https://www.youtube.com/embed/${l.id}`,
            orderIndex: l.order,
            moduleNumber: 2
        });
    }

    // Exam for Module 2
    await Exam.create({
        courseId: osCourse._id,
        title: "Module 2 Advance Assessment",
        orderIndex: 2, 
        questions: [
            { text: "Which scheduling algorithm is non-preemptive?", options: ["FCFS", "RR", "SRTF", "None"], correctOptionIndex: 0 },
            { text: "A stalemate in process execution is called?", options: ["Deadlock", "Lockout", "Starvation", "Busy Waiting"], correctOptionIndex: 0 }
        ]
    });

    // Final Certification Exam (Module 3)
    await Exam.create({
        courseId: osCourse._id,
        title: "Final OS Mastery Certification",
        orderIndex: 3,
        questions: [
            { text: "Which memory management technique suffers from external fragmentation?", options: ["Paging", "Segmentation", "Virtual Memory", "None"], correctOptionIndex: 1 },
            { text: "What is the primary role of a file system?", options: ["Browsing web", "Hardware abstraction for data storage", "Compiling code", "Network routing"], correctOptionIndex: 1 },
            { text: "What does the 'Dirty Bit' in paging signify?", options: ["Modified Page", "Deleted Page", "Read-only Page", "New Page"], correctOptionIndex: 0 }
        ]
    });

    return NextResponse.json({ 
        success: true, 
        message: "Premium Modular BCA Curriculum Seeded!",
        coursesCreated: 5,
        lessonsCreated: playlist.length + quranLessons.length + fiqhLessons.length + seerahLessons.length + osModule1.length + osModule2.length,
        examsCreated: 3
    });

  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
