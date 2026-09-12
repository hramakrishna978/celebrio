"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  CalendarDays,
  Clock,
  Copy,
  ExternalLink,
  Plus,
  Video,
  CheckCircle2,
  XCircle,
  Edit2,
  X,
  Sparkles,
} from "lucide-react";

interface Consultation {
  id: number;
  customer_id: number;
  event_id: number | null;
  consultation_date: string;
  consultation_type: string;
  meeting_provider: string | null;
  meeting_url: string | null;
  duration_minutes: number | null;
  notes: string | null;
  status: string;
  customers: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    city: string | null;
  };
  events: {
    id: number;
    event_name: string;
    event_type: string;
    event_date: string | null;
  } | null;
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Consultation | null>(null);
  const [feedback, setFeedback] = useState("");

  const [form, setForm] = useState({
    consultationDate: "",
    meetingProvider: "Zoom",
    meetingUrl: "",
    durationMinutes: 30,
    status: "CONFIRMED",
    notes: "",
  });

  async function loadData() {
    try {
      const res = await fetch(`/api/admin/consultations?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setConsultations(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [filter]);

  function handleOpenEdit(item: Consultation) {
    setEditingItem(item);
    const dateStr = item.consultation_date
      ? new Date(item.consultation_date).toISOString().slice(0, 16)
      : "";
    setForm({
      consultationDate: dateStr,
      meetingProvider: item.meeting_provider || "Zoom",
      meetingUrl: item.meeting_url || "",
      durationMinutes: item.duration_minutes || 30,
      status: item.status || "CONFIRMED",
      notes: item.notes || "",
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch("/api/admin/consultations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItem.id,
          consultationDate: form.consultationDate,
          meetingProvider: form.meetingProvider,
          meetingUrl: form.meetingUrl,
          durationMinutes: form.durationMinutes,
          status: form.status,
          notes: form.notes,
        }),
      });

      if (res.ok) {
        setFeedback("Consultation details updated successfully!");
        setModalOpen(false);
        setEditingItem(null);
        await loadData();
        setTimeout(() => setFeedback(""), 4000);
      } else {
        alert("Failed to update consultation.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating consultation.");
    }
  }

  function copyMeetingInvite(item: Consultation) {
    const text = `Celebrio Wedding Planning Discovery Call\nDate: ${new Date(
      item.consultation_date
    ).toLocaleString()}\nDuration: ${item.duration_minutes || 30} mins\nMeeting Link: ${
      item.meeting_url || "Link will be shared shortly"
    }\nPlatform: ${item.meeting_provider || "Zoom"}`;

    navigator.clipboard.writeText(text);
    setFeedback(`Invitation copied to clipboard for ${item.customers.name}!`);
    setTimeout(() => setFeedback(""), 3500);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
            Celebrio Operations
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Consultation & Discovery Calls
          </h1>
          <p className="mt-2 text-slate-500">
            Schedule initial consultations, generate Zoom/Teams links, and sync
            schedules with customer portals.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 rounded-xl bg-white p-1.5 border shadow-sm text-xs font-semibold">
          {["ALL", "REQUESTED", "CONFIRMED", "COMPLETED", "CANCELLED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-lg px-3 py-1.5 transition ${
                  filter === status
                    ? "bg-violet-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {status === "ALL" ? "All Calls" : status}
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

      {/* Main List */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
              <Video size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Scheduled Consultations</h2>
              <p className="text-xs text-slate-500">
                {consultations.length} calls found
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-400">
            Loading consultations...
          </div>
        ) : consultations.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <p className="font-semibold">No consultations matching this filter.</p>
            <p className="mt-1 text-sm text-slate-400">
              When new enquiries are submitted or scheduled, they will show up here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {consultations.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-slate-50/80 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-slate-900">
                      {item.customers.name}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        item.status === "CONFIRMED"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "REQUESTED"
                          ? "bg-amber-100 text-amber-800"
                          : item.status === "COMPLETED"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">
                      {item.events?.event_name || "Wedding Celebration"}
                    </span>{" "}
                    · {item.customers.email} · {item.customers.phone || "No phone"}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-violet-700">
                      <Video size={14} />
                      {item.meeting_provider || "Zoom"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {item.duration_minutes || 30} mins
                    </span>
                    {item.notes && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-xs text-slate-500 italic">
                          &ldquo;{item.notes}&rdquo;
                        </span>
                      </>
                    )}
                  </div>

                  {item.meeting_url && (
                    <div className="pt-1">
                      <a
                        href={item.meeting_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-900"
                      >
                        Join video call <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-start gap-2 md:items-end">
                  <div className="flex items-center gap-1.5 rounded-xl bg-violet-50 px-3.5 py-2 text-xs font-bold text-violet-800">
                    <CalendarDays size={15} />
                    {new Date(item.consultation_date).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyMeetingInvite(item)}
                      title="Copy meeting invitation to clipboard"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Copy size={13} /> Copy Invite
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="inline-flex items-center gap-1 rounded-lg bg-violet-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-800"
                    >
                      <Edit2 size={13} /> Manage Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit / Schedule Modal */}
      {modalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Manage Consultation Call
                </h3>
                <p className="text-xs text-slate-500">
                  {editingItem.customers.name} · {editingItem.events?.event_name || "Celebration"}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Call Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.consultationDate}
                  onChange={(e) =>
                    setForm({ ...form, consultationDate: e.target.value })
                  }
                  className="field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Platform / Provider
                  </label>
                  <select
                    value={form.meetingProvider}
                    onChange={(e) =>
                      setForm({ ...form, meetingProvider: e.target.value })
                    }
                    className="field"
                  >
                    <option value="Zoom">Zoom</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Duration (Minutes)
                  </label>
                  <select
                    value={form.durationMinutes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        durationMinutes: Number(e.target.value),
                      })
                    }
                    className="field"
                  >
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Meeting URL / Link
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        meetingUrl: `https://meet.google.com/cel-${Math.random()
                          .toString(36)
                          .slice(2, 6)}-${Math.random()
                          .toString(36)
                          .slice(2, 5)}`,
                      })
                    }
                    className="text-[11px] font-semibold text-violet-700 hover:underline flex items-center gap-1"
                  >
                    <Sparkles size={11} /> Generate Meet Link
                  </button>
                </div>
                <input
                  type="url"
                  placeholder="https://zoom.us/j/12345678 or Google Meet URL"
                  value={form.meetingUrl}
                  onChange={(e) =>
                    setForm({ ...form, meetingUrl: e.target.value })
                  }
                  className="field"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  This link will automatically appear on the client&apos;s planning portal.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="field"
                >
                  <option value="REQUESTED">REQUESTED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Agenda & Coordinator Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="What we will review: venue options, vision, package pricing..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="field font-normal"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
