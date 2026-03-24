import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Exam from "@/models/Exam";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });

    const { courseId, title, orderIndex, questions } = await req.json();

    const existing = await Exam.findOne({ courseId, orderIndex });
    if (existing) return NextResponse.json({ success: false, message: "Exam with this order index already exists in this course" }, { status: 400 });

    const exam = await Exam.create({
      courseId, title, orderIndex, questions: questions || []
    });

    return NextResponse.json({ success: true, data: { ...exam.toObject(), id: exam._id.toString() } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
