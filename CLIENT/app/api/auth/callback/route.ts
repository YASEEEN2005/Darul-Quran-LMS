import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

  if (!code) {
    return NextResponse.redirect(`${FRONTEND_URL}/login?error=no_code`);
  }

  try {
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Fetch the user's profile with the access token
    const res = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`);
    const profile = await res.json();

    const email = profile.email;
    const name = profile.name;
    const googleId = profile.id;

    // Execute User Upsert/Whitelist logic from legacy Express passport.js
    let user = await prisma.user.findUnique({ where: { googleId } });

    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, name: user.name || name },
        });
      } else {
        user = await prisma.user.create({
          data: {
            googleId,
            email,
            name,
            role: "STUDENT",
            approved: false,
          },
        });
      }
    }

    if (!user.approved) {
      return NextResponse.redirect(`${FRONTEND_URL}/login?error=not_approved`);
    }

    // Generate JWT and redirect
    const token = generateToken({ id: user.id, role: user.role, email: user.email });
    return NextResponse.redirect(`${FRONTEND_URL}/login-success?token=${token}`);

  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
}
