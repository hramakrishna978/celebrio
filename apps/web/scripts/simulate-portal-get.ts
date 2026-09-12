import "dotenv/config";
import { prisma } from "../lib/prisma";

async function simulateGet() {
  try {
    const userId = 9; // test1 user id
    console.log("Simulating GET /api/portal for userId:", userId);
    const customer = await prisma.customers.findFirst({ where: { user_id: userId } });
    console.log("Customer found:", customer);
    if (!customer) {
      console.log("No customer found for userId 9");
      return;
    }

    // Call ensureCustomerEvent logic
    let event = await prisma.events.findFirst({
      where: { customer_id: customer.id },
      orderBy: { created_at: "desc" },
    });
    console.log("Event found:", event);

    if (!event) {
      console.log("No event found!");
      return;
    }

    console.log("Testing queries...");
    const profile = await prisma.planning_profiles.findUnique({ where: { customer_id: customer.id } });
    console.log("profile:", !!profile);

    const expenses = await prisma.expenses.findMany({ where: { customer_id: customer.id }, orderBy: { created_at: "desc" }, take: 10 });
    console.log("expenses:", expenses.length);

    const media = await prisma.media_assets.findMany({ where: { customer_id: customer.id }, orderBy: { created_at: "desc" }, take: 12 });
    console.log("media:", media.length);

    const notes = await prisma.meeting_notes.findMany({ where: { customer_id: customer.id }, orderBy: { meeting_at: "desc" }, take: 6 });
    console.log("notes:", notes.length);

    const tasks = await prisma.tasks.findMany({ where: { event_id: event.id }, orderBy: { due_date: "asc" } });
    console.log("tasks:", tasks.length);

    const requirements = await prisma.event_requirements.findUnique({ where: { event_id: event.id } });
    console.log("requirements:", !!requirements);

    const consultation = await prisma.consultations.findFirst({ where: { event_id: event.id }, orderBy: { consultation_date: "asc" } });
    console.log("consultation:", !!consultation);

    console.log("ALL QUERIES SUCCEEDED!");
  } catch (err) {
    console.error("SIMULATE GET ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

simulateGet();

