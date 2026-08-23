import { Users, Plus, Search } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-violet-600">
            CELEBRIO ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Customers
          </h1>

          <p className="mt-2 text-slate-500">
            Manage customer enquiries and wedding clients.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700">
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
          <Search size={19} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="w-full outline-none"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
              <Users size={22} />
            </div>

            <div>
              <h2 className="font-bold text-slate-950">
                Customer Directory
              </h2>

              <p className="text-sm text-slate-500">
                All customer enquiries and clients.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">City</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-16 text-center text-slate-500"
                >
                  No customers available yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}