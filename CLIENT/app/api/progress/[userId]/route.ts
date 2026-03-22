import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const user = getUserFromRequest(req);
    const { userId } = await params;

    if (!user || (user.id !== userId && user.role !== "ADMIN")) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    const totalLessons = await prisma.lesson.count();
    const totalExams = await prisma.exam.count();

    const completedLessons = await prisma.lessonProgress.count({
      where: { userId, completed: true },
    });
    
    const completedExams = await prisma.examResult.count({
      where: { userId, completed: true },
    });

    const totalItems = totalLessons + totalExams;
    const completedItems = completedLessons + completedExams;

    let completionPercentage = 0;
    if (totalItems > 0) {
      completionPercentage = (completedItems / totalItems) * 100;
    }

    return NextResponse.json({
      success: true,
      data: {
        completionPercentage: completionPercentage.toFixed(2),
        completedLessons,
        totalLessons,
        completedExams,
        totalExams,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
