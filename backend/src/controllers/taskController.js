import Task from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, archived = "false", search, from, to } = req.query;
  const filter = { userId: req.user._id };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (archived !== "all") filter.archived = archived === "true";
  if (search) filter.$text = { $search: search };
  if (from || to) {
    filter.dueDate = {};
    if (from) filter.dueDate.$gte = new Date(from);
    if (to) filter.dueDate.$lte = new Date(to);
  }

  const tasks = await Task.find(filter).sort({ dueDate: 1, priority: -1, createdAt: -1 });
  res.json({ tasks });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }
  res.json({ task });
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.validated.body, userId: req.user._id });
  res.status(201).json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.validated.body,
    { new: true, runValidators: true }
  );

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }
  res.json({ message: "Task deleted" });
});

export const duplicateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id }).lean();
  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  delete task._id;
  delete task.createdAt;
  delete task.updatedAt;

  const copy = await Task.create({
    ...task,
    title: `${task.title} Copy`,
    completed: false,
    status: "To Do"
  });

  res.status(201).json({ task: copy });
});
