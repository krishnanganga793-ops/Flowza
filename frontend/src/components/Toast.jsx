import { useEffect } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearToast } from "../store/uiSlice.js";

export default function Toast() {
  const toast = useSelector((state) => state.ui.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => dispatch(clearToast()), 3200);
    return () => clearTimeout(timer);
  }, [dispatch, toast]);

  if (!toast) return null;
  const isError = toast.type === "error";
  const Icon = isError ? XCircle : CheckCircle2;

  return (
    <div className="animate-slide-up fixed bottom-6 right-6 z-50 flex max-w-md items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isError ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{isError ? "Notice" : "Success"}</p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{toast.message}</p>
      </div>
      <button
        onClick={() => dispatch(clearToast())}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

