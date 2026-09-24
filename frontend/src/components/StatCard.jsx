export default function StatCard({ label, value, accent, icon: Icon, trend }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg dark:border-slate-800/80 dark:bg-slate-900/90">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">{value}</p>
          {trend && (
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-110"
            style={{
              backgroundColor: accent ? `${accent}15` : "rgba(99, 102, 241, 0.1)",
              color: accent || "#6366f1"
            }}
          >
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      <div
        className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full opacity-10 blur-xl transition-opacity group-hover:opacity-25"
        style={{ backgroundColor: accent || "#6366f1" }}
      />
    </div>
  );
}

