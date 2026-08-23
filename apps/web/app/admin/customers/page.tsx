export default function CustomersPage() {
  return (
    <div>
      <p className="text-sm font-medium text-violet-600">
        CELEBRIO ADMIN
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-950">
        Customers
      </h1>

      <p className="mt-2 text-slate-500">
        Manage all customer enquiries and wedding clients.
      </p>

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Customer Management
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Customer records from the Celebrio database will appear here.
        </p>
      </div>
    </div>
  );
}