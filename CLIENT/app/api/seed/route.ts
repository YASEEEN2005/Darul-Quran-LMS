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
        { title: "Introduction To Programming", id: "pDmEYRhyusU" },
        { title: "Linux Installation | Eclipse IDE", id: "XW7HI6ajZfo" },
        { title: "Variables Datatypes & I/O", id: "qGGqnzvKjmM" },
        { title: "Conditional Statements", id: "W7s0upNfcKY" },
        { title: "Loops: FOR Loop explained", id: "YfaJzXFbFcQ" },
        { title: "Arrays & Data Structures", id: "d0drJeqmiws" },
        { title: "Functions & Scope", id: "pDmEYRhyusU" }, // Placeholder duplicate for test
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
        { title: "Basics of Makharij", id: "97_y1tX-fsw" },
        { title: "Rules of Noon Sakinah", id: "97_y1tX-fsw" },
        { title: "Meem Sakinah & Madd", id: "97_y1tX-fsw" },
    ];

    for (let i = 0; i < quranLessons.length; i++) {
        await Lesson.create({
            courseId: quranCourse._id,
            title: `Session ${i + 1}: ${quranLessons[i].title}`,
            videoUrl: `https://www.youtube.com/embed/${quranLessons[i].id}`,
            orderIndex: i + 1,
        });
    }

    // 3. Create a Demo Exam for the C Course
    await Exam.create({
        courseId: cCourse._id,
        title: "Programming Fundamentals Proficiency",
        orderIndex: 1,
        questions: [
            {
                text: "Which of the following is a literal in C?",
                options: ["123", "int", "float", "main"],
                correctOptionIndex: 0,
            },
            {
                text: "What is the size of 'int' on most 64-bit systems?",
                options: ["2 bytes", "4 bytes", "8 bytes", "Depends on compiler"],
                correctOptionIndex: 1,
            },
            {
                text: "Which keyword is used to skip the rest of the current loop iteration?",
                options: ["break", "continue", "skip", "next"],
                correctOptionIndex: 1,
            }
        ]
    });

    return NextResponse.json({ 
        success: true, 
        message: "Database seeded successfully with your playlist!",
        coursesCreated: 2,
        lessonsCreated: 2 + playlist.length,
        examsCreated: 1
    });

  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
