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

    if (lessons.length === 0) {
      return NextResponse.json({ success: true, count: 0, data: [] });
    }

    if (user.role === "ADMIN") {
      const formatted = lessons.map((l: any) => ({ ...l, id: l._id.toString() }));
      return NextResponse.json({ success: true, count: formatted.length, data: formatted });
    }

    const progresses = await LessonProgress.find({ userId: user.id })
      .populate('lessonId')
      .lean();

    let maxCompletedIndex = 0;
    progresses.forEach((p: any) => {
      if (p.completed && p.lessonId && p.lessonId.courseId.toString() === courseId && p.lessonId.orderIndex > maxCompletedIndex) {
        maxCompletedIndex = p.lessonId.orderIndex;
      }
    });

    const unlockedLessons = lessons.filter((lesson: any) => lesson.orderIndex <= maxCompletedIndex + 1);
    const formatted = unlockedLessons.map((l: any) => ({ ...l, id: l._id.toString() }));

    return NextResponse.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
