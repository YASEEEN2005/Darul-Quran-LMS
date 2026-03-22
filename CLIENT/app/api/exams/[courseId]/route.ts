import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { courseId } = await params;

    const exams = await prisma.exam.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
      include: {
        questions: {
          select: { id: true, text: true, options: true }, 
        },
      },
    });

    if (exams.length === 0) return NextResponse.json({ success: true, count: 0, data: [] });

    if (user.role === "ADMIN") {
      return NextResponse.json({ success: true, count: exams.length, data: exams });
    }

    const results = await prisma.examResult.findMany({
      where: { userId: user.id, exam: { courseId } },
      include: { exam: true },
    });

    let maxCompletedIndex = 0;
    results.forEach((r: any) => {
      if (r.completed && r.exam.orderIndex > maxCompletedIndex) {
        maxCompletedIndex = r.exam.orderIndex;
      }
    });

    const unlockedExams = exams.filter((e: any) => e.orderIndex <= maxCompletedIndex + 1);

    return NextResponse.json({ success: true, count: unlockedExams.length, data: unlockedExams });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
