import { FileText, Plus } from "lucide-react";

export default function ContractsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-violet-600">
            CELEBRIO ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Contracts
          </h1>

          <p className="mt-2 text-slate-500">
            Create and manage customer contracts.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white">
          <Plus size={18} />
          Create Contract
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 p-6">
          <FileText className="text-violet-600" size={24} />

          <div>
            <h2 className="font-bold">Contract Management</h2>
            <p className="text-sm text-slate-500">
              Customer agreements and contract status.
            </p>
          </div>
        </div>

        <div className="p-16 text-center text-slate-500">
          No contracts available yet.
        </div>
      </div>
    </div>
  );
}