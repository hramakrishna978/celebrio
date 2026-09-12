"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Search,
  X,
  IndianRupee,
} from "lucide-react";

interface PaymentItem {
  id: number;
  customer_id: number;
  event_id: number;
  amount: number;
  currency: string;
  payment_method: string | null;
  transaction_reference: string | null;
  status: string;
  paid_at: string | null;
  created_at: string;
  customers: {
    id: number;
    name: string;
    email: string;
  };
  events: {
    id: number;
    event_name: string;
    event_type: string;
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [feedback, setFeedback] = useState("");

  const [newPayment, setNewPayment] = useState({
    eventId: "",
    amount: "150000",
    paymentMethod: "Bank Transfer / NEFT",
    transactionReference: "",
    status: "SUCCESS",
  });

  async function loadData() {
    try {
      const res = await fetch("/api/admin/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
        setTotalRevenue(data.totalRevenue || 0);
      }

      const custRes = await fetch("/api/customers");
      if (custRes.ok) {
        const custData = await custRes.json();
        const evs: any[] = [];
        custData.forEach((c: any) => {
          (c.events || []).forEach((ev: any) => {
            evs.push({
              id: ev.id,
              customerId: c.id,
              customerName: c.name,
              eventName: ev.event_name,
            });
          });
        });
        setEventsList(evs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleRecordPayment(e: FormEvent) {
    e.preventDefault();
    if (!newPayment.eventId || !newPayment.amount) {
      alert("Please select celebration and enter amount");
      return;
    }

    const selected = eventsList.find(
      (ev) => String(ev.id) === String(newPayment.eventId)
    );
    if (!selected) return;

    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selected.id,
          customerId: selected.customerId,
          amount: Number(newPayment.amount),
          paymentMethod: newPayment.paymentMethod,
          transactionReference:
            newPayment.transactionReference ||
            `TXN-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
          status: newPayment.status,
          paidAt: newPayment.status === "SUCCESS" ? new Date() : null,
        }),
      });

      if (res.ok) {
        setFeedback("Payment recorded successfully!");
        setModalOpen(false);
        await loadData();
        setTimeout(() => setFeedback(""), 3500);
      }
    } catch (err) {
      console.error(err);
      alert("Error recording payment.");
    }
  }

  const successCount = payments.filter((p) => p.status === "SUCCESS").length;
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
            Celebrio Financials
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Payments & Collections
          </h1>
          <p className="mt-2 text-slate-500">
            Track customer retainers, vendor disbursements, and client payment
            settlements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-primary text-xs"
        >
          <Plus size={15} /> Record Payment
        </button>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 animate-fadeIn">
          <CheckCircle2 size={18} />
          {feedback}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Revenue Collected
            </span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <IndianRupee size={18} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-emerald-700 font-semibold">
            {successCount} successful transactions
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Invoices
            </span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <Clock size={18} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">{pendingCount}</p>
          <p className="mt-1 text-xs text-amber-700 font-semibold">
            Awaiting bank clearance or client action
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Records
            </span>
            <div className="rounded-xl bg-violet-50 p-2 text-violet-600">
              <CreditCard size={18} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {payments.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            All-time payment transactions
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Transaction Ref</th>
                <th className="px-6 py-4">Client & Celebration</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    Loading payments...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    No payment records found. Click &quot;Record Payment&quot; to log one.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">
                      {p.transaction_reference || `TXN-${p.id}`}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">
                        {p.customers.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {p.events?.event_name || "Celebration"}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-950">
                      ₹{Number(p.amount).toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600">
                      {p.payment_method || "Online"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          p.status === "SUCCESS"
                            ? "bg-emerald-100 text-emerald-800"
                            : p.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(p.created_at).toLocaleDateString([], {
                        dateStyle: "medium",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Record Payment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Record Client Payment
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Celebration & Client
                </label>
                <select
                  required
                  value={newPayment.eventId}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, eventId: e.target.value })
                  }
                  className="field"
                >
                  <option value="">Choose celebration...</option>
                  {eventsList.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.customerName} · {ev.eventName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Amount Received (₹)
                </label>
                <input
                  type="number"
                  required
                  value={newPayment.amount}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, amount: e.target.value })
                  }
                  className="field"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Payment Method
                </label>
                <select
                  value={newPayment.paymentMethod}
                  onChange={(e) =>
                    setNewPayment({
                      ...newPayment,
                      paymentMethod: e.target.value,
                    })
                  }
                  className="field"
                >
                  <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
                  <option value="UPI / QR Code">UPI / QR Code</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Transaction / UTR Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR12345678 or Cheque No."
                  value={newPayment.transactionReference}
                  onChange={(e) =>
                    setNewPayment({
                      ...newPayment,
                      transactionReference: e.target.value,
                    })
                  }
                  className="field"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Status
                </label>
                <select
                  value={newPayment.status}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, status: e.target.value })
                  }
                  className="field"
                >
                  <option value="SUCCESS">SUCCESS (Paid & Cleared)</option>
                  <option value="PENDING">PENDING (Awaiting clearance)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}