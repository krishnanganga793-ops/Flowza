import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Globe, Image, Mail, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authApi } from "../api/api.js";
import SectionHeader from "../components/SectionHeader.jsx";
import { setUser } from "../store/authSlice.js";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
    timezone: user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const updateProfile = useMutation({
    mutationFn: authApi.profile,
    onSuccess: (data) => dispatch(setUser(data.user))
  });

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="space-y-6">
      <SectionHeader title="Account Profile" subtitle="Manage your account preferences, avatar, and time zone settings." />

      <div className="mx-auto max-w-3xl space-y-6">
        {/* User Hero Banner */}
        <section className="panel bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-slate-900 dark:to-slate-900">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            {form.avatar ? (
              <img src={form.avatar} alt={form.name} className="h-20 w-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md" />
            ) : (
              <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-2xl font-black text-white shadow-md shadow-indigo-500/30">
                {initial}
              </div>
            )}
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{user?.name}</h2>
              <p className="text-xs font-semibold text-slate-400">{user?.email}</p>
              <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="badge bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">Pro Plan</span>
                <span className="badge bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">Active Session</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form Panel */}
        <section className="panel">
          <form
            className="grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              updateProfile.mutate(form);
            }}
          >
            <div>
              <label className="label flex items-center gap-1.5">
                <UserIcon className="h-3.5 w-3.5 text-indigo-500" /> Full Name
              </label>
              <input className="field mt-1" value={form.name} onChange={(event) => update("name", event.target.value)} required />
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-indigo-500" /> Email Address
              </label>
              <input className="field mt-1 opacity-75 cursor-not-allowed bg-slate-100 dark:bg-slate-800" value={user?.email || ""} disabled />
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <Image className="h-3.5 w-3.5 text-indigo-500" /> Avatar Image URL
              </label>
              <input
                className="field mt-1"
                placeholder="https://images.unsplash.com/photo-..."
                value={form.avatar}
                onChange={(event) => update("avatar", event.target.value)}
              />
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-indigo-500" /> Timezone
              </label>
              <input className="field mt-1" value={form.timezone} onChange={(event) => update("timezone", event.target.value)} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button className="btn-primary" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving changes..." : "Save Profile"}
              </button>

              {updateProfile.isSuccess && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Profile updated successfully!
                </div>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

