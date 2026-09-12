"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  FileText,
  IndianRupee,
  Loader2,
  Plus,
  ReceiptText,
  Users,
  Star,
  Clock,
  Sparkles,
  MapPin,
  Heart,
  Flower2,
  Handshake,
  Check,
  Edit3,
  MessageCircle,
  Video,
  ChevronRight,
  ExternalLink,
  X,
  AlertCircle,
  FileCheck,
  Building2,
  ListTodo,
  RefreshCw,
  ArrowRight,
  UploadCloud,
  LogOut,
  Globe,
  ChevronDown,
  User,
  ShieldCheck,
} from "lucide-react";
import EventRequirements from "@/components/portal/EventRequirements";

type PortalData = any;

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function ClientPortal() {
  const [data, setData] = useState<PortalData>(null);
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "requirements" | "budget" | "gallery" | "notes" | "tasks"
  >("overview");

  // Approval modal state
  const [approvalModal, setApprovalModal] = useState<{
    open: boolean;
    decision: "APPROVED" | "EDITS_REQUESTED" | "QUESTIONS";
    title: string;
    description: string;
    notes: string;
  }>({
    open: false,
    decision: "APPROVED",
    title: "",
    description: "",
    notes: "",
  });

  // Edit preferences modal state
  const [editProfileModal, setEditProfileModal] = useState(false);

  // Profile menu state
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/signin";
    } catch {
      window.location.href = "/signin";
    }
  };

  // Forms
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: "Venue & Décor",
    receiptDataUrl: "",
  });

  const [profile, setProfile] = useState({
    partnerName: "",
    vision: "",
    ceremonyStyle: "",
    priorities: "",
    preferredDate: "",
    city: "",
    guestTarget: "",
    budgetTarget: "",
  });

  const [note, setNote] = useState({
    title: "",
    provider: "Discovery Call",
    notes: "",
  });

  const load = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const response = await fetch("/api/portal", {
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401) {
        window.location.href = "/signin";
        return;
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setMessage(err.error || "Unable to load your celebration dashboard.");
        setIsSuccessMessage(false);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const next = await response.json();
      setData(next);
      setLoading(false);
      setRefreshing(false);

      if (next.profile) {
        setProfile({
          partnerName: next.profile.partner_name || "",
          vision: next.profile.vision || "",
          ceremonyStyle: next.profile.ceremony_style || "",
          priorities: next.profile.priorities || "",
          preferredDate: next.profile.preferred_date?.slice(0, 10) || "",
          city: next.profile.preferred_city || "",
          guestTarget: String(next.profile.guest_target || ""),
          budgetTarget: String(next.profile.budget_target || ""),
        });
      }

      if (isManualRefresh) {
        setMessage("Dashboard refreshed with the latest updates.");
        setIsSuccessMessage(true);
        setTimeout(() => setMessage(""), 3500);
      }
    } catch (err) {
      console.error(err);
      setMessage("Network connection error. Please refresh the page.");
      setIsSuccessMessage(false);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (payload: object) => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/portal", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setSaving(false);

      if (!response.ok) {
        setMessage(result.error || "Could not save your update.");
        setIsSuccessMessage(false);
        return false;
      }

      setMessage("Saved successfully to your celebration dashboard.");
      setIsSuccessMessage(true);
      await load();
      setTimeout(() => setMessage(""), 4000);
      return true;
    } catch {
      setSaving(false);
      setMessage("Failed to reach server. Please try again.");
      setIsSuccessMessage(false);
      return false;
    }
  };

  const uploadReceipt = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMessage("Please choose a receipt under 2 MB.");
      setIsSuccessMessage(false);
      return;
    }
    const dataUrl = await readFile(file);
    setExpense((prev) => ({ ...prev, receiptDataUrl: dataUrl }));
  };

  const uploadPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMessage("Please choose a photo under 2 MB.");
      setIsSuccessMessage(false);
      return;
    }
    await submit({
      action: "media",
      name: file.name,
      contentType: file.type,
      dataUrl: await readFile(file),
    });
  };

  const handleApprovalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await submit({
      action: "summary_approval",
      decision: approvalModal.decision,
      notes: approvalModal.notes,
    });
    if (success) {
      setApprovalModal({ ...approvalModal, open: false, notes: "" });
    }
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 shadow-xs">
            <Loader2 className="animate-spin" size={26} />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Loading your Celebrio celebration dashboard...
          </p>
        </div>
      </main>
    );
  }

  // Safe variables
  const customerName = data?.customer?.name || "Client";
  const customerEmail = data?.customer?.email || "customer@celebrio.in";
  const customerInitial = (customerName || "C").charAt(0).toUpperCase();
  const partnerName = data?.profile?.partner_name;
  const coupleTitle = partnerName
    ? `${customerName} & ${partnerName}`
    : customerName;

  const eventDateObj = data?.event?.event_date
    ? new Date(data.event.event_date)
    : data?.profile?.preferred_date
    ? new Date(data.profile.preferred_date)
    : null;

  // Countdown in days
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const countdownDays = eventDateObj
    ? Math.ceil((eventDateObj.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const budget = Number(
    data?.event?.budget || data?.profile?.budget_target || 4500000
  );
  const spent = Number(data?.spent || 0);
  const budgetProgress = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0;

  const guests =
    data?.event?.guest_count || data?.profile?.guest_target || 125;
  const city =
    data?.event?.city || data?.profile?.preferred_city || "Bengaluru";

  const vision =
    data?.profile?.vision || "Elegant · Romantic · Fun";
  const ceremonyStyle =
    data?.profile?.ceremony_style || "Outdoor Preferred";
  const prioritiesText =
    data?.profile?.priorities ||
    "Food & Catering, Music & Entertainment, Photography";
  const prioritiesArray = prioritiesText
    .split(/[,·+]/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  const tasksList = data?.tasks || [];
  const completedTasks = tasksList.filter((t: any) => t.status === "COMPLETED").length;
  const inProgressTasks = tasksList.filter((t: any) => t.status === "IN_PROGRESS").length;
  const openTasks = tasksList.filter((t: any) => t.status === "TODO").length;
  const totalTasks = tasksList.length || 6;

  const completedPct = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 33;
  const inProgressPct = totalTasks
    ? Math.round((inProgressTasks / totalTasks) * 100)
    : 17;
  const openPct = Math.max(0, 100 - completedPct - inProgressPct);

  // Overall planning progress calculation
  const overallProgress = Math.min(
    100,
    Math.max(
      15,
      Math.round(
        completedPct * 0.5 +
          (data?.requirements?.status === "SUBMITTED" ? 25 : 10) +
          (data?.consultation?.status === "CONFIRMED" ? 25 : 10)
      )
    )
  );

  return (
    <main className="min-h-screen bg-slate-50/70 px-4 py-6 text-slate-900 sm:px-6 md:py-10">
      <div className="mx-auto max-w-6xl space-y-7">
        {/* Tier 1: Top Brand & User Profile Header */}
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              title="Return to Celebrio home"
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-700 to-indigo-800 text-lg font-bold text-white shadow-sm transition hover:scale-105"
            >
              C
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-950 tracking-tight">
                  Celebrio
                </span>
                <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold text-violet-700 border border-violet-200">
                  Client Studio
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Celebration planning for <span className="font-semibold text-slate-700">{customerName}</span>
              </p>
            </div>
          </div>

          {/* Top Right Profile & Quick Actions */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Website Link */}
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 md:inline-flex"
            >
              <Globe size={14} />
              Website
            </Link>

            {/* Profile Menu with Login ID */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-1.5 pr-3 transition hover:border-violet-300 hover:bg-violet-50/50 cursor-pointer"
                aria-label="User profile menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-700 text-xs font-bold text-white shadow-2xs">
                  {customerInitial}
                </span>

                <div className="text-left hidden xs:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {customerName}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-tight truncate max-w-[150px]">
                    {customerEmail}
                  </p>
                </div>

                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-fadeIn">
                  <div className="border-b border-slate-100 p-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                        {customerInitial}
                      </span>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {customerName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate" title={customerEmail}>
                          {customerEmail}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-[10px]">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 border border-emerald-200">
                        Active Client
                      </span>
                      <span className="text-slate-400">
                        ID #{data?.customer?.id || ""}
                      </span>
                    </div>
                  </div>

                  <div className="p-1 space-y-1 text-xs">
                    <Link
                      href="/"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition"
                    >
                      <Globe size={14} className="text-slate-400" />
                      Visit Celebrio Website
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Logout Button */}
            <button
              onClick={handleLogout}
              title="Sign out of Celebrio"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        </header>

        {/* Tier 2: Navigation Tabs & Live Sync Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100/90 p-1 text-xs font-semibold">
            {[
              { id: "overview", label: "Overview & Snapshot" },
              { id: "requirements", label: "Requirements Brief" },
              { id: "budget", label: "Budget & Invoices" },
              { id: "gallery", label: "Moodboard" },
              { id: "notes", label: "Meeting Notes" },
              { id: "tasks", label: "All Tasks" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-violet-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Quick Refresh / Sync Button */}
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            title="Sync celebration dashboard data from Celebrio admin"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition cursor-pointer"
          >
            <RefreshCw
              size={13}
              className={refreshing ? "animate-spin text-violet-600" : "text-slate-400"}
            />
            <span>{refreshing ? "Syncing..." : "Sync Live Updates"}</span>
          </button>
        </div>

        {/* Global Toast Alert */}
        {message && (
          <div
            className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-xs font-semibold shadow-xs animate-fadeIn ${
              isSuccessMessage
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {isSuccessMessage ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
              )}
              <span>{message}</span>
            </div>
            <button
              onClick={() => setMessage("")}
              className="text-slate-400 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & CELEBRATION SNAPSHOT                                    */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-7 animate-fadeIn">
            {/* 1. HERO HEADER */}
            <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-9">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">
                      {data?.event?.event_type || "Wedding"} Celebration
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                      {data?.event?.status || "PLANNING"}
                    </span>
                  </div>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    {coupleTitle}
                  </h1>

                  <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                    {data?.event?.event_name || vision}
                  </p>

                  {/* Metadata Chips */}
                  <div className="mt-5 flex flex-wrap items-center gap-5 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={16} className="text-violet-600" />
                      <span>
                        {eventDateObj
                          ? eventDateObj.toLocaleDateString([], {
                              weekday: "short",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Preferred Date to be set"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-violet-600" />
                      <span>{city}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users size={16} className="text-violet-600" />
                      <span>{guests} Estimated Guests</span>
                    </div>
                  </div>
                </div>

                {/* Right: Countdown Pill */}
                <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-violet-700 to-violet-900 p-5 text-white shadow-sm min-w-[170px] text-center">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-violet-200">
                    Countdown
                  </p>
                  <div className="my-1 text-3xl sm:text-4xl font-black tracking-tight">
                    {countdownDays !== null
                      ? countdownDays > 0
                        ? countdownDays
                        : countdownDays === 0
                        ? "Today!"
                        : "Ready"
                      : "—"}
                  </div>
                  <p className="text-xs font-medium text-violet-100">
                    {countdownDays !== null && countdownDays > 0
                      ? "Days To Go"
                      : "Planning Underway"}
                  </p>
                </div>
              </div>
            </header>

            {/* 2. 4 STAT CARDS */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: Overall Progress */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Overall Planning
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-violet-600 transition-all duration-1000"
                        strokeDasharray={`${overallProgress}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-sm font-bold text-slate-900">
                      {overallProgress}%
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {completedTasks} of {totalTasks} Tasks
                    </p>
                    <p className="text-xs text-slate-500">Live Stage</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Budget Target */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Budget
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700 font-bold text-base">
                    ₹
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {money(budget)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {money(spent)} committed ({budgetProgress}%)
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Guests */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Guest Target
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {guests} Guests
                    </p>
                    <p className="text-xs text-slate-500">Venue Capacity</p>
                  </div>
                </div>
              </div>

              {/* Card 4: Top Priorities */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Top Priorities
                </p>
                <div className="mt-3 flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Star size={18} className="fill-current" />
                  </div>
                  <ul className="space-y-0.5 text-xs font-semibold text-slate-700">
                    {prioritiesArray.slice(0, 3).map((item: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5 truncate">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. YOUR PLANNING JOURNEY ROADMAP */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                    Celebrio Planning Journey
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track your journey from discovery session to celebration day
                  </p>
                </div>
                <span className="text-xs font-semibold text-violet-700">
                  Step 2 of 4
                </span>
              </div>

              <div className="relative mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-500 shadow-xs">
                    <Check size={20} strokeWidth={2.5} />
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-900">
                    1. Consultation
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-600">
                    Completed
                  </p>
                </div>

                {/* Step 2 (Current) */}
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-700 border-2 border-violet-600 shadow-xs ring-4 ring-violet-100">
                    <FileCheck size={20} />
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-900">
                    2. Requirements & Brief
                  </p>
                  <span className="mt-0.5 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-800">
                    You are here
                  </span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-slate-200">
                    <Edit3 size={18} />
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-900">
                    3. Sign Package
                  </p>
                  <p className="text-[11px] text-slate-400">Lock Agreements</p>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-slate-200">
                    <Sparkles size={18} />
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-900">
                    4. Event Kickoff
                  </p>
                  <p className="text-[11px] text-slate-400">Full Execution</p>
                </div>
              </div>
            </section>

            {/* 4. 3-COLUMN DETAILS: What We Heard | Deliverables Status | Action Items */}
            <section className="grid gap-6 lg:grid-cols-3">
              {/* Card 1: What We Heard */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      Celebration Profile
                    </h3>
                    <button
                      onClick={() => setEditProfileModal(true)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-900"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                  </div>

                  <div className="mt-4 space-y-3.5 text-xs sm:text-sm">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Atmosphere & Vision
                      </p>
                      <p className="text-slate-800 font-medium mt-0.5">{vision}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Ceremony Style
                      </p>
                      <p className="text-slate-800 font-medium mt-0.5">
                        {ceremonyStyle}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Top Priorities
                      </p>
                      <p className="text-slate-800 font-medium mt-0.5">
                        {prioritiesText}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Celebrio Scope
                      </p>
                      <p className="text-slate-800 font-medium mt-0.5">
                        Vendor curation, contracts, scheduling & day-of execution
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                  Shared during your consultation discovery call.
                </div>
              </div>

              {/* Card 2: Deliverables & Health */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      Task Progress
                    </h3>
                    <span className="text-xs font-bold text-slate-500">
                      {totalTasks} Milestones
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Completed
                        </span>
                        <span className="font-bold text-slate-900">
                          {completedTasks} ({completedPct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${completedPct}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          In Progress
                        </span>
                        <span className="font-bold text-slate-900">
                          {inProgressTasks} ({inProgressPct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${inProgressPct}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-slate-300" />
                          To Do
                        </span>
                        <span className="font-bold text-slate-900">
                          {openTasks} ({openPct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-slate-300 rounded-full"
                          style={{ width: `${openPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-violet-50 p-3.5 border border-violet-100">
                    <p className="text-xs text-violet-900 font-medium">
                      💡 Admin updates to tasks or event milestones in the coordinator console dynamically update this progress bar.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("tasks")}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:underline"
                >
                  View full task checklist →
                </button>
              </div>

              {/* Card 3: Action Items Requiring Attention */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      Your Action Items
                    </h3>
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-800">
                      Active
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                      <p className="text-xs font-bold text-slate-900">
                        1. Fill Requirements Brief
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Tell us your preferred catering, décor, and photography needs.
                      </p>
                      <button
                        onClick={() => setActiveTab("requirements")}
                        className="mt-2 text-xs font-bold text-violet-700 hover:underline"
                      >
                        Open requirements form →
                      </button>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                      <p className="text-xs font-bold text-slate-900">
                        2. Review Planning Call Details
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Join your scheduled video session with your Celebrio planner.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                      <p className="text-xs font-bold text-slate-900">
                        3. Confirm Planning Summary
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Approve the snapshot below to trigger vendor contract preparation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                  Completing items advances your overall readiness score.
                </div>
              </div>
            </section>

            {/* 5. 2-COLUMN SECTION: What Celebrio Is Doing | Planning Call Touchpoint */}
            <section className="grid gap-6 lg:grid-cols-2">
              {/* Card 1: What Celebrio is Doing Next */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
                <h3 className="text-base font-bold text-slate-900">
                  What Celebrio Is Working On
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Core execution deliverables driven by your coordinator.
                </p>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xs font-bold text-violet-800">
                      01
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Venue Shortlisting & Availability Check
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Evaluating 5+ curated properties in {city} that match your capacity ({guests} guests) and budget parameters.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xs font-bold text-violet-800">
                      02
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Vendor Roadmap & Category Allocation
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Prioritizing tier-1 caterers, decorators, and photo/video artists by booking urgency.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xs font-bold text-violet-800">
                      03
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Budget Governance & Transparent Invoicing
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Protecting your target budget of {money(budget)} with milestone-based payment schedules.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Coordinator Call Touchpoint */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      Upcoming Planning Session
                    </h3>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                      {data?.consultation?.status || "CONFIRMED"}
                    </span>
                  </div>

                  <div className="mt-5 flex items-start gap-4 rounded-xl bg-violet-50/70 p-4 border border-violet-100">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-xs">
                      <Video size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Discovery & Alignment Call
                      </p>
                      <p className="text-xs font-bold text-violet-800 mt-0.5">
                        {data?.consultation?.consultation_date
                          ? new Date(data.consultation.consultation_date).toLocaleString([], {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Scheduled in 3 business days"}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Platform: {data?.consultation?.meeting_provider || "Zoom"} · {data?.consultation?.duration_minutes || 30} mins
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Session Goals:</p>
                    <p className="flex items-center gap-1.5">
                      <Check size={13} className="text-emerald-600 shrink-0" />
                      Review venue options and shortlist availability
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Check size={13} className="text-emerald-600 shrink-0" />
                      Confirm requirements brief and aesthetic priorities
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  {data?.consultation?.meeting_url ? (
                    <a
                      href={data.consultation.meeting_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-800"
                    >
                      <Video size={16} />
                      Join {data.consultation.meeting_provider || "Video"} Session →
                    </a>
                  ) : (
                    <p className="text-xs text-slate-400 text-center italic">
                      Video link will be updated by your Celebrio coordinator in the admin portal.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* 6. REVIEW & CONFIRM SUMMARY BANNER */}
            <section className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50/60 to-white p-6 sm:p-8 shadow-xs text-center">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Review & Confirm This Summary
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-600">
                Let your Celebrio coordinator know your decision so we can proceed to package drafting and vendor holds.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3 text-left">
                {/* Approve */}
                <button
                  type="button"
                  onClick={() =>
                    setApprovalModal({
                      open: true,
                      decision: "APPROVED",
                      title: "Approve Summary & Ready for Contract",
                      description:
                        "You approve this celebration brief. We will finalize your wedding package and prepare the agreement.",
                      notes: "",
                    })
                  }
                  className="rounded-xl border border-emerald-200 bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Approve Summary
                      </p>
                      <p className="text-xs font-semibold text-emerald-700">
                        Ready to contract
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    I approve this summary and am ready to review package options and sign agreement.
                  </p>
                </button>

                {/* Propose Edits */}
                <button
                  type="button"
                  onClick={() =>
                    setApprovalModal({
                      open: true,
                      decision: "EDITS_REQUESTED",
                      title: "Propose Changes or Edits",
                      description:
                        "Tell us what dates, guest counts, or vision preferences you would like to adjust.",
                      notes: "",
                    })
                  }
                  className="rounded-xl border border-amber-200 bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-amber-500 hover:shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <Edit3 size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Propose Edits
                      </p>
                      <p className="text-xs font-semibold text-amber-700">
                        Suggest tweaks
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    I would like to suggest adjustments to our guest count, budget, or priorities before signing.
                  </p>
                </button>

                {/* Questions */}
                <button
                  type="button"
                  onClick={() =>
                    setApprovalModal({
                      open: true,
                      decision: "QUESTIONS",
                      title: "Questions & Clarifications",
                      description:
                        "Have questions about packages or vendor coordination? Send a direct note to your coordinator.",
                      notes: "",
                    })
                  }
                  className="rounded-xl border border-violet-200 bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-violet-500 hover:shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <MessageCircle size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Have Questions
                      </p>
                      <p className="text-xs font-semibold text-violet-700">
                        Ask coordinator
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    I have questions regarding options or timelines before making our decision.
                  </p>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REQUIREMENTS BRIEF FORM                                            */}
        {/* ========================================================================= */}
        {activeTab === "requirements" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Event Requirements Brief
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Detail your catering, décor, music, and photography preferences for your Celebrio team.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("overview")}
                className="text-xs font-bold text-violet-700 hover:underline"
              >
                ← Back to Overview
              </button>
            </div>

            <EventRequirements
              eventType={data?.event?.event_type || "Wedding"}
              existing={data?.requirements}
              onSave={async (content) => {
                return await submit({ action: "requirements", content });
              }}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BUDGET & RECEIPTS TRACKER                                          */}
        {/* ========================================================================= */}
        {activeTab === "budget" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Budget & Expense Tracker
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload vendor invoices and receipts to track your committed celebration budget.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("overview")}
                className="text-xs font-bold text-violet-700 hover:underline"
              >
                ← Back to Overview
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Budget Utilization
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {money(spent)} spent of {money(budget)} allocated
                    </p>
                  </div>
                  <ReceiptText className="text-violet-600" size={24} />
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-violet-600 transition-all duration-500 rounded-full"
                    style={{ width: `${budgetProgress}%` }}
                  />
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                  <div>
                    <p className="text-slate-400">Total Spent</p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">
                      {money(spent)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400">Remaining Budget</p>
                    <p className="text-base font-bold text-emerald-600 mt-0.5">
                      {money(Math.max(0, budget - spent))}
                    </p>
                  </div>
                </div>

                {/* Expenses List */}
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">
                    Recent Expenses & Invoices
                  </h4>
                  {data?.expenses?.length ? (
                    <div className="divide-y divide-slate-100">
                      {data.expenses.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-3 text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-900">{item.title}</p>
                            <p className="text-slate-500">
                              {item.category} ·{" "}
                              {new Date(item.spent_at || item.created_at).toLocaleDateString([], {
                                dateStyle: "medium",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900">
                              {money(item.amount)}
                            </p>
                            {item.receipt_data_url && (
                              <a
                                href={item.receipt_data_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] font-semibold text-violet-700 hover:underline"
                              >
                                View receipt
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                      No expenses logged yet. Upload your vendor receipts using the form on the right.
                    </div>
                  )}
                </div>
              </div>

              {/* Add Expense Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const ok = await submit({ action: "expense", ...expense });
                  if (ok) {
                    setExpense({
                      title: "",
                      amount: "",
                      category: "Venue & Décor",
                      receiptDataUrl: "",
                    });
                  }
                }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Log an Expense
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add invoices, deposits or vendor advances.
                  </p>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Expense Description
                      </label>
                      <input
                        required
                        className="field"
                        placeholder="e.g. Venue Advance Deposit"
                        value={expense.title}
                        onChange={(e) =>
                          setExpense({ ...expense, title: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Amount (₹)
                      </label>
                      <input
                        required
                        type="number"
                        className="field"
                        placeholder="150000"
                        value={expense.amount}
                        onChange={(e) =>
                          setExpense({ ...expense, amount: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Category
                      </label>
                      <select
                        className="field"
                        value={expense.category}
                        onChange={(e) =>
                          setExpense({ ...expense, category: e.target.value })
                        }
                      >
                        <option value="Venue & Décor">Venue & Décor</option>
                        <option value="Catering & Food">Catering & Food</option>
                        <option value="Photography & Video">Photography & Video</option>
                        <option value="Entertainment & DJ">Entertainment & DJ</option>
                        <option value="Attire & Makeup">Attire & Makeup</option>
                        <option value="Invitations & Gifts">Invitations & Gifts</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Receipt Image (Optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={uploadReceipt}
                        className="text-xs text-slate-500 file:mr-2 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary mt-6 w-full text-xs"
                >
                  {saving ? "Logging Expense..." : "Add Expense"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MOODBOARD & MEDIA GALLERY                                          */}
        {/* ========================================================================= */}
        {activeTab === "gallery" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Moodboard & Inspiration Gallery
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload aesthetic ideas, venue snapshots, and color palette references.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("overview")}
                className="text-xs font-bold text-violet-700 hover:underline"
              >
                ← Back to Overview
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Uploaded Photos ({data?.media?.length || 0})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Images shared between you and your Celebrio creative team.
                  </p>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-violet-800">
                  <UploadCloud size={15} />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadPhoto}
                    className="hidden"
                  />
                </label>
              </div>

              {data?.media?.length ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {data.media.map((item: any) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 border border-slate-200 shadow-xs"
                    >
                      <img
                        src={item.data_url}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-2.5 flex flex-col justify-end text-white">
                        <p className="text-xs font-semibold truncate">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
                  <Camera size={32} className="mx-auto mb-2 text-slate-300" />
                  No photos uploaded yet. Click Upload Photo above to add your design inspiration.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MEETING NOTES & DECISIONS                                          */}
        {/* ========================================================================= */}
        {activeTab === "notes" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Meeting Notes & Decisions Log
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Keep track of all agreements, coordinator call summaries, and decisions.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("overview")}
                className="text-xs font-bold text-violet-700 hover:underline"
              >
                ← Back to Overview
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Add Note */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const ok = await submit({ action: "note", ...note });
                  if (ok) {
                    setNote({ title: "", provider: "Discovery Call", notes: "" });
                  }
                }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
              >
                <h3 className="text-base font-bold text-slate-900">
                  Add Decision / Note
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record personal notes or questions for your coordinator.
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Title
                    </label>
                    <input
                      required
                      className="field"
                      placeholder="e.g. Discussed photography timings"
                      value={note.title}
                      onChange={(e) =>
                        setNote({ ...note, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Context / Channel
                    </label>
                    <input
                      className="field"
                      placeholder="e.g. Zoom Call / Personal Preference"
                      value={note.provider}
                      onChange={(e) =>
                        setNote({ ...note, provider: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Notes
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="field font-normal"
                      placeholder="Notes, agreed decisions, or questions..."
                      value={note.notes}
                      onChange={(e) =>
                        setNote({ ...note, notes: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary w-full text-xs"
                  >
                    {saving ? "Saving Note..." : "Save Note"}
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="lg:col-span-2 space-y-3">
                {data?.notes?.length ? (
                  data.notes.map((item: any) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-bold text-violet-800">
                          {item.provider}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                        {item.notes}
                      </p>
                      <p className="mt-3 text-[11px] text-slate-400">
                        {new Date(item.created_at || item.meeting_at).toLocaleDateString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
                    No notes recorded yet. Call notes and decisions will appear here.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: ALL TASKS CHECKLIST                                                */}
        {/* ========================================================================= */}
        {activeTab === "tasks" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Planning Milestone Checklist
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Deliverables tracked between you and your Celebrio planning team.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("overview")}
                className="text-xs font-bold text-violet-700 hover:underline"
              >
                ← Back to Overview
              </button>
            </div>

            <div className="space-y-3">
              {tasksList.map((task: any) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        task.status === "COMPLETED"
                          ? "bg-emerald-500"
                          : task.status === "IN_PROGRESS"
                          ? "bg-amber-400"
                          : "bg-slate-300"
                      }`}
                    />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {task.due_date
                          ? `Due ${new Date(task.due_date).toLocaleDateString([], {
                              dateStyle: "medium",
                            })}`
                          : "Scheduled milestone"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      task.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : task.status === "IN_PROGRESS"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: APPROVAL / PROPOSE EDITS / QUESTIONS                               */}
        {/* ========================================================================= */}
        {approvalModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-scaleUp">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {approvalModal.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Celebrio Planning Studio
                  </p>
                </div>
                <button
                  onClick={() =>
                    setApprovalModal({ ...approvalModal, open: false })
                  }
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleApprovalSubmit} className="mt-5 space-y-4">
                <p className="text-xs text-slate-600">
                  {approvalModal.description}
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    {approvalModal.decision === "APPROVED"
                      ? "Special Notes or Confirmations (Optional)"
                      : approvalModal.decision === "EDITS_REQUESTED"
                      ? "Describe Requested Changes"
                      : "Your Questions / Clarifications"}
                  </label>
                  <textarea
                    rows={4}
                    required={approvalModal.decision !== "APPROVED"}
                    placeholder={
                      approvalModal.decision === "APPROVED"
                        ? "Looking forward to kickoff! We confirm our budget and guest targets."
                        : approvalModal.decision === "EDITS_REQUESTED"
                        ? "We would like to adjust the guest count to 150 and shift preferred date to late June..."
                        : "What is the vendor payment schedule after the contract is signed?"
                    }
                    value={approvalModal.notes}
                    onChange={(e) =>
                      setApprovalModal({
                        ...approvalModal,
                        notes: e.target.value,
                      })
                    }
                    className="field font-normal"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() =>
                      setApprovalModal({ ...approvalModal, open: false })
                    }
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`btn-primary text-xs ${
                      approvalModal.decision === "APPROVED"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : approvalModal.decision === "EDITS_REQUESTED"
                        ? "bg-amber-600 hover:bg-amber-700"
                        : ""
                    }`}
                  >
                    {saving ? "Submitting..." : "Send to Coordinator"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: EDIT CELEBRATION PREFERENCES                                       */}
        {/* ========================================================================= */}
        {editProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl animate-scaleUp">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Edit Celebration Preferences
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update your vision, partner name, and priority targets
                  </p>
                </div>
                <button
                  onClick={() => setEditProfileModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (await submit({ action: "profile", ...profile })) {
                    setEditProfileModal(false);
                  }
                }}
                className="mt-5 space-y-4"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Partner&apos;s Name
                    </label>
                    <input
                      className="field"
                      placeholder="Partner Name"
                      value={profile.partnerName}
                      onChange={(e) =>
                        setProfile({ ...profile, partnerName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Preferred Date
                    </label>
                    <input
                      className="field"
                      type="date"
                      value={profile.preferredDate}
                      onChange={(e) =>
                        setProfile({ ...profile, preferredDate: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      City / Destination
                    </label>
                    <input
                      className="field"
                      placeholder="Bengaluru"
                      value={profile.city}
                      onChange={(e) =>
                        setProfile({ ...profile, city: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Guest Target
                    </label>
                    <input
                      className="field"
                      type="number"
                      placeholder="125"
                      value={profile.guestTarget}
                      onChange={(e) =>
                        setProfile({ ...profile, guestTarget: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Ceremony Style
                    </label>
                    <input
                      className="field"
                      placeholder="Outdoor Preferred, Heritage, etc."
                      value={profile.ceremonyStyle}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          ceremonyStyle: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Total Budget Target (₹)
                    </label>
                    <input
                      className="field"
                      type="number"
                      placeholder="4500000"
                      value={profile.budgetTarget}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          budgetTarget: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Atmosphere & Vision
                    </label>
                    <textarea
                      rows={3}
                      className="field font-normal"
                      placeholder="Elegant · Romantic · Fun"
                      value={profile.vision}
                      onChange={(e) =>
                        setProfile({ ...profile, vision: e.target.value })
                      }
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Top Priorities (Comma separated)
                    </label>
                    <input
                      className="field"
                      placeholder="Food & Catering, Music & Entertainment, Photography"
                      value={profile.priorities}
                      onChange={(e) =>
                        setProfile({ ...profile, priorities: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditProfileModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary text-xs"
                  >
                    {saving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
