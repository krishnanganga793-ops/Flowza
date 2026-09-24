import { Router } from "express";
import {
  createTask,
  deleteTask,
  duplicateTask,
  getTask,
  getTasks,
  updateTask
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema, taskSchema, taskUpdateSchema } from "../validation/schemas.js";

const router = Router();

router.use(protect);
router.route("/").get(getTasks).post(validate(taskSchema), createTask);
router.post("/:id/duplicate", validate(idParamSchema), duplicateTask);
router.route("/:id").get(validate(idParamSchema), getTask).put(validate(taskUpdateSchema), updateTask).delete(validate(idParamSchema), deleteTask);

export default router;
