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

    const progresses = await LessonProgress.find({ userId: user.id }).lean();
    const completedLessonIds = progresses.filter((p: any) => p.completed).map((p: any) => p.lessonId.toString());

    let maxCompletedOrder = 0;
    progresses.forEach((p: any) => {
      const lesson = lessons.find((l: any) => l._id.toString() === p.lessonId.toString());
      if (p.completed && lesson && lesson.orderIndex > maxCompletedOrder) {
        maxCompletedOrder = lesson.orderIndex;
      }
    });

    const formatted = lessons.map((l: any) => {
      const isCompleted = completedLessonIds.includes(l._id.toString());
      const isLocked = user.role !== "ADMIN" && l.orderIndex > maxCompletedOrder + 1;
      
      return {
        ...l,
        id: l._id.toString(),
        isCompleted,
        isLocked,
      };
    });

    return NextResponse.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
