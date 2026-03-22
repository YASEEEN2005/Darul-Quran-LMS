import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const meetings = await prisma.meeting.findMany({
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ success: true, count: meetings.length, data: meetings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    const { title, meetLink, date } = await req.json();

    const meeting = await prisma.meeting.create({
      data: { title, meetLink, date: new Date(date) },
    });

    return NextResponse.json({ success: true, data: meeting }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
