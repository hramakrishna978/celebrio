import { CheckSquare, Plus } from "lucide-react";

export default function TasksPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-violet-600">
            CELEBRIO ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Tasks
          </h1>

          <p className="mt-2 text-slate-500">
            Track and manage wedding planning tasks.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white">
          <Plus size={18} />
          Create Task
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 p-6">
          <CheckSquare className="text-violet-600" size={24} />

          <div>
            <h2 className="font-bold">Task Management</h2>
            <p className="text-sm text-slate-500">
              Wedding planning tasks and progress.
            </p>
          </div>
        </div>

        <div className="p-16 text-center text-slate-500">
          No tasks available yet.
        </div>
      </div>
    </div>
  );
}