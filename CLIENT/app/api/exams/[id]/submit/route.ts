import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Exam from "@/models/Exam";
import ExamResult from "@/models/ExamResult";
import { getUserFromRequest } from "@/lib/auth";
import { addPoints, checkExamAchievements } from "@/lib/achievements";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id: examId } = await params;
    const userId = user.id;
    const { answers } = await req.json(); 

    const exam = await Exam.findById(examId);

    if (!exam) return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });

    let correctCount = 0;
    const totalQuestions = exam.questions.length;

    answers.forEach((ans: any) => {
      const question = exam.questions.find((q: any) => q._id.toString() === ans.questionId);
      if (question && question.correctOptionIndex === ans.selectedOptionIndex) {
        correctCount++;
      }
    });

    const existingResult = await ExamResult.findOne({ userId, examId });
    if (existingResult) {
      return NextResponse.json({ success: false, message: "You have already completed this exam." }, { status: 400 });
    }

    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const completed = true; 

    const result = await ExamResult.create({
      userId,
      examId,
      score,
      completed
    });

    // --- Gamification ---
    // 1. Add points (10 per correct answer)
    await addPoints(userId.toString(), correctCount * 10);

    // 2. Check for achievements
    const totalExamsPassed = await ExamResult.countDocuments({ userId, completed: true });
    await checkExamAchievements(userId.toString(), score, totalExamsPassed);
    // --------------------

    return NextResponse.json({
      success: true,
      data: { ...result.toObject(), id: result._id.toString() },
      score,
      totalQuestions,
      correctCount
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
