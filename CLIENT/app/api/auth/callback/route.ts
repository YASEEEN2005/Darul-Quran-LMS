import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

  if (!code) return NextResponse.redirect(`${FRONTEND_URL}/login?error=no_code`);

  try {
    await dbConnect();
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    const { tokens } = await oAuth2Client.getToken(code);
    const res = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`);
    const profile = await res.json();

    const { email, name, id: googleId } = profile;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.findOne({ email });

      if (user) {
         user.googleId = googleId;
         if (!user.name) user.name = name;
         await user.save();
      } else {
        user = await User.create({
          googleId, email, name, role: "STUDENT", approved: false,
        });
      }
    }

    if (!user.approved) return NextResponse.redirect(`${FRONTEND_URL}/login?error=not_approved`);

    const token = generateToken({ id: user._id.toString(), role: user.role, email: user.email });
    return NextResponse.redirect(`${FRONTEND_URL}/login-success?token=${token}`);

  } catch (error) {
    console.error(error);
    return NextResponse.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
}
