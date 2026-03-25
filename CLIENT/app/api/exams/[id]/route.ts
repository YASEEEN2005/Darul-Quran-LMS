import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Exam from "@/models/Exam";
import Lesson from "@/models/Lesson";
import LessonProgress from "@/models/LessonProgress";
import ExamResult from "@/models/ExamResult";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id: courseId } = await params;
    const exams = await Exam.find({ courseId }).sort({ orderIndex: 1 }).lean();
    if (exams.length === 0) return NextResponse.json({ success: true, count: 0, data: [] });

    // Fetch user progress for gating
    const courseLessons = await Lesson.find({ courseId }).lean();
    const userProgress = await LessonProgress.find({ userId: user.id }).lean();
    const examResults = await ExamResult.find({ userId: user.id }).lean();

    const formatted = exams.map((exam: any) => {
      // 1. Check if all preceding exams were passed (70%+)
      const precedingExamsPassed = exams
        .filter((e: any) => e.orderIndex < exam.orderIndex)
        .every((pre: any) => {
          const res = examResults.find(r => r.examId.toString() === pre._id.toString());
          return res && res.score >= 70;
        });

      // 2. Check if all lessons in THIS module are completed
      const lessonsInModule = courseLessons.filter((l: any) => l.moduleNumber === exam.moduleNumber);
      const moduleLessonsCompleted = lessonsInModule.every((l: any) => 
        userProgress.some((p: any) => p.lessonId.toString() === l._id.toString() && p.completed)
      );

      return { 
        ...exam, 
        id: exam._id.toString(),
        isLocked: !precedingExamsPassed || !moduleLessonsCompleted,
        questions: exam.questions.map((q: any) => ({ ...q, id: q._id.toString() }))
      };
    });

    return NextResponse.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
