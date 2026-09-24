import mongoose from "mongoose";

const completionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    note: { type: String, default: "" }
  },
  { _id: false }
);

const habitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    streak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    completions: [completionSchema],
    reminderTime: { type: String, default: "" },
    color: { type: String, default: "#2563eb" }
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);
