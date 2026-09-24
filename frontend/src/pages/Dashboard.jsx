import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, BarChart3, CalendarDays, CheckCircle2, Flame, Sparkles, Target, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { analyticsApi } from "../api/api.js";
import EmptyState from "../components/EmptyState.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import StatCard from "../components/StatCard.jsx";

const priorityClasses = {
  Low: "priority-low",
  Medium: "priority-medium",
  High: "priority-high",
  Critical: "priority-critical"
};

export default function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["summary"], queryFn: analyticsApi.summary });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Dashboard" subtitle="Today, deadlines, focus time, and weekly productivity at a glance." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard"
        subtitle="Today, deadlines, focus time, and weekly productivity at a glance."
        actions={
          <Link to="/app/tasks" className="btn-primary">
            <Sparkles className="h-4 w-4" />
            Quick Action
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Productivity Score" value={`${stats.productivityScore || 0}%`} icon={Target} accent="#6366f1" trend="+5% this week" />
        <StatCard label="Focus Minutes" value={`${stats.focusMinutes || 0}m`} icon={Timer} accent="#10b981" trend="Active timer" />
        <StatCard label="Tasks Complete" value={stats.completedTasks || 0} icon={CheckCircle2} accent="#f43f5e" trend="High output" />
        <StatCard label="Habit Streaks" value={`${stats.habitDoneToday || 0}/${stats.activeHabits || 0}`} icon={Flame} accent="#f59e0b" trend="Daily target" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        {/* Weekly Focus Bar Chart */}
        <section className="panel">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">Weekly Focus Time</h2>
                <p className="text-xs text-slate-400">Minutes spent in deep work</p>
              </div>
            </div>
            <Link to="/app/analytics" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
              View Analytics <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.focusByDay || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)"
                  }}
                  formatter={(value) => [`${value} min`, "Focus Time"]}
                />
                <Bar dataKey="minutes" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Today's Tasks */}
        <section className="panel flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white">Today&apos;s Tasks</h2>
              <Link to="/app/tasks" className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {data?.todayTasks?.length ? (
                data.todayTasks.map((task) => <TaskRow key={task._id} task={task} />)
              ) : (
                <EmptyState title="No due tasks today" message="Enjoy your clear focus day or add new tasks." />
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Upcoming Deadlines */}
      <section className="panel">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="font-bold text-slate-900 dark:text-white">Upcoming Deadlines</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data?.upcoming?.length ? (
            data.upcoming.map((task) => <TaskRow key={task._id} task={task} />)
          ) : (
            <p className="text-xs font-medium text-slate-400">No upcoming deadlines.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function TaskRow({ task }) {
  const pClass = priorityClasses[task.priority] || priorityClasses.Medium;
  return (
    <div className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white/60 p-3.5 transition-all hover:border-slate-300 hover:bg-white dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-900">
      <div className="min-w-0 flex-1 pr-3">
        <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{task.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
          <span>{task.category || "General"}</span>
          <span>•</span>
          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</span>
        </div>
      </div>
      <span className={`badge shrink-0 ${pClass}`}>{task.priority}</span>
    </div>
  );
}

