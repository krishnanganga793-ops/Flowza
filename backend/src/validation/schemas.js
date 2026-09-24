import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
const optionalDate = z
  .union([z.string().datetime(), z.string().date(), z.literal(""), z.null()])
  .optional()
  .transform((value) => (value ? new Date(value) : undefined));

export const idParamSchema = z.object({
  params: z.object({ id: objectId })
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8),
    timezone: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

export const profileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80).optional(),
    avatar: z.string().url().or(z.literal("")).optional(),
    timezone: z.string().optional()
  })
});

export const taskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(160),
    description: z.string().max(4000).optional(),
    priority: z.enum(["Low", "Medium", "High", "Critical"]).optional(),
    status: z.enum(["Backlog", "To Do", "In Progress", "Review", "Completed"]).optional(),
    category: z.string().max(80).optional(),
    dueDate: optionalDate,
    estimatedTime: z.coerce.number().min(0).optional(),
    actualTime: z.coerce.number().min(0).optional(),
    tags: z.array(z.string().max(40)).optional(),
    completed: z.boolean().optional(),
    archived: z.boolean().optional(),
    subtasks: z
      .array(
        z.object({
          title: z.string().min(1).max(120),
          completed: z.boolean().optional()
        })
      )
      .optional()
  })
});

export const taskUpdateSchema = taskSchema.partial({
  body: true
}).extend({
  body: taskSchema.shape.body.partial()
});

export const habitSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(120),
    reminderTime: z.string().optional(),
    color: z.string().optional()
  })
});

export const habitUpdateSchema = z.object({
  body: habitSchema.shape.body.partial()
});

export const habitCompleteSchema = z.object({
  body: z.object({
    date: optionalDate,
    note: z.string().max(500).optional()
  })
});

export const timerStartSchema = z.object({
  body: z.object({
    taskId: objectId.optional(),
    note: z.string().max(500).optional()
  })
});

export const timerStopSchema = z.object({
  body: z.object({
    timeLogId: objectId.optional(),
    note: z.string().max(500).optional()
  })
});

export const manualTimeSchema = z.object({
  body: z.object({
    taskId: objectId.optional(),
    startTime: z.string().datetime().or(z.string().date()),
    duration: z.coerce.number().min(1),
    note: z.string().max(500).optional()
  })
});
