import Habit from "../models/Habit.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function calculateStreak(completions) {
  const days = new Set(completions.map((item) => startOfDay(item.date).toISOString()));
  let streak = 0;
  const cursor = startOfDay(new Date());

  while (days.has(cursor.toISOString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ habits });
});

export const createHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.create({ ...req.validated.body, userId: req.user._id });
  res.status(201).json({ habit });
});

export const updateHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.validated.body,
    { new: true, runValidators: true }
  );
  if (!habit) {
    const error = new Error("Habit not found");
    error.statusCode = 404;
    throw error;
  }
  res.json({ habit });
});

export const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!habit) {
    const error = new Error("Habit not found");
    error.statusCode = 404;
    throw error;
  }
  res.json({ message: "Habit deleted" });
});

export const completeHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
  if (!habit) {
    const error = new Error("Habit not found");
    error.statusCode = 404;
    throw error;
  }

  const date = startOfDay(req.validated.body.date || new Date());
  const existing = habit.completions.find(
    (completion) => startOfDay(completion.date).getTime() === date.getTime()
  );

  if (existing) {
    habit.completions = habit.completions.filter(
      (completion) => startOfDay(completion.date).getTime() !== date.getTime()
    );
  } else {
    habit.completions.push({ date, note: req.validated.body.note || "" });
  }

  habit.streak = calculateStreak(habit.completions);
  habit.bestStreak = Math.max(habit.bestStreak, habit.streak);
  await habit.save();

  res.json({ habit });
});
