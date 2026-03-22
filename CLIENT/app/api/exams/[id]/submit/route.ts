import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id: examId } = await params;
    const userId = user.id;
    const { answers } = await req.json(); 

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: true },
    });

    if (!exam) return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });

    let correctCount = 0;
    const totalQuestions = exam.questions.length;

    answers.forEach((ans: any) => {
      const question = exam.questions.find((q: any) => q.id === ans.questionId);
      if (question && question.correctOptionIndex === ans.selectedOptionIndex) {
        correctCount++;
      }
    });

    const score = (correctCount / totalQuestions) * 100;
    const completed = true; 

    const result = await prisma.examResult.upsert({
      where: {
        userId_examId: { userId, examId },
      },
      update: { score, completed },
      create: { userId, examId, score, completed },
    });

    return NextResponse.json({ success: true, score, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
