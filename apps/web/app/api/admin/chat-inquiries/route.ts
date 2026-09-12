import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || "100");

    const inquiries = await prisma.chat_inquiries.findMany({
      orderBy: { created_at: "desc" },
      take: limit,
    });

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("GET /api/admin/chat-inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

