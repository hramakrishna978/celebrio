"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  FileText,
  Plus,
  CheckCircle2,
  Send,
  Download,
  X,
  Search,
} from "lucide-react";

interface ContractItem {
  id: number;
  contract_number: string;
  contract_content: string | null;
  status: string;
  signed_at: string | null;
  created_at: string;
  customers: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  };
  events: {
    id: number;
    event_name: string;
    event_type: string;
    budget: number | null;
  };
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<ContractItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [createModal, setCreateModal] = useState(false);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [feedback, setFeedback] = useState("");

  const [newContract, setNewContract] = useState({
    eventId: "",
    customerId: "",
    packageName: "Celebrio Signature Wedding PMO",
    agreedAmount: "350000",
    terms: "50% retainer on contract signing, 50% two weeks prior to event date.",
  });

  async function loadData() {
    try {
      const res = await fetch(`/api/admin/contracts?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setContracts(data);
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
  }, [statusFilter]);

  async function handleStatusChange(contractId: number, nextStatus: string) {
    try {
      const res = await fetch("/api/admin/contracts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contractId, status: nextStatus }),
      });

      if (res.ok) {
        setFeedback(`Contract status updated to ${nextStatus}!`);
        await loadData();
        setTimeout(() => setFeedback(""), 3500);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!newContract.eventId) {
      alert("Please select a celebration");
      return;
    }

    const selectedEv = eventsList.find(
      (ev) => String(ev.id) === String(newContract.eventId)
    );
    if (!selectedEv) return;

    try {
      const res = await fetch("/api/admin/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEv.id,
          customerId: selectedEv.customerId,
          packageName: newContract.packageName,
          agreedAmount: Number(newContract.agreedAmount),
          contractContent: JSON.stringify({
            packageName: newContract.packageName,
            agreedAmount: Number(newContract.agreedAmount),
            terms: newContract.terms,
            services: "Full wedding management, vendor shortlists, day-of coordination, budget tracking.",
          }),
          status: "DRAFT",
        }),
      });

      if (res.ok) {
        setFeedback("New contract draft generated!");
        setCreateModal(false);
        await loadData();
        setTimeout(() => setFeedback(""), 3500);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create contract.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
            Celebrio Legal & Agreements
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Contracts & Agreements
          </h1>
          <p className="mt-2 text-slate-500">
            Draft, send, and track signed wedding management service agreements
            and deposit terms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-white p-1 border shadow-sm text-xs font-semibold">
            {["ALL", "DRAFT", "SENT", "SIGNED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1.5 transition ${
                  statusFilter === st
                    ? "bg-violet-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {st === "ALL" ? "All Contracts" : st}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCreateModal(true)}
            className="btn-primary text-xs"
          >
            <Plus size={15} /> Create Contract
          </button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 animate-fadeIn">
          <CheckCircle2 size={18} />
          {feedback}
        </div>
      )}

      {/* Contracts Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Contract #</th>
                <th className="px-6 py-4">Client & Celebration</th>
                <th className="px-6 py-4">Package & Terms</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Signed Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    Loading contracts...
                  </td>
                </tr>
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    No contracts found in this view. Click &quot;Create Contract&quot; to draft one.
                  </td>
                </tr>
              ) : (
                contracts.map((item) => {
                  let parsedContent: any = {};
                  try {
                    parsedContent = item.contract_content
                      ? JSON.parse(item.contract_content)
                      : {};
                  } catch {
                    parsedContent = { packageName: item.contract_content };
                  }

                  return (
                    <tr
                      key={item.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-mono font-bold text-slate-900">
                          <FileText size={16} className="text-violet-600" />
                          {item.contract_number}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">
                          {item.customers.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.events.event_name}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 text-xs">
                          {parsedContent.packageName || "Signature Planning"}
                        </p>
                        <p className="text-xs font-bold text-violet-700">
                          {parsedContent.agreedAmount
                            ? `₹${Number(
                                parsedContent.agreedAmount
                              ).toLocaleString("en-IN")}`
                            : "Custom Package"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            item.status === "SIGNED"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "SENT"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-600">
                        {item.signed_at
                          ? new Date(item.signed_at).toLocaleDateString([], {
                              dateStyle: "medium",
                            })
                          : "Awaiting signature"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.status === "DRAFT" && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(item.id, "SENT")}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                            >
                              <Send size={12} className="text-violet-600" /> Send
                            </button>
                          )}

                          {item.status !== "SIGNED" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(item.id, "SIGNED")
                              }
                              className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                            >
                              Mark Signed
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Create Contract Modal */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Generate Wedding Management Contract
              </h3>
              <button
                onClick={() => setCreateModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Select Celebration & Client
                </label>
                <select
                  required
                  value={newContract.eventId}
                  onChange={(e) =>
                    setNewContract({ ...newContract, eventId: e.target.value })
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
                  Package Name
                </label>
                <input
                  type="text"
                  required
                  value={newContract.packageName}
                  onChange={(e) =>
                    setNewContract({
                      ...newContract,
                      packageName: e.target.value,
                    })
                  }
                  className="field"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Agreed Service Fee (₹)
                </label>
                <input
                  type="number"
                  required
                  value={newContract.agreedAmount}
                  onChange={(e) =>
                    setNewContract({
                      ...newContract,
                      agreedAmount: e.target.value,
                    })
                  }
                  className="field"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Payment Milestones & Terms
                </label>
                <textarea
                  rows={3}
                  value={newContract.terms}
                  onChange={(e) =>
                    setNewContract({ ...newContract, terms: e.target.value })
                  }
                  className="field font-normal"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setCreateModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Generate Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}