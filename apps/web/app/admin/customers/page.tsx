"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ClipboardCheck,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Mail,
  Phone,
  Search,
  Share2,
  Users,
  Video,
  X,
  CheckCircle2,
} from "lucide-react";

interface CustomerEnquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  created_at: string;
  events: Array<{
    id: number;
    event_name: string;
    event_type: string;
    event_date: string | null;
    status: string;
    budget: number | null;
    guest_count: number | null;
    consultations: Array<{
      id: number;
      consultation_date: string;
      status: string;
      meeting_provider: string | null;
      meeting_url: string | null;
    }>;
    requirements: {
      id: number;
      status: string | null;
      content: any;
    } | null;
  }>;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBrief, setSelectedBrief] = useState<any>(null);
  const [briefModalOpen, setBriefModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [feedback, setFeedback] = useState("");

  async function loadCustomers() {
    try {
      const res = await fetch("/api/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  function handleShareRequirements(customer: CustomerEnquiry) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${origin}/portal#requirements`;
    navigator.clipboard.writeText(link);
    setFeedback(`Requirements brief link copied to clipboard for ${customer.name}!`);
    setTimeout(() => setFeedback(""), 4000);
  }

  function handleOpenBrief(customer: CustomerEnquiry, event: any) {
    setSelectedBrief({
      customer,
      event,
      requirements: event.requirements,
    });
    setReviewNote(event.requirements?.content?.adminReviewNotes || "");
    setBriefModalOpen(true);
  }

  async function handleSaveReview(newStatus?: string) {
    if (!selectedBrief?.event?.id) return;
    try {
      const res = await fetch("/api/admin/requirements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedBrief.event.id,
          status: newStatus || selectedBrief.requirements?.status || "REVIEWED",
          reviewNotes: reviewNote,
        }),
      });

      if (res.ok) {
        setFeedback("Requirements brief updated!");
        setBriefModalOpen(false);
        await loadCustomers();
        setTimeout(() => setFeedback(""), 3500);
      }
    } catch (err) {
      console.error(err);
      alert("Could not update requirements.");
    }
  }

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.city && c.city.toLowerCase().includes(q)) ||
      (c.events[0]?.event_name && c.events[0].event_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
            Celebrio Operations
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Customers & Enquiries
          </h1>
          <p className="mt-2 text-slate-500">
            Manage incoming leads, schedule initial consultation calls, and share
            custom requirements questionnaires.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by client, email, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 animate-fadeIn">
          <CheckCircle2 size={18} />
          {feedback}
        </div>
      )}

      {/* Table Card */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Client Contact</th>
                <th className="px-6 py-4">Celebration</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4">Discovery Call</th>
                <th className="px-6 py-4">Requirements</th>
                <th className="px-6 py-4 text-right">Post-Enquiry Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    Loading customers and enquiries...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    No customers found. Submit an enquiry on the website or seed
                    the database.
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => {
                  const event = customer.events[0];
                  const call = event?.consultations?.[0];
                  const req = event?.requirements;

                  return (
                    <tr
                      key={customer.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 font-bold text-violet-700">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {customer.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {customer.email}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {customer.phone || "No phone"} · {customer.city || "Location TBD"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {event ? (
                          <div>
                            <p className="font-semibold text-slate-800">
                              {event.event_type}
                            </p>
                            <p className="text-xs text-slate-500">
                              {event.event_date
                                ? new Date(event.event_date).toLocaleDateString(
                                    [],
                                    { dateStyle: "medium" }
                                  )
                                : "Date TBD"}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {event.guest_count
                                ? `${event.guest_count} guests`
                                : "Guests TBD"}{" "}
                              {event.budget
                                ? `· ₹${Number(event.budget).toLocaleString("en-IN")}`
                                : ""}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No celebration created
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            event?.status === "PLANNING"
                              ? "bg-violet-100 text-violet-800"
                              : event?.status === "CONFIRMED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {event?.status || "ENQUIRY"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {call ? (
                          <div>
                            <p className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                              <Video size={13} className="text-violet-700" />
                              {new Date(
                                call.consultation_date
                              ).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-400">
                              {call.status} ({call.meeting_provider || "Zoom"})
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Not scheduled
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {req ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                req.status === "SUBMITTED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : req.status === "APPROVED"
                                  ? "bg-violet-100 text-violet-800"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {req.status || "DRAFT"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenBrief(customer, event)}
                              title="Inspect submitted brief"
                              className="text-violet-700 hover:text-violet-900"
                            >
                              <Eye size={15} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Pending Brief
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleShareRequirements(customer)}
                            title="Copy shareable requirements form link"
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <Share2 size={13} className="text-violet-700" /> Share Form
                          </button>

                          <Link
                            href="/admin/consultations"
                            className="inline-flex items-center gap-1 rounded-lg bg-violet-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-800"
                          >
                            <Video size={13} /> Schedule Call
                          </Link>
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

      {/* View & Review Brief Modal */}
      {briefModalOpen && selectedBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Client Requirements Brief
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedBrief.customer.name} · {selectedBrief.event.event_name}
                </p>
              </div>
              <button
                onClick={() => setBriefModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-violet-50 p-4 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-violet-900">Status: </span>
                  <span className="font-bold text-violet-700">
                    {selectedBrief.requirements?.status || "DRAFT"}
                  </span>
                </div>
                <div className="text-slate-500">
                  Event Date:{" "}
                  {selectedBrief.event.event_date
                    ? new Date(selectedBrief.event.event_date).toLocaleDateString()
                    : "TBD"}
                </div>
              </div>

              {/* Questionnaire Content */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Submitted Preferences & Must-Haves
                </h4>

                {selectedBrief.requirements?.content &&
                typeof selectedBrief.requirements.content === "object" ? (
                  Object.entries(selectedBrief.requirements.content).map(
                    ([key, val]) => {
                      if (key === "adminReviewNotes" || key === "reviewedAt")
                        return null;
                      return (
                        <div
                          key={key}
                          className="rounded-xl border border-slate-100 bg-slate-50 p-3.5"
                        >
                          <p className="text-xs font-bold text-slate-700">
                            {key}
                          </p>
                          <p className="mt-1 text-sm text-slate-900">
                            {String(val || "Not specified")}
                          </p>
                        </div>
                      );
                    }
                  )
                ) : (
                  <p className="text-xs text-slate-400">
                    No questionnaire responses submitted yet.
                  </p>
                )}
              </div>

              {/* Coordinator Review Notes */}
              <div className="pt-2 border-t">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Coordinator Internal Review & Feasibility Notes
                </label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Notes on budget feasibility, venue constraints, recommended vendor partners..."
                  className="field font-normal"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => handleShareRequirements(selectedBrief.customer)}
                  className="text-xs font-semibold text-violet-700 hover:underline flex items-center gap-1"
                >
                  <Share2 size={13} /> Copy Link to Share with Client
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveReview("REVIEWED")}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Mark as Reviewed
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveReview("APPROVED")}
                    className="btn-primary text-xs"
                  >
                    Approve Brief
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
