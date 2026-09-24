import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Lock, Mail, Sparkles, Timer } from "lucide-react";
import { authApi, getApiErrorMessage } from "../api/api.js";
import { setCredentials } from "../store/authSlice.js";
import { showToast } from "../store/uiSlice.js";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.login(form);
      dispatch(setCredentials(data));
      dispatch(showToast({ type: "success", message: "Welcome back to flowza!" }));
      navigate("/app");
    } catch (error) {
      dispatch(showToast({ type: "error", message: getApiErrorMessage(error, "Login failed") }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your flowza command center.">
      <form onSubmit={submit} className="grid gap-4">
        <div>
          <label className="label mb-1 block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              className="field pl-10"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="label mb-1 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              className="field pl-10"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
        </div>

        <button className="btn-primary mt-2 py-3 text-base font-extrabold" disabled={loading}>
          {loading ? "Signing in..." : "Sign In to Workspace"} <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link className="font-extrabold text-indigo-600 hover:underline dark:text-indigo-400" to="/register">
            Create workspace
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_480px] xl:grid-cols-[1.3fr_520px]">
        {/* Left Hero Section */}
        <section className="relative hidden overflow-hidden bg-slate-900 p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.2),transparent_50%)]" />

          {/* Top Brand Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black text-lg shadow-glow">
              fz
            </div>
            <span className="text-xl font-black tracking-tight text-white">flowza</span>
          </div>

          {/* Middle Hero Content */}
          <div className="relative z-10 max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" /> Next-Gen Productivity OS
            </div>
            <h1 className="text-6xl font-black leading-none tracking-tight text-white xl:text-8xl">
              flowza
            </h1>
            <p className="text-3xl font-black leading-tight tracking-tight text-white xl:text-4xl">
              A calm command center for focused, high-impact days.
            </p>
            <p className="text-base leading-relaxed text-slate-300">
              Harmonize tasks, habits, Pomodoro focus blocks, and weekly analytics in one sleek, ultra-responsive workspace.
            </p>

            <div className="grid gap-3 pt-4 sm:grid-cols-2">
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">Kanban & List Tasks</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <Timer className="h-5 w-5 text-indigo-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">Pomodoro Focus Timer</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright/Info */}
          <div className="relative z-10 text-xs font-medium text-slate-500">
            (c) flowza Time Management OS. All rights reserved.
          </div>
        </section>

        {/* Right Form Card Container */}
        <section className="flex items-center justify-center bg-slate-50 px-6 py-12 text-slate-900 dark:bg-slate-950 dark:text-white">
          <div className="panel w-full max-w-md border-slate-200/80 bg-white/90 p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-5 text-4xl font-black leading-none tracking-tight text-slate-950 dark:text-white lg:hidden">
              flowza
            </p>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h2>
            <p className="mb-6 mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
