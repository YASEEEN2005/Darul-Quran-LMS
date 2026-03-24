import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Exam from "@/models/Exam";
import ExamResult from "@/models/ExamResult";
import { getUserFromRequest } from "@/lib/auth";

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

    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const completed = true; 

    const result = await ExamResult.findOneAndUpdate(
      { userId, examId },
      { score, completed },
      { upsert: true, new: true }
    );

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
