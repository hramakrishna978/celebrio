"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  CheckCircle2,
  Circle,
  Clock3,
  Plus,
  X,
  AlertCircle,
  Calendar,
} from "lucide-react";

interface TaskItem {
  id: number;
  event_id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  events: {
    id: number;
    event_name: string;
    customers: {
      id: number;
      name: string;
    };
  };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [feedback, setFeedback] = useState("");

  const [newTask, setNewTask] = useState({
    eventId: "",
    title: "",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: "",
    description: "",
  });

  async function loadData() {
    try {
      const res = await fetch("/api/admin/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }

      const custRes = await fetch("/api/customers");
      if (custRes.ok) {
        const custData = await custRes.json();
        const evs: any[] = [];
        custData.forEach((c: any) => {
          (c.events || []).forEach((ev: any) => {
            evs.push({
              id: ev.id,
              customerName: c.name,
              eventName: ev.event_name,
            });
          });
        });
        setEventsList(evs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleStatusChange(
    taskId: number,
    newStatus: "TODO" | "IN_PROGRESS" | "COMPLETED"
  ) {
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });

      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreateTask(e: FormEvent) {
    e.preventDefault();
    if (!newTask.eventId || !newTask.title) {
      alert("Please select celebration and enter title");
      return;
    }

    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: Number(newTask.eventId),
          title: newTask.title,
          priority: newTask.priority,
          status: newTask.status,
          dueDate: newTask.dueDate || null,
          description: newTask.description || null,
        }),
      });

      if (res.ok) {
        setFeedback("New task assigned!");
        setModalOpen(false);
        setNewTask({
          eventId: "",
          title: "",
          priority: "MEDIUM",
          status: "TODO",
          dueDate: "",
          description: "",
        });
        await loadData();
        setTimeout(() => setFeedback(""), 3500);
      }
    } catch (err) {
      console.error(err);
      alert("Error adding task.");
    }
  }

  const groups: Array<"TODO" | "IN_PROGRESS" | "COMPLETED"> = [
    "TODO",
    "IN_PROGRESS",
    "COMPLETED",
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
            Celebrio Operations
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Planning Tasks & Kanban Board
          </h1>
          <p className="mt-2 text-slate-500">
            Assign deliverables, prioritize actions, and update milestone statuses
            across celebrations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-primary text-xs"
        >
          <Plus size={15} /> Add Task
        </button>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 animate-fadeIn">
          <CheckCircle2 size={18} />
          {feedback}
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid gap-5 lg:grid-cols-3">
        {groups.map((status) => {
          const items = tasks.filter((t) => t.status === status);

          return (
            <section
              key={status}
              className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 font-bold text-slate-900">
                <div className="flex items-center gap-2 text-sm">
                  {status === "COMPLETED" ? (
                    <CheckCircle2 className="text-emerald-600" size={18} />
                  ) : status === "IN_PROGRESS" ? (
                    <Clock3 className="text-amber-500" size={18} />
                  ) : (
                    <Circle className="text-slate-400" size={18} />
                  )}
                  <span>
                    {status === "TODO"
                      ? "To Do"
                      : status === "IN_PROGRESS"
                      ? "In Progress"
                      : "Completed"}
                  </span>
                </div>

                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold shadow-xs border">
                  {items.length}
                </span>
              </div>

              <div className="mt-4 flex-1 space-y-3">
                {items.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                    No tasks in this column
                  </div>
                ) : (
                  items.map((task) => (
                    <article
                      key={task.id}
                      className="group rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-slate-900 text-sm">
                          {task.title}
                        </p>

                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(
                              task.id,
                              e.target.value as "TODO" | "IN_PROGRESS" | "COMPLETED"
                            )
                          }
                          className="text-[11px] font-bold rounded-lg border px-1.5 py-0.5 bg-slate-50 text-slate-600 outline-none"
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>

                      <p className="mt-1 text-xs text-slate-500 truncate">
                        {task.events?.customers?.name || "Client"} ·{" "}
                        {task.events?.event_name || "Celebration"}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-2 text-[11px]">
                        <span
                          className={`rounded-md px-1.5 py-0.5 font-bold ${
                            task.priority === "HIGH"
                              ? "bg-red-50 text-red-700"
                              : task.priority === "MEDIUM"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-50 text-slate-600"
                          }`}
                        >
                          {task.priority} Priority
                        </span>

                        <span className="flex items-center gap-1 text-slate-400 font-medium">
                          <Calendar size={11} />
                          {task.due_date
                            ? new Date(task.due_date).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                              })
                            : "No due date"}
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Add New Planning Task
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Select Celebration
                </label>
                <select
                  required
                  value={newTask.eventId}
                  onChange={(e) =>
                    setNewTask({ ...newTask, eventId: e.target.value })
                  }
                  className="field"
                >
                  <option value="">Choose celebration...</option>
                  {eventsList.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.customerName} · {ev.eventName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule venue walkthrough visit"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="field"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional details or instructions..."
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="field font-normal"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
