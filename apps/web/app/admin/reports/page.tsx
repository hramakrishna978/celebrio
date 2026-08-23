export default function ReportsPage() {
  return (
    <div>
      <p className="text-sm font-medium text-violet-600">
        CELEBRIO ADMIN
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-950">
        Reports
      </h1>

      <p className="mt-2 text-slate-500">
        Analyse customers, events, payments, vendors and business performance.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold">
            Customer Report
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Customer enquiries and conversions.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold">
            Event Report
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Events and wedding planning activity.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold">
            Payment Report
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Revenue and payment status.
          </p>
        </div>

      </div>
    </div>
  );
}