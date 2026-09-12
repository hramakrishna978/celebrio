import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (eventId) {
      const requirement = await prisma.event_requirements.findUnique({
        where: { event_id: Number(eventId) },
        include: {
          events: {
            include: {
              customers: { select: { id: true, name: true, email: true, phone: true } },
            },
          },
        },
      });
      return NextResponse.json(requirement);
    }

    const requirements = await prisma.event_requirements.findMany({
      orderBy: { updated_at: "desc" },
      include: {
        events: {
          include: {
            customers: { select: { id: true, name: true, email: true, phone: true } },
          },
        },
      },
    });

    return NextResponse.json(requirements);
  } catch (error) {
    console.error("GET /api/admin/requirements error:", error);
    return NextResponse.json({ error: "Failed to fetch requirements" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, eventId, status, reviewNotes } = body;

    if (!id && !eventId) {
      return NextResponse.json({ error: "Requirement ID or Event ID is required" }, { status: 400 });
    }

    const where = id ? { id: Number(id) } : { event_id: Number(eventId) };

    const current = await prisma.event_requirements.findUnique({ where });
    if (!current) {
      return NextResponse.json({ error: "Requirements record not found" }, { status: 404 });
    }

    const existingContent = (current.content as Record<string, unknown>) || {};
    if (reviewNotes !== undefined) {
      existingContent.adminReviewNotes = reviewNotes;
      existingContent.reviewedAt = new Date().toISOString();
    }

    const updated = await prisma.event_requirements.update({
      where,
      data: {
        status: status || current.status,
        content: existingContent as any,
      },
      include: {
        events: {
          include: {
            customers: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/admin/requirements error:", error);
    return NextResponse.json({ error: "Failed to update requirements" }, { status: 500 });
  }
}
