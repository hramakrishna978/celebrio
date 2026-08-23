export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          CELEBRIO ADMIN
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
          Admin Dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-slate-500">
          Manage customers, events, consultations, services, vendors,
          contracts, payments, tasks and reports from one place.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Customers
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Events
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Consultations
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending Payments
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              0
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AdminLink
            title="Customers"
            description="Manage customer enquiries and wedding clients."
            href="/admin/customers"
          />

          <AdminLink
            title="Events"
            description="Manage weddings and other customer events."
            href="/admin/events"
          />

          <AdminLink
            title="Consultations"
            description="Manage consultation requests and schedules."
            href="/admin/consultations"
          />

          <AdminLink
            title="Services"
            description="Manage Celebrio services and pricing."
            href="/admin/services"
          />

          <AdminLink
            title="Vendors"
            description="Manage vendors and vendor assignments."
            href="/admin/vendors"
          />

          <AdminLink
            title="Contracts"
            description="Manage customer contracts and agreements."
            href="/admin/contracts"
          />

          <AdminLink
            title="Payments"
            description="Track payments, invoices and outstanding amounts."
            href="/admin/payments"
          />

          <AdminLink
            title="Tasks"
            description="Manage event planning tasks and deadlines."
            href="/admin/tasks"
          />

          <AdminLink
            title="Reports"
            description="View business, event and financial reports."
            href="/admin/reports"
          />
        </div>
      </div>
    </main>
  );
}

function AdminLink({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
    >
      <h2 className="text-xl font-semibold text-slate-950 group-hover:text-violet-700">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <p className="mt-5 text-sm font-semibold text-violet-700">
        Open →
      </p>
    </a>
  );
}