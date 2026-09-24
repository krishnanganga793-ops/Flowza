import nodemailer from "nodemailer";
import { env } from "../config/env.js";

export async function sendEmail({ to, subject, html }) {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) return { skipped: true };

  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: Number(env.smtp.port || 587),
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass
    }
  });

  return transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html
  });
}
