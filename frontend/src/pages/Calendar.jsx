import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { taskApi } from "../api/api.js";
import EmptyState from "../components/EmptyState.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

const priorityClasses = {
  Low: "priority-low",
  Medium: "priority-medium",
  High: "priority-high",
  Critical: "priority-critical"
};

export default function Calendar() {
  const { data, isLoading } = useQuery({ queryKey: ["tasks", "calendar"], queryFn: () => taskApi.list({ archived: "false" }) });
  const tasks = (data?.tasks || []).filter((task) => task.dueDate);
  const grouped = tasks.reduce((days, task) => {
    const key = new Date(task.dueDate).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    days[key] = [...(days[key] || []), task];
    return days;
  }, {});

  return (
    <div className="space-y-6">
      <SectionHeader title="Calendar Schedule" subtitle="A due-date view of all upcoming work already on your plate." />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
          ))}
        </div>
      ) : null}

      {!isLoading && !tasks.length ? (
        <EmptyState icon={CalendarIcon} title="No dated tasks scheduled" message="Add due dates to your tasks to see them organized by date here." />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(grouped).map(([date, items]) => (
          <section key={date} className="panel flex flex-col justify-between">
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="font-extrabold text-slate-900 dark:text-white">{date}</h2>
                </div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  {items.length} {items.length === 1 ? "task" : "tasks"}
                </span>
              </div>

              <div className="space-y-2.5">
                {items.map((task) => {
                  const pClass = priorityClasses[task.priority] || priorityClasses.Medium;
                  return (
                    <div
                      key={task._id}
                      className="group rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 transition-all hover:border-slate-300 hover:bg-white dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{task.title}</p>
                        <span className={`badge text-[10px] shrink-0 ${pClass}`}>{task.priority}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">{task.status}</span>
                        {task.estimatedTime > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {task.estimatedTime}m
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

