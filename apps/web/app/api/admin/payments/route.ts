import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [payments, aggregate] = await Promise.all([
      prisma.payments.findMany({
        orderBy: { created_at: "desc" },
        include: {
          customers: { select: { id: true, name: true, email: true } },
          events: { select: { id: true, event_name: true, event_type: true } },
        },
      }),
      prisma.payments.aggregate({
        _sum: { amount: true },
        where: { status: "SUCCESS" },
      }),
    ]);

    const totalRevenue = Number(aggregate._sum.amount || 0);

    return NextResponse.json({
      payments: payments.map((p) => ({ ...p, amount: Number(p.amount) })),
      totalRevenue,
    });
  } catch (error) {
    console.error("GET /api/admin/payments error:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      eventId,
      customerId,
      amount,
      currency = "INR",
      paymentMethod = "Bank Transfer",
      transactionReference,
      status = "SUCCESS",
      paidAt,
    } = body;

    if (!eventId || !customerId || !amount) {
      return NextResponse.json(
        { error: "Event ID, Customer ID, and Amount are required" },
        { status: 400 }
      );
    }

    const ref = transactionReference || `TXN-${Date.now().toString().slice(-8)}`;

    const payment = await prisma.payments.create({
      data: {
        event_id: Number(eventId),
        customer_id: Number(customerId),
        amount: Number(amount),
        currency,
        payment_method: paymentMethod,
        transaction_reference: ref,
        status,
        paid_at: status === "SUCCESS" ? (paidAt ? new Date(paidAt) : new Date()) : null,
      },
      include: {
        customers: { select: { name: true, email: true } },
        events: { select: { event_name: true } },
      },
    });

    return NextResponse.json({ ...payment, amount: Number(payment.amount) }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/payments error:", error);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Payment ID and status are required" }, { status: 400 });
    }

    const updated = await prisma.payments.update({
      where: { id: Number(id) },
      data: {
        status,
        paid_at: status === "SUCCESS" ? new Date() : null,
      },
    });

    return NextResponse.json({ ...updated, amount: Number(updated.amount) });
  } catch (error) {
    console.error("PATCH /api/admin/payments error:", error);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}
