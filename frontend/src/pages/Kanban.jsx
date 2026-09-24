import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock } from "lucide-react";
import { taskApi } from "../api/api.js";
import EmptyState from "../components/EmptyState.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

const statusConfig = {
  Backlog: { color: "bg-slate-400", border: "border-t-slate-400" },
  "To Do": { color: "bg-indigo-500", border: "border-t-indigo-500" },
  "In Progress": { color: "bg-amber-500", border: "border-t-amber-500" },
  Review: { color: "bg-purple-500", border: "border-t-purple-500" },
  Completed: { color: "bg-emerald-500", border: "border-t-emerald-500" }
};

const priorityClasses = {
  Low: "priority-low",
  Medium: "priority-medium",
  High: "priority-high",
  Critical: "priority-critical"
};

export default function Kanban() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["tasks", "kanban"], queryFn: () => taskApi.list({ archived: "false" }) });

  const updateTask = useMutation({
    mutationFn: ({ id, payload }) => taskApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] })
  });

  const tasks = data?.tasks || [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Kanban Board" subtitle="Move tasks across workflow stages visually without losing details." />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Object.keys(statusConfig).map((key) => (
            <div key={key} className="h-64 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
          ))}
        </div>
      ) : null}

      {!isLoading && !tasks.length ? <EmptyState title="No cards on the board" message="Tasks you create will appear on this Kanban board." /> : null}

      <div className="grid gap-4 overflow-x-auto pb-4 sm:grid-cols-2 xl:grid-cols-5">
        {Object.entries(statusConfig).map(([status, config]) => {
          const columnTasks = tasks.filter((task) => task.status === status);
          return (
            <section
              key={status}
              className={`flex flex-col rounded-2xl border border-slate-200/80 border-t-4 ${config.border} bg-slate-100/50 p-4 dark:border-slate-800 dark:bg-slate-900/40`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${config.color}`} />
                  <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{status}</h2>
                </div>
                <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {columnTasks.length}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                {columnTasks.map((task) => {
                  const pClass = priorityClasses[task.priority] || priorityClasses.Medium;
                  return (
                    <article
                      key={task._id}
                      className="group rounded-xl border border-slate-200/80 bg-white p-4 shadow-soft transition-all hover:border-indigo-300 hover:shadow-soft-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{task.title}</p>
                        <span className={`badge shrink-0 text-[10px] ${pClass}`}>{task.priority}</span>
                      </div>

                      {task.description && (
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {task.estimatedTime > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimatedTime}m
                          </span>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                        <select
                          className="field py-1 text-xs font-medium"
                          value={task.status}
                          onChange={(event) =>
                            updateTask.mutate({
                              id: task._id,
                              payload: { status: event.target.value, completed: event.target.value === "Completed" }
                            })
                          }
                        >
                          {Object.keys(statusConfig).map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

