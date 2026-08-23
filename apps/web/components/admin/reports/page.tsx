import {
  BarChart3,
  Users,
  CalendarDays,
  CreditCard,
} from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-violet-600">
          CELEBRIO ADMIN
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Reports
        </h1>

        <p className="mt-2 text-slate-500">
          Analyze business performance and wedding operations.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <Users className="text-violet-600" />

          <p className="mt-4 text-sm text-slate-500">
            Customer Reports
          </p>

          <p className="mt-2 font-semibold">
            Customer growth and enquiries
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <CalendarDays className="text-violet-600" />

          <p className="mt-4 text-sm text-slate-500">
            Event Reports
          </p>

          <p className="mt-2 font-semibold">
            Event status and trends
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <CreditCard className="text-violet-600" />

          <p className="mt-4 text-sm text-slate-500">
            Revenue Reports
          </p>

          <p className="mt-2 font-semibold">
            Payments and revenue analysis
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center">
        <BarChart3
          size={48}
          className="mx-auto text-violet-500"
        />

        <h2 className="mt-5 text-lg font-bold">
          Advanced Analytics Coming Soon
        </h2>

        <p className="mt-2 text-slate-500">
          Customer, event, revenue and performance reports will appear here.
        </p>
      </div>
    </div>
  );
}