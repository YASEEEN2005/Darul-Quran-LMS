import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });

    const { id } = await params;
    const updatedUser = await User.findByIdAndUpdate(id, { approved: true }, { new: true });

    if (!updatedUser) return NextResponse.json({ success: false, message: "User missing" }, { status: 404 });

    return NextResponse.json({ success: true, data: { ...updatedUser.toObject(), id: updatedUser._id.toString() } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
