"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  Share2,
  Users,
  Video,
  X,
} from "lucide-react";

interface EventPipelineItem {
  id: number;
  customer_id: number;
  event_name: string;
  event_type: string;
  event_date: string | null;
  guest_count: number | null;
  venue_name: string | null;
  city: string | null;
  budget: number | null;
  status: string;
  customers: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  };
  tasks: Array<{
    id: number;
    title: string;
    status: string;
    priority: string;
    due_date: string | null;
  }>;
  requirements: {
    id: number;
    content: any;
    status: string | null;
  } | null;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventPipelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewingBrief, setViewingBrief] = useState<any>(null);
  const [feedback, setFeedback] = useState("");

  async function loadEvents() {
    try {
      const res = await fetch("/api/customers");
      if (res.ok) {
        const customers = await res.json();
        // Flatten events from customers
        const allEvents: EventPipelineItem[] = [];
        customers.forEach((c: any) => {
          if (c.events && Array.isArray(c.events)) {
            c.events.forEach((ev: any) => {
              allEvents.push({
                ...ev,
                customers: { id: c.id, name: c.name, email: c.email, phone: c.phone },
                tasks: ev.tasks || [],
              });
            });
          }
        });
        setEvents(allEvents);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const filtered = events.filter((e) =>
    statusFilter === "ALL" ? true : e.status === statusFilter
  );

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
            Celebrio Operations
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Celebration Pipeline & Events
          </h1>
          <p className="mt-2 text-slate-500">
            Monitor all celebrations across planning milestones, brief submissions,
            and task deliverables.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 rounded-xl bg-white p-1.5 border shadow-sm text-xs font-semibold">
          {["ALL", "ENQUIRY", "PLANNING", "CONFIRMED", "COMPLETED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 transition ${
                  statusFilter === status
                    ? "bg-violet-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {status === "ALL" ? "All Stages" : status}
              </button>
            )
          )}
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 animate-fadeIn">
          <CheckCircle2 size={18} />
          {feedback}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-sm text-slate-400">
          Loading events pipeline...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center text-slate-500">
          No celebrations found in this stage.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => {
            const completed = (item.tasks || []).filter(
              (t) => t.status === "COMPLETED"
            ).length;
            const total = (item.tasks || []).length;
            const pct = total ? Math.round((completed / total) * 100) : 0;

            return (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                        <CalendarDays size={20} />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600">
                          {item.event_type}
                        </span>
                        <h2 className="text-lg font-bold text-slate-950">
                          {item.event_name}
                        </h2>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        item.status === "CONFIRMED"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "PLANNING"
                          ? "bg-violet-100 text-violet-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    Host:{" "}
                    <span className="font-semibold text-slate-800">
                      {item.customers.name}
                    </span>{" "}
                    ({item.customers.email})
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-slate-400 font-medium">Guest Target</p>
                      <p className="mt-0.5 text-sm font-bold text-slate-800">
                        {item.guest_count || 125} guests
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-slate-400 font-medium">Target Budget</p>
                      <p className="mt-0.5 text-sm font-bold text-slate-800">
                        ₹{Number(item.budget || 4500000).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-600">
                        Tasks: {completed} / {total} complete
                      </span>
                      <span className="font-bold text-violet-700">{pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-violet-600 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Brief indicator */}
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs">
                    <span className="text-slate-600">
                      Requirements:{" "}
                      <b
                        className={
                          item.requirements?.status === "SUBMITTED"
                            ? "text-emerald-700"
                            : "text-slate-700"
                        }
                      >
                        {item.requirements?.status || "Draft"}
                      </b>
                    </span>

                    {item.requirements && (
                      <button
                        type="button"
                        onClick={() => setViewingBrief(item)}
                        className="font-bold text-violet-700 hover:underline flex items-center gap-1"
                      >
                        <Eye size={12} /> View brief
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-500">
                    {item.event_date
                      ? new Date(item.event_date).toLocaleDateString([], {
                          dateStyle: "medium",
                        })
                      : "Date TBD"}
                  </span>

                  <div className="flex gap-2">
                    <Link
                      href="/admin/consultations"
                      className="rounded-lg bg-violet-700 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-violet-800"
                    >
                      Manage Call →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Brief Inspection Modal */}
      {viewingBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {viewingBrief.event_name}
                </h3>
                <p className="text-xs text-slate-500">
                  Requirements Brief · {viewingBrief.customers.name}
                </p>
              </div>
              <button
                onClick={() => setViewingBrief(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {viewingBrief.requirements?.content &&
              typeof viewingBrief.requirements.content === "object" ? (
                Object.entries(viewingBrief.requirements.content).map(
                  ([key, val]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-3.5"
                    >
                      <p className="text-xs font-bold text-slate-700">{key}</p>
                      <p className="mt-1 text-sm text-slate-900">
                        {String(val || "Not specified")}
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="text-xs text-slate-400">
                  No questionnaire content submitted yet.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t pt-4">
              <button
                type="button"
                onClick={() => setViewingBrief(null)}
                className="btn-primary text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
