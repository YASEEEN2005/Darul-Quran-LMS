import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    const { courseId, title, orderIndex, questions } = await req.json();

    const exam = await prisma.exam.create({
      data: {
        courseId,
        title,
        orderIndex,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json({ success: true, data: exam }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ success: false, message: "Exam with this orderIndex already exists in this course" }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
