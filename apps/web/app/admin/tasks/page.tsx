export default function TasksPage() {
  return (
    <div>
      <p className="text-sm font-medium text-violet-600">
        CELEBRIO ADMIN
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-950">
        Tasks
      </h1>

      <p className="mt-2 text-slate-500">
        Manage event planning tasks and operational activities.
      </p>

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Task Management
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Pending, active, completed and overdue tasks will appear here.
        </p>
      </div>
    </div>
  );
}