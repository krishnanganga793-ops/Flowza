import { Router } from "express";
import {
  completeHabit,
  createHabit,
  deleteHabit,
  getHabits,
  updateHabit
} from "../controllers/habitController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { habitCompleteSchema, habitSchema, habitUpdateSchema, idParamSchema } from "../validation/schemas.js";

const router = Router();

router.use(protect);
router.route("/").get(getHabits).post(validate(habitSchema), createHabit);
router.post("/:id/complete", validate(habitCompleteSchema), completeHabit);
router.route("/:id").put(validate(habitUpdateSchema), updateHabit).delete(validate(idParamSchema), deleteHabit);

export default router;
