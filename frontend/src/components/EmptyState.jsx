import { Inbox } from "lucide-react";

export default function EmptyState({ title, message, icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/90 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/30">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-3 text-base font-bold text-slate-800 dark:text-slate-200">{title}</p>
      <p className="mt-1 max-w-sm text-xs font-medium text-slate-500 dark:text-slate-400">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

