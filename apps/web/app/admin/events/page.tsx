export default function EventsPage() {
  return (
    <div>
      <p className="text-sm font-medium text-violet-600">
        CELEBRIO ADMIN
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-950">
        Events
      </h1>

      <p className="mt-2 text-slate-500">
        Manage wedding events, dates, locations, guest counts and budgets.
      </p>

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Event Management
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Wedding events will be displayed here.
        </p>
      </div>
    </div>
  );
}