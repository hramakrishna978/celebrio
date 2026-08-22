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
    } = body;

    if (!name || !email || !eventType || !eventDate) {
      return NextResponse.json(
        {
          error:
            "Name, email, event type and event date are required",
        },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create customer
      const customer = await tx.customers.create({
        data: {
          name,
          email,
          phone: phone || null,
          city: city || null,
        },
      });

      // 2. Create event linked to customer
      const event = await tx.events.create({
        data: {
          customer_id: customer.id,
          event_name: `${eventType} - ${name}`,
          event_type: eventType,
          event_date: new Date(eventDate),
          guest_count: guestCount
            ? Number(guestCount)
            : null,
          city: city || null,
          budget: budget
            ? Number(budget)
            : null,
        },
      });

      return {
        customer,
        event,
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/customers error:", error);

    return NextResponse.json(
      {
        error: "Failed to create enquiry",
      },
      { status: 500 }
    );
  }
}