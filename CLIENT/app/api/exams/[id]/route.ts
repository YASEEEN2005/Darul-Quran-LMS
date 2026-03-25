import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Exam from "@/models/Exam";
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

    if (user.role === "ADMIN") {
      const formatted = exams.map((e: any) => ({ 
        ...e, 
        id: e._id.toString(),
        questions: e.questions.map((q: any) => ({ ...q, id: q._id.toString() }))
      }));
      return NextResponse.json({ success: true, count: formatted.length, data: formatted });
    }

    const results = await ExamResult.find({ userId: user.id }).populate('examId').lean();

    let maxCompletedIndex = 0;
    results.forEach((r: any) => {
      if (r.completed && r.examId && r.examId.courseId.toString() === courseId && r.examId.orderIndex > maxCompletedIndex) {
        maxCompletedIndex = r.examId.orderIndex;
      }
    });

    const unlockedExams = exams.filter((e: any) => e.orderIndex <= maxCompletedIndex + 1);
    const formatted = unlockedExams.map((e: any) => ({ 
      ...e, 
      id: e._id.toString(),
      questions: e.questions.map((q: any) => ({ ...q, id: q._id.toString() }))
    }));

    return NextResponse.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
