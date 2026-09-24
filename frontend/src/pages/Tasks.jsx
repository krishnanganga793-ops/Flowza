import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, Copy, Filter, Folder, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { taskApi } from "../api/api.js";
import EmptyState from "../components/EmptyState.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import TaskForm from "../components/TaskForm.jsx";

const statusList = ["All", "Backlog", "To Do", "In Progress", "Review", "Completed"];

const priorityClasses = {
  Low: "priority-low",
  Medium: "priority-medium",
  High: "priority-high",
  Critical: "priority-critical"
};

export default function Tasks() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", status],
    queryFn: () => taskApi.list(status ? { status } : undefined)
  });

  const createTask = useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setShowForm(false);
    }
  });

  const updateTask = useMutation({
    mutationFn: ({ id, payload }) => taskApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] })
  });

  const removeTask = useMutation({
    mutationFn: taskApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] })
  });

  const duplicateTask = useMutation({
    mutationFn: taskApi.duplicate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] })
  });

  const tasks = data?.tasks || [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Tasks"
        subtitle="Capture work, update priority, and move items through your workflow."
        actions={
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            New Task
          </button>
        }
      />

      {/* Filter tab bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-2 shadow-soft dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {statusList.map((item) => {
            const isSelected = (item === "All" && !status) || status === item;
            return (
              <button
                key={item}
                onClick={() => setStatus(item === "All" ? "" : item)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 dark:bg-indigo-500"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-400">
          <Filter className="h-3.5 w-3.5" />
          <span>{tasks.length} tasks</span>
        </div>
      </div>

      {/* Task Creation Form Panel */}
      {showForm && (
        <section className="panel animate-slide-up border-indigo-200 dark:border-indigo-900/50">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create New Task</h2>
          </div>
          <TaskForm
            onSubmit={(payload) => createTask.mutate(payload)}
            isLoading={createTask.isPending}
            onCancel={() => setShowForm(false)}
          />
        </section>
      )}

      {/* Tasks List */}
      <section className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
            ))}
          </div>
        ) : null}

        {!isLoading && !tasks.length ? (
          <EmptyState
            title="No tasks found"
            message="Create a task or change your status filter to see items here."
            action={
              <button className="btn-primary mt-2" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" /> Create Task
              </button>
            }
          />
        ) : null}

        {tasks.map((task) => {
          const pClass = priorityClasses[task.priority] || priorityClasses.Medium;
          return (
            <article
              key={task._id}
              className="panel group flex flex-col justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-700 md:flex-row md:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{task.title}</h2>
                  <span className={`badge ${pClass}`}>{task.priority}</span>
                </div>

                {task.description && (
                  <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Folder className="h-3.5 w-3.5 text-indigo-500" />
                    {task.category || "General"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-indigo-500" />
                    {task.estimatedTime || 0} min
                  </span>

                  {Array.isArray(task.tags) && task.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5 text-indigo-500" />
                      {task.tags.map((t, idx) => (
                        <span key={idx} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions & Status selector */}
              <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800 md:border-t-0 md:pt-0">
                <select
                  className="field py-1.5 text-xs font-semibold"
                  value={task.status}
                  onChange={(event) =>
                    updateTask.mutate({
                      id: task._id,
                      payload: { status: event.target.value, completed: event.target.value === "Completed" }
                    })
                  }
                >
                  {statusList.filter((s) => s !== "All").map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <button
                  className="btn-ghost p-2"
                  onClick={() => duplicateTask.mutate(task._id)}
                  title="Duplicate Task"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  className="btn-ghost p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  onClick={() => removeTask.mutate(task._id)}
                  title="Delete Task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

