import mongoose from "mongoose";

const timeLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date },
    duration: { type: Number, default: 0, min: 0 },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

timeLogSchema.index({ userId: 1, endTime: 1 });

export default mongoose.model("TimeLog", timeLogSchema);
