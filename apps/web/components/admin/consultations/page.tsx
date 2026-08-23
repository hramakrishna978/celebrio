import { Handshake, Plus, Calendar } from "lucide-react";

export default function ConsultationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-violet-600">
            CELEBRIO ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Consultations
          </h1>

          <p className="mt-2 text-slate-500">
            Schedule and manage customer consultations.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white">
          <Plus size={18} />
          Schedule Consultation
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Upcoming</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Cancelled</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 p-6">
          <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
            <Handshake size={22} />
          </div>

          <div>
            <h2 className="font-bold">Consultation Schedule</h2>
            <p className="text-sm text-slate-500">
              Upcoming customer meetings.
            </p>
          </div>
        </div>

        <div className="p-16 text-center text-slate-500">
          <Calendar className="mx-auto mb-4 text-slate-400" size={40} />
          No consultations scheduled.
        </div>
      </div>
    </div>
  );
}