import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, FileText, PlusCircle, Timer } from "lucide-react";
import { useState } from "react";
import { taskApi, timerApi } from "../api/api.js";
import EmptyState from "../components/EmptyState.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

export default function TimeTracking() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    taskId: "",
    startTime: new Date().toISOString().slice(0, 16),
    duration: 25,
    note: ""
  });

  const { data: taskData } = useQuery({ queryKey: ["tasks", "time"], queryFn: () => taskApi.list({ archived: "false" }) });
  const { data, isLoading } = useQuery({ queryKey: ["time-report"], queryFn: () => timerApi.report("week") });

  const manualEntry = useMutation({
    mutationFn: timerApi.manual,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["time-report"] })
  });

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <div className="space-y-6">
      <SectionHeader title="Time Logs & Tracking" subtitle="Log focused minutes manually and review your recent weekly report." />

      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        {/* Form Panel */}
        <section className="panel">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Log Focus Time</h2>
              <p className="text-xs text-slate-400">Record work done offline or manually</p>
            </div>
          </div>

          <form
            className="mt-5 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              manualEntry.mutate({
                ...form,
                taskId: form.taskId || undefined,
                startTime: new Date(form.startTime).toISOString(),
                duration: Number(form.duration)
              });
            }}
          >
            <div>
              <label className="label">Associated Task</label>
              <select className="field mt-1" value={form.taskId} onChange={(event) => update("taskId", event.target.value)}>
                <option value="">No task (General time)</option>
                {(taskData?.tasks || []).map((task) => (
                  <option key={task._id} value={task._id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-indigo-500" /> Start Time
              </label>
              <input
                className="field mt-1"
                type="datetime-local"
                value={form.startTime}
                onChange={(event) => update("startTime", event.target.value)}
                required
              />
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-indigo-500" /> Duration (Minutes)
              </label>
              <input
                className="field mt-1"
                type="number"
                min="1"
                value={form.duration}
                onChange={(event) => update("duration", event.target.value)}
                required
              />
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-indigo-500" /> Session Note
              </label>
              <textarea
                className="field mt-1 min-h-20"
                placeholder="What did you focus on during this block?"
                value={form.note}
                onChange={(event) => update("note", event.target.value)}
              />
            </div>

            <button className="btn-primary" disabled={manualEntry.isPending}>
              {manualEntry.isPending ? "Logging..." : "Save Time Entry"}
            </button>
          </form>
        </section>

        {/* Weekly Logs Report Panel */}
        <section className="panel flex flex-col justify-between">
          <div>
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">This Week&apos;s Summary</h2>
                <p className="text-xs text-slate-400">Total tracked minutes</p>
              </div>
              <div className="rounded-2xl bg-indigo-50 px-4 py-2 text-right dark:bg-indigo-950/60">
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{data?.totalMinutes || 0}m</p>
                <p className="text-[10px] font-bold text-slate-400">
                  {Math.round(((data?.totalMinutes || 0) / 60) * 10) / 10} hours
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-200/60 dark:bg-slate-800/60" />
                ))}
              </div>
            ) : null}

            {!isLoading && !data?.logs?.length ? (
              <EmptyState icon={Timer} title="No time logged yet" message="Add a manual entry or complete Pomodoro timers to build your weekly log." />
            ) : null}

            <div className="space-y-3">
              {(data?.logs || []).map((log) => (
                <div
                  key={log._id}
                  className="flex items-start justify-between rounded-xl border border-slate-200/80 bg-white/60 p-3.5 transition-all hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{log.taskId?.title || "Unassigned Deep Work"}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {new Date(log.startTime).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    {log.note && <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{log.note}</p>}
                  </div>
                  <span className="badge bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold shrink-0">
                    {log.duration} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

