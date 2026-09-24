import { useQuery } from "@tanstack/react-query";
import { BarChart3, CheckCircle2, Flame, Target, Timer } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { analyticsApi } from "../api/api.js";
import SectionHeader from "../components/SectionHeader.jsx";
import StatCard from "../components/StatCard.jsx";

export default function Analytics() {
  const { data, isLoading } = useQuery({ queryKey: ["summary"], queryFn: analyticsApi.summary });
  const stats = data?.stats || {};
  const habitRatio = stats.activeHabits ? Math.round(((stats.habitDoneToday || 0) / stats.activeHabits) * 100) : 0;

  return (
    <div className="space-y-6">
      <SectionHeader title="Analytics & Reports" subtitle="A comprehensive overview of completion rates, focus time, and habit consistency." />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Productivity Score" value={`${stats.productivityScore || 0}%`} icon={Target} accent="#6366f1" trend="Overall output" />
        <StatCard label="Total Tasks" value={stats.totalTasks || 0} icon={BarChart3} accent="#3b82f6" trend="Registered items" />
        <StatCard label="Completed Tasks" value={stats.completedTasks || 0} icon={CheckCircle2} accent="#10b981" trend="Finished items" />
        <StatCard label="Focus Minutes" value={`${stats.focusMinutes || 0}m`} icon={Timer} accent="#f43f5e" trend="Logged time" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Daily Focus Chart */}
        <section className="panel">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Daily Focus Time</h2>
              <p className="text-xs text-slate-400">Minutes tracked per day</p>
            </div>
            <span className="badge bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">Weekly</span>
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
                    color: "#fff"
                  }}
                  formatter={(value) => [`${value} min`, "Focus Time"]}
                />
                <Bar dataKey="minutes" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Tasks by Status Chart */}
        <section className="panel">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Tasks by Status</h2>
              <p className="text-xs text-slate-400">Distribution across workflow stages</p>
            </div>
            <span className="badge bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">Breakdown</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.taskByStatus || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff"
                  }}
                  formatter={(value) => [`${value} tasks`, "Task Count"]}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Habit Consistency Banner */}
      <section className="panel bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-slate-900 dark:to-slate-900/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Flame className="h-6 w-6 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Daily Habit Progress</h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {stats.habitDoneToday || 0} of {stats.activeHabits || 0} habits completed today ({habitRatio}%)
              </p>
            </div>
          </div>
          <div className="w-full max-w-xs">
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500" style={{ width: `${habitRatio}%` }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

