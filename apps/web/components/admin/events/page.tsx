import { CalendarDays, Plus, Search } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-violet-600">
            CELEBRIO ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Events
          </h1>

          <p className="mt-2 text-slate-500">
            Manage weddings and all client events.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700">
          <Plus size={18} />
          New Event
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
          <Search size={19} className="text-slate-400" />

          <input
            placeholder="Search events..."
            className="w-full outline-none"
          />
        </div>

        <select className="rounded-xl border border-slate-200 px-4 py-3 outline-none">
          <option>All Status</option>
          <option>Enquiry</option>
          <option>Confirmed</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
              <CalendarDays size={22} />
            </div>

            <div>
              <h2 className="font-bold text-slate-950">
                Event Management
              </h2>

              <p className="text-sm text-slate-500">
                Weddings and upcoming events.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Guests</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center text-slate-500"
                >
                  No events available yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}