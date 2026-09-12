"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Search,
  User,
  Clock,
  RefreshCw,
  Phone,
  Mail,
  Filter,
  Sparkles,
  Bot,
} from "lucide-react";

interface Inquiry {
  id: number;
  session_id: string;
  customer_id: number | null;
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
  role: string;
  message: string;
  topic: string | null;
  metadata: any;
  created_at: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTopic, setFilterTopic] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/chat-inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const filtered = inquiries.filter((inq) => {
    if (filterTopic !== "ALL" && inq.topic !== filterTopic) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      inq.message.toLowerCase().includes(term) ||
      (inq.user_name && inq.user_name.toLowerCase().includes(term)) ||
      (inq.user_email && inq.user_email.toLowerCase().includes(term)) ||
      (inq.user_phone && inq.user_phone.toLowerCase().includes(term)) ||
      (inq.topic && inq.topic.toLowerCase().includes(term))
    );
  });

  const topics = Array.from(
    new Set(inquiries.map((i) => i.topic).filter(Boolean))
  );

  const totalUsers = new Set(inquiries.map((i) => i.session_id)).size;
  const leadCaptures = inquiries.filter(
    (i) => i.topic === "Lead Capture" || i.user_phone || i.user_email
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Concierge Chat Inquiries
            </h1>
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-700">
              Saved for Team Reference
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Real-time inquiries and conversations from new visitors &amp; portal clients.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Messages
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <MessageSquare size={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {inquiries.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Across {totalUsers} visitor sessions
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Unique Visitor Sessions
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <User size={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {totalUsers}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Engaged with AI Concierge
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contact Leads Captured
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Phone size={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {leadCaptures}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Phone / Email inquiries for follow-up
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search messages, names, phone numbers, topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs focus:border-violet-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="flex items-center gap-1 text-slate-400 font-semibold mr-1">
            <Filter size={13} /> Topic:
          </span>
          <button
            onClick={() => setFilterTopic("ALL")}
            className={`rounded-lg px-3 py-1.5 font-semibold transition ${
              filterTopic === "ALL"
                ? "bg-violet-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setFilterTopic(t!)}
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                filterTopic === t
                  ? "bg-violet-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiry Cards / Feed */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Loading concierge chat inquiries...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-800">
            No inquiries found
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            When users or clients chat with Celebrio Concierge, their queries and
            leads will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isBot = item.role === "assistant";
            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-4 transition shadow-xs ${
                  isBot
                    ? "border-slate-100 bg-slate-50/70"
                    : "border-violet-100 bg-white hover:border-violet-300"
                }`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                        isBot
                          ? "bg-slate-200 text-slate-700"
                          : "bg-violet-700 text-white"
                      }`}
                    >
                      {isBot ? <Bot size={15} /> : <User size={15} />}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900">
                        {isBot
                          ? "Celebrio Concierge"
                          : item.user_name || "Visitor"}
                      </span>
                      {item.customer_id && (
                        <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          Client #{item.customer_id}
                        </span>
                      )}
                      <span className="ml-2 text-[10px] text-slate-400">
                        Session: {item.session_id.slice(0, 16)}...
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {item.topic && (
                      <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700 border border-violet-100">
                        {item.topic}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Clock size={12} />
                      {new Date(item.created_at).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Contact info if available */}
                {(item.user_email || item.user_phone) && (
                  <div className="mt-2 flex flex-wrap items-center gap-4 rounded-xl bg-amber-50/80 px-3 py-1.5 text-xs text-amber-900 border border-amber-200">
                    <span className="font-bold text-[11px] uppercase tracking-wide text-amber-700">
                      Contact Lead:
                    </span>
                    {item.user_phone && (
                      <span className="flex items-center gap-1 font-semibold">
                        <Phone size={13} className="text-amber-600" />
                        {item.user_phone}
                      </span>
                    )}
                    {item.user_email && (
                      <span className="flex items-center gap-1 font-semibold">
                        <Mail size={13} className="text-amber-600" />
                        {item.user_email}
                      </span>
                    )}
                  </div>
                )}

                {/* Message Body */}
                <div className="mt-2.5 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {item.message}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

