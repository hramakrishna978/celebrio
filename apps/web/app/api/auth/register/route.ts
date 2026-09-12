import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim() || null;
    const password = body.password;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "Name, email and password are required.",
        },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          error: "Please enter a valid name.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    // Check existing account
    const existingUser = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user + customer together
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          name,
          email,
          password_hash: passwordHash,
          role: "CUSTOMER",
          is_active: true,
        },
      });

      const existingCustomer = await tx.customers.findFirst({
        where: { email, user_id: null },
      });

      const customer = existingCustomer
        ? await tx.customers.update({
            where: { id: existingCustomer.id },
            data: { user_id: user.id, name, phone: phone || existingCustomer.phone },
          })
        : await tx.customers.create({
            data: { user_id: user.id, name, email, phone },
          });

      // Check if this customer already has an event (e.g. from a prior enquiry)
      const existingEvent = await tx.events.findFirst({
        where: { customer_id: customer.id },
      });

      if (!existingEvent) {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 308); // ~10 months away for wedding celebration

        const event = await tx.events.create({
          data: {
            customer_id: customer.id,
            event_name: `Wedding Celebration - ${name}`,
            event_type: "Wedding",
            event_date: defaultDate,
            guest_count: 125,
            city: customer.city || "Bengaluru",
            budget: 4500000,
            status: "PLANNING",
          },
        });

        await tx.planning_profiles.create({
          data: {
            customer_id: customer.id,
            partner_name: "Partner",
            vision: "Elegant · Romantic · Fun",
            ceremony_style: "Outdoor preferred",
            priorities: "Food & Catering, Music & Entertainment, Photography",
            preferred_date: defaultDate,
            preferred_city: customer.city || "Bengaluru",
            guest_target: 125,
            budget_target: 4500000,
          },
        });

        await tx.event_requirements.create({
          data: {
            event_id: event.id,
            content: {
              eventType: "Wedding",
              "Venue style or location": "Outdoor garden or heritage estate with natural backdrop",
              "Food & dietary needs": "Multi-cuisine buffet, live counters, vegetarian and non-vegetarian selections",
              "Flowers and décor": "Soft pastel tones, floral archway, fairy lighting",
              "Photography / video": "Full day candid photography, drone aerials and cinematic highlights film",
              "Music & entertainment": "Live acoustic quartet for ceremony, DJ and dance floor for evening party",
            },
            status: "DRAFT",
          },
        });

        const consultationDate = new Date();
        consultationDate.setDate(consultationDate.getDate() + 3);
        consultationDate.setHours(18, 0, 0, 0);

        await tx.consultations.create({
          data: {
            customer_id: customer.id,
            event_id: event.id,
            consultation_date: consultationDate,
            consultation_type: "ONLINE",
            meeting_provider: "Zoom",
            notes: "Initial discovery call scheduled with your Celebrio wedding coordinator.",
            duration_minutes: 30,
            status: "CONFIRMED",
          },
        });

        await tx.tasks.createMany({
          data: [
            { event_id: event.id, title: "Confirm preferred event date", priority: "HIGH", status: "COMPLETED", due_date: new Date(Date.now() + 7 * 86400000) },
            { event_id: event.id, title: "Review post-consultation snapshot", priority: "HIGH", status: "IN_PROGRESS", due_date: new Date(Date.now() + 10 * 86400000) },
            { event_id: event.id, title: "Complete event requirements brief", priority: "HIGH", status: "TODO", due_date: new Date(Date.now() + 14 * 86400000) },
            { event_id: event.id, title: "Venue shortlist and site visits", priority: "MEDIUM", status: "TODO", due_date: new Date(Date.now() + 21 * 86400000) },
            { event_id: event.id, title: "Catering and menu tasting shortlist", priority: "MEDIUM", status: "TODO", due_date: new Date(Date.now() + 28 * 86400000) },
            { event_id: event.id, title: "Sign contract and select wedding package", priority: "HIGH", status: "TODO", due_date: new Date(Date.now() + 35 * 86400000) },
          ],
        });
      }

      return {
        user,
        customer,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/register error:", error);

    return NextResponse.json(
      {
        error: "Unable to create account. Please try again.",
      },
      { status: 500 }
    );
  }
}
