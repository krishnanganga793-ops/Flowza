import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  Repeat,
  Sparkles,
  TimerReset,
  User,
  X
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/app/kanban", label: "Kanban", icon: ClipboardList },
  { to: "/app/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/app/pomodoro", label: "Pomodoro", icon: TimerReset },
  { to: "/app/time", label: "Time", icon: Gauge },
  { to: "/app/habits", label: "Habits", icon: Repeat },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/profile", label: "Profile", icon: User }
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const content = (
    <div className="flex h-full flex-col justify-between p-5">
      <div>
        {/* Brand header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-md shadow-indigo-500/20 text-white font-black text-lg">
              fz
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-lg font-black tracking-tight text-slate-900 dark:text-white">flowza</p>
                <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  PRO
                </span>
              </div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Productivity System</p>
            </div>
          </div>
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Overview
          </p>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                [
                  "group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 dark:bg-indigo-500 dark:text-white"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer widget */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-slate-50 p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/40">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Sparkles className="h-4 w-4" />
          <p className="text-xs font-bold uppercase tracking-wider">Focus Mode</p>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Track deep work hours & maintain long habit streaks.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/95 lg:block">
        {content}
      </aside>

      {/* Mobile drawer backdrop and panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl dark:bg-slate-950">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
