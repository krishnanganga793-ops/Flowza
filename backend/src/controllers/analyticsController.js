import Habit from "../models/Habit.js";
import Task from "../models/Task.js";
import TimeLog from "../models/TimeLog.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function lastNDays(n) {
  return Array.from({ length: n }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (n - index - 1));
    return date;
  });
}

export const summary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 6);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [tasks, weekLogs, habits] = await Promise.all([
    Task.find({ userId, archived: false }),
    TimeLog.find({ userId, startTime: { $gte: weekStart }, endTime: { $exists: true } }),
    Habit.find({ userId })
  ]);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const dueToday = tasks.filter(
    (task) => task.dueDate && task.dueDate >= today && task.dueDate < tomorrow
  );
  const upcoming = tasks
    .filter((task) => task.dueDate && task.dueDate >= today && !task.completed)
    .sort((a, b) => a.dueDate - b.dueDate)
    .slice(0, 5);

  const focusMinutes = weekLogs.reduce((sum, log) => sum + log.duration, 0);
  const habitPossible = habits.length || 1;
  const habitDoneToday = habits.filter((habit) =>
    habit.completions.some((completion) => {
      const date = new Date(completion.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    })
  ).length;

  const completionRate = tasks.length ? completedTasks / tasks.length : 0;
  const focusScore = Math.min(focusMinutes / 600, 1);
  const habitScore = habitDoneToday / habitPossible;
  const productivityScore = Math.round((completionRate * 0.45 + focusScore * 0.35 + habitScore * 0.2) * 100);

  const focusByDay = lastNDays(7).map((day) => {
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    return {
      day: day.toLocaleDateString("en", { weekday: "short" }),
      minutes: weekLogs
        .filter((log) => log.startTime >= day && log.startTime < next)
        .reduce((sum, log) => sum + log.duration, 0)
    };
  });

  const taskByStatus = ["Backlog", "To Do", "In Progress", "Review", "Completed"].map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length
  }));

  res.json({
    stats: {
      totalTasks: tasks.length,
      completedTasks,
      dueToday: dueToday.length,
      focusMinutes,
      productivityScore,
      activeHabits: habits.length,
      habitDoneToday
    },
    todayTasks: dueToday,
    upcoming,
    focusByDay,
    taskByStatus
  });
});
