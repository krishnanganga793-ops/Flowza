import mongoose from "mongoose";

export const taskStatuses = ["Backlog", "To Do", "In Progress", "Review", "Completed"];
export const priorities = ["Low", "Medium", "High", "Critical"];

const subtaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: "", maxlength: 4000 },
    priority: { type: String, enum: priorities, default: "Medium", index: true },
    status: { type: String, enum: taskStatuses, default: "To Do", index: true },
    category: { type: String, default: "General", trim: true },
    dueDate: { type: Date, index: true },
    estimatedTime: { type: Number, default: 0, min: 0 },
    actualTime: { type: Number, default: 0, min: 0 },
    tags: [{ type: String, trim: true }],
    completed: { type: Boolean, default: false, index: true },
    archived: { type: Boolean, default: false, index: true },
    subtasks: [subtaskSchema]
  },
  { timestamps: true }
);

taskSchema.pre("save", function normalizeCompleted(next) {
  if (this.status === "Completed") this.completed = true;
  if (this.completed) this.status = "Completed";
  next();
});

export default mongoose.model("Task", taskSchema);
