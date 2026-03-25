import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Lesson from "@/models/Lesson";
import LessonProgress from "@/models/LessonProgress";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id: courseId } = await params;

    const lessons = await Lesson.find({ courseId }).sort({ orderIndex: 1 }).lean();
    const Exam = (await import("@/models/Exam")).default;
    const exams = await Exam.find({ courseId }).sort({ orderIndex: 1 }).lean();
    const LessonProgress = (await import("@/models/LessonProgress")).default;
    const ExamResult = (await import("@/models/ExamResult")).default;
    
    const progresses = await LessonProgress.find({ userId: user.id }).lean();
    const results = await ExamResult.find({ userId: user.id }).lean();

    const completedLessonIds = progresses.filter((p: any) => p.completed).map((p: any) => p.lessonId.toString());
    const examResultsMap = results.reduce((acc: any, r: any) => {
        acc[r.examId.toString()] = r.score;
        return acc;
    }, {});

    const curriculum: any[] = [];
    lessons.forEach(l => curriculum.push({ ...l, id: l._id.toString(), type: 'LESSON', isCompleted: completedLessonIds.includes(l._id.toString()) }));
    exams.forEach(e => curriculum.push({ ...e, id: e._id.toString(), type: 'EXAM', score: examResultsMap[e._id.toString()] || 0, isCompleted: (examResultsMap[e._id.toString()] || 0) >= 70 }));

    curriculum.sort((a, b) => a.orderIndex - b.orderIndex);

    let currentLocked = false;
    const formatted = curriculum.map((item, idx) => {
        let isLocked = false;
        if (idx === 0) {
            isLocked = false;
        } else {
            const prev = curriculum[idx - 1];
            if (!prev.isCompleted) isLocked = true;
        }

        if (currentLocked) isLocked = true;
        if (isLocked) currentLocked = true;

        return { ...item, isLocked };
    });

    return NextResponse.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
