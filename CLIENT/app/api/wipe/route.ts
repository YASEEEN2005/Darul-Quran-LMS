import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import Exam from "@/models/Exam";

export async function GET() {
  try {
    await dbConnect();
    
    // Wipe all curriculum data
    const courseRes = await Course.deleteMany({});
    const lessonRes = await Lesson.deleteMany({});
    const examRes = await Exam.deleteMany({});

    return NextResponse.json({ 
        success: true, 
        message: "All curriculum data wiped successfully.",
        deleted: {
            courses: courseRes.deletedCount,
            lessons: lessonRes.deletedCount,
            exams: examRes.deletedCount
        }
    });

  } catch (error: any) {
    console.error("Wipe error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
