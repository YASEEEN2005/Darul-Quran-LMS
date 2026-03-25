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
        message: "Database seeded successfully with premium curriculum!",
        coursesCreated: 4,
        lessonsCreated: playlist.length + quranLessons.length + fiqhLessons.length + seerahLessons.length,
        examsCreated: 1
    });

  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
