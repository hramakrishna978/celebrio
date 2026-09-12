"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useState, useEffect } from "react";
import { ClipboardList, CheckCircle2, Save, Sparkles } from "lucide-react";

const fields: Record<string, string[]> = {
  Wedding: [
    "Venue style or location",
    "Ceremony traditions",
    "Food & dietary needs",
    "Flowers and décor",
    "Photography / video",
    "Music & entertainment",
    "Bridal party / family notes",
  ],
  Corporate: [
    "Event objective",
    "Venue & seating style",
    "Agenda / speakers",
    "Food & dietary needs",
    "Branding requirements",
    "AV / livestream needs",
    "Guest experience",
  ],
  Birthday: [
    "Theme and colours",
    "Venue preference",
    "Food & cake",
    "Entertainment",
    "Décor and activities",
  ],
  "Baby Shower": [
    "Theme and colours",
    "Venue preference",
    "Food & dietary needs",
    "Games and activities",
    "Décor and photography",
  ],
  default: [
    "Venue preference",
    "Food & dietary needs",
    "Décor / atmosphere",
    "Entertainment",
    "Guests and accessibility needs",
    "Anything else we should know",
  ],
};

export default function EventRequirements({
  eventType,
  existing,
  onSave,
}: {
  eventType?: string;
  existing?: any;
  onSave: (content: Record<string, string>) => Promise<boolean>;
}) {
  const selected = fields[eventType || ""] || fields.default;
  const initial = (existing?.content || {}) as Record<string, string>;
  const [answers, setAnswers] = useState<Record<string, string>>(initial);
  const [busy, setBusy] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (existing?.content && typeof existing.content === "object") {
      setAnswers(existing.content as Record<string, string>);
    }
  }, [existing]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setSavedSuccess(false);
    const ok = await onSave(answers);
    setBusy(false);
    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 5000);
    }
  };

  const completedCount = selected.filter((label) => Boolean(answers[label]?.trim())).length;
  const progressPercent = Math.round((completedCount / selected.length) * 100);

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <ClipboardList size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {eventType || "Event"} Requirements Brief
              </h2>
              {existing?.status === "SUBMITTED" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 size={12} />
                  Submitted
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Add your preferences below. These details guide your Celebrio planning coordinator and vendor selections.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="font-semibold text-slate-900">{completedCount} of {selected.length}</span> answered
            <div className="mt-1 h-1.5 w-28 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-violet-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-medium text-emerald-800">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          Requirements saved successfully! Your Celebrio planning team has received this brief.
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {selected.map((label) => (
          <div key={label} className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              {label}
            </label>
            <textarea
              rows={3}
              value={answers[label] || ""}
              onChange={(e) =>
                setAnswers({ ...answers, [label]: e.target.value })
              }
              placeholder={`Describe your ${label.toLowerCase()} preferences...`}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-3 focus:ring-violet-100"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <Sparkles size={14} className="text-violet-600" />
          You can update these requirements at any time as your plans evolve.
        </p>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {busy ? "Saving Brief…" : "Save Requirements"}
        </button>
      </div>
    </form>
  );
}
