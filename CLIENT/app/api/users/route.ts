import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });

    const users = await User.find({}, 'name email role approved createdAt').lean();
    const formattedUsers = users.map((u: any) => ({ ...u, id: u._id.toString() }));
    return NextResponse.json({ success: true, count: formattedUsers.length, data: formattedUsers });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });

    const { email, name, role = "STUDENT", approved = true } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ success: false, message: "User exists" }, { status: 400 });

    const newUser = await User.create({ email, name, role, approved });
    return NextResponse.json({ success: true, data: { ...newUser.toObject(), id: newUser._id.toString() } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
