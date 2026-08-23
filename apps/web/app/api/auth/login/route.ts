import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    // Do not reveal whether email exists
    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // Check account status
    if (!user.is_active) {
      return NextResponse.json(
        {
          error: "Your account is inactive. Please contact Celebrio support.",
        },
        { status: 403 }
      );
    }

    // Compare password with stored bcrypt hash
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // Decide where the user should go
    const redirectTo =
      user.role === "ADMIN"
        ? "/admin"
        : "/";

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Signed in successfully.",
        redirectTo,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Create authentication cookie
    response.cookies.set("celebrio_session", String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("POST /api/auth/login error:", error);

    return NextResponse.json(
      {
        error: "Unable to sign in. Please try again.",
      },
      { status: 500 }
    );
  }
}