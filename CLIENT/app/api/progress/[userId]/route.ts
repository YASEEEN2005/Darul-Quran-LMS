import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Lesson from "@/models/Lesson";
import LessonProgress from "@/models/LessonProgress";
import Exam from "@/models/Exam";
import ExamResult from "@/models/ExamResult";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    const { userId } = await params;

    if (!user || (user.id !== userId && user.role !== "ADMIN")) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    const totalLessons = await Lesson.countDocuments();
    const completedLessons = await LessonProgress.countDocuments({ userId, completed: true });
    const lessonProgress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

    const totalExams = await Exam.countDocuments();
    const completedExams = await ExamResult.countDocuments({ userId, completed: true });
    const examProgress = totalExams === 0 ? 0 : Math.round((completedExams / totalExams) * 100);

    const overallProgress = Math.round((lessonProgress + examProgress) / 2);

    return NextResponse.json({
      success: true,
      data: { lessonProgress, examProgress, overallProgress },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
