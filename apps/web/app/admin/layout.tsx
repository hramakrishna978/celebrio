import Link from "next/link";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
  },
  {
    name: "Customers",
    href: "/admin/customers",
  },
  {
    name: "Events",
    href: "/admin/events",
  },
  {
    name: "Consultations",
    href: "/admin/consultations",
  },
  {
    name: "Services",
    href: "/admin/services",
  },
  {
    name: "Vendors",
    href: "/admin/vendors",
  },
  {
    name: "Contracts",
    href: "/admin/contracts",
  },
  {
    name: "Payments",
    href: "/admin/payments",
  },
  {
    name: "Tasks",
    href: "/admin/tasks",
  },
  {
    name: "Reports",
    href: "/admin/reports",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">

      <div className="flex min-h-screen">

        {/* Sidebar */}

        <aside className="hidden w-64 border-r bg-white lg:block">

          <div className="border-b px-6 py-6">

            <Link
              href="/"
              className="text-2xl font-bold text-slate-950"
            >
              Celebrio
            </Link>

            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-violet-600">
              Admin Portal
            </p>

          </div>

          <nav className="space-y-1 p-4">

            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
              >
                {item.name}
              </Link>
            ))}

          </nav>

          <div className="absolute bottom-0 w-64 border-t bg-white p-4">

            <Link
              href="/"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              ← Back to Website
            </Link>

          </div>

        </aside>

        {/* Main */}

        <main className="flex-1">

          {/* Mobile/Header */}

          <header className="border-b bg-white px-6 py-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-violet-600">
                  CELEBRIO
                </p>

                <p className="text-xs text-slate-500">
                  Event Management Platform
                </p>

              </div>

              <Link
                href="/"
                className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Website
              </Link>

            </div>

          </header>

          <div className="p-6 lg:p-8">
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}