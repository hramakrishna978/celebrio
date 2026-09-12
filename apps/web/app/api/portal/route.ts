import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function customerFor(request: Request) {
  const cookie = request.headers.get("cookie")
    ?.split(";").map((item) => item.trim())
    .find((item) => item.startsWith("celebrio_session="));
  const userId = Number(cookie?.split("=")[1]);
  if (!Number.isInteger(userId) || userId <= 0) return null;

  let customer = await prisma.customers.findFirst({
    where: { user_id: userId },
    include: { users: true },
  });

  if (!customer) {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (user) {
      customer = await prisma.customers.create({
        data: {
          user_id: user.id,
          name: user.name,
          email: user.email,
        },
        include: { users: true },
      });
    }
  }

  return customer;
}

async function ensureCustomerEvent(customerId: number, customerName: string, customerCity?: string | null) {
  // Find customer's event (most recent)
  let event = await prisma.events.findFirst({
    where: { customer_id: customerId },
    orderBy: { created_at: "desc" },
  });

  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 180);

  if (!event) {
    event = await prisma.events.create({
      data: {
        customer_id: customerId,
        event_name: `Wedding Celebration - ${customerName}`,
        event_type: "Wedding",
        event_date: defaultDate,
        guest_count: 125,
        city: customerCity || "Bengaluru",
        budget: 4500000,
        status: "PLANNING",
      },
    });
  }

  // 1. Ensure Planning Profile exists
  if (prisma.planning_profiles) {
    await prisma.planning_profiles.upsert({
      where: { customer_id: customerId },
      create: {
        customer_id: customerId,
        partner_name: "Partner",
        vision: "Elegant · Romantic · Fun",
        ceremony_style: "Outdoor preferred",
        priorities: "Food & Catering, Music & Entertainment, Photography",
        preferred_date: event.event_date || defaultDate,
        preferred_city: event.city || customerCity || "Bengaluru",
        guest_target: event.guest_count || 125,
        budget_target: Number(event.budget) || 4500000,
      },
      update: {},
    }).catch((err) => console.warn("profile upsert error:", err));
  }

  // 2. Ensure Event Requirements row exists
  if (prisma.event_requirements) {
    const existingReq = await prisma.event_requirements.findUnique({
      where: { event_id: event.id },
    }).catch(() => null);

    if (!existingReq) {
      await prisma.event_requirements.create({
        data: {
          event_id: event.id,
          content: {
            eventType: event.event_type || "Wedding",
            "Venue style or location": "Outdoor garden or heritage estate with natural backdrop",
            "Food & dietary needs": "Multi-cuisine buffet, live counters, vegetarian and non-vegetarian selections",
            "Flowers and décor": "Soft pastel tones, floral archway, fairy lighting",
            "Photography / video": "Full day candid photography, drone aerials and cinematic highlights film",
            "Music & entertainment": "Live acoustic quartet for ceremony, DJ and dance floor for evening party",
          },
          status: "DRAFT",
        },
      }).catch((err) => console.warn("req create error:", err));
    }
  }

  // 3. Ensure Consultation exists
  if (prisma.consultations) {
    const existingConsultation = await prisma.consultations.findFirst({
      where: { event_id: event.id },
    }).catch(() => null);

    if (!existingConsultation) {
      const consultationDate = new Date();
      consultationDate.setDate(consultationDate.getDate() + 3);
      consultationDate.setHours(18, 0, 0, 0);

      await prisma.consultations.create({
        data: {
          customer_id: customerId,
          event_id: event.id,
          consultation_date: consultationDate,
          consultation_type: "ONLINE",
          meeting_provider: "Zoom",
          meeting_url: "https://zoom.us/j/celebrio-planning-session",
          duration_minutes: 30,
          status: "CONFIRMED",
          notes: "Discovery call scheduled with your Celebrio wedding coordinator.",
        },
      }).catch((err) => console.warn("consultation create error:", err));
    }
  }

  // 4. Ensure Tasks exist
  if (prisma.tasks) {
    const taskCount = await prisma.tasks.count({
      where: { event_id: event.id },
    }).catch(() => 0);

    if (taskCount === 0) {
      await prisma.tasks.createMany({
        data: [
          { event_id: event.id, title: "Confirm preferred event date", priority: "HIGH", status: "COMPLETED", due_date: new Date(Date.now() + 7 * 86400000) },
          { event_id: event.id, title: "Review post-consultation snapshot", priority: "HIGH", status: "IN_PROGRESS", due_date: new Date(Date.now() + 10 * 86400000) },
          { event_id: event.id, title: "Complete event requirements brief", priority: "HIGH", status: "TODO", due_date: new Date(Date.now() + 14 * 86400000) },
          { event_id: event.id, title: "Venue shortlist and site visits", priority: "MEDIUM", status: "TODO", due_date: new Date(Date.now() + 21 * 86400000) },
          { event_id: event.id, title: "Catering and menu tasting shortlist", priority: "MEDIUM", status: "TODO", due_date: new Date(Date.now() + 28 * 86400000) },
          { event_id: event.id, title: "Sign contract and select wedding package", priority: "HIGH", status: "TODO", due_date: new Date(Date.now() + 35 * 86400000) },
        ],
      }).catch((err) => console.warn("tasks create error:", err));
    }
  }

  return event;
}

export async function GET(request: Request) {
  try {
    const customer = await customerFor(request);
    if (!customer) {
      return NextResponse.json({ error: "Please sign in to view your portal." }, { status: 401 });
    }

    const event = await ensureCustomerEvent(customer.id, customer.name, customer.city);

    const [profile, expenses, media, notes, tasks, requirements, consultation] = await Promise.all([
      prisma.planning_profiles?.findUnique
        ? prisma.planning_profiles.findUnique({ where: { customer_id: customer.id } }).catch(() => null)
        : null,
      prisma.expenses?.findMany
        ? prisma.expenses.findMany({ where: { customer_id: customer.id }, orderBy: { created_at: "desc" }, take: 10 }).catch(() => [])
        : [],
      prisma.media_assets?.findMany
        ? prisma.media_assets.findMany({ where: { customer_id: customer.id }, orderBy: { created_at: "desc" }, take: 12 }).catch(() => [])
        : [],
      prisma.meeting_notes?.findMany
        ? prisma.meeting_notes.findMany({ where: { customer_id: customer.id }, orderBy: { meeting_at: "desc" }, take: 6 }).catch(() => [])
        : [],
      prisma.tasks?.findMany
        ? prisma.tasks.findMany({ where: { event_id: event.id }, orderBy: { due_date: "asc" } }).catch(() => [])
        : [],
      prisma.event_requirements?.findUnique
        ? prisma.event_requirements.findUnique({ where: { event_id: event.id } }).catch(() => null)
        : null,
      prisma.consultations?.findFirst
        ? prisma.consultations.findFirst({ where: { event_id: event.id }, orderBy: { consultation_date: "asc" } }).catch(() => null)
        : null,
    ]);

    const spent = expenses.reduce((total, expense) => total + Number(expense.amount), 0);

    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const todoTasks = tasks.filter((t) => t.status === "TODO").length;

    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        city: customer.city,
      },
      event: {
        id: event.id,
        event_name: event.event_name,
        event_type: event.event_type,
        event_date: event.event_date,
        guest_count: event.guest_count,
        venue_name: event.venue_name,
        city: event.city,
        budget: Number(event.budget || 0),
        status: event.status,
      },
      profile,
      expenses: expenses.map((item) => ({ ...item, amount: Number(item.amount) })),
      media,
      notes,
      tasks,
      taskStats: {
        total: tasks.length,
        completed: completedTasks,
        inProgress: inProgressTasks,
        todo: todoTasks,
        progressPercent: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
      },
      requirements,
      consultation,
      spent,
    });
  } catch (error: any) {
    console.error("GET /api/portal error:", error);
    return NextResponse.json({ error: error?.message || "Unable to load your portal." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const customer = await customerFor(request);
    if (!customer) {
      return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    }

    const body = await request.json();
    const event = await ensureCustomerEvent(customer.id, customer.name, customer.city);

    if (body.action === "profile") {
      const data = {
        partner_name: String(body.partnerName || "").slice(0, 150) || null,
        vision: String(body.vision || "").slice(0, 3000) || null,
        ceremony_style: String(body.ceremonyStyle || "").slice(0, 150) || null,
        priorities: String(body.priorities || "").slice(0, 1000) || null,
        preferred_city: String(body.city || "").slice(0, 100) || null,
        guest_target: body.guestTarget ? Number(body.guestTarget) : null,
        budget_target: body.budgetTarget ? Number(body.budgetTarget) : null,
        preferred_date: body.preferredDate ? new Date(body.preferredDate) : null,
      };
      const profile = await prisma.planning_profiles.upsert({
        where: { customer_id: customer.id },
        create: { customer_id: customer.id, ...data },
        update: data,
      });

      // Also update event values if changed
      await prisma.events.update({
        where: { id: event.id },
        data: {
          guest_count: data.guest_target || event.guest_count,
          budget: data.budget_target || event.budget,
          event_date: data.preferred_date || event.event_date,
          city: data.preferred_city || event.city,
        },
      });

      return NextResponse.json({ profile });
    }

    if (body.action === "summary_approval") {
      const { decision, notes } = body;
      // decision: "APPROVED" | "EDITS_REQUESTED" | "QUESTIONS"

      // Record a meeting note / decision log
      const title = decision === "APPROVED"
        ? "Summary Approved by Client"
        : decision === "EDITS_REQUESTED"
        ? "Client Requested Edits to Summary"
        : "Client Inquiry / Questions";

      const note = await prisma.meeting_notes.create({
        data: {
          customer_id: customer.id,
          event_id: event.id,
          title,
          provider: "Portal",
          notes: notes || `Client submitted action: ${decision}`,
          meeting_at: new Date(),
        },
      });

      // Update snapshot review task
      const snapshotTask = await prisma.tasks.findFirst({
        where: { event_id: event.id, title: { contains: "snapshot", mode: "insensitive" } },
      });

      if (snapshotTask) {
        await prisma.tasks.update({
          where: { id: snapshotTask.id },
          data: {
            status: decision === "APPROVED" ? "COMPLETED" : "IN_PROGRESS",
          },
        });
      }

      if (decision === "APPROVED") {
        await prisma.events.update({
          where: { id: event.id },
          data: { status: "PLANNING" },
        });
      }

      return NextResponse.json({ success: true, decision, note });
    }

    if (body.action === "expense") {
      if (!body.title || !Number(body.amount)) {
        return NextResponse.json({ error: "Enter a receipt name and amount." }, { status: 400 });
      }
      if (body.receiptDataUrl && (!String(body.receiptDataUrl).startsWith("data:image/") || String(body.receiptDataUrl).length > 2_800_000)) {
        return NextResponse.json({ error: "Receipt must be an image under 2 MB." }, { status: 400 });
      }
      const expense = await prisma.expenses.create({
        data: {
          customer_id: customer.id,
          event_id: event.id,
          title: String(body.title).slice(0, 200),
          amount: Number(body.amount),
          category: String(body.category || "Other").slice(0, 100),
          receipt_data_url: body.receiptDataUrl || null,
          spent_at: body.spentAt ? new Date(body.spentAt) : new Date(),
        },
      });
      return NextResponse.json({ expense: { ...expense, amount: Number(expense.amount) } }, { status: 201 });
    }

    if (body.action === "media") {
      if (!body.name || !body.dataUrl || !String(body.dataUrl).startsWith("data:image/") || String(body.dataUrl).length > 2_800_000) {
        return NextResponse.json({ error: "Choose an image under 2 MB." }, { status: 400 });
      }
      const media = await prisma.media_assets.create({
        data: {
          customer_id: customer.id,
          event_id: event.id,
          name: String(body.name).slice(0, 255),
          data_url: body.dataUrl,
          content_type: String(body.contentType || "image/jpeg").slice(0, 100),
        },
      });
      return NextResponse.json({ media }, { status: 201 });
    }

    if (body.action === "note") {
      if (!body.title || !body.notes) {
        return NextResponse.json({ error: "Add a title and meeting notes." }, { status: 400 });
      }
      const note = await prisma.meeting_notes.create({
        data: {
          customer_id: customer.id,
          event_id: event.id,
          title: String(body.title).slice(0, 200),
          provider: String(body.provider || "Manual").slice(0, 50),
          notes: String(body.notes).slice(0, 10000),
          meeting_at: body.meetingAt ? new Date(body.meetingAt) : new Date(),
        },
      });
      return NextResponse.json({ note }, { status: 201 });
    }

    if (body.action === "requirements") {
      const content = body.content || {};
      const requirements = await prisma.event_requirements.upsert({
        where: { event_id: event.id },
        create: { event_id: event.id, content, status: "SUBMITTED" },
        update: { content, status: "SUBMITTED" },
      });

      // Update tasks safely
      try {
        await prisma.tasks.updateMany({
          where: {
            event_id: event.id,
            title: { contains: "requirements", mode: "insensitive" },
          },
          data: { status: "COMPLETED" },
        });
      } catch (tErr) {
        console.warn("Could not update task status for requirements:", tErr);
      }

      return NextResponse.json({ success: true, requirements });
    }

    return NextResponse.json({ error: "Unknown portal action." }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/portal error:", error);
    return NextResponse.json({ error: error?.message || "Unable to save your update." }, { status: 500 });
  }
}
