import { Coffee, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader.jsx";

const focusSeconds = 25 * 60;
const breakSeconds = 5 * 60;

export default function Pomodoro() {
  const [mode, setMode] = useState("focus");
  const [remaining, setRemaining] = useState(focusSeconds);
  const [running, setRunning] = useState(false);

  const totalSeconds = mode === "focus" ? focusSeconds : breakSeconds;
  const progressPercent = ((totalSeconds - remaining) / totalSeconds) * 100;

  useEffect(() => {
    if (!running) return undefined;
    const interval = window.setInterval(() => {
      setRemaining((value) => {
        if (value > 1) return value - 1;
        setRunning(false);
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  const reset = (nextMode = mode) => {
    setMode(nextMode);
    setRemaining(nextMode === "focus" ? focusSeconds : breakSeconds);
    setRunning(false);
  };

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  return (
    <div className="space-y-6">
      <SectionHeader title="Pomodoro Timer" subtitle="Boost deep focus with structured work intervals and timed rest breaks." />

      <section className="panel mx-auto max-w-xl p-8 text-center">
        {/* Mode Switcher */}
        <div className="mx-auto mb-8 grid max-w-xs grid-cols-2 rounded-2xl bg-slate-100/80 p-1.5 dark:bg-slate-800/80">
          <button
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition-all ${
              mode === "focus"
                ? "bg-white text-indigo-600 shadow-soft dark:bg-slate-900 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
            onClick={() => reset("focus")}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Focus (25m)
          </button>
          <button
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition-all ${
              mode === "break"
                ? "bg-white text-emerald-600 shadow-soft dark:bg-slate-900 dark:text-emerald-400"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
            onClick={() => reset("break")}
          >
            <Coffee className="h-3.5 w-3.5" />
            Break (5m)
          </button>
        </div>

        {/* Circular Display */}
        <div className="relative mx-auto my-6 grid h-64 w-64 place-items-center rounded-full bg-slate-50 shadow-inner dark:bg-slate-900/60">
          <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" className="text-slate-200 dark:text-slate-800" fill="transparent" />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={283}
              strokeDashoffset={283 - (283 * progressPercent) / 100}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${mode === "focus" ? "text-indigo-600 dark:text-indigo-500" : "text-emerald-500"}`}
              fill="transparent"
            />
          </svg>

          <div className="z-10">
            <div className={`text-6xl font-black tracking-tight tabular-nums ${running ? "animate-pulse-subtle" : ""}`}>
              {minutes}:{seconds}
            </div>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              {mode === "focus" ? "Deep Work Session" : "Rest & Recharge"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button className="btn-primary px-6 py-3 text-base font-extrabold" onClick={() => setRunning((value) => !value)}>
            {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            {running ? "Pause" : "Start Focus"}
          </button>
          <button className="btn-ghost px-5 py-3" onClick={() => reset()}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </section>

      {/* Focus Advice */}
      <div className="panel mx-auto max-w-xl bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-5 dark:from-slate-900 dark:to-slate-900/40">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Pro Tip</h3>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
          Close distracting browser tabs and notifications during your 25-minute focus window to keep your focus unbroken.
        </p>
      </div>
    </div>
  );
}

