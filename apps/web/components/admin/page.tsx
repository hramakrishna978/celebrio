import {
  Users,
  CalendarDays,
  Handshake,
  CreditCard,
} from "lucide-react";

import StatCard from "@/components/admin/StatCard";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-violet-600">
          CELEBRIO ADMIN
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Overview of your wedding management platform.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Customers"
          value="0"
          description="Registered enquiries"
          icon={Users}
        />

        <StatCard
          title="Total Events"
          value="0"
          description="All wedding events"
          icon={CalendarDays}
        />

        <StatCard
          title="Consultations"
          value="0"
          description="Upcoming consultations"
          icon={Handshake}
        />

        <StatCard
          title="Payments"
          value="₹0"
          description="Total received"
          icon={CreditCard}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Recent Customers
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest enquiries received
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">City</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-slate-500"
                  >
                    No customer data yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-950">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your platform quickly.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href="/admin/customers"
              className="rounded-xl border border-slate-200 p-4 transition hover:border-violet-300 hover:bg-violet-50"
            >
              <p className="font-semibold text-slate-900">
                View Customers
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Manage enquiries
              </p>
            </a>

            <a
              href="/admin/events"
              className="rounded-xl border border-slate-200 p-4 transition hover:border-violet-300 hover:bg-violet-50"
            >
              <p className="font-semibold text-slate-900">
                View Events
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Manage weddings
              </p>
            </a>

            <a
              href="/admin/consultations"
              className="rounded-xl border border-slate-200 p-4 transition hover:border-violet-300 hover:bg-violet-50"
            >
              <p className="font-semibold text-slate-900">
                Consultations
              </p>

              <p className="mt-1 text-sm text-slate-500">
                View schedules
              </p>
            </a>

            <a
              href="/admin/payments"
              className="rounded-xl border border-slate-200 p-4 transition hover:border-violet-300 hover:bg-violet-50"
            >
              <p className="font-semibold text-slate-900">
                Payments
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Track payments
              </p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}