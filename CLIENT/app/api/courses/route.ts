import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import Exam from "@/models/Exam";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const courses = await Course.find().lean();
    
    const coursesWithCounts = await Promise.all(courses.map(async (c: any) => {
      const lessonsCount = await Lesson.countDocuments({ courseId: c._id });
      const examsCount = await Exam.countDocuments({ courseId: c._id });
      return { ...c, id: c._id.toString(), _count: { lessons: lessonsCount, exams: examsCount } };
    }));

    return NextResponse.json({ success: true, data: coursesWithCounts });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });

    const { title, description } = await req.json();
    const course = await Course.create({ title, description });
    return NextResponse.json({ success: true, data: { ...course.toObject(), id: course._id.toString() } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
