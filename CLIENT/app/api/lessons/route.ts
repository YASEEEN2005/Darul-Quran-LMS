import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    const { courseId, title, videoUrl, orderIndex } = await req.json();

    const lesson = await prisma.lesson.create({
      data: { courseId, title, videoUrl, orderIndex },
    });

    return NextResponse.json({ success: true, data: lesson }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ success: false, message: "Lesson with this orderIndex already exists in this course" }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
