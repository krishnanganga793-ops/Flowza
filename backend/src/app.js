import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import xss from "xss-clean";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import timerRoutes from "./routes/timerRoutes.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(env.cookieSecret));
  app.use(mongoSanitize());
  app.use(xss());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  if (env.nodeEnv !== "test") app.use(morgan("dev"));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "flowza API" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/habits", habitRoutes);
  app.use("/api/timer", timerRoutes);
  app.use("/api/analytics", analyticsRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
