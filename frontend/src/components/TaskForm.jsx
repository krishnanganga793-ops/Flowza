import { useState } from "react";
import { Calendar, Clock, Flag, Folder, Sparkles, Tag } from "lucide-react";

const defaults = {
  title: "",
  description: "",
  priority: "Medium",
  status: "To Do",
  category: "General",
  dueDate: "",
  estimatedTime: 25,
  tags: ""
};

const priorityOptions = [
  { level: "Low", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  { level: "Medium", color: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300" },
  { level: "High", color: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300" },
  { level: "Critical", color: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" }
];

export default function TaskForm({ initial, onSubmit, isLoading, onCancel }) {
  const [form, setForm] = useState({
    ...defaults,
    ...initial,
    dueDate: initial?.dueDate ? initial.dueDate.slice(0, 10) : "",
    tags: Array.isArray(initial?.tags) ? initial.tags.join(", ") : initial?.tags || ""
  });

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      estimatedTime: Number(form.estimatedTime || 0),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div>
        <label className="label">Task Title</label>
        <input
          className="field mt-1 text-base font-medium"
          placeholder="e.g. Design landing page hero section"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label">Description & Notes</label>
        <textarea
          className="field mt-1 min-h-24 leading-relaxed"
          placeholder="Add details, acceptance criteria, or key links..."
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      {/* Priority Pills */}
      <div>
        <label className="label flex items-center gap-1.5">
          <Flag className="h-3.5 w-3.5" /> Priority Level
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {priorityOptions.map(({ level, color }) => {
            const isSelected = form.priority === level;
            return (
              <button
                type="button"
                key={level}
                onClick={() => update("priority", level)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  isSelected
                    ? "ring-2 ring-indigo-500 shadow-sm scale-105 " + color
                    : "opacity-60 hover:opacity-100 " + color
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Status Stage
          </label>
          <select className="field mt-1 font-medium" value={form.status} onChange={(e) => update("status", e.target.value)}>
            {["Backlog", "To Do", "In Progress", "Review", "Completed"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label flex items-center gap-1.5">
            <Folder className="h-3.5 w-3.5" /> Category
          </label>
          <input className="field mt-1" value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="General, Work, Personal" />
        </div>

        <div>
          <label className="label flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Target Due Date
          </label>
          <input className="field mt-1" type="date" value={form.dueDate} onChange={(e) => update("dueDate", e.target.value)} />
        </div>

        <div>
          <label className="label flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Estimated Duration (Min)
          </label>
          <input className="field mt-1" type="number" min="0" value={form.estimatedTime} onChange={(e) => update("estimatedTime", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5" /> Tags (Comma Separated)
        </label>
        <input className="field mt-1" value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="deepwork, design, high-impact" />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button type="button" className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className="btn-primary" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Task"}
        </button>
      </div>
    </form>
  );
}

