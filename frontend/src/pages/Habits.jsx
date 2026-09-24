import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Flame, Plus, Repeat, Trash2, Trophy } from "lucide-react";
import { useState } from "react";
import { habitApi } from "../api/api.js";
import EmptyState from "../components/EmptyState.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

export default function Habits() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["habits"], queryFn: habitApi.list });

  const createHabit = useMutation({
    mutationFn: habitApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      setTitle("");
    }
  });

  const completeHabit = useMutation({
    mutationFn: habitApi.complete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] })
  });

  const removeHabit = useMutation({
    mutationFn: habitApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] })
  });

  const today = new Date().toDateString();
  const habits = data?.habits || [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Habit Tracker" subtitle="Track small repeatable daily actions and build long streaks." />

      {/* Add Habit Form */}
      <form
        className="panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
        onSubmit={(event) => {
          event.preventDefault();
          if (title.trim()) createHabit.mutate({ title: title.trim() });
        }}
      >
        <div className="relative flex-1">
          <input
            className="field pl-3.5"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Read 20 pages, 30 min workout, meditate"
            required
          />
        </div>
        <button className="btn-primary shrink-0" disabled={createHabit.isPending}>
          <Plus className="h-4 w-4" />
          Add Habit
        </button>
      </form>

      {/* Habits Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
          ))}
        </div>
      ) : null}

      {!isLoading && !habits.length ? (
        <EmptyState icon={Repeat} title="No habits added yet" message="Add one habit you want to practice daily to build consistency." />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {habits.map((habit) => {
          const doneToday = habit.completions?.some((item) => new Date(item.date).toDateString() === today);
          const accentColor = habit.color || "#6366f1";

          return (
            <article
              key={habit._id}
              className="panel flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 shrink-0 rounded-full shadow-sm" style={{ backgroundColor: accentColor }} />
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{habit.title}</h2>
                  </div>
                  <button
                    className="btn-ghost p-1.5 text-slate-400 hover:text-rose-500"
                    onClick={() => removeHabit.mutate(habit._id)}
                    title="Delete Habit"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                    <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span>Streak: {habit.streak || 0} days</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                    <Trophy className="h-3.5 w-3.5" />
                    <span>Best: {habit.bestStreak || 0}</span>
                  </div>
                </div>
              </div>

              <button
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition-all duration-150 active:scale-[0.98] ${
                  doneToday
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600 dark:bg-emerald-600"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
                onClick={() => completeHabit.mutate(habit._id)}
              >
                <Check className="h-4 w-4" />
                {doneToday ? "Completed Today" : "Mark as Done"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

