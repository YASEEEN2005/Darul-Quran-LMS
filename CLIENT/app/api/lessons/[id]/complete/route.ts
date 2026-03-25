import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import LessonProgress from "@/models/LessonProgress";
import { getUserFromRequest } from "@/lib/auth";
import { addPoints, checkLessonAchievements } from "@/lib/achievements";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id: lessonId } = await params;
    const userId = user.id;

    const progress = await LessonProgress.findOneAndUpdate(
      { userId, lessonId },
      { completed: true },
      { upsert: true, new: true }
    );

    // --- Gamification ---
    // 1. Add points (20 per lesson)
    await addPoints(userId.toString(), 20);

    // 2. Check for achievements
    const completedLessonsCount = await LessonProgress.countDocuments({ userId, completed: true });
    await checkLessonAchievements(userId.toString(), completedLessonsCount);
    // --------------------

    return NextResponse.json({ success: true, data: { ...progress.toObject(), id: progress._id.toString() } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
