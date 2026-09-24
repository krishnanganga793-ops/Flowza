import { LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/api.js";
import { clearCredentials } from "../store/authSlice.js";
import { showToast, toggleTheme } from "../store/uiSlice.js";

export default function Topbar({ onToggleMobile }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const darkMode = useSelector((state) => state.ui.darkMode);

  const logout = async () => {
    await authApi.logout().catch(() => null);
    dispatch(clearCredentials());
    dispatch(showToast({ type: "success", message: "Signed out" }));
    navigate("/login");
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobile}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            title="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="group flex w-64 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-2 transition-all focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/60 dark:focus-within:border-indigo-400 dark:focus-within:bg-slate-900 sm:w-80">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500" />
            <input
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
              placeholder="Search tasks, habits, timers..."
            />
            <kbd className="hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800 sm:inline-block">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => dispatch(toggleTheme())}
            title="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          <div className="flex items-center gap-3 border-l border-slate-200/80 pl-3 dark:border-slate-800">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-500/20" />
            ) : (
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 font-bold text-white shadow-sm shadow-indigo-500/30">
                {initial}
              </div>
            )}
            <div className="hidden min-w-0 text-left sm:block">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">{user?.name || "User"}</p>
              <p className="truncate text-[11px] text-slate-400">{user?.email || "Pro Plan"}</p>
            </div>
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
            onClick={logout}
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

