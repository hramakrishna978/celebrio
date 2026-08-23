export default function ContractsPage() {
  return (
    <div>
      <p className="text-sm font-medium text-violet-600">
        CELEBRIO ADMIN
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-950">
        Contracts
      </h1>

      <p className="mt-2 text-slate-500">
        Manage customer contracts and agreement status.
      </p>

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Contract Management
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Draft, sent, signed and expired contracts will be managed here.
        </p>
      </div>
    </div>
  );
}