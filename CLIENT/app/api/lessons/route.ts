import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Lesson from "@/models/Lesson";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });

    const { courseId, title, videoUrl, orderIndex } = await req.json();

    const existing = await Lesson.findOne({ courseId, orderIndex });
    if (existing) return NextResponse.json({ success: false, message: "Lesson with this order index already exists in this course" }, { status: 400 });

    const lesson = await Lesson.create({ courseId, title, videoUrl, orderIndex });
    return NextResponse.json({ success: true, data: { ...lesson.toObject(), id: lesson._id.toString() } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
