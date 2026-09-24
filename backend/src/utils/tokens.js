import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import RefreshToken from "../models/RefreshToken.js";

export function signAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email }, env.accessSecret, {
    expiresIn: env.accessTtl
  });
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString(), type: "refresh" }, env.refreshSecret, {
    expiresIn: env.refreshTtl
  });
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function persistRefreshToken(user, token) {
  const decoded = jwt.decode(token);
  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(token),
    expiresAt: new Date(decoded.exp * 1000)
  });
}

export function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    signed: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export function clearRefreshCookie(res) {
  res.clearCookie("refreshToken");
}
