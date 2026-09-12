import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    const where = eventId ? { event_id: Number(eventId) } : {};

    const tasks = await prisma.tasks.findMany({
      where,
      orderBy: { due_date: "asc" },
      include: {
        events: {
          include: {
            customers: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/admin/tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, title, priority = "MEDIUM", status = "TODO", dueDate, description } = body;

    if (!eventId || !title) {
      return NextResponse.json({ error: "Event ID and Title are required" }, { status: 400 });
    }

    const task = await prisma.tasks.create({
      data: {
        event_id: Number(eventId),
        title: String(title).slice(0, 200),
        priority,
        status,
        due_date: dueDate ? new Date(dueDate) : null,
        description: description ? String(description) : null,
      },
      include: {
        events: {
          include: {
            customers: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/tasks error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, priority, dueDate, title } = body;

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.due_date = dueDate ? new Date(dueDate) : null;
    if (title !== undefined) updateData.title = String(title).slice(0, 200);

    const updated = await prisma.tasks.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/admin/tasks error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

