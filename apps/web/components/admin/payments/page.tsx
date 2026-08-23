import { CreditCard, Plus } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-violet-600">
            CELEBRIO ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Payments
          </h1>

          <p className="mt-2 text-slate-500">
            Track customer payments and outstanding balances.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white">
          <Plus size={18} />
          Add Payment
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Total Received</p>
          <p className="mt-2 text-3xl font-bold">₹0</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-2 text-3xl font-bold">₹0</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Transactions</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 p-6">
          <CreditCard className="text-violet-600" size={24} />

          <div>
            <h2 className="font-bold">Payment History</h2>
            <p className="text-sm text-slate-500">
              All customer payment records.
            </p>
          </div>
        </div>

        <div className="p-16 text-center text-slate-500">
          No payments available yet.
        </div>
      </div>
    </div>
  );
}