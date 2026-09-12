import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const consultations = await prisma.consultations.findMany({
      where,
      orderBy: { consultation_date: "asc" },
      include: {
        customers: {
          select: { id: true, name: true, email: true, phone: true, city: true },
        },
        events: {
          select: { id: true, event_name: true, event_type: true, event_date: true },
        },
      },
    });

    return NextResponse.json(consultations);
  } catch (error) {
    console.error("GET /api/admin/consultations error:", error);
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerId,
      eventId,
      consultationDate,
      consultationType = "ONLINE",
      meetingProvider = "Zoom",
      meetingUrl,
      durationMinutes = 30,
      notes,
      status = "CONFIRMED",
    } = body;

    if (!customerId || !consultationDate) {
      return NextResponse.json(
        { error: "Customer and consultation date are required" },
        { status: 400 }
      );
    }

    const consultation = await prisma.consultations.create({
      data: {
        customer_id: Number(customerId),
        event_id: eventId ? Number(eventId) : null,
        consultation_date: new Date(consultationDate),
        consultation_type: consultationType,
        meeting_provider: meetingProvider,
        meeting_url: meetingUrl || null,
        duration_minutes: Number(durationMinutes),
        notes: notes || null,
        status,
      },
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/consultations error:", error);
    return NextResponse.json({ error: "Failed to schedule consultation" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, consultationDate, meetingProvider, meetingUrl, durationMinutes, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Consultation ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (consultationDate) updateData.consultation_date = new Date(consultationDate);
    if (meetingProvider !== undefined) updateData.meeting_provider = meetingProvider;
    if (meetingUrl !== undefined) updateData.meeting_url = meetingUrl;
    if (durationMinutes !== undefined) updateData.duration_minutes = Number(durationMinutes);
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.consultations.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        customers: { select: { id: true, name: true, email: true } },
        events: { select: { id: true, event_name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/admin/consultations error:", error);
    return NextResponse.json({ error: "Failed to update consultation" }, { status: 500 });
  }
}

