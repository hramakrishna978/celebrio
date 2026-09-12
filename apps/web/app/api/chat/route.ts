import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Comprehensive Celebrio knowledge base for instant, 100% free, high-accuracy answers
const KNOWLEDGE_RESPONSES = [
  {
    keywords: ["price", "pricing", "cost", "charge", "package", "fee", "rate", "budget"],
    topic: "Packages & Pricing",
    reply: `**Celebrio offers three transparent, bespoke celebration packages:**

1. 🌸 **Full-Service Celebration Planning (₹4,50,000 onwards)**
   - End-to-end management from concept to teardown
   - Venue sourcing, contract negotiation, and booking
   - Custom 3D decor design, floral styling, sound & lighting
   - Curated gourmet catering, bar curation & tastings
   - Top-tier photography, cinematic film & bridal styling
   - Complete hospitality, RSVP management & airport logistics
   - Dedicated on-ground team of 6+ coordinators on event days

2. 🌿 **Partial Planning & Design (₹2,00,000 onwards)**
   - Ideal if you've already booked your venue
   - Vendor gap analysis, design concept & styling
   - Contract reviews, production timeline & budget tracking
   - 3 coordinators managing the celebration week

3. ✨ **Day-of & Month-Of Coordination (₹75,000 onwards)**
   - Handover 4-6 weeks prior to the event
   - Master production runsheet & vendor load-in supervision
   - On-ground stage, ceremony cues, and crisis management

Would you like to schedule a **free discovery call** with our senior wedding director to get an accurate estimate tailored to your guest count?`,
    suggestedActions: [
      "Book Free Consultation",
      "Venues & Destinations",
      "How Celebrio Works",
    ],
  },
  {
    keywords: ["venue", "destin", "place", "location", "goa", "jaipur", "udaipur", "bangalore", "bengaluru", "kerala", "resort", "palace"],
    topic: "Venues & Destinations",
    reply: `**Celebrio crafts celebrations across India's premier destinations:**

🏰 **Royal Heritage & Palaces:**
- **Udaipur & Jaipur:** Taj Lake Palace, The Leela Palace, Fairmont Jaipur, Rambagh Palace, Samode Palace.

🌊 **Luxury Beachfront & Tropical Escapes:**
- **Goa:** W Goa, Taj Exotica, ITC Grand Goa, St. Regis Resort.
- **Kerala:** Backwater luxury villas, Kumarakom Lake Resort, Grand Hyatt Kochi.

🌿 **Garden Estates & Banquets:**
- **Bengaluru:** The Leela Bhartiya City, Tamarind Tree, Taj West End, Girasol, Chamara Vajra.
- **Hyderabad & Chennai:** Taj Falaknuma, ITC Kohenur, Connemara.

We secure **preferred corporate partner pricing** and exclusive perks for Celebrio couples. Would you like a curated venue shortlist based on your city and guest target?`,
    suggestedActions: [
      "Get Venue Shortlist",
      "Book Free Consultation",
      "Explore Packages",
    ],
  },
  {
    keywords: ["consult", "book", "call", "schedule", "talk", "meet", "appointment", "demo", "discuss"],
    topic: "Consultation & Booking",
    reply: `**Scheduling your Free Celebrio Discovery Consultation is effortless!**

📅 **What happens on the 30-minute call:**
1. Deep-dive into your vision, traditions, guest count, and dream aesthetics.
2. Honest budget breakdown & feasibility check.
3. Venue and date availability insights.
4. Walkthrough of your private **Celebrio Client Studio**.

You can schedule directly via the consultation form on our website, or leave your **Name, Phone number, and Preferred Date** right here in this chat, and our concierge team will reach out via WhatsApp/call within 2 hours!`,
    suggestedActions: [
      "Book Free Consultation",
      "Contact Details",
      "What Packages Do You Offer?",
    ],
  },
  {
    keywords: ["how it works", "process", "step", "flow", "workflow", "start", "what do you do"],
    topic: "How Celebrio Works",
    reply: `**The Celebrio 6-Step Flawless Journey:**

1. **Discovery Consultation (Day 0):** Free 30-min strategy session to align on your vision, traditions, and budget.
2. **Concept & Tailored Proposal (Days 1–3):** Receive a moodboard presentation, transparent cost estimates, and initial venue options.
3. **Client Studio Unlock:** Access your private dashboard at \`/portal\` to track live budgets, review vendor contracts, and view real-time task progress.
4. **Vendor Locking & Tasting (Months 2–4):** Site visits, menu tastings, decor mockups, and contract execution.
5. **Master Timeline & Rehearsal (Final 30 Days):** Minute-by-minute runsheet, artist soundchecks, and ceremony rehearsals.
6. **Day-Of Perfection:** Our dedicated on-ground team takes over all logistics so you and your family celebrate stress-free!`,
    suggestedActions: [
      "View Packages",
      "Book Free Consultation",
      "Tell Me About the Client Studio",
    ],
  },
  {
    keywords: ["portal", "studio", "dashboard", "track", "requirements", "moodboard", "client page"],
    topic: "Client Studio & Portal",
    reply: `**The Celebrio Client Studio (\`/portal\`) is your celebration command center:**

✨ **Key Features:**
- **Live Budget & Expense Tracker:** Track every rupee spent, upload vendor receipts, and monitor savings against budget.
- **Event Requirements Brief:** Share color palettes, religious ceremonies, catering preferences, and sound guidelines directly with your planner.
- **Interactive Moodboard:** Upload dream decor photos, lehenga/sherwani inspirations, and floral references.
- **Meeting Notes & Action Items:** Revisit discussion summaries from every vendor and design sync.
- **Real-time Task Progress:** Keep track of countdown days, vendor contracts, and milestone deliverables.

Already have an account? Simply visit **[My Celebrio Portal](/portal)** from the top menu to view your dashboard!`,
    suggestedActions: [
      "Open My Portal",
      "Book Free Consultation",
      "Pricing & Packages",
    ],
  },
  {
    keywords: ["service", "decor", "food", "catering", "photo", "video", "makeup", "music", "dj", "artist"],
    topic: "Services Offered",
    reply: `**Our 360° celebration management covers every detail:**

- 🎨 **Decor & Styling:** Bespoke Mandaps, floral installations, luxury lighting, stage design, entrance pathways.
- 🍽️ **Gastronomy & Bar:** Regional authentic feasts, global fusion menus, molecular cocktails & bar setup.
- 📸 **Photography & Cinema:** Candid captures, cinematic teasers, aerial drone coverage & pre-wedding shoots.
- 🎵 **Entertainment & Sound:** Celebrity artists, live bands, Sufi & Bollywood DJs, acoustic ensembles, and EMCEEs.
- 💄 **Bridal Styling & Hospitality:** Saree drapers, MUA shortlists, luxury guest hampers, and airport transfer fleets.

Everything is coordinated under a single point of contact so you never have to chase 20 different vendors!`,
    suggestedActions: [
      "Packages & Pricing",
      "Book Free Consultation",
      "How Celebrio Works",
    ],
  },
  {
    keywords: ["contact", "phone", "email", "whatsapp", "address", "office", "reach", "support", "help"],
    topic: "Contact Information",
    reply: `**Connect with Celebrio Concierge:**

📞 **Direct Phone / WhatsApp:** +91 91825 27913
📧 **Email:** concierge@celebrio.in / hello@celebrio.in
📍 **Experience Studio:** Indiranagar, Bengaluru, Karnataka, India
⏰ **Hours:** Monday – Saturday, 9:30 AM – 8:00 PM IST (Emergency client event coordination is active 24/7)

You can also drop your contact number right here in the chat, and a senior coordinator will connect with you!`,
    suggestedActions: [
      "Book Free Consultation",
      "Pricing & Packages",
      "How Celebrio Works",
    ],
  },
];

// Fallback intelligent answer
function generateSmartReply(query: string) {
  const lower = query.toLowerCase();

  // Contact capture detection
  const phoneMatch = query.match(/(?:\+?91[\-\s]?)?[6-9]\d{9}/);
  const emailMatch = query.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

  if (phoneMatch || emailMatch) {
    const contact = phoneMatch ? phoneMatch[0] : emailMatch ? emailMatch[0] : "";
    return {
      topic: "Lead Capture",
      reply: `Thank you for sharing your details (${contact})! ✨
Our senior celebration planner has received your request and will connect with you via WhatsApp/call shortly to discuss your dates, guest count, and personalized packages.

In the meantime, feel free to ask any other questions about venues, pricing, or our client studio!`,
      suggestedActions: ["View Packages", "Explore Venues", "How Celebrio Works"],
    };
  }

  // Find best match in knowledge base
  let bestScore = 0;
  let bestMatch = KNOWLEDGE_RESPONSES[0];

  for (const item of KNOWLEDGE_RESPONSES) {
    let score = 0;
    for (const kw of item.keywords) {
      if (lower.includes(kw)) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  if (bestScore > 0) {
    return {
      topic: bestMatch.topic,
      reply: bestMatch.reply,
      suggestedActions: bestMatch.suggestedActions,
    };
  }

  // Polite general fallback
  return {
    topic: "General Inquiry",
    reply: `Hello! I am **Celebrio Concierge**, your personal AI wedding & luxury event planning assistant.

I can help you with:
- 🌸 **Packages & Pricing** (Full planning from ₹4.5L, Partial from ₹2L, Day-of from ₹75k)
- 🏰 **Curated Venues & Destinations** (Goa, Rajasthan, Bangalore, Kerala)
- 📅 **Scheduling a Free Discovery Call** with our creative directors
- 💻 **Navigating Your Client Studio (\`/portal\`)** for budget and moodboard tracking

What would you like to explore today?`,
    suggestedActions: [
      "What Packages Do You Offer?",
      "How Much Does Wedding Planning Cost?",
      "Can You Plan Destination Weddings?",
      "Book Free Consultation",
    ],
  };
}

async function getSessionCustomer(request: Request) {
  try {
    const cookie = request.headers
      .get("cookie")
      ?.split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith("celebrio_session="));
    const userId = Number(cookie?.split("=")[1]);
    if (!Number.isInteger(userId) || userId <= 0) return null;

    return await prisma.customers.findFirst({
      where: { user_id: userId },
    });
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ messages: [] });
    }

    const messages = await prisma.chat_inquiries.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: "asc" },
      take: 50,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("GET /api/chat error:", error);
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sessionId,
      message,
      userName,
      userEmail,
      userPhone,
    } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Please provide a valid message." },
        { status: 400 }
      );
    }

    const trimmedMsg = message.trim();
    const sid = sessionId || `anon_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const loggedInCustomer = await getSessionCustomer(request);

    const clientName = userName || loggedInCustomer?.name || null;
    const clientEmail = userEmail || loggedInCustomer?.email || null;
    const clientPhone = userPhone || loggedInCustomer?.phone || null;

    // 1. Generate smart reply
    const { topic, reply, suggestedActions } = generateSmartReply(trimmedMsg);

    // 2. Save User Message in database for team reference
    await prisma.chat_inquiries.create({
      data: {
        session_id: sid,
        customer_id: loggedInCustomer?.id || null,
        user_name: clientName,
        user_email: clientEmail,
        user_phone: clientPhone,
        role: "user",
        message: trimmedMsg,
        topic,
        metadata: {
          hasCustomer: Boolean(loggedInCustomer),
          capturedPhone: trimmedMsg.match(/(?:\+?91[\-\s]?)?[6-9]\d{9}/)?.[0] || null,
          capturedEmail: trimmedMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || null,
        },
      },
    }).catch((err) => console.warn("Failed to save user chat inquiry:", err));

    // 3. Save Assistant Message in database
    await prisma.chat_inquiries.create({
      data: {
        session_id: sid,
        customer_id: loggedInCustomer?.id || null,
        user_name: "Celebrio Concierge",
        role: "assistant",
        message: reply,
        topic,
        metadata: { suggestedActions },
      },
    }).catch((err) => console.warn("Failed to save bot chat inquiry:", err));

    // 4. If logged-in customer asks important inquiry, log into meeting notes for their portal view as well
    if (loggedInCustomer && (topic === "Lead Capture" || topic === "Consultation & Booking")) {
      await prisma.meeting_notes.create({
        data: {
          customer_id: loggedInCustomer.id,
          title: `Concierge Chat: ${topic}`,
          provider: "AI Concierge",
          meeting_at: new Date(),
          notes: `User question: "${trimmedMsg}"\n\nAssistant guidance: "${reply.slice(0, 400)}..."`,
        },
      }).catch(() => null);
    }

    return NextResponse.json({
      sessionId: sid,
      reply,
      topic,
      suggestedActions,
      customer: loggedInCustomer
        ? {
            id: loggedInCustomer.id,
            name: loggedInCustomer.name,
            email: loggedInCustomer.email,
          }
        : null,
    });
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json(
      {
        reply:
          "I am currently receiving high volume, but our wedding planning concierge is available! Please leave your contact details or call us directly at +91 91825 27913.",
        suggestedActions: ["Book Free Consultation", "Contact Details"],
      },
      { status: 200 }
    );
  }
}

