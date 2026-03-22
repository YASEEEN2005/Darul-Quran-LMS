import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { lessons: true, exams: true },
        },
      },
    });
    return NextResponse.json({ success: true, data: courses });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Not authorized as ADMIN" }, { status: 403 });
    }

    const { title, description } = await req.json();

    const course = await prisma.course.create({
      data: { title, description },
    });

    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
