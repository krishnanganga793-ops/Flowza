import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { authApi, getApiErrorMessage } from "../api/api.js";
import { setCredentials } from "../store/authSlice.js";
import { showToast } from "../store/uiSlice.js";
import { AuthShell } from "./Login.jsx";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.register(form);
      dispatch(setCredentials(data));
      dispatch(showToast({ type: "success", message: "Account created! Welcome to flowza." }));
      navigate("/app");
    } catch (error) {
      dispatch(showToast({ type: "error", message: getApiErrorMessage(error, "Registration failed") }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your workspace" subtitle="Start tracking time, habits, and tasks in seconds.">
      <form onSubmit={submit} className="grid gap-4">
        <div>
          <label className="label mb-1 block">Your Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              className="field pl-10"
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              minLength={2}
              required
            />
          </div>
        </div>

        <div>
          <label className="label mb-1 block">Work Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              className="field pl-10"
              type="email"
              placeholder="jane@company.com"
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
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={8}
              required
            />
          </div>
        </div>

        <button className="btn-primary mt-2 py-3 text-base font-extrabold" disabled={loading}>
          {loading ? "Creating workspace..." : "Create Free Account"}{" "}
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          Already registered?{" "}
          <Link className="font-extrabold text-indigo-600 hover:underline dark:text-indigo-400" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
