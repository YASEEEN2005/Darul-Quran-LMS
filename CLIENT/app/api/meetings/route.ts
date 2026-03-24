import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Meeting from "@/models/Meeting";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const meetings = await Meeting.find().sort({ date: 1 }).lean();
    const formatted = meetings.map((m: any) => ({ ...m, id: m._id.toString() }));
    return NextResponse.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });

    const { title, meetLink, date } = await req.json();
    const meeting = await Meeting.create({ title, meetLink, date: new Date(date) });

    return NextResponse.json({ success: true, data: { ...meeting.toObject(), id: meeting._id.toString() } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
