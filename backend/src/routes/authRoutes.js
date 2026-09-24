import { Router } from "express";
import { login, logout, me, refresh, register, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, profileSchema, registerSchema } from "../validation/schemas.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", protect, me);
router.put("/profile", protect, validate(profileSchema), updateProfile);

export default router;
