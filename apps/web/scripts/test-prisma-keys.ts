import "dotenv/config";
import { prisma } from "../lib/prisma";

async function testKeys() {
  console.log("prisma:", !!prisma);
  console.log("prisma.users:", !!prisma.users);
  console.log("prisma.customers:", !!prisma.customers);
  console.log("prisma.events:", !!prisma.events);
  console.log("prisma.planning_profiles:", !!(prisma as any).planning_profiles);
  console.log("prisma.planning_profile:", !!(prisma as any).planning_profile);
  console.log("prisma.planningProfiles:", !!(prisma as any).planningProfiles);
  console.log("prisma.event_requirements:", !!(prisma as any).event_requirements);
  console.log("prisma.eventRequirements:", !!(prisma as any).eventRequirements);
  console.log("prisma.tasks:", !!prisma.tasks);
  console.log("prisma.consultations:", !!prisma.consultations);
  console.log("prisma.expenses:", !!prisma.expenses);
  console.log("prisma.media_assets:", !!prisma.media_assets);
  console.log("prisma.meeting_notes:", !!prisma.meeting_notes);

  // Now let's try calling customerFor and ensureCustomerEvent logic
  try {
    const customer = await prisma.customers.findFirst();
    console.log("First customer:", customer?.id, customer?.name);
    if (customer) {
      if ((prisma as any).planning_profiles) {
        const p = await (prisma as any).planning_profiles.findUnique({ where: { customer_id: customer.id } });
        console.log("planning_profiles.findUnique works:", !!p);
      }
      if ((prisma as any).event_requirements) {
        const r = await (prisma as any).event_requirements.findFirst();
        console.log("event_requirements works:", !!r);
      }
    }
  } catch (err) {
    console.error("Error in testKeys:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testKeys();

