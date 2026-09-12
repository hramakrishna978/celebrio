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

    const contracts = await prisma.contracts.findMany({
      where,
      orderBy: { created_at: "desc" },
      include: {
        customers: { select: { id: true, name: true, email: true, phone: true } },
        events: { select: { id: true, event_name: true, event_type: true, event_date: true, budget: true } },
      },
    });

    return NextResponse.json(contracts);
  } catch (error) {
    console.error("GET /api/admin/contracts error:", error);
    return NextResponse.json({ error: "Failed to fetch contracts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, customerId, contractContent, packageName, agreedAmount, status = "DRAFT" } = body;

    if (!eventId || !customerId) {
      return NextResponse.json({ error: "Event ID and Customer ID are required" }, { status: 400 });
    }

    const count = await prisma.contracts.count();
    const contractNumber = `CEL-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    const defaultContent = contractContent || JSON.stringify({
      packageName: packageName || "Signature Celebrio Planning",
      agreedAmount: agreedAmount || 250000,
      scope: "Full-service wedding coordination, vendor contract negotiation, on-site event direction, and digital planning dashboard.",
      terms: "50% retainer on signing, remaining 50% two weeks prior to celebration date.",
    });

    const contract = await prisma.contracts.create({
      data: {
        event_id: Number(eventId),
        customer_id: Number(customerId),
        contract_number: contractNumber,
        contract_content: defaultContent,
        status,
        signed_at: status === "SIGNED" ? new Date() : null,
      },
      include: {
        customers: { select: { name: true, email: true } },
        events: { select: { event_name: true } },
      },
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/contracts error:", error);
    return NextResponse.json({ error: "Failed to create contract" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, contractContent } = body;

    if (!id) {
      return NextResponse.json({ error: "Contract ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status) {
      updateData.status = status;
      if (status === "SIGNED") {
        updateData.signed_at = new Date();
      }
    }
    if (contractContent !== undefined) {
      updateData.contract_content = contractContent;
    }

    const updated = await prisma.contracts.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        customers: { select: { name: true, email: true } },
        events: { select: { event_name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/admin/contracts error:", error);
    return NextResponse.json({ error: "Failed to update contract" }, { status: 500 });
  }
}

