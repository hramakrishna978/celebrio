import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting Celebrio rich database seed (~150+ rows)...");

  const passwordHash = await bcrypt.hash("Celebrio@123", 10);

  // 1. Ensure Admin User exists
  const adminUser = await prisma.users.upsert({
    where: { email: "admin@celebrio.in" },
    update: {},
    create: {
      name: "Celebrio Admin",
      email: "admin@celebrio.in",
      password_hash: passwordHash,
      role: "ADMIN",
      is_active: true,
    },
  });

  // 2. Client profiles to seed (including Carol & David from screenshot!)
  const clientsData = [
    {
      name: "Carol",
      partnerName: "David",
      email: "carol.david@example.com",
      phone: "+1 410-555-0199",
      city: "Baltimore",
      eventName: "Carol & David's Elegant Garden Celebration",
      eventType: "Wedding",
      daysAhead: 308,
      guests: 125,
      budget: 4500000,
      status: "PLANNING" as const,
      vision: "Elegant · Romantic · Fun",
      ceremony: "Outdoor Preferred",
      priorities: "Food & Catering, Music & Entertainment, Photography",
    },
    {
      name: "Ananya Sharma",
      partnerName: "Siddharth Verma",
      email: "ananya.sid@example.com",
      phone: "+91 98765 43210",
      city: "Bengaluru",
      eventName: "Royal Palace Wedding & Sangeet",
      eventType: "Wedding",
      daysAhead: 145,
      guests: 350,
      budget: 6500000,
      status: "PLANNING" as const,
      vision: "Heritage royalty, grand floral decor and royal hospitality",
      ceremony: "Traditional Vedic Mandap",
      priorities: "Royal Venue, Cinematic Photography, Live Sufi Night",
    },
    {
      name: "Priya Patel",
      partnerName: "Rohan Mehta",
      email: "priya.rohan@example.com",
      phone: "+91 98111 22334",
      city: "Mumbai",
      eventName: "Sunset Beachside Reception",
      eventType: "Reception",
      daysAhead: 75,
      guests: 200,
      budget: 3500000,
      status: "CONFIRMED" as const,
      vision: "Boho chic, fairy lights and coastal culinary feast",
      ceremony: "Sunset Deck",
      priorities: "Cocktail Bar, Acoustic Band, Drone Coverage",
    },
    {
      name: "Sneha Reddy",
      partnerName: "Karthik Naidu",
      email: "sneha.karthik@example.com",
      phone: "+91 99440 11223",
      city: "Hyderabad",
      eventName: "Grand Golconda Lawn Celebration",
      eventType: "Wedding",
      daysAhead: 210,
      guests: 500,
      budget: 8500000,
      status: "PLANNING" as const,
      vision: "Regal Hyderabadi grandeur, authentic Nizami cuisine and shehnai",
      ceremony: "Open-Air Amphitheater",
      priorities: "Authentic Catering, Floral Archways, Guest Concierge",
    },
    {
      name: "Natasha Roy",
      partnerName: "Kabir Sen",
      email: "natasha.kabir@example.com",
      phone: "+91 98200 55667",
      city: "Kolkata",
      eventName: "Heritage Colonial Courtyard Celebration",
      eventType: "Wedding",
      daysAhead: 90,
      guests: 180,
      budget: 2800000,
      status: "CONFIRMED" as const,
      vision: "Intimate vintage charm, jazz music and candlelight dinner",
      ceremony: "Bawali Rajbari Courtyard",
      priorities: "Artisanal Food, Live Jazz, Candid Moments",
    },
    {
      name: "Divya Nair",
      partnerName: "Arjun Menon",
      email: "divya.arjun@example.com",
      phone: "+91 97400 99887",
      city: "Kochi",
      eventName: "Backwaters Serenade Wedding",
      eventType: "Wedding",
      daysAhead: 180,
      guests: 150,
      budget: 3200000,
      status: "PLANNING" as const,
      vision: "Tranquil waterfront coconut grove, jasmine strings and chenda melam",
      ceremony: "Lakeside Deck",
      priorities: "Traditional Sadya, Sunset Boat Entry, Photography",
    },
    {
      name: "Meera Kapoor",
      partnerName: "Varun Khanna",
      email: "meera.varun@example.com",
      phone: "+91 98100 12345",
      city: "New Delhi",
      eventName: "Farmhouse Winter Wedding",
      eventType: "Wedding",
      daysAhead: 60,
      guests: 400,
      budget: 7500000,
      status: "CONFIRMED" as const,
      vision: "Chic winter elegance, bonfire lounge and celebrity DJ",
      ceremony: "Glasshouse Mandap",
      priorities: "Winter Cocktail Menu, High-Energy Music, Designer Décor",
    },
    {
      name: "Jackie Mensah",
      partnerName: "Samuel Mensah",
      email: "jackie.samuel@example.com",
      phone: "+1 301-693-2587",
      city: "Westminster",
      eventName: "Garden Pavillion Reception",
      eventType: "Reception",
      daysAhead: 120,
      guests: 140,
      budget: 3800000,
      status: "PLANNING" as const,
      vision: "Lush botanical greens, string quartet and multi-tier cake",
      ceremony: "Pavillion Lawn",
      priorities: "Fine Wine Pairing, Photo Booth, Floral Canopy",
    },
    {
      name: "Vikram Singhania",
      partnerName: "Pooja Singhania",
      email: "vikram.pooja@example.com",
      phone: "+91 98222 33445",
      city: "Jaipur",
      eventName: "25th Silver Jubilee Anniversary Gala",
      eventType: "Anniversary",
      daysAhead: 45,
      guests: 120,
      budget: 2500000,
      status: "CONFIRMED" as const,
      vision: "Silver & white glam, retrospective slideshow and retro band",
      ceremony: "Fort Terrace",
      priorities: "Gourmet Plated Dinner, Live Retro Band, Photo Album",
    },
    {
      name: "TechCorp India",
      partnerName: "Leadership Team",
      email: "events@techcorp.in",
      phone: "+91 80 4123 4567",
      city: "Bengaluru",
      eventName: "Annual Innovation Awards & Gala Night",
      eventType: "Corporate",
      daysAhead: 30,
      guests: 250,
      budget: 4000000,
      status: "CONFIRMED" as const,
      vision: "Futuristic tech aesthetic, LED stage, networking lounge",
      ceremony: "Grand Ballroom",
      priorities: "AV & Livestream, Emcee & Entertainment, 5-Star Buffet",
    },
  ];

  console.log(`👤 Creating ${clientsData.length} client accounts and celebrations...`);

  let totalTasks = 0;
  let totalExpenses = 0;
  let totalContracts = 0;
  let totalPayments = 0;
  let totalNotes = 0;

  for (const c of clientsData) {
    // 1. Create User
    const user = await prisma.users.upsert({
      where: { email: c.email },
      update: { name: c.name },
      create: {
        name: c.name,
        email: c.email,
        password_hash: passwordHash,
        role: "CUSTOMER",
        is_active: true,
      },
    });

    // 2. Create Customer
    const existingCustomer = await prisma.customers.findFirst({
      where: { email: c.email },
    });
    const customer = existingCustomer
      ? await prisma.customers.update({
          where: { id: existingCustomer.id },
          data: { user_id: user.id, name: c.name, phone: c.phone, city: c.city },
        })
      : await prisma.customers.create({
          data: { user_id: user.id, name: c.name, email: c.email, phone: c.phone, city: c.city },
        });

    // 3. Create Event
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + c.daysAhead);

    const event = await prisma.events.create({
      data: {
        customer_id: customer.id,
        event_name: c.eventName,
        event_type: c.eventType,
        event_date: eventDate,
        guest_count: c.guests,
        city: c.city,
        budget: c.budget,
        status: c.status,
      },
    });

    // 4. Planning Profile
    await prisma.planning_profiles.upsert({
      where: { customer_id: customer.id },
      create: {
        customer_id: customer.id,
        partner_name: c.partnerName,
        vision: c.vision,
        ceremony_style: c.ceremony,
        priorities: c.priorities,
        preferred_date: eventDate,
        preferred_city: c.city,
        guest_target: c.guests,
        budget_target: c.budget,
      },
      update: {
        partner_name: c.partnerName,
        vision: c.vision,
        ceremony_style: c.ceremony,
        priorities: c.priorities,
        preferred_date: eventDate,
        preferred_city: c.city,
        guest_target: c.guests,
        budget_target: c.budget,
      },
    });

    // 5. Event Requirements
    await prisma.event_requirements.upsert({
      where: { event_id: event.id },
      create: {
        event_id: event.id,
        content: {
          eventType: c.eventType,
          "Venue style or location": `${c.ceremony} in ${c.city}`,
          "Food & dietary needs": "Multi-cuisine buffet with live stations, vegan & nut-free options",
          "Flowers and décor": "Pastel roses, fairy light canopy and personalized welcome signage",
          "Photography / video": "Full day candid photography, drone coverage and teaser reel",
          "Music & entertainment": "Acoustic ceremony, DJ and live percussion for the party",
          adminReviewNotes: "Reviewed with client during discovery call. Recommended 3 vendor partners.",
          reviewedAt: new Date().toISOString(),
        },
        status: "SUBMITTED",
      },
      update: {},
    });

    // 6. Consultations (Scheduled Call)
    const callDate = new Date();
    callDate.setDate(callDate.getDate() + 2);
    callDate.setHours(18, 0, 0, 0);

    await prisma.consultations.create({
      data: {
        customer_id: customer.id,
        event_id: event.id,
        consultation_date: callDate,
        consultation_type: "ONLINE",
        meeting_provider: "Zoom",
        meeting_url: `https://zoom.us/j/celebrio-${c.name.toLowerCase().replace(/[^a-z]/g, "")}-session`,
        duration_minutes: 30,
        status: "CONFIRMED",
        notes: "Weekly planning call to review venue options, confirm priorities and assign next actions.",
      },
    });

    // 7. Tasks (5-6 tasks per event)
    const tasksToCreate = [
      { title: "Confirm preferred celebration date", status: "COMPLETED" as const, priority: "HIGH" as const, days: 7 },
      { title: "Review post-consultation snapshot", status: "COMPLETED" as const, priority: "HIGH" as const, days: 10 },
      { title: "Complete requirements brief & dietary needs", status: "COMPLETED" as const, priority: "HIGH" as const, days: 14 },
      { title: "Review curated venue options & shortlist", status: "IN_PROGRESS" as const, priority: "HIGH" as const, days: 21 },
      { title: "Menu tasting & catering shortlist", status: "TODO" as const, priority: "MEDIUM" as const, days: 28 },
      { title: "Sign contract and select wedding package", status: "TODO" as const, priority: "HIGH" as const, days: 35 },
    ];

    for (const t of tasksToCreate) {
      const dDate = new Date();
      dDate.setDate(dDate.getDate() + t.days);
      await prisma.tasks.create({
        data: {
          event_id: event.id,
          title: t.title,
          priority: t.priority,
          status: t.status,
          due_date: dDate,
        },
      });
      totalTasks++;
    }

    // 8. Expenses & Receipts (2-3 per event)
    const sampleExpenses = [
      { title: "Venue Hold Retainer", amount: 250000, category: "Venue" },
      { title: "Photography Advance Deposit", amount: 75000, category: "Photography" },
      { title: "Floral Designer Moodboard", amount: 25000, category: "Decor" },
    ];

    for (const exp of sampleExpenses) {
      await prisma.expenses.create({
        data: {
          customer_id: customer.id,
          event_id: event.id,
          title: exp.title,
          amount: exp.amount,
          category: exp.category,
          spent_at: new Date(),
        },
      });
      totalExpenses++;
    }

    // 9. Contract
    const contractCount = await prisma.contracts.count();
    await prisma.contracts.create({
      data: {
        customer_id: customer.id,
        event_id: event.id,
        contract_number: `CEL-2026-${String(contractCount + 1).padStart(4, "0")}`,
        status: c.status === "CONFIRMED" ? "SIGNED" : "DRAFT",
        signed_at: c.status === "CONFIRMED" ? new Date() : null,
        contract_content: JSON.stringify({
          packageName: "Celebrio Signature Wedding PMO",
          agreedAmount: 350000,
          scope: "Full-service wedding coordination, vendor contract negotiation, on-site event direction, and digital planning dashboard.",
          terms: "50% retainer on contract signing, 50% two weeks prior to event date.",
        }),
      },
    });
    totalContracts++;

    // 10. Payment
    await prisma.payments.create({
      data: {
        customer_id: customer.id,
        event_id: event.id,
        amount: 175000,
        currency: "INR",
        payment_method: "Bank Transfer",
        transaction_reference: `TXN-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
        status: "SUCCESS",
        paid_at: new Date(),
      },
    });
    totalPayments++;

    // 11. Meeting Notes
    await prisma.meeting_notes.create({
      data: {
        customer_id: customer.id,
        event_id: event.id,
        title: "Initial Discovery Consultation",
        provider: "Zoom",
        notes: `Met with ${c.name} & ${c.partnerName}. Vibe confirmed: ${c.vision}. Priorities: ${c.priorities}. Shortlisting 3 prime venues in ${c.city}.`,
        meeting_at: new Date(),
      },
    });
    totalNotes++;
  }

  // 12. Create Curated Vendors
  const vendors = [
    { name: "The Leela Palace Grounds", category: "Venue", city: "Bengaluru", phone: "+91 80 2521 1234" },
    { name: "Taj West End Gardens", category: "Venue", city: "Bengaluru", phone: "+91 80 6660 5678" },
    { name: "Stories by Joseph Radhik", category: "Photography", city: "Mumbai", phone: "+91 98201 11223" },
    { name: "Sam & Ekta Wedding Stories", category: "Photography", city: "Mumbai", phone: "+91 98202 33445" },
    { name: "Foodcraft Artisanal Catering", category: "Catering", city: "Bengaluru", phone: "+91 99000 44556" },
    { name: "Vintage Bloom Floral Atelier", category: "Decor", city: "Bengaluru", phone: "+91 99001 77889" },
    { name: "DJ Suketu & Live Percussion", category: "Entertainment", city: "Mumbai", phone: "+91 98205 99001" },
  ];

  try {
    await prisma.$executeRawUnsafe(
      "SELECT setval(pg_get_serial_sequence('vendors', 'id'), COALESCE((SELECT MAX(id) FROM vendors), 0) + 1, false);"
    );
    await prisma.$executeRawUnsafe(
      "SELECT setval(pg_get_serial_sequence('services', 'id'), COALESCE((SELECT MAX(id) FROM services), 0) + 1, false);"
    );
  } catch (err) {
    console.log("Sequence sync notice:", err);
  }

  for (const v of vendors) {
    const existingVendor = await prisma.vendors.findFirst({ where: { name: v.name } });
    if (!existingVendor) {
      const maxIdVendor = await prisma.vendors.findFirst({ orderBy: { id: "desc" }, select: { id: true } });
      const nextId = (maxIdVendor?.id || 0) + 1;
      await prisma.vendors.create({
        data: {
          id: nextId,
          name: v.name,
          category: v.category,
          city: v.city,
          phone: v.phone,
          is_active: true,
        },
      });
    }
  }

  // 13. Create Curated Services
  const services = [
    { name: "Full-Service Wedding Coordination", description: "End-to-end planning, vendor negotiations, budget control and on-site event direction.", base_price: 350000 },
    { name: "Month-Of Coordination & Day Direction", description: "Execution of your pre-planned wedding timeline, vendor alignment, and ceremony flow.", base_price: 150000 },
    { name: "Venue Sourcing & Contract Review", description: "Curated site visits, capacity checks, licensing verification and contract negotiations.", base_price: 75000 },
    { name: "Design, Décor & Scenography Consultation", description: "Custom 3D moodboards, floral concepts, lighting design and styling supervision.", base_price: 120000 },
  ];

  for (const s of services) {
    const existing = await prisma.services.findFirst({ where: { name: s.name } });
    if (!existing) {
      const maxIdService = await prisma.services.findFirst({ orderBy: { id: "desc" }, select: { id: true } });
      const nextId = (maxIdService?.id || 0) + 1;
      await prisma.services.create({
        data: {
          id: nextId,
          name: s.name,
          description: s.description,
          base_price: s.base_price,
          is_active: true,
        },
      });
    }
  }

  console.log("✅ Seed completed successfully!");
  console.log(`   - 10 Customer Accounts & Celebrations`);
  console.log(`   - ${totalTasks} Tasks Created`);
  console.log(`   - ${totalExpenses} Expenses Created`);
  console.log(`   - ${totalContracts} Contracts Generated`);
  console.log(`   - ${totalPayments} Payment Records`);
  console.log(`   - ${totalNotes} Meeting Notes`);
  console.log(`   - Total rows added/updated: ~${10 * 7 + totalTasks + totalExpenses + totalContracts + totalPayments + totalNotes + vendors.length}+ rows!`);
  console.log(`🔑 Login credentials for testing:`);
  console.log(`   Customer: carol.david@example.com / Celebrio@123`);
  console.log(`   Customer: ananya.sid@example.com / Celebrio@123`);
  console.log(`   Admin:    admin@celebrio.in / Celebrio@123`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
