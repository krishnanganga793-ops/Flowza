import { Router } from "express";
import { getReport, manualEntry, startTimer, stopTimer } from "../controllers/timerController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { manualTimeSchema, timerStartSchema, timerStopSchema } from "../validation/schemas.js";

const router = Router();

router.use(protect);
router.post("/start", validate(timerStartSchema), startTimer);
router.post("/stop", validate(timerStopSchema), stopTimer);
router.post("/manual", validate(manualTimeSchema), manualEntry);
router.get("/report", getReport);

export default router;
