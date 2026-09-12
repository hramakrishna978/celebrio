import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.customers.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        events: true,
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("GET /api/customers error:", error);

    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      city,
      eventType,
      eventDate,
      guestCount,
      budget,
      description,
    } = body;

    const trimmedName = String(name || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const selectedEventType = String(eventType || "Wedding").trim();

    if (!trimmedName || !normalizedEmail) {
      return NextResponse.json(
        {
          error: "Your name and email address are required.",
        },
        { status: 400 }
      );
    }

    // Check if user is currently logged in via session cookie
    const cookieHeader = request.headers.get("cookie");
    const sessionCookie = cookieHeader
      ?.split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("celebrio_session="));
    const rawUserId = Number(sessionCookie?.split("=")[1]);
    const loggedInUserId = Number.isInteger(rawUserId) && rawUserId > 0 ? rawUserId : null;

    // Parse event date safely
    let parsedDate: Date;
    if (eventDate) {
      const d = new Date(eventDate);
      parsedDate = isNaN(d.getTime()) ? new Date(Date.now() + 180 * 86400000) : d;
    } else {
      parsedDate = new Date(Date.now() + 180 * 86400000);
    }

    // Parse numeric fields safely
    const parsedGuests =
      guestCount && !isNaN(Number(guestCount)) ? Math.max(1, parseInt(String(guestCount), 10)) : null;
    const parsedBudget =
      budget && !isNaN(Number(budget)) ? Math.max(0, Number(budget)) : null;

    // 1. Find or create customer
    let customer = null;

    if (loggedInUserId) {
      customer = await prisma.customers.findFirst({
        where: { user_id: loggedInUserId },
      });
    }

    if (!customer) {
      customer = await prisma.customers.findFirst({
        where: { email: { equals: normalizedEmail, mode: "insensitive" } },
      });
    }

    if (customer) {
      // Update contact details & link user_id if missing
      customer = await prisma.customers.update({
        where: { id: customer.id },
        data: {
          name: trimmedName || customer.name,
          phone: phone ? String(phone).trim().slice(0, 30) : customer.phone,
          city: city ? String(city).trim().slice(0, 100) : customer.city,
          user_id: customer.user_id || loggedInUserId || null,
        },
      });
    } else {
      customer = await prisma.customers.create({
        data: {
          name: trimmedName,
          email: normalizedEmail,
          phone: phone ? String(phone).trim().slice(0, 30) : null,
          city: city ? String(city).trim().slice(0, 100) : null,
          user_id: loggedInUserId || null,
        },
      });
    }

    // 2. Create the Event
    const event = await prisma.events.create({
      data: {
        customer_id: customer.id,
        event_name: `${selectedEventType} Celebration - ${trimmedName}`,
        event_type: selectedEventType,
        event_date: parsedDate,
        guest_count: parsedGuests,
        city: city ? String(city).trim().slice(0, 100) : null,
        budget: parsedBudget,
        status: "ENQUIRY",
      },
    });

    // 3. Create or upsert planning profile
    await prisma.planning_profiles.upsert({
      where: { customer_id: customer.id },
      create: {
        customer_id: customer.id,
        partner_name: "Partner",
        vision: description || "Elegant · Romantic · Fun",
        ceremony_style: "Outdoor preferred",
        priorities: "Venue, Catering, Photography, Décor",
        preferred_date: parsedDate,
        preferred_city: city ? String(city).trim().slice(0, 100) : "Bengaluru",
        guest_target: parsedGuests || 125,
        budget_target: parsedBudget || 4500000,
      },
      update: {
        preferred_date: parsedDate,
        preferred_city: city ? String(city).trim().slice(0, 100) : undefined,
        guest_target: parsedGuests || undefined,
        budget_target: parsedBudget || undefined,
      },
    }).catch((e) => console.warn("Could not upsert planning profile:", e));

    // 4. Create Initial Requirements Brief
    await prisma.event_requirements.create({
      data: {
        event_id: event.id,
        content: {
          eventType: selectedEventType,
          enquiryDescription: description || "",
          "Venue style or location": city ? `Preferred location in ${city}` : "Outdoor garden or heritage venue",
          "Food & dietary needs": "Multi-cuisine catering, live counters",
          "Photography / video": "Full day photography and cinematic film",
        },
        status: "DRAFT",
      },
    }).catch((e) => console.warn("Could not create event requirements:", e));

    // 5. Create Discovery Consultation (3 days ahead)
    const consultationDate = new Date();
    consultationDate.setDate(consultationDate.getDate() + 3);
    consultationDate.setHours(18, 0, 0, 0);

    await prisma.consultations.create({
      data: {
        customer_id: customer.id,
        event_id: event.id,
        consultation_date: consultationDate,
        consultation_type: "ONLINE",
        meeting_provider: "Zoom",
        meeting_url: "https://zoom.us/j/celebrio-consultation-session",
        duration_minutes: 30,
        status: "CONFIRMED",
        notes: `Free planning consultation with Celebrio event coordinator for ${trimmedName}. Discussing ${selectedEventType} vision, timelines, and budget.`,
      },
    }).catch((e) => console.warn("Could not create consultation:", e));

    // 6. Create Initial Planning Tasks
    const initialTasks = [
      { title: "Confirm preferred event date", priority: "HIGH", status: "COMPLETED", offsetDays: 3 },
      { title: "Review post-consultation snapshot", priority: "HIGH", status: "IN_PROGRESS", offsetDays: 7 },
      { title: "Complete event requirements brief", priority: "HIGH", status: "TODO", offsetDays: 14 },
      { title: "Venue shortlist and site visits", priority: "MEDIUM", status: "TODO", offsetDays: 21 },
      { title: "Catering and menu tasting shortlist", priority: "MEDIUM", status: "TODO", offsetDays: 28 },
      { title: "Sign contract and select wedding package", priority: "HIGH", status: "TODO", offsetDays: 35 },
    ];

    await prisma.tasks.createMany({
      data: initialTasks.map((t) => ({
        event_id: event.id,
        title: t.title,
        priority: t.priority as any,
        status: t.status as any,
        due_date: new Date(Date.now() + t.offsetDays * 86400000),
      })),
    }).catch((e) => console.warn("Could not create tasks:", e));

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully",
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
        },
        event: {
          id: event.id,
          event_name: event.event_name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/customers error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Failed to create enquiry. Please try again.",
      },
      { status: 500 }
    );
  }
}
