import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id: courseId } = await params;

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
    });

    if (lessons.length === 0) {
      return NextResponse.json({ success: true, count: 0, data: [] });
    }

    if (user.role === "ADMIN") {
      return NextResponse.json({ success: true, count: lessons.length, data: lessons });
    }

    const progresses = await prisma.lessonProgress.findMany({
      where: { userId: user.id, lesson: { courseId } },
      include: { lesson: true },
    });

    let maxCompletedIndex = 0;
    progresses.forEach((p: any) => {
      if (p.completed && p.lesson.orderIndex > maxCompletedIndex) {
        maxCompletedIndex = p.lesson.orderIndex;
      }
    });

    const unlockedLessons = lessons.filter(
      (lesson: any) => lesson.orderIndex <= maxCompletedIndex + 1
    );

    return NextResponse.json({ success: true, count: unlockedLessons.length, data: unlockedLessons });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
