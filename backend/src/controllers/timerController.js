import Task from "../models/Task.js";
import TimeLog from "../models/TimeLog.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const startTimer = asyncHandler(async (req, res) => {
  const active = await TimeLog.findOne({ userId: req.user._id, endTime: { $exists: false } });
  if (active) {
    const error = new Error("A timer is already running");
    error.statusCode = 409;
    throw error;
  }

  const timeLog = await TimeLog.create({
    userId: req.user._id,
    taskId: req.validated.body.taskId,
    startTime: new Date(),
    note: req.validated.body.note || ""
  });

  res.status(201).json({ timeLog });
});

export const stopTimer = asyncHandler(async (req, res) => {
  const filter = req.validated.body.timeLogId
    ? { _id: req.validated.body.timeLogId, userId: req.user._id }
    : { userId: req.user._id, endTime: { $exists: false } };

  const timeLog = await TimeLog.findOne(filter);
  if (!timeLog || timeLog.endTime) {
    const error = new Error("Active timer not found");
    error.statusCode = 404;
    throw error;
  }

  timeLog.endTime = new Date();
  timeLog.duration = Math.max(1, Math.round((timeLog.endTime - timeLog.startTime) / 60000));
  if (req.validated.body.note) timeLog.note = req.validated.body.note;
  await timeLog.save();

  if (timeLog.taskId) {
    await Task.findOneAndUpdate(
      { _id: timeLog.taskId, userId: req.user._id },
      { $inc: { actualTime: timeLog.duration } }
    );
  }

  res.json({ timeLog });
});

export const manualEntry = asyncHandler(async (req, res) => {
  const { taskId, startTime, duration, note } = req.validated.body;
  const start = new Date(startTime);
  const end = new Date(start.getTime() + duration * 60000);

  const timeLog = await TimeLog.create({
    userId: req.user._id,
    taskId,
    startTime: start,
    endTime: end,
    duration,
    note
  });

  if (taskId) {
    await Task.findOneAndUpdate({ _id: taskId, userId: req.user._id }, { $inc: { actualTime: duration } });
  }

  res.status(201).json({ timeLog });
});

export const getReport = asyncHandler(async (req, res) => {
  const range = req.query.range || "week";
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  if (range === "day") start.setDate(start.getDate());
  if (range === "week") start.setDate(start.getDate() - 6);
  if (range === "month") start.setMonth(start.getMonth() - 1);

  const logs = await TimeLog.find({
    userId: req.user._id,
    startTime: { $gte: start },
    endTime: { $exists: true }
  })
    .populate("taskId", "title category")
    .sort({ startTime: -1 });

  const totalMinutes = logs.reduce((sum, log) => sum + log.duration, 0);
  res.json({ logs, totalMinutes, range });
});
